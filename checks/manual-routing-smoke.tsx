import {Circuit} from '@tscircuit/core'
import {checkSourceTracesHavePcbTraces,checkEachPcbPortConnectedToPcbTraces,checkEachPcbTraceNonOverlapping} from '@tscircuit/checks'
const route=[{route_type:'wire',x:-3.5,y:2,layer:'top',width:.2},{route_type:'wire',x:-3.5,y:3.2,layer:'top',width:.2},{route_type:'wire',x:3.5,y:3.2,layer:'top',width:.2},{route_type:'wire',x:3.5,y:2,layer:'top',width:.2}]
const c=new Circuit()
c.add(<board width={20} height={14} schematicDisabled routeRemaining={false} autorouter={{local:true}}>
 <resistor name="R1" resistance="1k" footprint="0402" pcbX={-4} pcbY={2}/>
 <resistor name="R2" resistance="1k" footprint="0402" pcbX={4} pcbY={2}/>
 <resistor name="R3" resistance="1k" footprint="0402" pcbX={-4} pcbY={-2}/>
 <resistor name="R4" resistance="1k" footprint="0402" pcbX={4} pcbY={-2}/>
 <trace from=".R1 > .pin2" to=".R2 > .pin1" name="AUTHORED"/>
 <trace from=".R3 > .pin2" to=".R4 > .pin1" name="INTENTIONALLY_MISSING"/>
 <pcbtrace source_trace_id="source_trace_0" route={route as any}/>
</board>)
await c.renderUntilSettled();const json=c.getCircuitJson() as any[]
if(!json.some(t=>t.type==='pcb_trace'&&JSON.stringify(t.route.map(({route_type,x,y,layer,width}:any)=>({route_type,x,y,layer,width})))===JSON.stringify(route)))throw Error('Manual route changed')
if(!checkSourceTracesHavePcbTraces(json).length&&!checkEachPcbPortConnectedToPcbTraces(json).length)throw Error('Missing required copper was not detected')
const bad=[...json,{type:'pcb_trace',pcb_trace_id:'intentional_short',source_trace_id:'source_trace_1',route:[{route_type:'wire',x:0,y:2.5,layer:'top',width:.2},{route_type:'wire',x:0,y:4,layer:'top',width:.2}]}]
if(!checkEachPcbTraceNonOverlapping(bad as any).length)throw Error('Intentional short not detected')
console.log('PASS: exact manual route retained; missing copper and intentional short detected.')
