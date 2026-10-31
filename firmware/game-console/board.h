#pragma once
#include <stdint.h>
void board_init(void);
void lcd_rect(int x, int y, int w, int h, uint8_t r, uint8_t g, uint8_t b);
void lcd_text(int x, int y, const char *s, int scale);
void lcd_frame(const uint8_t *pixels, const uint32_t *palette);
uint16_t buttons_read(void);

extern int lcd_large;

void lcd_set_clock(uint32_t hz);
uint32_t lcd_get_clock(void);
void lcd_calibration(void);

void lcd_frame_region(const uint8_t *, const uint32_t *, unsigned, unsigned, unsigned, unsigned);

void lcd_read_diagnostics(void);

extern int lcd_fast_mode;
void lcd_apply_game_mode(void);
void lcd_apply_ui_mode(void);
