cmake_minimum_required(VERSION 3.13)
if(NOT PICO_SDK_PATH)
 set(PICO_SDK_PATH "$ENV{PICO_SDK_PATH}" CACHE PATH "Pico SDK")
endif()
include(${PICO_SDK_PATH}/external/pico_sdk_import.cmake)
project(gba_console C CXX ASM)
set(CMAKE_C_STANDARD 11)
pico_sdk_init()
add_subdirectory(sd-fatfs)
add_executable(gba_console main.c board.c hw_config.c dirty_regions.c asset_diagnostics.c)
target_link_libraries(gba_console pico_stdlib hardware_spi hardware_pio hardware_pwm hardware_psram hardware_xip_cache hardware_watchdog pico_multicore no-OS-FatFS-SD-SDIO-SPI-RPi-Pico)
target_compile_definitions(gba_console PRIVATE PICO_PSRAM_CS_PIN=8 PICO_AUTO_DETECT_PSRAM_SIZE=1 PICO_DEFAULT_PSRAM_MAX_FREQ=66000000 PICO_STACK_SIZE=16384 PICO_CORE1_STACK_SIZE=4096)
pico_enable_stdio_usb(gba_console 1)
pico_enable_stdio_uart(gba_console 0)
pico_set_program_name(gba_console "GBA game console")
pico_set_program_version(gba_console "0.3")
pico_add_extra_outputs(gba_console)

target_sources(gba_console PRIVATE filesystem.c doom_port.c
 doomgeneric/dummy.c
 doomgeneric/am_map.c
 doomgeneric/doomdef.c
 doomgeneric/doomstat.c
 doomgeneric/dstrings.c
 doomgeneric/d_event.c
 doomgeneric/d_items.c
 doomgeneric/d_iwad.c
 doomgeneric/d_loop.c
 doomgeneric/d_main.c
 doomgeneric/d_mode.c
 doomgeneric/d_net.c
 doomgeneric/f_finale.c
 doomgeneric/f_wipe.c
 doomgeneric/g_game.c
 doomgeneric/hu_lib.c
 doomgeneric/hu_stuff.c
 doomgeneric/info.c
 doomgeneric/i_cdmus.c
 doomgeneric/i_endoom.c
 doomgeneric/i_joystick.c
 doomgeneric/i_scale.c
 doomgeneric/i_sound.c
 doomgeneric/i_system.c
 doomgeneric/i_timer.c
 doomgeneric/memio.c
 doomgeneric/m_argv.c
 doomgeneric/m_bbox.c
 doomgeneric/m_cheat.c
 doomgeneric/m_config.c
 doomgeneric/m_controls.c
 doomgeneric/m_fixed.c
 doomgeneric/m_menu.c
 doomgeneric/m_misc.c
 doomgeneric/m_random.c
 doomgeneric/p_ceilng.c
 doomgeneric/p_doors.c
 doomgeneric/p_enemy.c
 doomgeneric/p_floor.c
 doomgeneric/p_inter.c
 doomgeneric/p_lights.c
 doomgeneric/p_map.c
 doomgeneric/p_maputl.c
 doomgeneric/p_mobj.c
 doomgeneric/p_plats.c
 doomgeneric/p_pspr.c
 doomgeneric/p_saveg.c
 doomgeneric/p_setup.c
 doomgeneric/p_sight.c
 doomgeneric/p_spec.c
 doomgeneric/p_switch.c
 doomgeneric/p_telept.c
 doomgeneric/p_tick.c
 doomgeneric/p_user.c
 doomgeneric/r_bsp.c
 doomgeneric/r_data.c
 doomgeneric/r_draw.c
 doomgeneric/r_main.c
 doomgeneric/r_plane.c
 doomgeneric/r_segs.c
 doomgeneric/r_sky.c
 doomgeneric/r_things.c
 doomgeneric/sha1.c
 doomgeneric/sounds.c
 doomgeneric/statdump.c
 doomgeneric/st_lib.c
 doomgeneric/st_stuff.c
 doomgeneric/s_sound.c
 doomgeneric/tables.c
 doomgeneric/v_video.c
 doomgeneric/wi_stuff.c
 doomgeneric/w_checksum.c
 doomgeneric/w_file.c
 doomgeneric/w_main.c
 doomgeneric/w_wad.c
 doomgeneric/z_zone.c
 doomgeneric/w_file_stdc.c
 doomgeneric/i_input.c
 doomgeneric/i_video.c
 doomgeneric/doomgeneric.c
)
target_include_directories(gba_console PRIVATE doomgeneric)
target_compile_definitions(gba_console PRIVATE CMAP256 DOOMGENERIC_RESX=320 DOOMGENERIC_RESY=200 NORMALUNIX PICO_MALLOC_PANIC=0 USE_PRINTF USE_DBG_PRINTF)
target_link_libraries(gba_console m)

pico_add_linker_script_override_path(gba_console ${CMAKE_CURRENT_SOURCE_DIR}/linker FILES sections_stack.incl section_end.incl section_heap.incl)

option(BUILD_GAME_EXAMPLE "Build the shared browser/Pico example game" OFF)
if(BUILD_GAME_EXAMPLE)
  set(GAME_ROOT ${CMAKE_CURRENT_SOURCE_DIR}/../../games)
  add_executable(star_test board.c ${GAME_ROOT}/platform/pico_main.c ${GAME_ROOT}/star-test/game.c)
  target_include_directories(star_test PRIVATE . ${GAME_ROOT}/platform)
  target_link_libraries(star_test pico_stdlib hardware_spi hardware_pio hardware_pwm hardware_dma)
  pico_enable_stdio_usb(star_test 1)
  pico_enable_stdio_uart(star_test 0)
  pico_add_extra_outputs(star_test)
endif()
