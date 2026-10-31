/* Each launch owns one worker, one WASM instance and one virtual SD card. */
let game;
let started = false;
let paused = false;
let pauseStart = 0;
let pausedTime = 0;
let startTime = 0;
let buttons = 0;
const events = [];
function setButtons(value) {
  const changed = value ^ buttons;
  for (let i=0;i<12;i++) if (changed & (1<<i)) events.push(i+1 | (value & (1<<i) ? 256 : 0));
  buttons = value;
  if (game) game.buttons = buttons;
}
function virtualClock() {
  return (paused ? pauseStart : performance.now()) - startTime - pausedTime;
}
onmessage = async ({data}) => {
  if (data.type === 'save-name' && game) {
    // Clear an existing slot label, then enter the supplied name and confirm.
    const name = String(data.name).replace(/[^a-zA-Z0-9 ._-]/g,'').slice(0,20) || 'PLAY TEST';
    for (const code of [...Array(24).fill(127), ...Array.from(name,c=>c.charCodeAt(0)),13]) {
      events.push(512|256|code,512|code);
    }
    return;
  }
  if (data.type === 'buttons') return setButtons(data.value & 4095);
  if (data.type === 'pause') {
    if (paused === data.value) return;
    paused = data.value;
    if (paused) { pauseStart = performance.now(); setButtons(0); }
    else pausedTime += performance.now() - pauseStart;
    if (game) game.paused = paused;
    return;
  }
  if (data.type === 'export') {
    if (!game) return;
    // Called only between WASM yields: the engine cannot be writing concurrently.
    const files = [];
    function walk(dir) {
      for (const name of game.FS.readdir(dir)) {
        if (name === '.' || name === '..') continue;
        const path = dir + '/' + name;
        if (game.FS.isDir(game.FS.stat(path).mode)) walk(path);
        else if (!path.toLowerCase().endsWith('.wad')) files.push({path, bytes:Array.from(game.FS.readFile(path))});
      }
    }
    walk('/games');
    postMessage({type:'saves', files});
    return;
  }
  if (data.type !== 'start' || started) return;
  started = true;
  try {
    if (!['doom','star-test'].includes(data.game)) throw Error('Unknown game');
    importScripts('./' + data.game + '.js');
    game = await createGame({noInitialRun:true,
      print:text=>postMessage({type:'log',text}),
      printErr:text=>postMessage({type:'log',text}),
      onAbort:reason=>postMessage({type:'error',message:String(reason)})});
    game.FS.mkdirTree('/games/doom');
    for (const file of data.saves || []) {
      if (!/^\/games\/doom\/(?:[\w.-]+\/)*[\w.-]+$/.test(file.path) || file.path.split('/').some(p=>p==='.'||p==='..') || /\.wad$/i.test(file.path)) throw Error('Invalid save path');
      game.FS.mkdirTree(file.path.slice(0,file.path.lastIndexOf('/')));
      game.FS.writeFile(file.path,new Uint8Array(file.bytes));
    }
    game.buttons = buttons; game.events = events;
    game.clock = virtualClock; game.paused = paused;
    startTime = performance.now(); pausedTime = 0;
    if (paused) pauseStart = startTime;
    let args = [];
    if (data.game === 'doom') {
      game.FS.writeFile('/games/doom/doom.wad',new Uint8Array(data.wad));
      args = ['-iwad','/games/doom/doom.wad','-config','/games/doom/default.cfg',
        '-extraconfig','/games/doom/extra.cfg','-savedir','/games/doom','-nogui','-nosound','-mb','6'];
    }
    postMessage({type:'ready'});
    game.callMain(args);
  } catch (e) {
    postMessage({type:'error',message:e.message || String(e)});
  }
};
