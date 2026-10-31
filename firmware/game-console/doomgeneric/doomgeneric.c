#include <stdio.h>

#include "m_argv.h"

#include "doomgeneric.h"

static pixel_t native_screen[DOOMGENERIC_RESX * DOOMGENERIC_RESY];
pixel_t* DG_ScreenBuffer = NULL;

void M_FindResponseFile(void);
void D_DoomMain (void);


void doomgeneric_Create(int argc, char **argv)
{
	// save arguments
    myargc = argc;
    myargv = argv;

	M_FindResponseFile();

	DG_ScreenBuffer = native_screen;

	DG_Init();

	D_DoomMain ();
}

