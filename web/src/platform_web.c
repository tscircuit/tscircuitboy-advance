/* SPDX-License-Identifier: GPL-2.0-or-later */
#include <emscripten.h>
#include "game_platform.h"
EM_JS(int, read_buttons, (), { return Module.buttons || 0; });
EM_JS(double, read_clock, (), { return Module.clock(); });
EM_JS(int, is_paused, (), { return Module.paused; });
EM_JS(void, present, (const uint8_t *pixels, const uint32_t *palette), {
    const rgba = new Uint8ClampedArray(320 * 200 * 4);
    for (let i = 0; i < 320 * 200; i++) {
        const c = HEAPU32[(palette >>> 2) + HEAPU8[pixels + i]];
        const j = i * 4;
        rgba[j] = (c >>> 16) & 255;
        rgba[j+1] = (c >>> 8) & 255;
        rgba[j+2] = c & 255;
        rgba[j+3] = 255;
    }
    postMessage({type:'frame', pixels:rgba.buffer}, [rgba.buffer]);
});
uint16_t platform_buttons(void) { return read_buttons(); }
uint32_t platform_millis(void) { return (uint32_t)read_clock(); }
void platform_sleep(uint32_t ms) {
    emscripten_sleep(ms);
    while (is_paused()) emscripten_sleep(50);
}
void platform_present(const uint8_t *pixels, const uint32_t *palette) {
    present(pixels, palette);
    platform_sleep(0);
}
