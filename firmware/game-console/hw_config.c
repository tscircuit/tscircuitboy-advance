#include "hw_config.h"
static spi_t spi = {
    .hw_inst = spi1, .sck_gpio = 26, .mosi_gpio = 27, .miso_gpio = 28, .baud_rate = 6000000};
static sd_spi_if_t interface = {.spi = &spi, .ss_gpio = 29};
static sd_card_t card = {.type = SD_IF_SPI, .spi_if_p = &interface};
size_t sd_get_num(void) { return 1; }
sd_card_t *sd_get_by_num(size_t num) { return num == 0 ? &card : NULL; }
