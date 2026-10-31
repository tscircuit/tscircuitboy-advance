"""Exercise the actual mutable timing overlay used by fast/nightmare mode."""
from pathlib import Path
import subprocess, tempfile
root = Path(__file__).resolve().parents[1]
source = (root / 'doomgeneric/info.c').read_text()
overlay = source[source.index('static int fast_state_tics['):]
harness = '''
#include <assert.h>
typedef struct { int tics; } state_t;
enum { S_SARG_RUN1 = 1, S_SARG_PAIN2 = 3 };
const state_t states[] = {{-1}, {4}, {2}, {8}, {6}};
'''
harness += overlay + '''
int main(void) {
  for(int i=0;i<5;i++) assert(P_StateTics(&states[i]) == states[i].tics);
  for(int i=S_SARG_RUN1;i<=S_SARG_PAIN2;i++)
    P_SetStateTics(i, P_StateTics(&states[i]) >> 1);
  for(int i=1;i<=3;i++) assert(P_StateTics(&states[i]) == states[i].tics / 2);
  assert(P_StateTics(&states[0]) == -1);
  assert(P_StateTics(&states[4]) == 6);
  for(int i=S_SARG_RUN1;i<=S_SARG_PAIN2;i++)
    P_SetStateTics(i, P_StateTics(&states[i]) << 1);
  for(int i=0;i<5;i++) assert(P_StateTics(&states[i]) == states[i].tics);
  return 0;
}
'''
with tempfile.TemporaryDirectory() as tmp:
    c = Path(tmp)/'test.c'; c.write_text(harness)
    exe = Path(tmp)/'test'
    subprocess.run(['cc', '-Wall', '-Werror', str(c), '-o', str(exe)], check=True)
    subprocess.run([str(exe)], check=True)
print('State timing overlay: normal, fast, unaffected states, and restore passed')
