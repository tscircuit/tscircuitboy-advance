import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
const c=JSON.parse(readFileSync('dist/index/circuit.json','utf8'))
type P={x:number,y:number}
const dist=(p:P,a:P,b:P)=>{const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy)}
const cross=(a:P,b:P,p:P)=>(b.x-a.x)*(p.y-a.y)-(b.y-a.y)*(p.x-a.x)
const segdist=(a:P,b:P,u:P,v:P)=>{
 const intersects=cross(a,b,u)*cross(a,b,v)<=0&&cross(u,v,a)*cross(u,v,b)<=0&&Math.max(a.x,b.x)>=Math.min(u.x,v.x)&&Math.max(u.x,v.x)>=Math.min(a.x,b.x)&&Math.max(a.y,b.y)>=Math.min(u.y,v.y)&&Math.max(u.y,v.y)>=Math.min(a.y,b.y)
 return intersects?0:Math.min(dist(a,u,v),dist(b,u,v),dist(u,a,b),dist(v,a,b))
}
const slot=c.find((e:any)=>e.type==='pcb_cutout')
assert(slot?.shape==='rect'&&slot.width===8&&slot.height===8,'Battery plug opening must be 8 x 8 mm rectangular')
const xmin=slot.center.x-slot.width/2,xmax=slot.center.x+slot.width/2,ymin=slot.center.y-slot.height/2,ymax=slot.center.y+slot.height/2
const corners=[{x:xmin,y:ymin},{x:xmax,y:ymin},{x:xmax,y:ymax},{x:xmin,y:ymax}]
const inside=(p:P)=>p.x>=xmin&&p.x<=xmax&&p.y>=ymin&&p.y<=ymax
const distance=(a:P,b:P)=>inside(a)||inside(b)?0:Math.min(...corners.map((p,i)=>segdist(a,b,p,corners[(i+1)%4])))
let minimum=Infinity;const checked=[]
for(const e of c){
 if(e.type==='pcb_trace')for(let i=1;i<e.route.length;i++){
  const a=e.route[i-1],b=e.route[i]
  if(a.route_type!=='wire'||b.route_type!=='wire'||a.layer!==b.layer)continue
  const clearance=distance(a,b)-Math.max(a.width??.1,b.width??.1)/2
  minimum=Math.min(minimum,clearance);assert(clearance>=.3-1e-6,`${e.pcb_trace_id}: copper too close to battery cutout (${clearance.toFixed(3)} mm)`)
 }
 if(e.type==='pcb_via'){const clearance=distance(e,e)-e.outer_diameter/2;minimum=Math.min(minimum,clearance);assert(clearance>=.3-1e-6,`${e.pcb_via_id}: via too close to battery cutout`)}
 if(e.type==='pcb_smtpad'){
  const pts=e.points??[{x:e.x-(e.width??2*e.radius)/2,y:e.y-(e.height??2*e.radius)/2},{x:e.x+(e.width??2*e.radius)/2,y:e.y-(e.height??2*e.radius)/2},{x:e.x+(e.width??2*e.radius)/2,y:e.y+(e.height??2*e.radius)/2},{x:e.x-(e.width??2*e.radius)/2,y:e.y+(e.height??2*e.radius)/2}]
  const clearance=Math.min(...pts.map((p:P,i:number)=>distance(p,pts[(i+1)%pts.length])));minimum=Math.min(minimum,clearance);assert(clearance>=.3-1e-6,`${e.pcb_smtpad_id}: pad too close to battery cutout`)
 }
}
const report={openingMm:[8,8],plugEnvelopeMm:[5.8,4.5,6.85],manufacturer:'JST PHR-2, PH series housing drawing',minimumCopperClearanceMm:minimum,requiredCopperClearanceMm:.3,passed:true}
writeFileSync('dist/index/pcb-cutout-clearance.json',JSON.stringify(report,null,2));console.log('Battery plug/cutout audit passed:',report)
