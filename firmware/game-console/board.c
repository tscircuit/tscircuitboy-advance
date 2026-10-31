#include "board.h"
#include "hardware/clocks.h"
#include "hardware/dma.h"
#include "hardware/pwm.h"
#include "hardware/pio.h"
#include "hardware/spi.h"
#include "pico/stdlib.h"
#include <stdio.h>
#include <string.h>
#define CS 10
#define DC 20
#define RST 21
#define BL 24
int lcd_fast_mode = 2;
static int wire_fast_mode;
static bool fast_stream_ready;
static uint32_t fast_spi_hz = 50000000;

static void cmd(uint8_t c, const uint8_t *d, size_t n) {
    fast_stream_ready = false;
    uint32_t saved_hz = spi_get_baudrate(spi0);
    if (saved_hz > 20000000)
        spi_set_baudrate(spi0, 20000000);
    gpio_put(CS, 0);
    gpio_put(DC, 0);
    spi_write_blocking(spi0, &c, 1);
    gpio_put(DC, 1);
    if (n)
        spi_write_blocking(spi0, d, n);
    gpio_put(CS, 1);
    if (saved_hz > 20000000)
        spi_set_baudrate(spi0, saved_hz);
}
#define CMD(c, ...)                                                                                \
    do {                                                                                           \
        const uint8_t d[] = {__VA_ARGS__};                                                         \
        cmd(c, d, sizeof(d));                                                                      \
    } while (0)
static void readreg(uint8_t c, uint8_t *d, size_t n) {
    gpio_put(CS, 0);
    gpio_put(DC, 0);
    spi_write_blocking(spi0, &c, 1);
    gpio_put(DC, 1);
    spi_read_blocking(spi0, 0, d, n);
    gpio_put(CS, 1);
}
void lcd_rect(int x, int y, int w, int h, uint8_t r, uint8_t g, uint8_t b) {
    lcd_apply_ui_mode();
    CMD(0x2a, x >> 8, x, (x + w - 1) >> 8, x + w - 1);
    CMD(0x2b, y >> 8, y, (y + h - 1) >> 8, y + h - 1);
    uint8_t row[480 * 3];
    for (int i = 0; i < w; i++) {
        row[i * 3] = r;
        row[i * 3 + 1] = g;
        row[i * 3 + 2] = b;
    }
    gpio_put(CS, 0);
    gpio_put(DC, 0);
    uint8_t c = 0x2c;
    spi_write_blocking(spi0, &c, 1);
    gpio_put(DC, 1);
    for (int i = 0; i < h; i++)
        spi_write_blocking(spi0, row, w * 3);
    gpio_put(CS, 1);
}
/* 5x7 glyphs, columns, least significant bit at top. */
static const char chars[] = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:-";
static const uint8_t font[][5] = {{0},
                                  {0x7e, 0x11, 0x11, 0x11, 0x7e},
                                  {0x7f, 0x49, 0x49, 0x49, 0x36},
                                  {0x3e, 0x41, 0x41, 0x41, 0x22},
                                  {0x7f, 0x41, 0x41, 0x22, 0x1c},
                                  {0x7f, 0x49, 0x49, 0x49, 0x41},
                                  {0x7f, 9, 9, 9, 1},
                                  {0x3e, 0x41, 0x49, 0x49, 0x7a},
                                  {0x7f, 8, 8, 8, 0x7f},
                                  {0, 0x41, 0x7f, 0x41, 0},
                                  {0x20, 0x40, 0x41, 0x3f, 1},
                                  {0x7f, 8, 0x14, 0x22, 0x41},
                                  {0x7f, 0x40, 0x40, 0x40, 0x40},
                                  {0x7f, 2, 0xc, 2, 0x7f},
                                  {0x7f, 4, 8, 0x10, 0x7f},
                                  {0x3e, 0x41, 0x41, 0x41, 0x3e},
                                  {0x7f, 9, 9, 9, 6},
                                  {0x3e, 0x41, 0x51, 0x21, 0x5e},
                                  {0x7f, 9, 0x19, 0x29, 0x46},
                                  {0x46, 0x49, 0x49, 0x49, 0x31},
                                  {1, 1, 0x7f, 1, 1},
                                  {0x3f, 0x40, 0x40, 0x40, 0x3f},
                                  {0x1f, 0x20, 0x40, 0x20, 0x1f},
                                  {0x3f, 0x40, 0x38, 0x40, 0x3f},
                                  {0x63, 0x14, 8, 0x14, 0x63},
                                  {7, 8, 0x70, 8, 7},
                                  {0x61, 0x51, 0x49, 0x45, 0x43},
                                  {0x3e, 0x51, 0x49, 0x45, 0x3e},
                                  {0, 0x42, 0x7f, 0x40, 0},
                                  {0x42, 0x61, 0x51, 0x49, 0x46},
                                  {0x21, 0x41, 0x45, 0x4b, 0x31},
                                  {0x18, 0x14, 0x12, 0x7f, 0x10},
                                  {0x27, 0x45, 0x45, 0x45, 0x39},
                                  {0x3c, 0x4a, 0x49, 0x49, 0x30},
                                  {1, 0x71, 9, 5, 3},
                                  {0x36, 0x49, 0x49, 0x49, 0x36},
                                  {6, 0x49, 0x49, 0x29, 0x1e},
                                  {0, 0x36, 0x36, 0, 0},
                                  {8, 8, 8, 8, 8}};
