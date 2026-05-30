import { RACK_H, RACK_W } from './floorplanLayout.js'
import { getDefaultStyleForType } from './floorplanElementStyle.js'

/** Synthetic editor element for demo shelves (same style as fixed-shelf). */
export function demoRackElement(label) {
  const def = getDefaultStyleForType('fixed-shelf')
  return {
    type: 'fixed-shelf',
    label: label || '',
    ...def,
  }
}

export function demoRackSize() {
  return { w: RACK_W, h: RACK_H }
}
