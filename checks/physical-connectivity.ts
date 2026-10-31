import {Polygon,Point} from '@flatten-js/core'
// Conservative polygonal copper connectivity, independent of route port hints.
// Full native clearance/short checks run before this audit.
export function auditPhysicalConnectivity(c:any[]){
 const sp=new Map(c.filter(e=>e.type==='source_port').map(e=>[e.source_port_id,e]));const pp=new Map(c.filter(e=>e.type==='pcb_port').map(e=>[e.pcb_port_id,e]));const st=new Map(c.filter(e=>e.type==='source_trace').map(e=>[e.source_trace_id,e]));const sn=new Map(c.filter(e=>e.type==='source_net').map(e=>[e.source_net_id,e]));const components=new Set(c.filter(e=>e.type==='source_component').map(e=>e.source_component_id))
 const objects:any[]=[];const parents:number[]=[];const ports=new Map<string,number[]>();const layers=new Map<string,number[]>()
 const root=(i:number):number=>{while(parents[i]!==i){parents[i]=parents[parents[i]];i=parents[i]}return i};const join=(a:number,b:number)=>{a=root(a);b=root(b);if(a!==b)parents[b]=a}
 const points=(a:number[][])=>a.map(([x,y])=>new Point(x,y))
 const ring=(x:number,y:number,r:number,inner=false,n=128)=>Array.from({length:n},(_,i)=>[x+r*(inner?1/Math.cos(Math.PI/n):1)*Math.cos(2*Math.PI*i/n),y+r*(inner?1/Math.cos(Math.PI/n):1)*Math.sin(2*Math.PI*i/n)])
 const rectangle=(x:number,y:number,w:number,h:number,deg=0)=>{const a=deg*Math.PI/180;return [[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]].map(([u,v])=>[x+u*Math.cos(a)-v*Math.sin(a),y+u*Math.sin(a)+v*Math.cos(a)])}
 const capsule=(a:any,b:any,r:number,inner=false)=>{const n=32;const angle=Math.atan2(b.y-a.y,b.x-a.x);const rr=r*(inner?1/Math.cos(Math.PI/(2*n)):1);return [...Array.from({length:n+1},(_,i)=>{const t=angle-Math.PI/2+Math.PI*i/n;return [b.x+rr*Math.cos(t),b.y+rr*Math.sin(t)]}),...Array.from({length:n+1},(_,i)=>{const t=angle+Math.PI/2+Math.PI*i/n;return [a.x+rr*Math.cos(t),a.y+rr*Math.sin(t)]})]}
 const pill=(x:number,y:number,w:number,h:number,deg=0,inner=false)=>{const r=Math.min(w,h)/2,dx=w>=h?(w-h)/2:0,dy=h>w?(h-w)/2:0,a=deg*Math.PI/180;return capsule({x:x-dx*Math.cos(a)+dy*Math.sin(a),y:y-dx*Math.sin(a)-dy*Math.cos(a)},{x:x+dx*Math.cos(a)-dy*Math.sin(a),y:y+dx*Math.sin(a)+dy*Math.cos(a)},r,inner)}
 const polygon=(outer:number[][],holes:number[][][]=[])=>{const p=new Polygon(points(outer));for(const h of holes)p.addFace(points([...h].reverse()));return p}
 const net=(e:any)=>e.subcircuit_connectivity_map_key??(e.pcb_port_id?sp.get(pp.get(e.pcb_port_id)?.source_port_id)?.subcircuit_connectivity_map_key??pp.get(e.pcb_port_id)?.source_port_id:undefined)??st.get(e.source_trace_id)?.subcircuit_connectivity_map_key??sn.get(e.source_net_id)?.subcircuit_connectivity_map_key
 const add=(e:any,shape:any,ls:string[],pids:string[]=[])=>{const i=objects.length;objects.push({shape,net:net(e),box:shape.box});parents.push(i);for(const l of ls)layers.set(l,[...(layers.get(l)??[]),i]);for(const pid of pids)ports.set(pid,[...(ports.get(pid)??[]),i])}
 for(const e of c){
  if(e.type==='pcb_smtpad'){
   let shape:any;if(e.shape==='polygon')shape=polygon(e.points.map((p:any)=>[p.x,p.y]).filter((p:number[],i:number,a:number[][])=>!i||p[0]!==a[i-1][0]||p[1]!==a[i-1][1]));else if(e.shape==='circle')shape=polygon(ring(e.x,e.y,e.radius??e.diameter/2));else if(['pill','rotated_pill'].includes(e.shape))shape=polygon(pill(e.x,e.y,e.width,e.height,e.ccw_rotation??0));else if(['rect','rotated_rect'].includes(e.shape)){
    const r=e.corner_radius??0;if(r){const a=(e.ccw_rotation??0)*Math.PI/180;const v:number[][]=[];for(const [u,w,base] of [[e.width/2-r,e.height/2-r,0],[-e.width/2+r,e.height/2-r,90],[-e.width/2+r,-e.height/2+r,180],[e.width/2-r,-e.height/2+r,270]])for(let j=0;j<=16;j++){const t=(base+90*j/16)*Math.PI/180,x=u+r*Math.cos(t),y=w+r*Math.sin(t);v.push([e.x+x*Math.cos(a)-y*Math.sin(a),e.y+x*Math.sin(a)+y*Math.cos(a)])}shape=polygon(v)}else shape=polygon(rectangle(e.x,e.y,e.width,e.height,e.ccw_rotation??0))
   }else throw Error('Unsupported SMT shape '+e.shape);add(e,shape,[e.layer],e.pcb_port_id?[e.pcb_port_id]:[])
  }else if(['pcb_via','pcb_plated_hole'].includes(e.type)){
   let shape:any;const s=e.shape??'circle';if(s==='circle')shape=polygon(ring(e.x,e.y,e.outer_diameter/2),[ring(e.x,e.y,e.hole_diameter/2,true)]);else if(s==='pill')shape=polygon(pill(e.x,e.y,e.outer_width,e.outer_height,e.ccw_rotation??0),[pill(e.x,e.y,e.hole_width,e.hole_height,e.ccw_rotation??0,true)]);else if(s==='rotated_pill_hole_with_rect_pad')shape=polygon(rectangle(e.x,e.y,e.outer_width,e.outer_height,e.rect_ccw_rotation??0),[pill(e.x,e.y,e.hole_width,e.hole_height,e.hole_ccw_rotation??0,true)]);else throw Error('Unsupported plated shape '+s);add(e,shape,e.layers,[...(e.pcb_port_id?[e.pcb_port_id]:[]),...(e.pcb_port_ids??[])])
  }else if(e.type==='pcb_trace'){
   for(let i=1;i<e.route.length;i++){const a=e.route[i-1],b=e.route[i];if(a.route_type!=='wire'||b.route_type!=='wire')continue;if(a.layer!==b.layer)throw Error('Wire changes layer without via');const r=Math.min(a.width,b.width)/2;add(e,polygon(a.x===b.x&&a.y===b.y?ring(a.x,a.y,r):capsule(a,b,r)),[a.layer])}
  }else if(e.type==='pcb_copper_pour'){
   if(e.shape!=='brep')throw Error('Unsupported copper-pour shape');const b=e.brep_shape,ringPoints=(r:any)=>r.vertices.map((v:any)=>[v.x,v.y]);add(e,polygon(ringPoints(b.outer_ring),(b.inner_rings??[]).map(ringPoints)),[e.layer])
  }
 }
 for(const ids of layers.values())for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){
  const a=objects[ids[i]],b=objects[ids[j]];if(!a.net||a.net!==b.net||root(ids[i])===root(ids[j])||a.box.not_intersect(b.box))continue
  if(a.shape.contains(b.shape.vertices[0])||b.shape.contains(a.shape.vertices[0])||a.shape.intersect(b.shape).length)join(ids[i],ids[j])
 }
 const groups=new Map<string,Set<number>>();const missing:string[]=[];let count=0
 for(const [pid,p] of pp){const s=sp.get(p.source_port_id);if(!s||!components.has(s.source_component_id))continue;count++;const nodes=ports.get(pid)??[];if(!nodes.length)missing.push(pid);const key=s.subcircuit_connectivity_map_key??s.source_port_id;const roots=groups.get(key)??new Set<number>();for(const i of nodes)roots.add(root(i));groups.set(key,roots)}
 const splits=[...groups].filter(([,roots])=>roots.size>1).map(([net,roots])=>({net,components:roots.size}));const report={componentPorts:count,electricalGroups:groups.size,copperObjects:objects.length,missingPadPorts:missing,splitElectricalGroups:splits,pass:count===470&&!missing.length&&!splits.length};if(!report.pass)throw Error('Physical copper connectivity failed: '+JSON.stringify(report));return report
}
