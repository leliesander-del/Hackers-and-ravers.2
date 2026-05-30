// Stores around Ghent. The simulated user stands at the Korenmarkt (city center).
// `department` links to a profile's preferences for personalization.

export const userLocation = { lat: 51.0538, lng: 3.722, label: 'Korenmarkt, Ghent' }

export const stores = [
  {
    id: 'ah-xl',
    logoDomain: 'ah.be',
    logoSrc: '/logos/ah-xl.png',
    name: 'AH XL Ghent',
    street: 'Brusselsesteenweg 707, Gentbrugge',
    department: 'groceries',
    type: 'Supermarket',
    lat: 51.0495,
    lng: 3.7305,
    cashback: 2,
    color: '#0aa0e0',
    emoji: '🛒',
    hasFloorplan: true,
  },
  {
    id: 'mediamarkt',
    logoDomain: 'mediamarkt.be',
    logoSrc: '/logos/mediamarkt.png',
    name: 'MediaMarkt Ghent',
    street: 'Woodrow Wilsonplein 4, Ghent',
    department: 'electronics',
    type: 'Electronics',
    lat: 51.0588,
    lng: 3.7485,
    cashback: 3,
    color: '#e3001b',
    emoji: '📺',
    hasFloorplan: true,
  },
  {
    id: 'decathlon',
    logoDomain: 'decathlon.be',
    logoSrc: '/logos/decathlon.png',
    logoBg: '#ffffff',
    name: 'Decathlon Ghent',
    street: 'Koopvaardijlaan 40, Ghent',
    department: 'sport',
    type: 'Sports',
    lat: 51.0285,
    lng: 3.751,
    cashback: 1.5,
    color: '#1559b2',
    emoji: '⚽',
    hasFloorplan: true,
  },
  {
    id: 'hema',
    logoDomain: 'hema.be',
    logoSrc: '/logos/hema.png',
    logoBg: '#e3001b',
    name: 'HEMA Veldstraat',
    street: 'Veldstraat 88, Ghent',
    department: 'toys',
    type: 'Department store',
    lat: 51.0511,
    lng: 3.7235,
    cashback: 2.5,
    color: '#008bcb',
    emoji: '🧸',
    hasFloorplan: true,
  },
  {
    id: 'delhaize',
    logoDomain: 'delhaize.be',
    logoSrc: '/logos/delhaize.png',
    name: 'Delhaize Sint-Pieters',
    street: 'Sint-Pietersplein 12, Ghent',
    department: 'groceries',
    type: 'Supermarket',
    lat: 51.0365,
    lng: 3.7105,
    cashback: 2,
    color: '#d11f2e',
    emoji: '🛒',
    hasFloorplan: true,
  },
]

export function getStore(id) {
  return stores.find((s) => s.id === id) || null
}

// Straight-line distance (km, 1 decimal) from the user to a store.
export function distanceToUser(store) {
  const R = 6371
  const dLat = ((store.lat - userLocation.lat) * Math.PI) / 180
  const dLng = ((store.lng - userLocation.lng) * Math.PI) / 180
  const lat1 = (userLocation.lat * Math.PI) / 180
  const lat2 = (store.lat * Math.PI) / 180
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return Math.round(R * 2 * Math.asin(Math.sqrt(h)) * 10) / 10
}
