import {CircuitRunner} from '@tscircuit/eval'
const r=new CircuitRunner()
await r.executeWithFsMap({fsMap:{'index.circuit.tsx':`export default () => <board width="20mm" height="10mm" layers={4} allowBlindAndBuriedVias={false}>
<testpoint name="A" pcbX={-3} pcbY={0} footprint={<footprint><smtpad portHints={["pin1"]} pcbX={0} pcbY={0} width={1} height={1} shape="rect" /></footprint>} />
<testpoint name="B" pcbX={3} pcbY={0} footprint={<footprint><smtpad portHints={["pin1"]} pcbX={0} pcbY={0} width={1} height={1} shape="rect" /></footprint>} />
<trace name="LINK" from=".A > .pin1" to=".B > .pin1" />
<via name="V1" connectsTo="net.LINKNET" pcbX={-1} pcbY={0} fromLayer="top" toLayer="bottom" outerDiameter={0.45} holeDiameter={0.15} />
<via name="V2" connectsTo="net.LINKNET" pcbX={1} pcbY={0} fromLayer="top" toLayer="bottom" outerDiameter={0.45} holeDiameter={0.15} />
<pcbtrace source_trace_id="source_trace_0" route={[{route_type:"wire",x:-3,y:0,width:.1,layer:"top"},{route_type:"wire",x:-1,y:0,width:.1,layer:"top"},{route_type:"via",x:-1,y:0,from_layer:"top",to_layer:"inner1"},{route_type:"wire",x:-1,y:0,width:.1,layer:"inner1"},{route_type:"wire",x:1,y:0,width:.1,layer:"inner1"},{route_type:"via",x:1,y:0,from_layer:"inner1",to_layer:"top"},{route_type:"wire",x:1,y:0,width:.1,layer:"top"},{route_type:"wire",x:3,y:0,width:.1,layer:"top"}]} />
<net name="LINKNET" /><trace name="TAG" from=".A > .pin1" to="net.LINKNET" /></board>`},mainComponentPath:'index.circuit.tsx'})
try{await r.renderUntilSettled();const c:any[]=await r.getCircuitJson();console.log(JSON.stringify({sourcePorts:c.filter(x=>x.type==='source_port').length,vias:c.filter(x=>x.type==='pcb_via'),errors:c.filter(x=>x.type.endsWith('_error'))},null,2))}finally{await r.kill()}
