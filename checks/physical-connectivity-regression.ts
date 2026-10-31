import {readFileSync,writeFileSync} from 'node:fs'
import {auditPhysicalConnectivity} from './physical-connectivity'
const input=process.argv[2]??'dist/index/circuit.json';const c=JSON.parse(readFileSync(input,'utf8'))
const report=auditPhysicalConnectivity(c)
const filter=c.filter((e:any)=>!(e.type==='pcb_trace'&&e.source_trace_id==='source_trace_33'))
if(filter.length===c.length)throw Error('Filter route missing from test fixture')
let rejected=false;try{auditPhysicalConnectivity(filter)}catch(e){if(String(e).includes('splitElectricalGroups'))rejected=true;else throw e}
if(!rejected)throw Error('Removed analog filter connection was not rejected')
if(input==='dist/index/circuit.json')writeFileSync('dist/index/physical-connectivity.json',JSON.stringify(report,null,2))
console.log('PASS: all component nets connected; removing the analog filter route is rejected.')
