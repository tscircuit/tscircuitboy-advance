import {readFileSync,writeFileSync} from 'node:fs'
const c=JSON.parse(readFileSync('dist/index/circuit.json','utf8'))
const comps=new Map(c.filter((e:any)=>e.type==='source_component').map((e:any)=>[e.name,e])) as Map<string,any>
const ports=c.filter((e:any)=>e.type==='source_port')
const p=(name:string,pin:string)=>ports.find((e:any)=>e.source_component_id===comps.get(name).source_component_id&&(e.name===pin||e.port_hints?.includes(pin)))
const net=(name:string,pin:string)=>p(name,pin)?.subcircuit_connectivity_map_key
const assert=(ok:any,msg:string)=>{if(!ok)throw Error(msg)}
const sourcePorts=new Map(ports.map((e:any)=>[e.source_port_id,e])) as Map<string,any>
const pcbPorts=new Map(c.filter((e:any)=>e.type==='pcb_port').map((e:any)=>[e.pcb_port_id,e])) as Map<string,any>
const sourceTraces=new Map(c.filter((e:any)=>e.type==='source_trace').map((e:any)=>[e.source_trace_id,e])) as Map<string,any>
const physicalComponentIds=new Set([...comps.values()].map((e:any)=>e.source_component_id))
for(const trace of c.filter((e:any)=>e.type==='pcb_trace'))for(const point of trace.route)for(const key of ['start_pcb_port_id','end_pcb_port_id']){const port=sourcePorts.get(pcbPorts.get(point[key])?.source_port_id);if(port&&physicalComponentIds.has(port.source_component_id)&&port.subcircuit_connectivity_map_key)assert(port.subcircuit_connectivity_map_key===sourceTraces.get(trace.source_trace_id)?.subcircuit_connectivity_map_key,'Authored endpoint belongs to wrong net '+trace.pcb_trace_id+' '+point[key])}
const gnd=net('U1','GND'),logic=net('C_3V3_OUT_A','pin1'),fb=net('U_3V3','FB')
assert(comps.get('U_3V3').manufacturer_part_number==='AP63200WU-7'&&comps.get('U_3V3').supplier_part_numbers.jlcpcb[0]==='C2071868','Wrong adjustable regulator')
for(const [name,value,code]of [['R_LOGIC_FB_TOP',49900,'C852808'],['R_LOGIC_FB_BOTTOM',16500,'C852559'],['R_SPK_LIMIT',330000,'C25778'],['R_LOGIC_FB_TRIM',300,'C25102']] as const)assert(comps.get(name).resistance===value&&comps.get(name).supplier_part_numbers.jlcpcb[0]===code,'Wrong precision/speaker resistor '+name)
assert(net('R_LOGIC_FB_TRIM','pin1')===logic&&net('R_LOGIC_FB_TRIM','pin2')===net('R_LOGIC_FB_TOP','pin1')&&net('R_LOGIC_FB_TOP','pin2')===fb&&net('R_LOGIC_FB_BOTTOM','pin1')===fb&&net('R_LOGIC_FB_BOTTOM','pin2')===gnd&&fb!==logic,'Feedback divider incorrectly connected')
for(const pin of ['IOVDD1','IOVDD2','IOVDD3','IOVDD4','IOVDD5','IOVDD6','ADC_AVDD','USB_OTP_VDD','QSPI_IOVDD','VREG_VIN'])assert(net('U1',pin)===logic,'Wrong MCU supply '+pin)
assert(comps.get('R_VREG_AVDD').manufacturer_part_number==='BLM15PD121SN1D'&&net('R_VREG_AVDD','pin1')===logic&&net('R_VREG_AVDD','pin2')===net('U1','VREG_AVDD'),'Wrong analog supply bead')
for(const pin of ['pin40','pin41','pin42'])assert(net('J_LCD',pin)===logic,'Wrong LCD supply '+pin)
assert(net('R_SPK_LIMIT','pin1')===net('C_AMP_IN_COUPLE','pin2')&&net('R_SPK_LIMIT','pin2')===net('U_SPK_AMP','INL')&&net('R_SPK_LIMIT','pin1')!==net('R_SPK_LIMIT','pin2'),'Audio limiter bypassed')
assert(net('J_SPK','pin1')!==gnd&&net('J_SPK','pin2')!==gnd&&net('J_SPK','pin1')!==net('J_SPK','pin2'),'Speaker bridge shorted')
// Static tolerance bound: reference +/-1%, divider +/-0.1% plus25ppm/C across65C.
// This is DC accuracy, not startup/ripple certification.
const rt=.001+25e-6*65
const vmin=.792*(1+(49900*(1-rt)+300*(1-.01-100e-6*65))/(16500*(1+rt)))
const vmax=.808*(1+(49900*(1+rt)+300*(1+.01+100e-6*65))/(16500*(1-rt)))
const feed=c.find((e:any)=>e.type==='pcb_trace'&&e.source_trace_id==='source_trace_32')
let feedResistanceOhm=.01 // Conservative combined allowance for the two through vias.
for(let i=1;i<feed.route.length;i++){const a=feed.route[i-1],z=feed.route[i];if(a.route_type==='wire'&&z.route_type==='wire'&&a.layer===z.layer)feedResistanceOhm+=.01724/1000*Math.hypot(z.x-a.x,z.y-a.y)/(Math.min(a.width,z.width)*.035)}
feedResistanceOhm=.01+(feedResistanceOhm-.01)*(1+.00393*65) // Copper temperature rise65C; through-via allowance already conservative.
const feederLoadAllowanceA=.5,downstreamDropAllowanceV=.005,ripplePeakAllowanceV=.01
const logicLoadMin=vmin-feederLoadAllowanceA*feedResistanceOhm-downstreamDropAllowanceV-ripplePeakAllowanceV
const analogMin=logicLoadMin-.09*1.25*.02 // 20mA analog-load design allowance; not a measured current.
assert(vmax+.02<3.3&&logicLoadMin>3.135&&analogMin>3.135,'DC supply tolerance bounds invalid')
// PAM8403 application note maxRF142k/minRI18k; add20% margin on each and3% on external resistor.
// Conservative continuous AC bound for bounded0..3.3V PWM is3.3/2 RMS; pot/filter gains <=1.
const gain=2*(142000*1.2)/(18000*.8+330000*.97)
const speakerRmsMax=3.3/2*gain
const speakerPowerAt4Ohm=speakerRmsMax**2/4
assert(speakerPowerAt4Ohm<1,'Passive steady-audio power bound exceeds1W')
// Cheap battery inductor: lower datasheet-tabulated saturation4.57A.
// Normal operating prototype target: battery converter output <=1.5A.
const vin=3.2,vout=5.1,eff=.85,l=1.2e-6,f=2.1e6,load=1.5,d=1-vin/vout
const peak=load/(eff*(1-d))+vin*d/(2*f*l)
assert(peak*1.2<4.57,'Inductor load design target exceeds saturation margin')
const maxFaultPeak=4.15+5.1/(8*f*l)
// Boost-mode estimate only. Buck-mode fault currents require a separate evaluation; this is not universal fault qualification.
const report={passed:true,logicNominalV:.8*(1+50200/16500),dcToleranceMinV:vmin,dcToleranceMaxV:vmax,feederResistanceEstimateOhm:feedResistanceOhm,logicLoadMinV:logicLoadMin,feederLoadAllowanceA,downstreamDropAllowanceV,ripplePeakAllowanceV,analogMinVAt20mA:analogMin,displayOperatingMaxV:3.3,mcuAnalogAndUsbMinV:3.135,feedbackTemperatureAllowanceC:65,speakerSeriesOhm:330000,speakerGainBoundWithMargins:gain,speakerSteadyAcPowerBoundAt4OhmW:speakerPowerAt4Ohm,specifiedSpeakerOhm:8,specifiedSpeakerW:1,batteryConverterOutputDesignTargetA:load,inductorPeakAtDesignTargetA:peak,inductor20PercentMarginA:peak*1.2,inductorLowerTabulatedSaturationA:4.57,boostModeMaxAverageLimitPlusRippleEstimateA:maxFaultPeak,physicalPrototypeTestingRequired:['startup and load-transient rails','PFM ripple and analog-filter ringing','maximum brightness/audio low-battery thermal load','actual speaker waveform including turn-on pops','USB current and enumeration'],productionQualified:false}
writeFileSync('dist/index/electrical-prototype.json',JSON.stringify(report,null,2));console.log('Electrical prototype design checks passed',JSON.stringify(report))
