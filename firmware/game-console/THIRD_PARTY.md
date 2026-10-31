# Third-party sources

## Doom engine

- Project: https://github.com/ozkl/doomgeneric
- Commit: `e257a09527062bfb986b6e5e0780839b6cbd5b71`
- License: GNU GPL v2 (see `LICENSE` and source-file notices).
- Based on id Software Doom and Chocolate Doom.
- Local changes: indexed framebuffer in SRAM, fatal-error display hook, SD configuration/save directory, immutable state table with mutable fast/nightmare timing overlay, const state pointers, and 16-bit bounded view-angle lookup.

## SD / FatFs driver

- Project: https://github.com/carlk3/no-OS-FatFS-SD-SDIO-SPI-RPi-Pico
- Commit: `d5e453404cdbfaa55ab30d285b6ab0b730e84a05`
- Driver license: Apache 2.0, see `SD-LICENSE`.
- Bundled FatFs has its own notices in `sd-fatfs/ff15/source/ff.c` and related files; retain them.
- Local changes: allow recognized SDSC cards; translate CMD17/18/24/25/32/33 sector addresses to bytes for SDSC; account for READ_BL_LEN when computing CSD v1 capacity; read legacy cards one sector at a time through an internal SRAM DMA buffer; stop clearly on short WAD reads.
- Addressing reference: SD Association Physical Layer Simplified Specification, section 4.3.14, https://www.sdcard.org/cms/wp-content/themes/sdcard-org/dl.php?f=Part1_Physical_Layer_Simplified_Specification_Ver7.10.pdf

## Pico SDK

External build dependency: Raspberry Pi Pico SDK 2.3.1, https://github.com/raspberrypi/pico-sdk . See its upstream licenses.

The glue source in this directory is provided under GPL-2.0-or-later, consistent with the Doom engine. Third-party components retain their respective licenses.

## Exact-panel initialization reference

The ER-TFT035IPS-6 gamma, power, VCOM and frame-rate values were checked against SeedHammer II's ILI9488 driver, commit `ea4b65be7137f268fc5e97e06d0fda4996233fbb`:
https://github.com/seedhammer/seedhammer/blob/ea4b65be7137f268fc5e97e06d0fda4996233fbb/driver/ili9488/ili9488.go
The corresponding hardware identifies this exact display at https://github.com/seedhammer/hardware . Webcam testing established RGB666 for this serial panel; RGB565 blanks it.
