const PREFIX = 'storenav.connections.'
export const CONNECTIONS_CHANGE_EVENT = 'storenav-connections-change'

// Simple id generator without external dependencies.
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

function persist(storeId, connections) {
  localStorage.setItem(PREFIX + storeId, JSON.stringify(connections))
  window.dispatchEvent(
    new CustomEvent(CONNECTIONS_CHANGE_EVENT, { detail: { storeId } }),
  )
  return connections
}

export function saveConnection(storeId, connection) {
  if (!storeId) return null
  const connections = loadConnections(storeId)
  const now = new Date().toISOString()

  if (connection.id) {
    const index = connections.findIndex((c) => c.id === connection.id)
    if (index !== -1) {
      connections[index] = { ...connections[index], ...connection, updatedAt: now }
      persist(storeId, connections)
      return connections[index]
    }
  }

  const newConnection = {
    id: genId(),
    name: '',
    baseUrl: '',
    method: 'GET',
    authHeader: '',
    apiKey: '',
    active: true,
    ...connection,
    createdAt: now,
    updatedAt: now,
  }
  connections.push(newConnection)
  persist(storeId, connections)
  return newConnection
}

export function deleteConnection(storeId, id) {
  if (!storeId) return
  const connections = loadConnections(storeId).filter((c) => c.id !== id)
  persist(storeId, connections)
}

export function toggleConnection(storeId, id) {
  if (!storeId) return
  const connections = loadConnections(storeId).map((c) =>
    c.id === id ? { ...c, active: !c.active, updatedAt: new Date().toISOString() } : c,
  )
  persist(storeId, connections)
}
