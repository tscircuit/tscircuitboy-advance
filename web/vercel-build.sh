#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# Keep the compiler outside the published output; pin the SDK bootstrap and
# toolchain so local, CI and Vercel builds use the same Emscripten version.
emsdk_revision=d7b4130688bfa348392b921ab04015aa15c4f154
sdk_dir="$PWD/.vercel/cache/emsdk"
if [ ! -f "$sdk_dir/emsdk" ]; then
  mkdir -p "$sdk_dir"
  curl --fail --location --retry 3 --silent --show-error \
    "https://github.com/emscripten-core/emsdk/archive/$emsdk_revision.tar.gz" \
    | tar -xz --strip-components=1 -C "$sdk_dir"
fi
"$sdk_dir/emsdk" install 4.0.23
"$sdk_dir/emsdk" activate 4.0.23
# emsdk_env.sh may refer to unset optional variables.
set +u
source "$sdk_dir/emsdk_env.sh"
set -u
python3 web/build.py
node web/smoke-test.cjs

# Publish corresponding source with the GPL engine, including when the Vercel
# checkout has no .git directory. Never include WADs or generated binaries.
tar --exclude='web/dist' --exclude='*.uf2' --exclude='*.zip' --exclude='*.wad' \
  --exclude='__pycache__' -czf web/dist/source.tar.gz \
  web games firmware/game-console vercel.json
