// Bloktypes voor de plattegrond-editor (palet links).
export const floorplanTypes = [
  {
    type: 'muur',
    label: 'Muur',
    preview: 'line',
    defaultW: 24,
    defaultH: 2.5,
    rotatable: true,
  },
  {
    type: 'vast-rek',
    label: 'Vast rek',
    preview: 'shelf-dark',
    defaultW: 22,
    defaultH: 10,
    rotatable: true,
  },
  {
    type: 'tijdelijk-rek',
    label: 'Tijdelijk rek',
    preview: 'shelf-light',
    defaultW: 22,
    defaultH: 10,
    rotatable: true,
  },
  {
    type: 'kassa',
    label: 'Kassa',
    preview: 'kassa',
    defaultW: 14,
    defaultH: 9,
    rotatable: true,
  },
  {
    type: 'ingang',
    label: 'Ingang',
    preview: 'ingang',
    defaultW: 0,
    defaultH: 0,
    rotatable: false,
  },
  {
    type: 'uitgang',
    label: 'Uitgang',
    preview: 'uitgang',
    defaultW: 0,
    defaultH: 0,
    rotatable: false,
  },
]

export function getFloorplanType(type) {
  return floorplanTypes.find((t) => t.type === type) || null
}
