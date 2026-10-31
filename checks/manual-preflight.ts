import {readFileSync,writeFileSync} from 'node:fs'
import * as checks from '@tscircuit/checks'
const c=JSON.parse(readFileSync('manual-preflight-circuit.json','utf8'))
for(const e of c)if(e.type==='pcb_via'){e.layers=['top','inner1','inner2','bottom'];e.from_layer='top';e.to_layer='bottom'}
const results:any={}
for(const n of ['checkViaPadClearance','checkViaTraceClearance','checkSameNetViaSpacing','checkDifferentNetViaSpacing','checkHoleTraceClearance','checkCopperPourShorts']){results[n]=await (checks as any)[n](c);console.log(n,results[n].length)}
writeFileSync('manual-preflight.json',JSON.stringify(results,null,2));writeFileSync('manual-preflight-output.json',JSON.stringify(c))
