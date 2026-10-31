// Exercise the actual WASM platform adapter, Asyncify, engine and framebuffer.
// Usage: node web/smoke-test.cjs [path/to/doom1.wad]
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const name = process.argv[2] ? 'doom' : 'star-test';
let moduleInstance, frames=0, hashes=new Set(), sampleFrames=new Set(), reportedError;
const start = performance.now();
const timeout = setTimeout(()=>{console.error('Timed out after',frames,'frames');process.exit(1);},15000);
function button(i,pressed) {
  moduleInstance.buttons = pressed ? moduleInstance.buttons | (1<<i) : moduleInstance.buttons & ~(1<<i);
  moduleInstance.events.push(i+1 | (pressed ? 256 : 0));
}
global.postMessage = data => {
  if(data.type==='error') { reportedError=data.message;console.error(data.message);process.exit(1); }
  if(data.type!=='frame')return;
  const pixels=new Uint8Array(data.pixels);
  assert.equal(pixels.length,320*200*4);
  let hash=2166136261;
  for(let i=0;i<pixels.length;i++)hash=Math.imul(hash^pixels[i],16777619)>>>0;
  hashes.add(hash);frames++;
  if(name==='doom') {
    if([5,15,25].includes(frames))button(4,true);
    if([7,17,27].includes(frames))button(4,false);
    if(frames===60)button(0,true);
    if(frames===85){button(0,false);button(3,true);button(4,true);}
    if(frames===105){button(3,false);button(4,false);}
  } else {
    if(frames===10)button(3,true);
    if(frames===30){button(3,false);button(4,true);}
    if(frames===60)button(4,false);
  }
  if(frames>=65)sampleFrames.add(hash);
  if(frames===140) {
    assert.ok(hashes.size>20,'Framebuffer should change while playing');
    assert.ok(sampleFrames.size>5,'Gameplay should keep updating after launch');
    assert.ok(!reportedError);
    const fps=frames*1000/(performance.now()-start);
    assert.ok(fps>20 && fps<45,`Expected paced frames, got ${fps}`);
    console.log(`${name}: ${frames} frames, ${hashes.size} distinct images, ${fps.toFixed(1)} updates/s`);
    clearTimeout(timeout);process.exit(0);
  }
};
(async()=>{
  const createGame=require('./dist/'+name+'.js');
  moduleInstance=await createGame({noInitialRun:true, print:()=>{}, printErr:console.error});
  moduleInstance.events=[];moduleInstance.buttons=0;moduleInstance.paused=false;
  moduleInstance.clock=()=>performance.now()-start;
  moduleInstance.FS.mkdirTree('/games/doom');
  let args=[];
  if(name==='doom') {
    moduleInstance.FS.writeFile('/games/doom/doom.wad',fs.readFileSync(path.resolve(process.argv[2])));
    args=['-iwad','/games/doom/doom.wad','-config','/games/doom/default.cfg','-extraconfig','/games/doom/extra.cfg','-savedir','/games/doom','-nogui','-nosound','-mb','6'];
  }
  moduleInstance.callMain(args);
})().catch(e=>{console.error(e);process.exit(1);});
