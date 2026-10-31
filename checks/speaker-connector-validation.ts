import {convertCircuitJsonTo3D} from 'circuit-json-to-gltf'
const c:any[]=await Bun.file('dist/index/circuit.json').json()
const component=c.find(e=>e.type==='source_component'&&e.name==='J_SPK')
if(component?.manufacturer_part_number!=='BM02B-SRSS-TB(LF)(SN)'||component.supplier_part_numbers?.jlcpcb?.[0]!=='C160388')throw Error('Wrong speaker connector')
const cad=c.find(e=>e.type==='cad_component'&&e.source_component_id===component.source_component_id)
cad.model_obj_url='data:text/plain;base64,'+Buffer.from(await Bun.file('imports/BM02B_SRSS_TB_LF__SN_/C160388.obj').arrayBuffer()).toString('base64')
const selected=c.filter(e=>e.type==='pcb_board'||e.source_component_id===component.source_component_id||e.pcb_component_id===cad.pcb_component_id)
const scene=await convertCircuitJsonTo3D(selected,{renderBoardTextures:false})
const mesh=scene.boxes.find((b:any)=>b.label==='J_SPK')?.mesh
if(!mesh?.triangles?.length)throw Error('Imported speaker connector CAD mesh missing')
const ports=c.filter(e=>e.type==='source_port'&&e.source_component_id===component.source_component_id)
const positive=ports.find(e=>e.pin_number===1),negative=ports.find(e=>e.pin_number===2)
const fb=(name:string)=>{const sc=c.find(e=>e.type==='source_component'&&e.name===name);return c.find(e=>e.type==='source_port'&&e.source_component_id===sc.source_component_id&&e.pin_number===2)}
if(positive.subcircuit_connectivity_map_key!==fb('FB_SPK_POS').subcircuit_connectivity_map_key||negative.subcircuit_connectivity_map_key!==fb('FB_SPK_NEG').subcircuit_connectivity_map_key)throw Error('Speaker output polarity changed')
const report={connector:'C160388',importedCadTriangles:mesh.triangles.length,pin1:'SPK_POS',pin2:'SPK_NEG',speaker:'CMS-23558N-L152B',speakerRatedWatt:1,powerLimiterImplemented:false,accepted:true}
await Bun.write('dist/index/speaker-connector-validation.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report))
