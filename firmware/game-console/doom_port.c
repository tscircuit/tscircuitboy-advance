#include "board.h"
#include "dirty_regions.h"
#include "doomgeneric.h"
#include "doomkeys.h"
#include "doomstat.h"
#include "g_game.h"
#include "hardware/sync.h"
#include "hardware/watchdog.h"
#include "i_video.h"
#include "m_controls.h"
#include "m_menu.h"
#include "p_mobj.h"
#include "pico/multicore.h"
#include "pico/stdlib.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
static uint16_t previous;
static unsigned char held_keys[12];
static uint16_t pending;
static uint16_t snapshot;
static uint16_t remote_buttons;
static uint32_t remote_until;
static unsigned frames;
static int last_submitted_tic = -1;
enum { FRAME_FREE, FRAME_QUEUED, FRAME_DISPLAYING, FRAME_WRITING };
struct queued_frame {
    uint8_t pixels[320 * 107] __attribute__((aligned(4)));
    uint32_t palette[256];
    struct dirty_region regions[MAX_DIRTY_REGIONS];
    unsigned region_count;
    uint32_t sequence;
    volatile uint32_t state;
};
static struct queued_frame queue[3];
static int last_submitted_slot = -1;
static uint32_t next_sequence;
static bool display_started;
static volatile uint32_t display_frames, display_us_total;
static uint32_t last_submit_us;
static bool force_redraw = true;
static int adaptive_scan = 1;
static bool field_valid[3];
static unsigned producer_field;