void lcd_text(int x, int y, const char *s, int scale) {
    for (; *s; s++, x += 6 * scale) {
        const char *p = strchr(chars, *s);
        if (!p)
            continue;
        int n = p - chars;
        for (int i = 0; i < 5; i++)
            for (int j = 0; j < 7; j++)
                if (font[n][i] & (1 << j))
                    lcd_rect(x + i * scale, y + j * scale, scale, scale, 252, 252, 252);
    }
}

void board_init(void) {
    stdio_init_all();
    gpio_init(CS);
    gpio_put(CS, 1);
    gpio_set_dir(CS, GPIO_OUT);
    gpio_init(DC);
    gpio_set_dir(DC, GPIO_OUT);
    gpio_init(RST);
    gpio_put(RST, 0);
    gpio_set_dir(RST, GPIO_OUT);
    gpio_init(22);
    gpio_put(22, 0);
    gpio_set_dir(22, GPIO_OUT);
    spi_init(spi0, 20000000);
    gpio_set_function(16, GPIO_FUNC_SPI);
    gpio_set_function(18, GPIO_FUNC_SPI);
    gpio_set_function(19, GPIO_FUNC_SPI);
    gpio_set_slew_rate(18, GPIO_SLEW_RATE_FAST);
    gpio_set_slew_rate(19, GPIO_SLEW_RATE_FAST);
    gpio_set_drive_strength(18, GPIO_DRIVE_STRENGTH_8MA);
    gpio_set_drive_strength(19, GPIO_DRIVE_STRENGTH_8MA);
    gpio_set_function(BL, GPIO_FUNC_PWM);
    uint slice = pwm_gpio_to_slice_num(BL);
    pwm_set_wrap(slice, 999);
    pwm_set_gpio_level(BL, 0);
    pwm_set_enabled(slice, true);
    sleep_ms(50);
    gpio_put(RST, 1);
    sleep_ms(150);
    CMD(0x01);
    sleep_ms(150);
    // ER-TFT035IPS-6 profile used by SeedHammer II's same-panel driver.
    // SPI retains RGB666 (0x66); its parallel RGB565 setting is not applicable.
    CMD(0xe0, 0x00, 0x08, 0x0c, 0x02, 0x0e, 0x04, 0x30, 0x45, 0x47, 0x04, 0x0c, 0x0a, 0x2e, 0x34,
        0x0f);
    CMD(0xe1, 0x00, 0x11, 0x0d, 0x01, 0x0f, 0x05, 0x39, 0x36, 0x51, 0x06, 0x0f, 0x0d, 0x33, 0x37,
        0x0f);
    CMD(0xc0, 0x0f, 0x0f);
    CMD(0xc1, 0x41);
    CMD(0xc2, 0x22);
    CMD(0xc5, 0x00, 0x53, 0x80);
    CMD(0x36, 0x28);
    CMD(0x3a, 0x66);
    CMD(0xb0, 0x00);
    CMD(0xb1, 0xa0, 0x11);
    CMD(0xb4, 0x02);
    CMD(0xb6, 0x02, 0x02);
    CMD(0xe9, 0x00);
    CMD(0xf7, 0xa9, 0x51, 0x2c, 0x82);
    CMD(0x11);
    sleep_ms(150);
    CMD(0x21);
    CMD(0x29);
    sleep_ms(50);

    pwm_set_gpio_level(BL, 600);
    const int pins[] = {2, 3, 4, 5, 6, 7, 12, 9, 17, 11, 13, 14};
    for (int i = 0; i < 12; i++) {
        gpio_init(pins[i]);
        gpio_set_dir(pins[i], GPIO_IN);
        gpio_pull_up(pins[i]);
    }
}

