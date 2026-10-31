/* SPDX-License-Identifier: GPL-2.0-or-later */
/* Portable example: move the ship, dodge falling rocks, shoot with A.
 * No browser, Pico SDK, allocation, or operating-system dependencies. */
#include <string.h>
#include "game_platform.h"
static uint8_t screen[GAME_WIDTH*GAME_HEIGHT];
static uint32_t palette[256] = {0x08111f,0x152d46,0x78e8cd,0xf7bf67,0xef6f7d,0xe9f1ff};
static int x, shot_x, shot_y, alive, ticks, score;
static struct { int x,y,speed; } rocks[9];
static unsigned rng;
static unsigned random_next(void) { rng=rng*1664525u+1013904223u; return rng; }
static void rect(int x,int y,int w,int h,int color) {
    for(int j=y;j<y+h;j++) for(int i=x;i<x+w;i++)
        if(i>=0 && i<GAME_WIDTH && j>=0 && j<GAME_HEIGHT) screen[j*GAME_WIDTH+i]=color;
}
void game_init(void) {
    x=156; shot_y=-20; alive=1; ticks=0; score=0; rng=1234;
    for(int i=0;i<9;i++) { rocks[i].x=12+random_next()%288; rocks[i].y=-i*25; rocks[i].speed=1+i%3; }
}
void game_tick(void) {
    unsigned b=platform_buttons();
    if (!alive && (b&BTN_A)) game_init();
    if(alive) {
        if(b&BTN_LEFT) x-=4;
        if(b&BTN_RIGHT) x+=4;
        if(x<5)x=5; if(x>303)x=303;
        if((b&BTN_A) && shot_y<0) { shot_x=x+5; shot_y=174; }
        shot_y-=7;
        for(int i=0;i<9;i++) {
            rocks[i].y+=rocks[i].speed;
            if(shot_y>=0 && shot_x>=rocks[i].x-2 && shot_x<=rocks[i].x+12 && shot_y<rocks[i].y+12 && shot_y+8>rocks[i].y) {
                rocks[i].y=205; shot_y=-20; score++;
            }
            if(rocks[i].y>195) { rocks[i].y=-12; rocks[i].x=8+random_next()%298; }
            if(rocks[i].y+11>176 && rocks[i].y<190 && rocks[i].x+11>x && rocks[i].x<x+11) alive=0;
        }
        ticks++;
    }
    memset(screen,0,sizeof screen);
    for(int i=0;i<70;i++) rect((i*127)%320,(i*43+ticks/2)%200,1,1,1);
    for(int i=0;i<9;i++) { rect(rocks[i].x,rocks[i].y,11,11,4); rect(rocks[i].x+2,rocks[i].y+2,3,3,3); }
    rect(x,182,12,7,alive?2:4); rect(x+4,175,4,10,alive?5:4);
    rect(shot_x,shot_y,2,8,3);
    for(int i=0;i<score%50;i++) rect(5+i*6,5,4,3,2);
    if(!alive) { rect(90,85,140,3,4); rect(90,110,140,3,4); }
    platform_present(screen,palette);
}
