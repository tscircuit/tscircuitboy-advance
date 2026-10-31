import {readFileSync} from 'node:fs'
const started=Date.now()
const child=Bun.spawn([process.execPath,'checks/build-validated.ts'],{cwd:process.cwd(),env:process.env,stdin:'ignore',stdout:'inherit',stderr:'inherit'})
const heartbeat=setInterval(()=>{
 let rssMB:number|undefined
 try{const match=readFileSync(`/proc/${child.pid}/status`,'utf8').match(/^VmRSS:\s+(\d+) kB/m);if(match)rssMB=Math.round(Number(match[1])/1024)}catch{}
 console.log('Native validation still running',JSON.stringify({elapsedSeconds:Math.round((Date.now()-started)/1000),rssMB}))
},20000)
try{const exitCode=await child.exited;clearInterval(heartbeat);process.exit(exitCode)}finally{clearInterval(heartbeat)}
