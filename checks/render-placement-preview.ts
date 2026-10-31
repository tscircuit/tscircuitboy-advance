import {convertCircuitJsonToPcbSvg} from 'circuit-to-svg'
import {Resvg} from '@resvg/resvg-js'
const c=await Bun.file('../quality-cleaned.circuit.json').json();const svg=convertCircuitJsonToPcbSvg(c,{layer:'top',width:1445,height:820,matchBoardAspectRatio:true,backgroundColor:'#0f172a',shouldDrawWarnings:false,shouldDrawRatsNest:false,includeVersion:false,showCourtyards:false});await Bun.write('../TRACE_QUALITY_PREVIEW.svg',svg);await Bun.write('../TRACE_QUALITY_PREVIEW.png',new Resvg(svg,{fitTo:{mode:'width',value:1800}}).render().asPng())
