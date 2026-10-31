#pragma once
#include <stdbool.h>
#include <stdint.h>
#define MAX_DIRTY_REGIONS 250
struct dirty_region {
    uint16_t x0, y0, x1, y1;
};
unsigned find_dirty_regions(const uint8_t *before, const uint8_t *after, bool force,
                            struct dirty_region *regions);
