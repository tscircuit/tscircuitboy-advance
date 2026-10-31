import {USB4110VisualModel} from '../imports/USB4110_VisualModel'
import {executeJscadOperations} from 'jscad-planner'
import modeling from '@jscad/modeling'
import {Resvg} from '@resvg/resvg-js'
const solid:any=executeJscadOperations(modeling,USB4110VisualModel.jscad)
const norm=(v:number[])=>v.map(n=>n/Math.hypot(...v)),dot=(a:number[],b:number[])=>a.reduce((s,n,i)=>s+n*b[i],0),cross=(a:number[],b:number[])=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]
const eye=norm([10,-14,10]),u=norm([14,10,0]),v=cross(eye,u),project=(p:number[])=>[dot(p,u),-dot(p,v)]
const faces=solid.polygons.filter((p:any)=>{const [a,b,c]=p.vertices;return dot(cross(b.map((n:number,i:number)=>n-a[i]),c.map((n:number,i:number)=>n-a[i])),eye)>0}).sort((a:any,b:any)=>a.vertices.reduce((s:number,p:number[])=>s+dot(p,eye),0)/a.vertices.length-b.vertices.reduce((s:number,p:number[])=>s+dot(p,eye),0)/b.vertices.length)
const pts=faces.flatMap((p:any)=>p.vertices.map(project)),min=[0,1].map(i=>Math.min(...pts.map((p:number[])=>p[i]))),max=[0,1].map(i=>Math.max(...pts.map((p:number[])=>p[i]))),scale=Math.min(1080/(max[0]-min[0]),650/(max[1]-min[1]));let svg='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="#0f172a"/>'
for(const f of faces){const color=f.color??solid.color??[.67,.69,.72];const [a,b,c]=f.vertices;const n=norm(cross(b.map((x:number,i:number)=>x-a[i]),c.map((x:number,i:number)=>x-a[i]))),shade=.55+.45*Math.max(0,dot(n,norm([-.3,-.7,1])));const rgb=color.slice(0,3).map((x:number)=>Math.round(255*x*shade));svg+='<polygon points="'+f.vertices.map((p:number[])=>{const [x,y]=project(p);return `${600+(x-(min[0]+max[0])/2)*scale},${390+(y-(min[1]+max[1])/2)*scale}`}).join(' ')+'" fill="rgb('+rgb.join(',')+')" stroke="rgb('+rgb.join(',')+')" stroke-width="0.3"/>'}
svg+='<text x="32" y="770" font-family="sans-serif" font-size="22" fill="#e2e8f0">USB4110: drawing-based reference visual — not supplier STEP</text></svg>';await Bun.write('../USB4110-reference.svg',svg);await Bun.write('../USB4110-reference.png',new Resvg(svg).render().asPng());console.log('Rendered USB reference CAD snapshot')
