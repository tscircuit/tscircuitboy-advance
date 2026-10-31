import ctypes,random,subprocess,tempfile
from pathlib import Path
N=320*200
class Rect(ctypes.Structure):_fields_=[(k,ctypes.c_uint16)for k in ('x0','y0','x1','y1')]
root=Path(__file__).resolve().parents[1]
_build=tempfile.TemporaryDirectory()
_library=Path(_build.name)/'dirty_regions.so'
subprocess.run(['cc','-shared','-fPIC','-O2',str(root/'dirty_regions.c'),'-o',str(_library)],check=True)
lib=ctypes.CDLL(str(_library));fn=lib.find_dirty_regions;fn.argtypes=[ctypes.c_void_p,ctypes.c_void_p,ctypes.c_bool,ctypes.POINTER(Rect)];fn.restype=ctypes.c_uint
rng=random.Random(23)
for case in range(120):
 old=bytearray(N);new=bytearray(N)
 if case==0:pass
 elif case==1:new[:]=b'\x01'*N
 elif case==2:
  for y in range(0,200,8):
   for x in range((y//8%2)*16,320,32):new[y*320+x]=1
 elif case==4:
  for pos in (0,319,320*199,320*200-1):new[pos]=1
 else:
  for _ in range(rng.randrange(1,1000)):new[rng.randrange(N)]=rng.randrange(1,256)
 a=(ctypes.c_ubyte*N).from_buffer(old);b=(ctypes.c_ubyte*N).from_buffer(new);rs=(Rect*250)();n=fn(a,b,case==3,rs);assert n<=250
 result=bytearray(old)
 for r in rs[:n]:
  assert 0<=r.x0<r.x1<=320 and 0<=r.y0<r.y1<=200
  for y in range(r.y0,r.y1):result[y*320+r.x0:y*320+r.x1]=new[y*320+r.x0:y*320+r.x1]
 assert result==new,case
 if case==0:assert n==0
 if case in (1,3):assert n==1
print('120 dirty-region cases passed: unchanged, full, checkerboard, edges, random changes')
