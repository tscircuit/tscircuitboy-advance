import {readFileSync} from 'node:fs'
import {checkTracesAreContiguous} from '@tscircuit/checks'
const c=JSON.parse(readFileSync('converted-circuit.json','utf8'))
for(const t of c.filter((x:any)=>x.type==='pcb_trace'))for(const q of t.route)if(q.route_type==='via'){q.from_layer='top';q.to_layer='bottom'}
const r=await checkTracesAreContiguous(c);console.log(r.length,JSON.stringify(r.slice(0,2)))
