// Store manager metadata (no credentials — managers authenticate via saved accounts).
export const managers = [
  { id: 'mgr-ah-xl', name: 'Demo', storeId: 'ah-xl' },
  { id: 'mgr-mediamarkt', name: 'Manager MediaMarkt Ghent', storeId: 'mediamarkt' },
  { id: 'mgr-decathlon', name: 'Manager Decathlon Ghent', storeId: 'decathlon' },
  { id: 'mgr-hema', name: 'Manager HEMA Veldstraat', storeId: 'hema' },
  { id: 'mgr-delhaize', name: 'Manager Delhaize Sint-Pieters', storeId: 'delhaize' },
]

export function getManager(id) {
  return managers.find((m) => m.id === id) || null
}
