#include "board.h"
#include "ff.h"
#include "hardware/psram.h"
#include "pico/stdlib.h"
#include "sd_card.h"
#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
void doom_run(const char *path);
static FATFS fs;
static FRESULT mounted;
static int psram_ok;
#define MAX_GAMES 12
static char games[MAX_GAMES][192];
static unsigned game_count, selected;
static int is_wad(const char *name) {
    size_t n = strlen(name);
    return n > 4 && !strcasecmp(name + n - 4, ".wad");
}
static void scan_dir(const char *path, unsigned depth) {
    DIR dir;
    FILINFO info;
    if (f_opendir(&dir, path) != FR_OK)
        return;
    while (game_count < MAX_GAMES && f_readdir(&dir, &info) == FR_OK && info.fname[0]) {
        if (info.fname[0] == '.')
            continue;
        char child[192];
        if (snprintf(child, sizeof(child), "%s/%s", path, info.fname) >= (int)sizeof(child))
            continue;
        if ((info.fattrib & AM_DIR) && depth)
            scan_dir(child, depth - 1);
        else if (!(info.fattrib & AM_DIR) && is_wad(info.fname))
            strcpy(games[game_count++], child);
    }
    f_closedir(&dir);
}
static void scan_games(void) {
    game_count = 0;
    selected = 0;
    if (!mounted)
        scan_dir("/games", 1);
}
static void title_for(const char *path, char *out, size_t n) {
    const char *base = strrchr(path, '/');
    base = base ? base + 1 : path;
    if (!strcasecmp(base, "doom1.wad")) {
        snprintf(out, n, "DOOM SHAREWARE");
        return;
    }
    size_t i = 0;
    while (base[i] && base[i] != '.' && i + 1 < n) {
        out[i] = base[i] == '_' ? ' ' : toupper((unsigned char)base[i]);
        i++;
    }
    out[i] = 0;
}
static void menu(void) {
    lcd_rect(0, 0, 480, 320, 8, 16, 28);
    lcd_text(24, 20, "GAME SELECT", 5);
    lcd_rect(24, 67, 432, 3, 0, 184, 176);
    if (mounted) {
        lcd_text(24, 98, "SD CARD NOT READY", 3);
        char msg[36];
        snprintf(msg, sizeof(msg), "SD ERROR %d", mounted);
        lcd_text(24, 140, msg, 2);
        lcd_text(24, 190, "INSERT CARD AND PRESS B", 2);
    } else if (!game_count) {
        lcd_text(24, 98, "NO GAMES ON SD", 3);
        lcd_text(24, 148, "ADD WAD FILES TO", 3);
        lcd_text(24, 183, "GAMES FOLDER", 3);
    } else {
        unsigned start = selected / 3 * 3;
        for (unsigned i = start; i < game_count && i < start + 3; i++) {
            int y = 86 + (i - start) * 56;
            char title[25];
            title_for(games[i], title, sizeof(title));
            if (i == selected) {
                lcd_rect(16, y, 448, 49, 20, 64, 80);
                lcd_rect(16, y, 4, 49, 0, 220, 180);
            }
            lcd_text(30, y + 15, title, 3);
        }
    }
    lcd_text(24, 245,
             lcd_fast_mode == 2   ? "FAST FULL COLOR - Y SWITCH"
             : lcd_fast_mode == 1 ? "DITHERED TEST MODE"
                                  : "ORIGINAL COLOR - Y FOR SPEED",
             2);
    lcd_text(24, 267, psram_ok ? (lcd_large ? "X FULL SCREEN" : "X SMALL SCREEN") : "RAM ERROR", 2);
    lcd_text(24, 294, "A PLAY  B REFRESH  UP DOWN SELECT", 2);
}
static void mount_card(void) {
    mounted = f_mount(&fs, "0:", 1);
    if (!mounted) {
        f_mkdir("/games");
        f_mkdir("/games/doom");
    }
    scan_games();
}
static void status(void) {
    printf("STATUS sd=%d psram_bytes=%lu psram_ok=%d buttons=%03x games=%u\n", mounted,
           (unsigned long)psram_get_size(), psram_ok, buttons_read(), game_count);
}
static void list(const char *path) {
    DIR d;
    FILINFO f;
    FRESULT r = f_opendir(&d, path);
    printf("LIST %s result=%d\n", path, r);
    if (!r) {
        while (!f_readdir(&d, &f) && f.fname[0])
            printf("%c %lu %s\n", (f.fattrib & AM_DIR) ? 'D' : 'F', (unsigned long)f.fsize,
                   f.fname);
        f_closedir(&d);
    }
    puts("END");
}
static void launch_selected(void) {
    if (mounted || !psram_ok || !game_count) {
        puts("ERROR SD, RAM, or game missing");
        return;
    }
    FIL f;
    uint8_t hdr[12] = {0};
    UINT got;
    FRESULT r = f_open(&f, games[selected], FA_READ);
    if (r) {
        printf("ERROR open=%d\n", r);
        return;
    }
    r = f_read(&f, hdr, sizeof(hdr), &got);
    uint32_t lumps = hdr[4] | hdr[5] << 8 | hdr[6] << 16 | hdr[7] << 24;
    uint32_t directory = hdr[8] | hdr[9] << 8 | hdr[10] << 16 | hdr[11] << 24;
    int valid = !r && got == 12 && !memcmp(hdr, "IWAD", 4) && lumps > 0 && lumps < 100000 &&
                ((uint64_t)directory + lumps * 16 <= f_size(&f));
    f_close(&f);
    if (!valid) {
        puts("ERROR invalid IWAD");
        return;
    }
    while (buttons_read() & ((1 << 4) | (1 << 9)))
        sleep_ms(10);
    doom_run(games[selected]);
}
static uint32_t crc_step(uint32_t crc, const uint8_t *p, size_t n) {
    while (n--) {
        crc ^= *p++;
        for (int k = 0; k < 8; k++)
            crc = (crc >> 1) ^ (0xedb88320u & -(crc & 1));
    }
    return crc;
}
static void upload(char *args) {
    char path[180];
    unsigned long size, expect;
    if (sscanf(args, "%179s %lu %lx", path, &size, &expect) != 3 || strncmp(path, "/games/", 7) ||
        strstr(path, "..") || size > 20000000) {
        puts("ERROR bad upload");
        return;
    }
    char temp[200];
    snprintf(temp, sizeof(temp), "%s.part", path);
    FIL f;
    FRESULT r = f_open(&f, temp, FA_WRITE | FA_CREATE_ALWAYS);
    if (r) {
        printf("ERROR open=%d\n", r);
        return;
    }
    printf("READY %lu\n", size);
    fflush(stdout);
    uint8_t buf[4096];
    uint32_t crc = ~0u;
    unsigned long total = 0;
    while (total < size) {
        unsigned n = size - total > sizeof(buf) ? sizeof(buf) : size - total;
        for (unsigned i = 0; i < n; i++) {
            int c = getchar_timeout_us(5000000);
            if (c < 0) {
                puts("ERROR timeout");
                f_close(&f);
                f_unlink(temp);
                return;
            }
            buf[i] = c;
        }
        UINT wrote;
        r = f_write(&f, buf, n, &wrote);
        if (r || wrote != n) {
            printf("ERROR write=%d\n", r);
            f_close(&f);
            return;
        }
        crc = crc_step(crc, buf, n);
        total += n;
        printf("ACK %lu\n", total);
        fflush(stdout);
    }
    f_sync(&f);
    f_close(&f);
    crc = ~crc;
    if (crc != expect) {
        printf("ERROR crc=%08lx\n", (unsigned long)crc);
        f_unlink(temp);
        return;
    }
    FILINFO info;
    if (f_stat(path, &info) == FR_OK) {
        puts("ERROR target exists");
        return;
    }
    uint32_t readcrc = ~0u;
    UINT got;
    r = f_open(&f, temp, FA_READ);
    if (r) {
        printf("ERROR verify open=%d\n", r);
        return;
    }
    while ((r = f_read(&f, buf, sizeof(buf), &got)) == FR_OK && got)
        readcrc = crc_step(readcrc, buf, got);
    f_close(&f);
    if (r || ~readcrc != expect) {
        puts("ERROR SD readback checksum");
        return;
    }
    r = f_rename(temp, path);
    printf("DONE %d %lu %08lx\n", r, total, (unsigned long)crc);
    scan_games();
    menu();
}

