#include "dirty_regions.h"
#include <string.h>
/* Compare 16x8 source tiles, combine horizontal runs, then extend equal
 * runs from the previous tile row. Coordinates are half-open. */
unsigned find_dirty_regions(const uint8_t *before, const uint8_t *after, bool force,
                            struct dirty_region *regions) {
    if (force) {
        regions[0] = (struct dirty_region){0, 0, 320, 200};
        return 1;
    }
    unsigned count = 0;
    for (unsigned y = 0; y < 200; y += 8) {
        bool dirty[20] = {0};
        for (unsigned tile = 0; tile < 20; tile++) {
            for (unsigned row = 0; row < 8; row++) {
                unsigned offset = (y + row) * 320 + tile * 16;
                if (memcmp(before + offset, after + offset, 16)) {
                    dirty[tile] = true;
                    break;
                }
            }
        }
        for (unsigned tile = 0; tile < 20;) {
            if (!dirty[tile]) {
                tile++;
                continue;
            }
            unsigned start = tile;
            while (tile < 20 && dirty[tile])
                tile++;
            unsigned merge = count;
            for (unsigned i = 0; i < count; i++)
                if (regions[i].x0 == start * 16 && regions[i].x1 == tile * 16 &&
                    regions[i].y1 == y) {
                    merge = i;
                    break;
                }
            if (merge < count)
                regions[merge].y1 = y + 8;
            else if (count < MAX_DIRTY_REGIONS)
                regions[count++] = (struct dirty_region){start * 16, y, tile * 16, y + 8};
            else {
                regions[0] = (struct dirty_region){0, 0, 320, 200};
                return 1;
            }
        }
    }
    return count;
}
