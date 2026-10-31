# Game Boy Advance RP2350 LCD bring-up

Built for the published abse/gameboy-advance v0.0.39 pin mapping:
https://tscircuit.com/abse/gameboy-advance/blob/index.circuit.tsx

- ILI9488, four-wire SPI0: SCK GP18, MOSI GP19, MISO GP16.
- CS GP10; D/C GP20; shared LCD/touch reset GP21.
- Backlight GP24, PWM at 60% duty.
- PSRAM CS GP8 is held high; audio GP22 held low.
- Buttons use internal pull-ups and appear as a hexadecimal bit mask:
  bits 0..11 = Up, Down, Left, Right, A, B, X, Y, Select, Start, L, R.

The display uses landscape 480x320, 18-bit pixels at 4 MHz SPI.
It displays HELLO SEVE, color bars, and a running counter with button state.
USB CDC prints uptime, LCD register reads, button state, and frame count.
This is a display/button bring-up test, not a complete board qualification.

## Build

Requires Raspberry Pi Pico SDK (tested with 2.3.1), ARM GCC, CMake and Ninja.

```sh
export PICO_SDK_PATH=/path/to/pico-sdk
cmake -S . -B build -G Ninja -DPICO_BOARD=pico2 -DPICO_PLATFORM=rp2350-arm-s
cmake --build build
```

A Pico 2 SDK target is used for the RP2350A/12 MHz clock/standard flash boot.
Only the first 64 KiB was backed up before writing the application. The saved range was entirely erased (0xFF).
The backup is `../pre-test-flash-64k.bin`; it is not a full external-flash backup.

## Flash

Enter BOOTSEL mode, then copy `../gba-lcd-test.uf2` to the RP2350 drive,
or use `picotool load -v -x ../gba-lcd-test.uf2`.

The tested board's USB serial number is 725C4F2D480112C0.
Flash readback verification passed. USB serial showed increasing uptime and
frame counters. The LCD 0x09 status read consistently returned ca31920000;
0xD3 ID returned ffffffff and should not be treated as confirmed chip identity.
The user confirmed that text, color bars, and the running counter are visible on the physical LCD. Button response has not yet been confirmed.
