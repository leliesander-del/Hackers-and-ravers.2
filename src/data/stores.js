// Winkels rond Gent. De gesimuleerde gebruiker staat op de Korenmarkt (centrum).
// `afdeling` koppelt aan de voorkeuren van een profiel voor de personalisatie.

export const userLocation = { lat: 51.0538, lng: 3.7220, label: 'Korenmarkt, Gent' }

export const stores = [
  {
    id: 'ah-xl',
    naam: 'AH XL Gent',
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
    naam: 'MediaMarkt Gent',
    afdeling: 'elektronica',
    type: 'Elektronica',
    lat: 51.0588,
    lng: 3.7485,
    cashback: 3,
    kleur: '#e3001b',
    emoji: '📺',
    heeftPlattegrond: false,
  },
  {
    id: 'decathlon',
    naam: 'Decathlon Gent',
    afdeling: 'sport',
    type: 'Sport',
    lat: 51.0285,
    lng: 3.7510,
    cashback: 1.5,
    kleur: '#1559b2',
    emoji: '⚽',
    heeftPlattegrond: false,
  },
  {
    id: 'hema',
    naam: 'HEMA Veldstraat',
    afdeling: 'speelgoed',
    type: 'Warenhuis',
    lat: 51.0511,
    lng: 3.7235,
    cashback: 2.5,
    kleur: '#008bcb',
    emoji: '🧸',
    heeftPlattegrond: false,
  },
  {
    id: 'delhaize',
    naam: 'Delhaize Sint-Pieters',
    afdeling: 'boodschappen',
    type: 'Supermarkt',
    lat: 51.0365,
    lng: 3.7105,
    cashback: 2,
    kleur: '#d11f2e',
    emoji: '🛒',
    heeftPlattegrond: false,
  },
]

export function getStore(id) {
  return stores.find((s) => s.id === id) || null
}
