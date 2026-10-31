import {Circuit} from '@tscircuit/core'
import {createElement} from 'react'
import Board from '../index.circuit'
const c=new Circuit();c.add(createElement(Board));await c.renderUntilSettled();const j=c.getCircuitJson();await Bun.write('../routing/probe.circuit.json',JSON.stringify(j));console.log('Probe complete',j.length)
