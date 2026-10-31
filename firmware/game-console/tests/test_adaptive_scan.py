"""Compile the actual field planner and scanline dispatcher against a mock LCD."""
from pathlib import Path
import subprocess,tempfile
root=Path(__file__).resolve().parents[1]
s=(root/'doom_port.c').read_text()
a=s.index('        bool full=force_redraw');b=s.index('        f->sequence',a)
plan=s[a:b]
a=s.index('        for(unsigned i=0;i<f->region_count;i++)');b=s.index('        display_us_total',a)
draw=s[a:b]
h='''#include <stdint.h>
#include <stdbool.h>
#include <string.h>
#include <assert.h>
struct dirty_region { uint16_t x0,y0,x1,y1; };
struct frame { uint8_t pixels[320*107]; uint32_t palette[256]; struct dirty_region regions[250]; unsigned region_count; } queue[3];
static uint8_t DG_ScreenBuffer[64000];
static uint32_t lcd[480*320];
static bool field_valid[3],force_redraw;
static unsigned producer_field;
static int adaptive_scan=1,lcd_large=1,current_slot;
void lcd_indexed_scanline(const uint8_t *p,const uint32_t *pal,unsigned y,unsigned x0,unsigned x1){
 unsigned w=lcd_large?480:320,h=lcd_large?320:240;
 assert(x0<x1 && x1<=w && y<h && ((x1-x0)*3)%4==0 && (y%3)==current_slot);
 for(unsigned x=x0;x<x1;x++)lcd[y*w+x]=pal[p[x*320/w]];
}
void lcd_frame_region(const uint8_t *p,const uint32_t *pal,unsigned a,unsigned b,unsigned c,unsigned d){assert(0);}
static void submit(uint32_t *rgb) {
 unsigned slot=producer_field;current_slot=slot; struct frame *f=&queue[slot];
'''+plan.replace('sizeof(rgb)','256*sizeof(uint32_t)')+'''

'''+draw+'''
}
int main(){
 uint32_t pal[256];for(int i=0;i<256;i++)pal[i]=i;
 for(int test=0;test<40;test++){
  if(test==20){lcd_large=0;field_valid[0]=field_valid[1]=field_valid[2]=false;}
  unsigned w=lcd_large?480:320,h=lcd_large?320:240;
  for(int i=0;i<64000;i++)if(test%3==0 || i%117==0)DG_ScreenBuffer[i]=(i*37+test*13)%256;
  if(test==6)pal[45]=999;
  submit(pal);submit(pal);submit(pal);
  for(unsigned y=0;y<h;y++)for(unsigned x=0;x<w;x++)
   assert(lcd[y*w+x]==pal[DG_ScreenBuffer[(y*200/h)*320+x*320/w]]);
  submit(pal);assert(queue[current_slot].region_count==0);
  submit(pal);assert(queue[current_slot].region_count==0);
 }
}
'''
with tempfile.TemporaryDirectory() as tmp:
 c=Path(tmp)/'test.c';c.write_text(h);exe=Path(tmp)/'test'
 subprocess.run(['cc','-O2',str(c),'-o',str(exe)],check=True)
 subprocess.run([str(exe)],check=True)
print('40 field-history cases passed: full/sparse/palette/resize, convergence, DMA alignment, parity and unchanged-frame skip')
