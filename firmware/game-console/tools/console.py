#!/usr/bin/env python3
"""USB maintenance for the native GBA console. Requires pyserial; Pillow for shots."""
import argparse
import pathlib
import struct
import time
import zlib
import serial
import serial.tools.list_ports


def connect(port):
    if not port:
        devices = [p.device for p in serial.tools.list_ports.comports()
                   if p.vid == 0x2E8A and p.serial_number == "725C4F2D480112C0"]
        if len(devices) != 1:
            raise SystemExit("Expected one GBA USB device; specify --port")
        port = devices[0]
    return serial.Serial(port, 115200, timeout=5, write_timeout=10)


def line_until(s, prefixes):
    deadline = time.monotonic() + 30
    while time.monotonic() < deadline:
        line = s.readline().decode(errors="replace").strip()
        if line.startswith("ERROR"):
            raise RuntimeError(line)
        if line.startswith(prefixes):
            return line
        if line:
            print(line, flush=True)
    raise TimeoutError("No response from board")


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--port")
    sub = p.add_subparsers(dest="command", required=True)
    for name in ("status", "launch", "menu", "retry", "colors", "resume", "assets", "lcdregs"):
        sub.add_parser(name)
    rate = sub.add_parser("rate")
    rate.add_argument("hz", type=int)
    ls = sub.add_parser("ls")
    ls.add_argument("path", default="/games", nargs="?")
    put = sub.add_parser("put")
    put.add_argument("local", type=pathlib.Path)
    put.add_argument("remote")
    key = sub.add_parser("key")
    key.add_argument("mask", type=lambda x: int(x, 0))
    key.add_argument("ms", type=int, default=200, nargs="?")
    shot = sub.add_parser("shot")
    shot.add_argument("file", type=pathlib.Path)
    args = p.parse_args()
    with connect(args.port) as s:
        s.reset_input_buffer()
        if args.command == "put":
            data = args.local.read_bytes()
            if not args.remote.startswith("/games/") or " " in args.remote:
                raise SystemExit("Remote path must be under /games and have no spaces")
            crc = zlib.crc32(data)
            s.write(f"put {args.remote} {len(data)} {crc:08x}\n".encode())
            print(line_until(s, ("READY ",)), flush=True)
            for off in range(0, len(data), 4096):
                chunk = data[off:off+4096]
                s.write(chunk)
                reply = line_until(s, ("ACK ",))
                if reply != f"ACK {off + len(chunk)}":
                    raise RuntimeError(reply)
                if off % (4096 * 64) == 0:
                    print(f"Uploaded {off + len(chunk)} / {len(data)}", flush=True)
            reply = line_until(s, ("DONE ",))
            if reply != f"DONE 0 {len(data)} {crc:08x}":
                raise RuntimeError(reply)
            print(reply)
        elif args.command == "shot":
            from PIL import Image
            s.write(b"shot\n")
            header = line_until(s, ("FRAME ",))
            _, width, height, stride = header.split()
            width, height, stride = int(width), int(height), int(stride)
            expected = width * height * stride
            raw = bytearray()
            while len(raw) < expected:
                part = s.read(expected - len(raw))
                if not part:
                    raise TimeoutError("Incomplete frame")
                raw.extend(part)
            Image.frombytes("RGBA", (width, height), bytes(raw), "raw", "BGRA").convert("RGB").save(args.file)
            print(f"Saved {args.file}")
        else:
            command = args.command
            if command == "resume": command = "r"
            if command == "rate": command += f" {args.hz}"
            if command == "ls": command += f" {args.path}"
            if command == "key": command += f" {args.mask:x} {args.ms}"
            s.write((command + "\n").encode())
            for _ in range(40 if args.command == "ls" else 5):
                reply = s.readline().decode(errors="replace").strip()
                if reply: print(reply, flush=True)
                if reply == "END" or (args.command == "key" and reply.startswith("KEY ")): break


if __name__ == "__main__":
    main()
