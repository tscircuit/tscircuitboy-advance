const $ = id => document.getElementById(id);
const canvas = $('screen');
const ctx = canvas.getContext('2d',{alpha:false});
const source = document.createElement('canvas');
source.width=320; source.height=200;
const sourceCtx = source.getContext('2d',{alpha:false});
const display = ctx.createImageData(480,320);
for(let i=3;i<display.data.length;i+=4) display.data[i]=255;
let worker, launch, paused=false, saves=[], frameCount=0, fpsTime=0, field=0, loadId=0;
const held = new Map();
const mapping={ArrowUp:0,ArrowDown:1,ArrowLeft:2,ArrowRight:3,KeyZ:4,Enter:4,KeyX:5,ShiftLeft:6,ShiftRight:6,KeyC:7,Tab:8,Escape:9,KeyQ:10,KeyE:11};
function status(text) { $('status').textContent=text; }
function log(text) { $('log').textContent=($('log').textContent+'\n'+text).slice(-14000); }
function buttons() {
  let mask=0; for(const bit of held.values()) mask |= 1<<bit;
  worker?.postMessage({type:'buttons',value:mask});
  document.querySelectorAll('[data-button]').forEach(el=>el.classList.toggle('pressed',!!(mask&(1<<Number(el.dataset.button)))));
}
function release() { held.clear(); buttons(); }
function setPause(value) {
  if(!worker) return;
  paused=value; release(); worker.postMessage({type:'pause',value});
  $('paused').hidden=!value; $('pause').textContent=value?'Resume':'Pause';
  if(value) $('fps').textContent='paused';
  frameCount=0; fpsTime=performance.now();
}
function showFrame(buffer) {
  const rgba=new Uint8ClampedArray(buffer);
  if($('display-mode').value==='fields') {
    for(let y=field;y<320;y+=3) for(let x=0;x<480;x++) {
      const src=(Math.floor(y*200/320)*320+Math.floor(x*320/480))*4;
      const dst=(y*480+x)*4;
      display.data[dst]=rgba[src]&252; display.data[dst+1]=rgba[src+1]&252; display.data[dst+2]=rgba[src+2]&252;
    }
    field=(field+1)%3; ctx.putImageData(display,0,0);
  } else {
    sourceCtx.putImageData(new ImageData(rgba,320,200),0,0);
    ctx.imageSmoothingEnabled=false; ctx.drawImage(source,0,0,480,320);
  }
  frameCount++;
  const now=performance.now();
  if(now-fpsTime>=1000) {
    $('fps').textContent=(frameCount*1000/(now-fpsTime)).toFixed(1)+' updates/s';
    frameCount=0; fpsTime=now;
  }
}
function start(config) {
  worker?.terminate(); release();
  launch=config; paused=false; field=0;
  display.data.fill(0); for(let i=3;i<display.data.length;i+=4) display.data[i]=255;
  ctx.fillStyle='#080d0c';ctx.fillRect(0,0,480,320);
  $('paused').hidden=true; $('pause').textContent='Pause'; $('save-name-form').hidden=true;
  $('empty').hidden=true; $('log').textContent='';
  $('game-title').textContent=config.game==='doom'?'DOOM / '+config.name:'STAR TEST / PORTABLE C';
  status('Starting '+(config.game==='doom'?'Doom':'Star Test')+'…');
  $('pause').disabled=false; $('restart').disabled=false; $('export').disabled=config.game!=='doom';
  worker=new Worker('./worker.js');
  worker.onmessage=({data})=>{
    if(data.type==='frame') showFrame(data.pixels);
    if(data.type==='log') log(data.text);
    if(data.type==='save-name') {
      $('save-name-form').hidden=!data.active;
      $('save-confirm').disabled=false;
      if(data.active){release();$('save-name').focus();$('save-name').select();}
      else canvas.focus({preventScroll:true});
    }
    if(data.type==='ready') {
      frameCount=0; fpsTime=performance.now();
      status(config.game==='doom'?'Ready. Press Z or Enter to choose New Game. Click the screen for keyboard controls.':'Move with ← →. Shoot with Z. After a crash, press Z to restart.');
    }
    if(data.type==='error') {
      status('Could not run game: '+data.message);log(data.message);
      worker.terminate();worker=null;release();$('pause').disabled=true;$('export').disabled=true;
    }
    if(data.type==='saves') {
      const blob=new Blob([JSON.stringify({format:'tscircuitboy-saves-v1',files:data.files})],{type:'application/json'});
      const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='tscircuitboy-doom-saves.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
      $('save-status').textContent='Exported '+data.files.length+' save/config files. Import this file before a future launch.';
    }
  };
  worker.onerror=e=>{status('Browser worker error: '+e.message);log(e.message);};
  worker.postMessage({type:'start',...config,saves});
  canvas.focus({preventScroll:true});
}
function validateWad(buffer) {
  if(buffer.byteLength<12 || buffer.byteLength>64*1024*1024) throw Error('Choose an IWAD between 12 bytes and 64 MB.');
  const bytes=new Uint8Array(buffer);
  if(String.fromCharCode(...bytes.slice(0,4))!=='IWAD') throw Error('This needs a Doom or Doom II IWAD; add-on PWADs cannot boot on their own.');
  const view=new DataView(buffer), count=view.getUint32(4,true), dir=view.getUint32(8,true);
  if(count===0 || dir<12 || dir+count*16>buffer.byteLength) throw Error('The WAD directory is invalid or incomplete.');
  for(let i=0;i<count;i++) {
    const offset=view.getUint32(dir+i*16,true),size=view.getUint32(dir+i*16+4,true);
    if(offset+size>buffer.byteLength) throw Error('The WAD contains a truncated lump.');
  }
}
$('wad').onchange=async e=>{
  const file=e.target.files[0];if(!file)return;const id=++loadId;
  try { if(file.size>64*1024*1024)throw Error('WAD is larger than 64 MB.');const wad=await file.arrayBuffer();validateWad(wad);if(id===loadId)start({game:'doom',wad,name:file.name}); }
  catch(e){status(e.message);} finally { $('wad').value=''; }
};
$('shareware').onclick=async()=>{
  const id=++loadId; $('shareware').disabled=true;status('Downloading Doom shareware (4 MB)…');
  try {
    const response=await fetch('https://raw.githubusercontent.com/Doom-Utils/shareware-collection/master/Doom%201.9/doom1.wad');
    if(!response.ok)throw Error('Download failed ('+response.status+'). Open a local WAD instead.');
    const wad=await response.arrayBuffer();validateWad(wad);
    if(id===loadId)start({game:'doom',wad,name:'SHAREWARE EPISODE'});
  } catch(e){if(id===loadId)status(e.message);}finally{$('shareware').disabled=false;}
};
$('star').onclick=()=>{++loadId;start({game:'star-test'});};
$('pause').onclick=()=>{setPause(!paused);canvas.focus({preventScroll:true});};
$('restart').onclick=()=>{if(launch){++loadId;start(launch);}};
$('fullscreen').onclick=async()=>{try{await canvas.parentElement.requestFullscreen();}catch(e){status('Full screen unavailable: '+e.message);}};
$('display-mode').onchange=()=>{field=0;display.data.set(ctx.getImageData(0,0,480,320).data);canvas.focus({preventScroll:true});};
$('export').onclick=()=>worker?.postMessage({type:'export'});
$('saves').onchange=async e=>{
  try {
    const file=e.target.files[0];if(!file)return;
    if(file.size>8*1024*1024)throw Error('Save bundle exceeds 8 MB.');
    const bundle=JSON.parse(await file.text());
    if(bundle.format!=='tscircuitboy-saves-v1'||!Array.isArray(bundle.files)||bundle.files.length>100)throw Error('Invalid save bundle.');
    for(const f of bundle.files) {
      if(typeof f.path!=='string'||!/^\/games\/doom\/(?:[\w-]+\/)*[\w.-]+$/.test(f.path)||/\.wad$/i.test(f.path)||!Array.isArray(f.bytes)||!f.bytes.every(b=>Number.isInteger(b)&&b>=0&&b<=255))throw Error('Invalid save file.');
    }
    saves=bundle.files;$('save-status').textContent='Imported '+saves.length+' files. Launch or restart Doom to use them.';
  }catch(e){$('save-status').textContent=e.message;}
  e.target.value='';
};
window.addEventListener('keydown',e=>{
  if(!worker||document.activeElement!==canvas||!(e.code in mapping))return;
  e.preventDefault();if(paused)return;
  held.set('key:'+e.code,mapping[e.code]);buttons();
});
window.addEventListener('keyup',e=>{if(held.delete('key:'+e.code)){e.preventDefault();buttons();}});
canvas.addEventListener('blur',release);
window.addEventListener('blur',()=>setPause(true));
document.addEventListener('visibilitychange',()=>{if(document.hidden)setPause(true);});
for(const el of document.querySelectorAll('[data-button]')) {
  el.addEventListener('pointerdown',e=>{e.preventDefault();if(paused||!worker)return;el.setPointerCapture(e.pointerId);held.set('pointer:'+e.pointerId,Number(el.dataset.button));buttons();});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(event,e=>{held.delete('pointer:'+e.pointerId);buttons();});
}

$('save-name-form').onsubmit=e=>{
  e.preventDefault();$('save-confirm').disabled=true;
  worker?.postMessage({type:'save-name',name:$('save-name').value});
};
