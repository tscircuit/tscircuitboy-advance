import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
const c=JSON.parse(readFileSync('dist/index/circuit.json','utf8'))
const names=new Map(c.filter((e:any)=>e.type==='source_component').map((e:any)=>[e.source_component_id,e.name]))
const ports=new Map(c.filter((e:any)=>e.type==='source_port'&&names.has(e.source_component_id)).map((e:any)=>[`${names.get(e.source_component_id)}:${e.pin_number}`,e]))
const key=(name:string,pin:number)=>(ports.get(`${name}:${pin}`) as any)?.subcircuit_connectivity_map_key
const ground=key('TP_GND',1)
assert(ground,'Missing ground reference')
const rows=[]
for(const name of [...names.values()].filter((n:any)=>n.startsWith('SW_')||['U_BOOTSEL','U_RUN'].includes(n)) as string[]){
 const shoulder=['SW_L','SW_R'].includes(name),service=name.startsWith('U_')
 const pairs=shoulder?[[1],[4]]:service?[[1,2],[3,4]]:[[1,3],[2,4]]
 const groundPin=service?3:4
 assert(key(name,1)&&key(name,1)!==ground,`${name}: signal tied to ground`)
 assert.equal(key(name,groundPin),ground,`${name}: missing ground return`)
 for(const pair of pairs){
  assert(!(pair.includes(1)&&pair.includes(groundPin)),`${name}: both nets on one contact`)
  assert(new Set(pair.map(pin=>key(name,pin)).filter(Boolean)).size<=1,`${name}: internally common terminals bridge different nets`)
 }
 if(shoulder)assert(!key(name,2)&&!key(name,3),`${name}: case stake unexpectedly routed`)
 rows.push({name,signalPin:1,groundPin,importedCommonPairs:pairs,result:'opposite_contacts'})
}
assert.equal(rows.length,14)
writeFileSync('dist/index/button-contact-audit.json',JSON.stringify({datasheets:['checks/datasheets/C3038675.pdf:1','checks/datasheets/C139797.pdf:2','checks/datasheets/B3F.pdf:5'],buttons:rows},null,2))
console.log('Manufacturer contact audit passed for all 14 buttons')
