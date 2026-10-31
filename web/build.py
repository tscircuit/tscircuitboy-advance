#!/usr/bin/env python3
"""Build the same Doom translation units used by the Pico CMake target."""
import os, pathlib, re, shutil, subprocess
root = pathlib.Path(__file__).resolve().parents[1]
web = root / 'web'
out = web / 'dist'
out.mkdir(exist_ok=True)
emcc = os.environ.get('EMCC', 'emcc')
common = [emcc, '-O2', '-I'+str(root/'games/platform'), '-sASYNCIFY',
          '-sASYNCIFY_STACK_SIZE=65536', '-sSTACK_SIZE=1048576',
          '-sINITIAL_MEMORY=33554432', '-sALLOW_MEMORY_GROWTH',
          '-sMAXIMUM_MEMORY=134217728', '-sMODULARIZE', '-sEXPORT_NAME=createGame',
          '-sENVIRONMENT=worker,node', '-sFORCE_FILESYSTEM',
          '-sEXPORTED_RUNTIME_METHODS=FS,callMain', '-sEXIT_RUNTIME=1',
          str(web/'src/platform_web.c')]
engine = root / 'firmware/game-console'
sources = re.findall(r'^\s+(doomgeneric/\w+\.c)\s*$', (engine/'CMakeLists.txt').read_text(), re.M)
assert len(sources)>70, 'Doom source manifest could not be read'
subprocess.run(common + ['-DCMAP256', '-DDOOMGENERIC_RESX=320', '-DDOOMGENERIC_RESY=200',
    '-DNORMALUNIX', '-DUSE_PRINTF', '-DUSE_DBG_PRINTF', '-Wno-incompatible-pointer-types',
    '-I'+str(engine/'doomgeneric'), str(web/'src/doom_web.c'),
    *[str(engine/s) for s in sources], '-lm', '-o', str(out/'doom.js')], check=True)
subprocess.run(common + [str(root/'games/platform/web_main.c'), str(root/'games/star-test/game.c'),
                        '-o', str(out/'star-test.js')], check=True)
for name in ['index.html','app.js','worker.js','style.css']:
    shutil.copyfile(web/name,out/name)
print('Web build ready:',out)

shutil.copyfile(engine/'LICENSE',out/'LICENSE-doom.txt')
shutil.copyfile(engine/'THIRD_PARTY.md',out/'THIRD_PARTY.md')
