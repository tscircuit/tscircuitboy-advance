import {Circuit} from '@tscircuit/core'
import {createElement} from 'react'
import Board from '../index.circuit'
const c=new Circuit();c.add(createElement(Board));await c.renderUntilSettled();await Bun.write('../probe.circuit.json',JSON.stringify(c.getCircuitJson()));console.log('Controls placement probe rendered')