uint16_t buttons_read(void) {
    const int pins[] = {2, 3, 4, 5, 6, 7, 12, 9, 17, 11, 13, 14};
    uint16_t b = 0;
    for (int i = 0; i < 12; i++)
        if (!gpio_get(pins[i]))
            b |= 1 << i;
    return b;
}
void lcd_apply_game_mode(void) {
    if (wire_fast_mode != lcd_fast_mode) {
        CMD(0x3a, 0x66);
        wire_fast_mode = lcd_fast_mode;
    }
    uint32_t want = 20000000;
    if (spi_get_baudrate(spi0) != want)
        spi_set_baudrate(spi0, want);
}
void lcd_apply_ui_mode(void) {
    if (wire_fast_mode) {
        CMD(0x3a, 0x66);
        wire_fast_mode = 0;
    }
    if (spi_get_baudrate(spi0) > 20000000)
        spi_set_baudrate(spi0, 20000000);
}
int lcd_large = 1;
void __not_in_flash_func(lcd_frame_region)(const uint8_t *pixels, const uint32_t *palette,
                                           unsigned sx0, unsigned sy0, unsigned sx1, unsigned sy1) {
    static int channel = -1;
    static uint8_t rows[2][480 * 3] __attribute__((aligned(4)));
    static int sm = -1;
    static uint program_offset;
    PIO pio = pio0;
    if (sm < 0) {
        uint16_t code[2] = {pio_encode_out(pio_pins, 1),
                            pio_encode_nop() | pio_encode_sideset(1, 1)};
        struct pio_program program = {.instructions = code, .length = 2, .origin = -1};
        sm = pio_claim_unused_sm(pio, true);
        program_offset = pio_add_program(pio, &program);
    }
    if (channel < 0)
        channel = dma_claim_unused_channel(true);
    const int full = lcd_large;
    int width = full ? 480 : 320, height = full ? 320 : 240;
    unsigned dx0 = (sx0 * width + 319) / 320, dx1 = (sx1 * width + 319) / 320;
    unsigned dy0 = (sy0 * height + 199) / 200, dy1 = (sy1 * height + 199) / 200;
    unsigned region_width = dx1 - dx0;
    int x0 = (480 - width) / 2 + dx0, y0 = (320 - height) / 2 + dy0;
    CMD(0x2a, x0 >> 8, x0, (x0 + region_width - 1) >> 8, x0 + region_width - 1);
    CMD(0x2b, y0 >> 8, y0, (y0 + dy1 - dy0 - 1) >> 8, y0 + dy1 - dy0 - 1);
    gpio_put(CS, 0);
    gpio_put(DC, 0);
    uint8_t c = 0x2c;
    spi_write_blocking(spi0, &c, 1);
    gpio_put(DC, 1);
    pio_sm_config cfg = pio_get_default_sm_config();
    sm_config_set_wrap(&cfg, program_offset, program_offset + 1);
    sm_config_set_out_pins(&cfg, 19, 1);
    sm_config_set_sideset(&cfg, 1, false, false);
    sm_config_set_sideset_pins(&cfg, 18);
    sm_config_set_out_shift(&cfg, false, true, 32);
    sm_config_set_fifo_join(&cfg, PIO_FIFO_JOIN_TX);
    sm_config_set_clkdiv(&cfg, (float)clock_get_hz(clk_sys) / (2.0f * lcd_get_clock()));
    pio_gpio_init(pio, 18);
    pio_gpio_init(pio, 19);
    pio_sm_set_consecutive_pindirs(pio, sm, 18, 2, true);
    pio_sm_init(pio, sm, program_offset, &cfg);
    pio->fdebug = 1u << (PIO_FDEBUG_TXSTALL_LSB + sm);
    pio_sm_set_enabled(pio, sm, true);
    dma_channel_config config = dma_channel_get_default_config(channel);
    channel_config_set_transfer_data_size(&config, DMA_SIZE_32);
    channel_config_set_bswap(&config, true);
    channel_config_set_read_increment(&config, true);
    channel_config_set_write_increment(&config, false);
    channel_config_set_dreq(&config, pio_get_dreq(pio, sm, true));
    for (unsigned y = dy0; y < dy1; y++) {
        uint8_t *row = rows[y & 1];
        const uint8_t *in = pixels + (y * 200 / height) * 320;
        for (unsigned x = 0; x < region_width; x++) {
            uint32_t p = palette[in[(x + dx0) * 320 / width]];
            row[x * 3] = (p >> 16) & 252;
            row[x * 3 + 1] = (p >> 8) & 252;
            row[x * 3 + 2] = p & 252;
        }
        dma_channel_wait_for_finish_blocking(channel);
        dma_channel_configure(channel, &config, &pio->txf[sm], row, region_width * 3 / 4, true);
    }
    dma_channel_wait_for_finish_blocking(channel);
    while (!pio_sm_is_tx_fifo_empty(pio, sm))
        tight_loop_contents();
    // FIFO-empty can leave one 32-bit word in the output shift register.
    busy_wait_us_32((32000000u + lcd_get_clock() - 1) / lcd_get_clock() + 2);
    pio_sm_set_enabled(pio, sm, false);
    gpio_set_function(18, GPIO_FUNC_SPI);
    gpio_set_function(19, GPIO_FUNC_SPI);
    gpio_put(CS, 1);
}

