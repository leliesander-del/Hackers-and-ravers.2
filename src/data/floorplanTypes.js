// Block types for the floor plan editor (palette on the left).

/** Default size for new shelves (freely scalable afterwards). */
export const UNIFORM_SHELF_W = 10
export const UNIFORM_SHELF_H = 10

export const floorplanTypes = [
  {
    type: 'wall',
    label: 'Wall',
    defaultW: 24,
    defaultH: 2.5,
    minW: 4,
    minH: 1.5,
    maxW: 96,
    maxH: 8,
    rotatable: true,
    resizable: true,
    labelable: false,
  },
  {
    type: 'fixed-shelf',
    label: 'Fixed shelf',
    defaultW: UNIFORM_SHELF_W,
    defaultH: UNIFORM_SHELF_H,
    minW: 4,
    minH: 4,
    maxW: 40,
    maxH: 40,
    rotatable: true,
    resizable: true,
    labelable: true,
  },
  {
    type: 'temp-shelf',
    label: 'Temporary shelf',
    defaultW: UNIFORM_SHELF_W,
    defaultH: UNIFORM_SHELF_H,
    minW: 4,
    minH: 4,
    maxW: 40,
    maxH: 40,
    rotatable: true,
    resizable: true,
    labelable: true,
  },
  {
    type: 'checkout',
    label: 'Checkout',
    defaultW: 16,
    defaultH: 11,
    minW: 10,
    minH: 7,
    maxW: 28,
    maxH: 18,
    rotatable: true,
    resizable: true,
    labelable: true,
  },
  {
    type: 'entrance',
    label: 'Entrance',
    defaultW: 12,
    defaultH: 6.5,
    minW: 6,
    minH: 3.5,
    maxW: 28,
    maxH: 14,
    rotatable: false,
    resizable: true,
    labelable: true,
  },
  {
    type: 'exit',
    label: 'Exit',
    defaultW: 12,
    defaultH: 6.5,
    minW: 6,
    minH: 3.5,
    maxW: 28,
    maxH: 14,
    rotatable: false,
    resizable: true,
    labelable: true,
  },
]

export function getFloorplanType(type) {
  return floorplanTypes.find((t) => t.type === type) || null
}
