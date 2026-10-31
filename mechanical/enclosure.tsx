import React from 'react'
import {assembly} from '@tscircuit/core'
import manifest from './manifest.json'
import {models} from './cad-models'
/** Mechanical-only siblings; keep PCB footprints, nets and routing unchanged. */
export const GameBoyEnclosure = () => <assembly.cadassembly name="EnclosureR13" displayName="Enclosure R13 / fit-print draft">
  {manifest.parts.filter(p=>p.group!=='clearance').map(p=>p.printable ?
    <assembly.printedpart key={p.id} name={p.id.replaceAll('-','_')} displayName={p.label}
      material="petg" color={'#'+p.color.map(c=>c.toString(16).padStart(2,'0')).join('')}
      cadModel={{glbUrl:models[p.id as keyof typeof models],modelOriginPosition:{x:0,y:0,z:0},modelUnitToMmScale:1}} /> :
    <assembly.part key={p.id} name={p.id.replaceAll('-','_')} displayName={p.label}
      cadModel={{glbUrl:models[p.id as keyof typeof models],modelOriginPosition:{x:0,y:0,z:0},modelUnitToMmScale:1}} />)}
</assembly.cadassembly>