static void display_core(void) {
    for (;;) {
        int slot = -1;
        for (int i = 0; i < 3; i++)
            if (__atomic_load_n(&queue[i].state, __ATOMIC_ACQUIRE) == FRAME_QUEUED)
                if (slot < 0 || (int32_t)(queue[i].sequence - queue[slot].sequence) < 0)
                    slot = i;
        if (slot < 0) {
            __wfe();
            continue;
        }
        struct queued_frame *f = &queue[slot];
        __atomic_store_n(&f->state, FRAME_DISPLAYING, __ATOMIC_RELEASE);
        uint32_t start = time_us_32();
        for(unsigned i=0;i<f->region_count;i++) {
            struct dirty_region r=f->regions[i];
            unsigned w=lcd_large?480:320;
            unsigned x0=((r.x0*w+319)/320)&~3u,x1=(((r.x1*w+319)/320)+3)&~3u;
            lcd_indexed_scanline(f->pixels+(r.y0/3)*320,f->palette,r.y0,x0,x1);
        }
        display_us_total += time_us_32() - start;
        if (f->region_count)
            __atomic_fetch_add(&display_frames, 1, __ATOMIC_RELAXED);
        __atomic_store_n(&f->state, FRAME_FREE, __ATOMIC_RELEASE);
        __sev();
    }
}
static void display_drain(void) {
    if (!display_started)
        return;
    while (__atomic_load_n(&queue[0].state, __ATOMIC_ACQUIRE) != FRAME_FREE ||
           __atomic_load_n(&queue[1].state, __ATOMIC_ACQUIRE) != FRAME_FREE ||
           __atomic_load_n(&queue[2].state, __ATOMIC_ACQUIRE) != FRAME_FREE)
        tight_loop_contents();
}
static void show_colors(void) {
    display_drain();
    field_valid[0]=field_valid[1]=field_valid[2]=false;
    lcd_calibration();
    printf("COLORS rgb=RED,GREEN,BLUE cmy=YELLOW,CYAN,MAGENTA spi_hz=%lu\n",
           (unsigned long)lcd_get_clock());
    while (buttons_read() & ((1 << 4) | (1 << 9)))
        sleep_ms(10);
    while (!(buttons_read() & ((1 << 4) | (1 << 9)))) {
        int c = getchar_timeout_us(1000);
        if (c == 'r')
            break;
    }
    while (buttons_read() & ((1 << 4) | (1 << 9)))
        sleep_ms(10);
    lcd_rect(0, 0, 480, 320, 0, 0, 0);
    force_redraw = true;
    lcd_apply_game_mode();
    puts("COLORS_END");
}
void DG_Init(void) {
    previous = buttons_read();
    lcd_rect(0, 0, 480, 320, 0, 0, 0);
    lcd_apply_game_mode();
    multicore_launch_core1(display_core);
    display_started = 1;
}
static void console_poll(void);
void DG_DrawFrame(void) {
    console_poll();
    static uint32_t rgb[256];
    if (palette_changed) {
        for (int i = 0; i < 256; i++)
            rgb[i] = (colors[i].r << 16) | (colors[i].g << 8) | colors[i].b;
        palette_changed = false;
    }
    int slot=-1;
    if((gametic!=last_submitted_tic || force_redraw) &&
       __atomic_load_n(&queue[producer_field].state,__ATOMIC_ACQUIRE)==FRAME_FREE)slot=producer_field;
    if(slot>=0) {
        struct queued_frame *f=&queue[slot];
        __atomic_store_n(&f->state,FRAME_WRITING,__ATOMIC_RELEASE);
        uint32_t start=time_us_32();
        bool full=force_redraw || !field_valid[slot] || memcmp(f->palette,rgb,sizeof(rgb));
        unsigned height=lcd_large?320:240;
        f->region_count=0;
        for(unsigned y=slot;y<height;y+=3) {
            uint8_t *old=f->pixels+(y/3)*320,*src=DG_ScreenBuffer+(y*200/height)*320;
            unsigned lo=0,hi=320;
            if(!full){while(lo<hi&&old[lo]==src[lo])lo++;while(hi>lo&&old[hi-1]==src[hi-1])hi--;}
            if(lo<hi)f->regions[f->region_count++]=(struct dirty_region){lo,y,hi,y+1};
            memcpy(old,src,320);
        }
        memcpy(f->palette,rgb,sizeof(rgb));
        field_valid[slot]=true;producer_field=(producer_field+1)%3;
        f->sequence=next_sequence++;
        force_redraw=false;last_submitted_tic=gametic;last_submitted_slot=slot;
        last_submit_us=time_us_32()-start;
        __atomic_store_n(&f->state,FRAME_QUEUED,__ATOMIC_RELEASE);__sev();
    }
    frames++;
    static uint32_t last, last_frames, last_display;
    uint32_t now = to_ms_since_boot(get_absolute_time());
    if (now - last > 5000) {
        uint32_t elapsed = now - last;
        uint32_t shown = __atomic_load_n(&display_frames, __ATOMIC_RELAXED);
        printf("PERF render_fps_x100=%lu display_fps_x100=%lu render_frames=%u displayed=%lu "
               "copy_us=%lu spi_hz=%lu gametic=%d map=%d buttons=%03x\n",
               (unsigned long)((frames - last_frames) * 100000 / elapsed),
               (unsigned long)((shown - last_display) * 100000 / elapsed), frames,
               (unsigned long)shown, (unsigned long)last_submit_us, (unsigned long)lcd_get_clock(),
               gametic, gamemap, buttons_read());
        last = now;
        last_frames = frames;
        last_display = shown;
    }
}
void DG_SleepMs(uint32_t ms) { sleep_ms(ms); }
uint32_t DG_GetTicksMs(void) { return to_ms_since_boot(get_absolute_time()); }
void DG_SetWindowTitle(const char *title) { printf("TITLE %s\n", title); }
int DG_GetKey(int *pressed, unsigned char *key) {
    if (!pending) {
        snapshot = buttons_read() | (DG_GetTicksMs() < remote_until ? remote_buttons : 0);
        pending = snapshot ^ previous;
        previous = snapshot;
    }
    if (!pending)
        return 0;
    unsigned i = __builtin_ctz(pending);
    pending &= ~(1u << i);
    *pressed = !!(snapshot & (1u << i));
    static const unsigned char keys[] = {KEY_UPARROW, KEY_DOWNARROW, KEY_LEFTARROW, KEY_RIGHTARROW,
                                         KEY_FIRE,    KEY_USE,       KEY_RSHIFT,    'w',
                                         KEY_TAB,     KEY_ESCAPE,    ',',           '.'};
    *key = keys[i];
    if (*pressed) {
        if (menuactive && i == 4)
            *key = KEY_ENTER;
        if (menuactive && i == 5)
            *key = KEY_BACKSPACE;
        held_keys[i] = *key;
    } else if (held_keys[i])
        *key = held_keys[i];
    return 1;
}
void doom_run(const char *path) {
    key_nextweapon = 'w';
    printf("LAUNCH %s\n", path);
    lcd_rect(0, 0, 480, 320, 8, 16, 28);
    lcd_text(24, 100, "LOADING DOOM", 4);
    char *args[] = {"doom",
                    "-iwad",
                    (char *)path,
                    "-config",
                    "/games/doom/default.cfg",
                    "-extraconfig",
                    "/games/doom/extra.cfg",
                    "-savedir",
                    "/games/doom",
                    "-nogui",
                    "-nosound",
                    "-mb",
                    "6",
                    NULL};
    doomgeneric_Create(13, args);
    key_menu_confirm = KEY_ENTER;
    key_menu_abort = KEY_BACKSPACE;
    M_StartControlPanel();
    while (1) {
        doomgeneric_Tick();
    }
}

