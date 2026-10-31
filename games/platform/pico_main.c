/* SPDX-License-Identifier: GPL-2.0-or-later */
#include "game_platform.h"
#include "board.h"
#include "pico/stdlib.h"
uint16_t platform_buttons(void) { return buttons_read(); }
uint32_t platform_millis(void) { return to_ms_since_boot(get_absolute_time()); }
void platform_sleep(uint32_t ms) { sleep_ms(ms); }
void platform_present(const uint8_t *pixels,const uint32_t *palette) {
    static unsigned field;
    for(unsigned y=field;y<320;y+=3)
        lcd_indexed_scanline(pixels+(y*200/320)*320,palette,y,0,480);
    field=(field+1)%3;
}
int main(void) {
    stdio_init_all(); board_init(); lcd_large=1; lcd_apply_game_mode(); game_init();
    uint64_t start=time_us_64(); unsigned tick=0;
    for(;;) { game_tick(); sleep_until(from_us_since_boot(start+(++tick)*1000000ull/35)); }
}
