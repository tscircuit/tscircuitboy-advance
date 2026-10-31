/* SPDX-License-Identifier: GPL-2.0-or-later */
#ifndef GAME_PLATFORM_H
#define GAME_PLATFORM_H
#include <stdint.h>
#define GAME_WIDTH 320
#define GAME_HEIGHT 200
/* Same bit order as board.h buttons_read(). */
enum { BTN_UP=1, BTN_DOWN=2, BTN_LEFT=4, BTN_RIGHT=8, BTN_A=16,
       BTN_B=32, BTN_X=64, BTN_Y=128, BTN_SELECT=256, BTN_START=512,
       BTN_L=1024, BTN_R=2048 };
uint16_t platform_buttons(void);
uint32_t platform_millis(void);
void platform_sleep(uint32_t ms);
/* Pixels are 8-bit indices. Palette entries are 0x00RRGGBB. Copied before return. */
void platform_present(const uint8_t *pixels, const uint32_t *palette);
void game_init(void);
/* Fixed 35 Hz simulation. Keep gameplay independent of wall-clock/render speed. */
void game_tick(void);
#endif
