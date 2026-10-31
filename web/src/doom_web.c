/* SPDX-License-Identifier: GPL-2.0-or-later */
#include <stdlib.h>
#include <emscripten.h>
#include "doomgeneric.h"
#include "doomkeys.h"
#include "doomstat.h"
#include "i_video.h"
#include "m_controls.h"
#include "m_menu.h"
#include "game_platform.h"

EM_JS(int, next_button, (), { return Module.events.length ? Module.events.shift() : 0; });
EM_JS(void, fatal_message, (const char *message), {
    postMessage({type:'error', message:UTF8ToString(message)});
});
EM_JS(void, save_prompt, (int active), { postMessage({type:'save-name', active:!!active}); });
extern int saveStringEnter;
void DG_Init(void) {}
void DG_DrawFrame(void) {
    /* Doom can draw twice per tic. Pace presentation at the handheld's 35 Hz
       target, including wipe animation, without changing engine simulation. */
    static uint32_t next;
    static unsigned remainder;
    uint32_t now = platform_millis();
    int32_t delay = (int32_t)(next - now);
    if (delay > 0 && delay < 1000) platform_sleep((uint32_t)delay);
    else next = now;
    remainder += 1000;
    next += remainder / 35;
    remainder %= 35;
    static int was_naming;
    if (was_naming != saveStringEnter) { was_naming = saveStringEnter; save_prompt(was_naming); }
    uint32_t palette[256];
    for (int i=0;i<256;i++) palette[i] = (colors[i].r<<16) | (colors[i].g<<8) | colors[i].b;
    platform_present(DG_ScreenBuffer, palette);
}
void DG_SleepMs(uint32_t ms) { platform_sleep(ms); }
uint32_t DG_GetTicksMs(void) { return platform_millis(); }
void DG_SetWindowTitle(const char *title) { (void)title; }
int DG_GetKey(int *pressed, unsigned char *key) {
    static unsigned char held[12];
    static const unsigned char keys[] = {KEY_UPARROW,KEY_DOWNARROW,KEY_LEFTARROW,KEY_RIGHTARROW,
        KEY_FIRE,KEY_USE,KEY_RSHIFT,'w',KEY_TAB,KEY_ESCAPE,',','.'};
    int event = next_button();
    if (!event) return 0;
    if (event & 512) { *pressed = !!(event & 256); *key = event & 255; return 1; }
    unsigned i = (event & 255) - 1;
    if (i >= 12) return 0;
    *pressed = (event & 256) != 0;
    *key = keys[i];
    if (*pressed) {
        if (menuactive && i == 4) *key = KEY_ENTER;
        if (menuactive && i == 5) *key = KEY_BACKSPACE;
        held[i] = *key;
    } else if (held[i]) *key = held[i];
    return 1;
}
void verify_lump_read(unsigned lump, const void *data) { (void)lump; (void)data; }
void gba_fatal(const char *message) { fatal_message(message); exit(1); }
int main(int argc, char **argv) {
    key_nextweapon = 'w';
    doomgeneric_Create(argc, argv);
    key_menu_confirm = KEY_ENTER;
    key_menu_abort = KEY_BACKSPACE;
    M_StartControlPanel();
    for (;;) doomgeneric_Tick();
}
