#include "doomgeneric/i_system.h"
#include "doomgeneric/w_wad.h"
#include "hardware/xip_cache.h"
#include "wad_checksums.h"
#include <stdint.h>
#include <stdio.h>
#include <string.h>
static unsigned reads_ok;
#ifndef GBA_VERIFY_EVERY_ASSET_READ
#define GBA_VERIFY_EVERY_ASSET_READ 0
#endif
static uint32_t crc32(const void *data, unsigned size) {
    const uint8_t *p = data;
    uint32_t crc = ~0u;
    while (size--) {
        crc ^= *p++;
        for (int bit = 0; bit < 8; bit++)
            crc = (crc >> 1) ^ (0xedb88320u & -(crc & 1));
    }
    return ~crc;
}
static int expected(unsigned i) {
    return lumpinfo[i].wad_file->length == 4196020 &&
           i < sizeof(wad_expected) / sizeof(wad_expected[0]) &&
           lumpinfo[i].position == wad_expected[i].pos && lumpinfo[i].size == wad_expected[i].size;
}
void verify_lump_read(unsigned i, const void *data) {
    if (!GBA_VERIFY_EVERY_ASSET_READ || !expected(i))
        return;
    uint32_t actual = crc32(data, lumpinfo[i].size);
    if (actual != wad_expected[i].crc) {
        printf("ASSET_BAD_READ %.8s lump=%u addr=%p actual=%08lx expected=%08x\n", lumpinfo[i].name,
               i, data, (unsigned long)actual, wad_expected[i].crc);
        I_Error("Bad SD/PSRAM texture data: %.8s", lumpinfo[i].name);
    }
    reads_ok++;
}
void verify_asset_caches(void) {
    unsigned checked = 0, bad = 0;
    xip_cache_clean_all();
    xip_cache_invalidate_all();
    for (unsigned i = 0; i < numlumps; i++)
        if (expected(i) && lumpinfo[i].cache) {
            uint32_t actual = crc32(lumpinfo[i].cache, lumpinfo[i].size);
            checked++;
            if (actual != wad_expected[i].crc) {
                bad++;
                printf("ASSET_BAD_CACHE %.8s lump=%u addr=%p actual=%08lx expected=%08x\n",
                       lumpinfo[i].name, i, lumpinfo[i].cache, (unsigned long)actual,
                       wad_expected[i].crc);
            }
        }
    printf("ASSET_CHECK reads_ok=%u caches=%u cache_bad=%u\n", reads_ok, checked, bad);
}
