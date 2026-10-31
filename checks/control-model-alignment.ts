import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
const c=JSON.parse(readFileSync('dist/index/circuit.json','utf8'))
const components=c.filter((e:any)=>e.type==='source_component'),sourcePorts=c.filter((e:any)=>e.type==='source_port')
const source=(name:string)=>components.find((e:any)=>e.name===name)
const port=(name:string,pin:number)=>{const p=sourcePorts.find((e:any)=>e.source_component_id===source(name).source_component_id&&e.pin_number===pin);return c.find((e:any)=>e.type==='pcb_port'&&e.source_port_id===p.source_port_id)}
const near=(a:number,b:number,label:string)=>assert(Math.abs(a-b)<.001,label)
const rows=[]
for(const name of ['SW_L','SW_R']){
 const cad=c.find((e:any)=>e.type==='cad_component'&&e.source_component_id===source(name).source_component_id)
 const a=port(name,1),b=port(name,4)
 near(cad.position.x,(a.x+b.x)/2,name+' model/pin origin X mismatch')
 near(cad.position.y,(a.y+b.y)/2,name+' model/pin origin Y mismatch')
 near(cad.position.z,.8,name+' seated PCB surface mismatch')
 assert(cad.model_obj_url.includes('/C231320.obj'),name+' supplier mesh missing')
 const angle=cad.rotation.z*Math.PI/180
 for(const[pin,x,y]of [[1,-2.25,0],[4,2.25,0],[2,3.5,2.5],[3,-3.5,2.5]]){
  const actual=port(name,pin)
  near(actual.x,cad.position.x+x*Math.cos(angle)-y*Math.sin(angle),name+' pin '+pin+' X alignment')
  near(actual.y,cad.position.y+x*Math.sin(angle)+y*Math.cos(angle),name+' pin '+pin+' Y alignment')
 }
 rows.push({name,modelPosition:cad.position,pinsAligned:4,passed:true})
}
const v1=port('RV_VOLUME',6),v2=port('RV_VOLUME',7)
near(Math.hypot(v1.x-v2.x,v1.y-v2.y),9.3,'ALPS9.3 mm stake spacing')
const manifest=JSON.parse(readFileSync('mechanical/manifest.json','utf8')),wheel=manifest.parts.find((e:any)=>e.id==='volume-wheel')
assert(Math.abs((wheel.bounds[0][2]+wheel.bounds[1][2])/2-2.15)<.01,'ALPS seated wheel height must follow1.8 mm overall/0.9 mm wheel drawing')
writeFileSync('dist/index/control-model-alignment.json',JSON.stringify({shoulders:rows,volumeStakeSpacingMm:9.3,volumeWheelCenterZMm:2.15,passed:true},null,2))
console.log('Control model/pin alignment and ALPS drawing dimensions passed')
