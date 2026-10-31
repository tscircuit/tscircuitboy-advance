/* SPDX-License-Identifier: GPL-2.0-or-later */
#include "game_platform.h"
int main(void) {
    game_init();
    uint32_t next = platform_millis();
    unsigned remainder = 0;
    for (;;) {
        game_tick();
        /* 1000 / 35 without cumulative integer truncation. */
        remainder += 1000;
        next += remainder / 35;
        remainder %= 35;
        int32_t remaining = (int32_t)(next - platform_millis());
        if (remaining > 0) platform_sleep((uint32_t)remaining);
        else next = platform_millis();
    }
}
