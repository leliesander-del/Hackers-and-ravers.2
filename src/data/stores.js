// Winkels rond Gent. De gesimuleerde gebruiker staat op de Korenmarkt (centrum).
// `afdeling` koppelt aan de voorkeuren van een profiel voor de personalisatie.

export const userLocation = { lat: 51.0538, lng: 3.722, label: 'Korenmarkt, Gent' }

export const stores = [
  {
    id: 'ah-xl',
    logoDomain: 'ah.be',
    naam: 'AH XL Gent',
    straat: 'Brusselsesteenweg 707, Gentbrugge',
    afdeling: 'boodschappen',
    type: 'Supermarkt',
    lat: 51.0495,
    lng: 3.7305,
    cashback: 2,
    kleur: '#0aa0e0',
    emoji: '🛒',
    heeftPlattegrond: true,
  },
  {
    id: 'mediamarkt',
    logoDomain: 'mediamarkt.be',
    naam: 'MediaMarkt Gent',
    straat: 'Woodrow Wilsonplein 4, Gent',
    afdeling: 'elektronica',
    type: 'Elektronica',
    lat: 51.0588,
    lng: 3.7485,
    cashback: 3,
    kleur: '#e3001b',
    emoji: '📺',
    heeftPlattegrond: true,
  },
  {
    id: 'decathlon',
    logoDomain: 'decathlon.be',
    naam: 'Decathlon Gent',
    straat: 'Koopvaardijlaan 40, Gent',
    afdeling: 'sport',
    type: 'Sport',
    lat: 51.0285,
    lng: 3.751,
    cashback: 1.5,
    kleur: '#1559b2',
    emoji: '⚽',
    heeftPlattegrond: true,
  },
  {
    id: 'hema',
    logoDomain: 'hema.be',
    naam: 'HEMA Veldstraat',
    straat: 'Veldstraat 88, Gent',
    afdeling: 'speelgoed',
    type: 'Warenhuis',
    lat: 51.0511,
    lng: 3.7235,
    cashback: 2.5,
    kleur: '#008bcb',
    emoji: '🧸',
    heeftPlattegrond: true,
  },
  {
    id: 'delhaize',
    logoDomain: 'delhaize.be',
    naam: 'Delhaize Sint-Pieters',
    straat: 'Sint-Pietersplein 12, Gent',
    afdeling: 'boodschappen',
    type: 'Supermarkt',
    lat: 51.0365,
    lng: 3.7105,
    cashback: 2,
    kleur: '#d11f2e',
    emoji: '🛒',
    heeftPlattegrond: true,
  },
]

export function getStore(id) {
  return stores.find((s) => s.id === id) || null
}

// Hemelsbrede afstand (km, 1 decimaal) van de gebruiker tot een winkel.
export function afstandTotGebruiker(store) {
  const R = 6371
  const dLat = ((store.lat - userLocation.lat) * Math.PI) / 180
  const dLng = ((store.lng - userLocation.lng) * Math.PI) / 180
  const lat1 = (userLocation.lat * Math.PI) / 180
  const lat2 = (store.lat * Math.PI) / 180
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return Math.round(R * 2 * Math.asin(Math.sqrt(h)) * 10) / 10
}