int main(void) {
    stdio_init_all();
    board_init();
    sleep_ms(500);
    size_t size = psram_get_size();
    if (size) {
        volatile uint32_t *p = (volatile uint32_t *)0x11000000;
        psram_ok = 1;
        for (unsigned i = 0; i < 16384; i++)
            p[i] = i ^ 0xa55a1234;
        for (unsigned i = 0; i < 16384; i++)
            if (p[i] != (i ^ 0xa55a1234))
                psram_ok = 0;
    }
    mount_card();
    menu();
    char line[256];
    unsigned n = 0;
    uint32_t last = 0;
    uint16_t prev = buttons_read();
    while (1) {
        int c = getchar_timeout_us(1000);
        if (c >= 0) {
            if (c == '\n' || c == '\r') {
                line[n] = 0;
                if (n) {
                    if (!strcmp(line, "status"))
                        status();
                    else if (!strcmp(line, "retry")) {
                        mount_card();
                        status();
                        menu();
                    } else if (!strcmp(line, "colors")) {
                        lcd_calibration();
                        while (!(buttons_read() & ((1 << 4) | (1 << 9)))) {
                            if (getchar_timeout_us(1000) == 'r')
                                break;
                        }
                        while (buttons_read() & ((1 << 4) | (1 << 9)))
                            sleep_ms(10);
                        menu();
                    } else if (!strncmp(line, "ls ", 3))
                        list(line + 3);
                    else if (!strncmp(line, "put ", 4))
                        upload(line + 4);
                    else if (!strcmp(line, "launch"))
                        launch_selected();
                    else
                        puts("ERROR unknown command");
                }
                n = 0;
            } else if (n < sizeof(line) - 1)
                line[n++] = c;
        }
        uint16_t b = buttons_read(), edge = b & ~prev;
        if (edge & ((1 << 4) | (1 << 9)))
            launch_selected();
        if (edge & (1 << 5)) {
            mount_card();
            menu();
        }
        if (edge & (1 << 7)) {
            lcd_fast_mode = lcd_fast_mode == 0 ? 2 : 0;
            menu();
        }
        if (edge & (1 << 6)) {
            lcd_large = !lcd_large;
            menu();
        }
        if (game_count && (edge & 1)) {
            selected = (selected + game_count - 1) % game_count;
            menu();
        }
        if (game_count && (edge & 2)) {
            selected = (selected + 1) % game_count;
            menu();
        }
        if (b != prev) {
            printf("BUTTONS %03x\n", b);
            prev = b;
        }
        if (to_ms_since_boot(get_absolute_time()) - last > 5000) {
            status();
            last = to_ms_since_boot(get_absolute_time());
        }
    }
}
