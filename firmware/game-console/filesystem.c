/* Native newlib/FatFs bridge. Firmware heap lives in detected QMI PSRAM. */
#include "ff.h"
#include "hardware/psram.h"
#include "pico/stdlib.h"
#include <errno.h>
#include <fcntl.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <sys/stat.h>
#include <sys/types.h>
static FIL files[12];
static bool used[12];
static int fail(FRESULT r) {
    errno = (r == FR_NO_FILE || r == FR_NO_PATH) ? ENOENT : r == FR_EXIST ? EEXIST : EIO;
    return -1;
}
void *_sbrk(int incr) {
    static uintptr_t pos = 0;
    uintptr_t base = 0x11010000, limit = 0x11000000 + psram_get_size();
    if (!psram_is_available()) {
        errno = ENOMEM;
        return (void *)-1;
    }
    if (!pos)
        pos = base;
    uintptr_t next = pos + incr;
    if (next < base || next > limit - 65536) {
        errno = ENOMEM;
        return (void *)-1;
    }
    void *r = (void *)pos;
    pos = next;
    return r;
}
int _open(const char *path, int flags, ...) {
    for (int i = 0; i < 12; i++)
        if (!used[i]) {
            BYTE mode = (flags & O_RDWR)     ? FA_READ | FA_WRITE
                        : (flags & O_WRONLY) ? FA_WRITE
                                             : FA_READ;
            if (flags & O_CREAT)
                mode |= (flags & O_EXCL)    ? FA_CREATE_NEW
                        : (flags & O_TRUNC) ? FA_CREATE_ALWAYS
                                            : FA_OPEN_ALWAYS;
            FRESULT r = f_open(&files[i], path, mode);
            if (r)
                return fail(r);
            if (flags & O_APPEND)
                f_lseek(&files[i], f_size(&files[i]));
            used[i] = true;
            return i + 3;
        }
    errno = EMFILE;
    return -1;
}
int _close(int fd) {
    if (fd < 3)
        return 0;
    if (fd >= 15 || !used[fd - 3]) {
        errno = EBADF;
        return -1;
    }
    FRESULT r = f_close(&files[fd - 3]);
    used[fd - 3] = false;
    return r ? fail(r) : 0;
}
int _read(int fd, char *buf, int n) {
    if (fd == 0) {
        int i = 0;
        for (; i < n; i++) {
            int c = getchar_timeout_us(i ? 0 : 1000);
            if (c < 0)
                break;
            buf[i] = c;
        }
        return i;
    }
    if (fd < 3 || fd >= 15 || !used[fd - 3]) {
        errno = EBADF;
        return -1;
    }
    UINT got;
    FRESULT r = f_read(&files[fd - 3], buf, n, &got);
    return r ? fail(r) : got;
}
int _write(int fd, const char *buf, int n) {
    if (fd == 1 || fd == 2) {
        for (int i = 0; i < n; i++)
            putchar_raw(buf[i]);
        return n;
    }
    if (fd < 3 || fd >= 15 || !used[fd - 3]) {
        errno = EBADF;
        return -1;
    }
    UINT put;
    FRESULT r = f_write(&files[fd - 3], buf, n, &put);
    return r ? fail(r) : put;
}
off_t _lseek(int fd, off_t pos, int whence) {
    if (fd < 3 || fd >= 15 || !used[fd - 3]) {
        errno = EBADF;
        return -1;
    }
    FIL *f = &files[fd - 3];
    int64_t dest = pos;
    if (whence == SEEK_CUR)
        dest += f_tell(f);
    if (whence == SEEK_END)
        dest += f_size(f);
    if (dest < 0) {
        errno = EINVAL;
        return -1;
    }
    FRESULT r = f_lseek(f, dest);
    return r ? fail(r) : (off_t)f_tell(f);
}
int _fstat(int fd, struct stat *s) {
    memset(s, 0, sizeof(*s));
    if (fd < 3) {
        s->st_mode = S_IFCHR;
        return 0;
    }
    if (fd >= 15 || !used[fd - 3]) {
        errno = EBADF;
        return -1;
    }
    s->st_mode = S_IFREG | 0666;
    s->st_size = f_size(&files[fd - 3]);
    return 0;
}
int _stat(const char *p, struct stat *s) {
    FILINFO info;
    FRESULT r = f_stat(p, &info);
    if (r)
        return fail(r);
    memset(s, 0, sizeof(*s));
    s->st_mode = (info.fattrib & AM_DIR) ? S_IFDIR | 0777 : S_IFREG | 0666;
    s->st_size = info.fsize;
    return 0;
}
int _isatty(int fd) { return fd < 3; }
int _unlink(const char *p) {
    FRESULT r = f_unlink(p);
    return r ? fail(r) : 0;
}
int _rename(const char *a, const char *b) {
    FRESULT r = f_rename(a, b);
    return r ? fail(r) : 0;
}
int mkdir(const char *p, mode_t mode) {
    (void)mode;
    FRESULT r = f_mkdir(p);
    return r ? fail(r) : 0;
}
int access(const char *p, int mode) {
    (void)mode;
    FILINFO f;
    FRESULT r = f_stat(p, &f);
    return r ? fail(r) : 0;
}
int system(const char *cmd) {
    (void)cmd;
    return -1;
}
int _link(const char *oldpath, const char *newpath) {
    (void)oldpath;
    (void)newpath;
    errno = ENOSYS;
    return -1;
}
