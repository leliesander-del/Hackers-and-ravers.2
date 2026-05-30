import { normalizeElement } from './floorplanGeometry.js'

const PREFIX = 'storenav.floorplan.'
export const FLOORPLAN_CHANGE_EVENT = 'storenav-floorplan-change'

export function loadFloorplan(storeId) {
  if (!storeId) return null
  try {
    const raw = localStorage.getItem(PREFIX + storeId)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data?.elements || !Array.isArray(data.elements)) return null
    return {
      ...data,
      elements: data.elements.map(normalizeElement),
    }
  } catch {
    return null
  }
}

export function saveFloorplan(storeId, elements) {
  const existing = loadFloorplan(storeId)
  const serialized = JSON.stringify(elements)
  if (existing && JSON.stringify(existing.elements) === serialized) {
    return existing
  }
  const data = { storeId, elements, updatedAt: new Date().toISOString() }
  localStorage.setItem(PREFIX + storeId, JSON.stringify(data))
  window.dispatchEvent(
    new CustomEvent(FLOORPLAN_CHANGE_EVENT, { detail: { storeId } }),
  )
  return data
}

export function getEntrancePosition(storeId, fallback = { x: 50, y: 96 }) {
  const plan = loadFloorplan(storeId)
  if (!plan) return fallback
  const ingang = plan.elements.find((el) => el.type === 'ingang')
  return ingang ? { x: ingang.x, y: ingang.y } : fallback
}
