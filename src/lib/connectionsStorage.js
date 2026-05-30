const PREFIX = 'storenav.connecties.'
export const CONNECTIONS_CHANGE_EVENT = 'storenav-connecties-change'

// Eenvoudige id-generator zonder externe afhankelijkheden.
function genId() {
  return 'conn-' + Math.random().toString(36).slice(2, 10)
}

export function loadConnections(storeId) {
  if (!storeId) return []
  try {
    const raw = localStorage.getItem(PREFIX + storeId)
    if (!raw) return []
    const data = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    return data
  } catch {
    return []
  }
}

function persist(storeId, connecties) {
  localStorage.setItem(PREFIX + storeId, JSON.stringify(connecties))
  window.dispatchEvent(
    new CustomEvent(CONNECTIONS_CHANGE_EVENT, { detail: { storeId } }),
  )
  return connecties
}

export function saveConnection(storeId, connectie) {
  if (!storeId) return null
  const connecties = loadConnections(storeId)
  const now = new Date().toISOString()

  if (connectie.id) {
    const index = connecties.findIndex((c) => c.id === connectie.id)
    if (index !== -1) {
      connecties[index] = { ...connecties[index], ...connectie, updatedAt: now }
      persist(storeId, connecties)
      return connecties[index]
    }
  }

  const nieuw = {
    id: genId(),
    naam: '',
    baseUrl: '',
    method: 'GET',
    authHeader: '',
    apiKey: '',
    actief: true,
    ...connectie,
    createdAt: now,
    updatedAt: now,
  }
  connecties.push(nieuw)
  persist(storeId, connecties)
  return nieuw
}

export function deleteConnection(storeId, id) {
  if (!storeId) return
  const connecties = loadConnections(storeId).filter((c) => c.id !== id)
  persist(storeId, connecties)
}

export function toggleConnection(storeId, id) {
  if (!storeId) return
  const connecties = loadConnections(storeId).map((c) =>
    c.id === id ? { ...c, actief: !c.actief, updatedAt: new Date().toISOString() } : c,
  )
  persist(storeId, connecties)
}