void gba_fatal(const char *msg) {
    printf("FATAL %s\n", msg);
    display_drain();
    lcd_rect(0, 0, 480, 320, 16, 0, 0);
    lcd_text(20, 20, "DOOM ERROR", 4);
    char line[38];
    for (int y = 90; *msg && y < 260; y += 24) {
        unsigned n = 0;
        while (*msg && n < 36)
            line[n++] = *msg++;
        line[n] = 0;
        for (unsigned j = 0; j < n; j++)
            if (line[j] >= 'a' && line[j] <= 'z')
                line[j] -= 32;
        lcd_text(20, y, line, 2);
    }
    while (1) {
        sleep_ms(100);
        if (buttons_read() & (1 << 9))
            watchdog_reboot(0, 0, 100);
    }
}

static void console_poll(void) {
    static char line[96];
    static unsigned n;
    int c;
    while ((c = getchar_timeout_us(0)) >= 0) {
        if (c == '\n' || c == '\r') {
            line[n] = 0;
            unsigned mask, ms;
            if (sscanf(line, "key %x %u", &mask, &ms) == 2) {
                remote_buttons = mask & 4095;
                remote_until = DG_GetTicksMs() + ms;
                printf("KEY %03x %u\n", mask, ms);
            } else if (!strcmp(line, "colors")) {
                show_colors();
            } else if (sscanf(line, "rate %u", &ms) == 1) {
                if (ms >= 1000000 && ms <= 75000000) {
                    display_drain();
                    lcd_set_clock(ms);
                    force_redraw = true;
                    printf("RATE %lu\n", (unsigned long)lcd_get_clock());
                }
            } else if (!strncmp(line, "mode ", 5)) {
                display_drain();
                lcd_fast_mode = atoi(line + 5) ? 2 : 0;
                if (lcd_fast_mode < 0 || lcd_fast_mode > 2)
                    lcd_fast_mode = 0;
                lcd_apply_game_mode();
                force_redraw = true;
                printf("MODE %d\n", lcd_fast_mode);
            } else if (!strncmp(line, "scan ", 5)) {
                display_drain(); adaptive_scan=1;
                field_valid[0]=field_valid[1]=field_valid[2]=false; force_redraw=true;
            } else if (!strncmp(line, "size ", 5)) {
                display_drain();
                lcd_large = atoi(line + 5) != 0;
                lcd_rect(0,0,480,320,0,0,0);
                field_valid[0]=field_valid[1]=field_valid[2]=false;
                force_redraw = true;
            } else if (!strcmp(line, "assets")) {
                extern void verify_asset_caches(void);
                verify_asset_caches();
            } else if (!strcmp(line, "lcdregs")) {
                display_drain();
                lcd_read_diagnostics();
            } else if (!strcmp(line, "shot")) {
                printf("FRAME 320 200 4\n");
                fflush(stdout);
                for (unsigned i = 0; i < 320 * 200; i++) {
                    struct color c = colors[DG_ScreenBuffer[i]];
                    putchar_raw(c.b);
                    putchar_raw(c.g);
                    putchar_raw(c.r);
                    putchar_raw(0);
                }
                puts("\nFRAME_END");
            } else if (!strcmp(line, "status")) {
                printf("DOOM frames=%u gametic=%d state=%d map=%d menu=%d\n", frames, gametic,
                       gamestate, gamemap, menuactive);
                if (players[consoleplayer].mo)
                    printf("PLAYER x=%ld y=%ld angle=%lu health=%d ammo=%d\n",
                           (long)players[consoleplayer].mo->x, (long)players[consoleplayer].mo->y,
                           (unsigned long)players[consoleplayer].mo->angle,
                           players[consoleplayer].health, players[consoleplayer].ammo[0]);
            } else if (!strcmp(line, "menu")) {
                watchdog_reboot(0, 0, 100);
                while (1)
                    tight_loop_contents();
            }
            n = 0;
        } else if (n < sizeof(line) - 1)
            line[n++] = c;
    }
    static uint32_t since;
    if ((buttons_read() & 0x300) == 0x300) {
        if (!since)
            since = DG_GetTicksMs();
        if (DG_GetTicksMs() - since > 1500) {
            watchdog_reboot(0, 0, 100);
            while (1)
                tight_loop_contents();
        }
    } else
        since = 0;
}

void _exit(int code) {
    printf("EXIT %d\n", code);
    watchdog_reboot(0, 0, 150);
    while (1)
        tight_loop_contents();
}
