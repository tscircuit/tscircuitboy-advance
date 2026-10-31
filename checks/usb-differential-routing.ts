import {readFileSync,writeFileSync} from 'node:fs'
const path='dist/index/circuit.json'
const c:any[]=JSON.parse(readFileSync(path,'utf8'))
const assert=(v:boolean,s:string)=>{if(!v)throw Error('USB differential routing: '+s)}
const sources=new Map(c.filter(x=>x.type==='source_trace').map(x=>[x.source_trace_id,x]))
const comp=new Map(c.filter(x=>x.type==='source_component').map(x=>[x.source_component_id,x]))
const ports=new Map(c.filter(x=>x.type==='source_port').map(x=>[x.source_port_id,x]))
const net=new Map(c.filter(x=>x.type==='source_net').map(x=>[x.source_net_id,x]))
const gnd=[...net.values()].find(x=>x.name==='GND').subcircuit_connectivity_map_key
const pours=c.filter(x=>x.type==='pcb_copper_pour'&&x.layer==='inner1'&&net.get(x.source_net_id)?.subcircuit_connectivity_map_key===gnd)
const inRing=(x:number,y:number,ring:any)=>{const ps=ring.vertices;let inside=false;for(let i=0,j=ps.length-1;i<ps.length;j=i++){const a=ps[i],b=ps[j];if((a.y>y)!==(b.y>y)&&x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x)inside=!inside}return inside}
const ground=(x:number,y:number)=>pours.some(p=>inRing(x,y,p.brep_shape.outer_ring)&&!(p.brep_shape.inner_rings??[]).some((r:any)=>inRing(x,y,r)))
const names=['USB_DM_A','USB_DP_A','USB_DM','USB_DP']
const result:any={nominalDifferentialOhm:90,stackup:'JLC04161H-3313',widthMm:.131318,gapMm:.15,coplanarGapMm:.18,traces:{},groundReferenceSamples:0}
for(const name of names){
 const traces=c.filter(x=>x.type==='pcb_trace'&&sources.get(x.source_trace_id)?.name===name);assert(traces.length===1,name+' must have one physical path')
 const t=traces[0],r=t.route;let length=0
 for(let i=1;i<r.length;i++)length+=Math.hypot(r[i].x-r[i-1].x,r[i].y-r[i-1].y)
 const vias=r.filter((p:any)=>p.route_type==='via').length
 result.traces[name]={lengthMm:length,viaTransitions:vias}
 if(name.endsWith('_A')){
  assert(vias===0&&r.every((p:any)=>p.layer==='top'),name+' changed layer')
  assert(length<55,name+' excessive length')
  assert(r.every((p:any)=>Math.abs(p.width-.131318)<1e-7),name+' impedance width changed')
  const start=c.find(x=>x.type==='pcb_port'&&x.pcb_port_id===r[0].start_pcb_port_id);const sp=ports.get(start.source_port_id)
  assert(comp.get(sp.source_component_id).name==='J_USB'&&sp.name===(name==='USB_DM_A'?'B7':'A6'),name+' wrong primary USB-C contact')
  for(let i=1;i<r.length;i++){
   const a=r[i-1],b=r[i],d=Math.hypot(b.x-a.x,b.y-a.y);if(d<1e-10)continue
   const nx=-(b.y-a.y)/d,ny=(b.x-a.x)/d;const n=Math.ceil(d/.05)
   for(let j=0;j<=n;j++)for(const sign of [-1,0,1]){const x=a.x+(b.x-a.x)*j/n+nx*a.width/2*sign,y=a.y+(b.y-a.y)*j/n+ny*a.width/2*sign;assert(ground(x,y),name+' missing ground beneath '+x.toFixed(4)+','+y.toFixed(4));result.groundReferenceSamples++}
  }
 }else assert(length<5,name+' chip-side escape too long')
}
for(const name of ['R_USB_DM','R_USB_DP']){const resistor=[...comp.values()].find(x=>x.name===name);assert(resistor.resistance===27,name+' termination changed')}
result.mainMismatchMm=Math.abs(result.traces.USB_DM_A.lengthMm-result.traces.USB_DP_A.lengthMm)
result.totalMismatchMm=Math.abs(result.traces.USB_DM_A.lengthMm+result.traces.USB_DM.lengthMm-result.traces.USB_DP_A.lengthMm-result.traces.USB_DP.lengthMm)
assert(result.mainMismatchMm<1,'main pair mismatch exceeds local 1mm target')
assert(result.totalMismatchMm<2,'complete path mismatch exceeds local 2mm target')
const stubLength=(name:string)=>{const t=c.find(x=>x.type==='pcb_trace'&&sources.get(x.source_trace_id)?.name===name);assert(!!t,name+' duplicate-contact link missing');let d=0;for(let i=1;i<t.route.length;i++)d+=Math.hypot(t.route[i].x-t.route[i-1].x,t.route[i].y-t.route[i-1].y);return d}
const dm=result.traces.USB_DM_A.lengthMm+result.traces.USB_DM.lengthMm,dp=result.traces.USB_DP_A.lengthMm+result.traces.USB_DP.lengthMm
result.orientationMismatchMm={A6_A7:Math.abs(dm+stubLength('USB_DM_B')-dp),B6_B7:Math.abs(dm-dp-stubLength('USB_DP_B'))}
assert(Math.max(...Object.values(result.orientationMismatchMm) as number[])<5,'USB-C orientation path skew exceeds local 5mm target')
writeFileSync('dist/index/usb-differential-routing.json',JSON.stringify(result,null,2))
console.log('USB paired-route and ground-reference checks passed',JSON.stringify(result))
