#include <stdio.h>
#include <string.h>
#include "pico/stdlib.h"
#include "hardware/spi.h"
#include "hardware/pwm.h"
#include "hardware/i2c.h"
#define CS 10
#define DC 20
#define RST 21
#define BL 24
static void cmd(uint8_t c,const uint8_t *d,size_t n){gpio_put(CS,0);gpio_put(DC,0);spi_write_blocking(spi0,&c,1);gpio_put(DC,1);if(n)spi_write_blocking(spi0,d,n);gpio_put(CS,1);}
#define CMD(c,...) do {const uint8_t d[]={__VA_ARGS__};cmd(c,d,sizeof(d));}while(0)
static void readreg(uint8_t c,uint8_t *d,size_t n){gpio_put(CS,0);gpio_put(DC,0);spi_write_blocking(spi0,&c,1);gpio_put(DC,1);spi_read_blocking(spi0,0,d,n);gpio_put(CS,1);}
static void rect(int x,int y,int w,int h,uint8_t r,uint8_t g,uint8_t b){CMD(0x2a,x>>8,x,(x+w-1)>>8,x+w-1);CMD(0x2b,y>>8,y,(y+h-1)>>8,y+h-1);uint8_t row[480*3];for(int i=0;i<w;i++){row[i*3]=r;row[i*3+1]=g;row[i*3+2]=b;}gpio_put(CS,0);gpio_put(DC,0);uint8_t c=0x2c;spi_write_blocking(spi0,&c,1);gpio_put(DC,1);for(int i=0;i<h;i++)spi_write_blocking(spi0,row,w*3);gpio_put(CS,1);}
/* 5x7 glyphs, columns, least significant bit at top. */
static const char chars[]=" ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:-";
static const uint8_t font[][5]={{0},{0x7e,0x11,0x11,0x11,0x7e},{0x7f,0x49,0x49,0x49,0x36},{0x3e,0x41,0x41,0x41,0x22},{0x7f,0x41,0x41,0x22,0x1c},{0x7f,0x49,0x49,0x49,0x41},{0x7f,9,9,9,1},{0x3e,0x41,0x49,0x49,0x7a},{0x7f,8,8,8,0x7f},{0,0x41,0x7f,0x41,0},{0x20,0x40,0x41,0x3f,1},{0x7f,8,0x14,0x22,0x41},{0x7f,0x40,0x40,0x40,0x40},{0x7f,2,0xc,2,0x7f},{0x7f,4,8,0x10,0x7f},{0x3e,0x41,0x41,0x41,0x3e},{0x7f,9,9,9,6},{0x3e,0x41,0x51,0x21,0x5e},{0x7f,9,0x19,0x29,0x46},{0x46,0x49,0x49,0x49,0x31},{1,1,0x7f,1,1},{0x3f,0x40,0x40,0x40,0x3f},{0x1f,0x20,0x40,0x20,0x1f},{0x3f,0x40,0x38,0x40,0x3f},{0x63,0x14,8,0x14,0x63},{7,8,0x70,8,7},{0x61,0x51,0x49,0x45,0x43},{0x3e,0x51,0x49,0x45,0x3e},{0,0x42,0x7f,0x40,0},{0x42,0x61,0x51,0x49,0x46},{0x21,0x41,0x45,0x4b,0x31},{0x18,0x14,0x12,0x7f,0x10},{0x27,0x45,0x45,0x45,0x39},{0x3c,0x4a,0x49,0x49,0x30},{1,0x71,9,5,3},{0x36,0x49,0x49,0x49,0x36},{6,0x49,0x49,0x29,0x1e},{0,0x36,0x36,0,0},{8,8,8,8,8}};
static void text(int x,int y,const char*s,int scale){for(;*s;s++,x+=6*scale){const char*p=strchr(chars,*s);if(!p)continue;int n=p-chars;for(int i=0;i<5;i++)for(int j=0;j<7;j++)if(font[n][i]&(1<<j))rect(x+i*scale,y+j*scale,scale,scale,252,252,252);}}
int main(){stdio_init_all();gpio_init(CS);gpio_put(CS,1);gpio_set_dir(CS,GPIO_OUT);gpio_init(DC);gpio_set_dir(DC,GPIO_OUT);gpio_init(RST);gpio_put(RST,0);gpio_set_dir(RST,GPIO_OUT);gpio_init(8);gpio_put(8,1);gpio_set_dir(8,GPIO_OUT);gpio_init(22);gpio_put(22,0);gpio_set_dir(22,GPIO_OUT);
spi_init(spi0,4000000);gpio_set_function(16,GPIO_FUNC_SPI);gpio_set_function(18,GPIO_FUNC_SPI);gpio_set_function(19,GPIO_FUNC_SPI);
gpio_set_function(BL,GPIO_FUNC_PWM);uint slice=pwm_gpio_to_slice_num(BL);pwm_set_wrap(slice,999);pwm_set_gpio_level(BL,0);pwm_set_enabled(slice,true);
sleep_ms(50);gpio_put(RST,1);sleep_ms(150);
CMD(0x01);sleep_ms(150);
CMD(0xe0,0x00,0x03,0x09,0x08,0x16,0x0a,0x3f,0x78,0x4c,0x09,0x0a,0x08,0x16,0x1a,0x0f);
CMD(0xe1,0x00,0x16,0x19,0x03,0x0f,0x05,0x32,0x45,0x46,0x04,0x0e,0x0d,0x35,0x37,0x0f);
CMD(0xc0,0x17,0x15);CMD(0xc1,0x41);CMD(0xc5,0x00,0x12,0x80);CMD(0x36,0x28);CMD(0x3a,0x66);CMD(0xb0,0x00);CMD(0xb1,0xa0);CMD(0xb4,0x02);CMD(0xb6,0x02,0x02);CMD(0xe9,0x00);CMD(0xf7,0xa9,0x51,0x2c,0x82);CMD(0x11);sleep_ms(150);CMD(0x21);CMD(0x29);sleep_ms(50);
rect(0,0,480,320,8,16,28);text(30,25,"HELLO SEVE",6);text(30,95,"RP2350 LCD TEST",4);const uint8_t colors[][3]={{252,0,0},{0,252,0},{0,0,252},{252,252,0},{0,252,252},{252,0,252}};for(int i=0;i<6;i++)rect(i*80,155,80,65,colors[i][0],colors[i][1],colors[i][2]);text(30,240,"PRESS ANY BUTTON",3);pwm_set_gpio_level(BL,600);
const int pins[]={2,3,4,5,6,7,12,9,17,11,13,14};for(int i=0;i<12;i++){gpio_init(pins[i]);gpio_set_dir(pins[i],GPIO_IN);gpio_pull_up(pins[i]);}
uint32_t frame=0;while(1){uint8_t id[4],status[5];readreg(0xd3,id,4);readreg(0x09,status,5);unsigned buttons=0;for(int i=0;i<12;i++)if(!gpio_get(pins[i]))buttons|=1<<i;printf("GBA_LCD_TEST uptime=%lu ID=%02x%02x%02x%02x STATUS=%02x%02x%02x%02x%02x buttons=%03x frames=%lu\n",(unsigned long)(to_ms_since_boot(get_absolute_time())/1000),id[0],id[1],id[2],id[3],status[0],status[1],status[2],status[3],status[4],buttons,(unsigned long)frame);rect(30,280,420,25,8,16,28);char msg[30];snprintf(msg,sizeof(msg),"RUNNING %lu  KEY %03X",(unsigned long)frame,buttons);text(30,280,msg,2);frame++;sleep_ms(1000);}}
