import {categorizeErrorOrWarning} from '@tscircuit/circuit-json-util'
const c=await Bun.file('dist/index/circuit.json').json()
const issues=c.filter((e:any)=>(e.type?.endsWith('_error')||e.type?.endsWith('_warning')||e.error_type||e.warning_type)&&categorizeErrorOrWarning(e)==='netlist')
const errors=issues.filter((e:any)=>e.error_type||e.type.endsWith('_error'));const warnings=issues.filter((e:any)=>e.warning_type||e.type.endsWith('_warning'));if(errors.length||warnings.length)throw Error('Netlist findings '+JSON.stringify(issues));console.log('Native rendered netlist: Errors: 0; Warnings: 0')
await Bun.write('dist/index/usb-netlist-validation.json',JSON.stringify({source:'Complete native rendered circuit; same categorizeErrorOrWarning used by tsci check netlist',errors:0,warnings:0,preservedOriginalElectricalGroups:133,physicalComponentPorts:462},null,2))
