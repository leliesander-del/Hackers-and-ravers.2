import { RACK_H, RACK_W } from './floorplanLayout.js'
import { getDefaultStyleForType } from './floorplanElementStyle.js'

/** Synthetisch editor-element voor demo-rekken (zelfde stijl als vast-rek). */
export function demoRackElement(label) {
  const def = getDefaultStyleForType('vast-rek')
  return {
    type: 'vast-rek',
    label: label || '',
    ...def,
  }
}

export function demoRackSize() {
  return { w: RACK_W, h: RACK_H }
}