void lcd_set_clock(uint32_t hz) {
    if (lcd_fast_mode) {
        fast_spi_hz = hz > 75000000 ? 75000000 : hz;

    } else
        spi_set_baudrate(spi0, hz > 20000000 ? 20000000 : hz);
}
uint32_t lcd_get_clock(void) { return lcd_fast_mode ? fast_spi_hz : 18750000; }
void lcd_calibration(void) {
    lcd_rect(0, 0, 480, 320, 0, 0, 0);
    lcd_text(18, 8, "LCD COLOR CHECK", 3);
    const uint8_t rgb[6][3] = {{252, 0, 0},   {0, 252, 0},   {0, 0, 252},
                               {252, 252, 0}, {0, 252, 252}, {252, 0, 252}};
    const char *labels[] = {"RED", "GREEN", "BLUE", "YELLOW", "CYAN", "MAGENTA"};
    for (int i = 0; i < 6; i++) {
        lcd_rect((i % 3) * 160, 45 + (i / 3) * 80, 160, 52, rgb[i][0], rgb[i][1], rgb[i][2]);
        lcd_text((i % 3) * 160 + 8, 103 + (i / 3) * 80, labels[i], 2);
    }
    for (int x = 0; x < 480; x++) {
        uint8_t v = (x * 255 / 479) & 252;
        lcd_rect(x, 210, 1, 50, v, v, v);
    }
    lcd_text(18, 276, "A OR START TO RETURN", 3);
}

void lcd_frame(const uint8_t *pixels, const uint32_t *palette) {
    lcd_frame_region(pixels, palette, 0, 0, 320, 200);
}

void lcd_read_diagnostics(void) {
    const uint8_t regs[] = {0x04, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0xd3};
    uint32_t old = spi_get_baudrate(spi0);
    spi_set_baudrate(spi0, 1000000);
    for (unsigned i = 0; i < sizeof(regs); i++) {
        uint8_t data[8];
        readreg(regs[i], data, sizeof(data));
        printf("LCDREG %02x", regs[i]);
        for (unsigned j = 0; j < sizeof(data); j++)
            printf(" %02x", data[j]);
        puts("");
    }
    spi_set_baudrate(spi0, old);
}
