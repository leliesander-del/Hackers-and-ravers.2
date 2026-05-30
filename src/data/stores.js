// Winkels rond Brugge. De gesimuleerde gebruiker staat op de Markt (centrum).
// `afdeling` koppelt aan de voorkeuren van een profiel voor de personalisatie.

export const userLocation = { lat: 51.2093, lng: 3.2247, label: 'Markt, Brugge' }

export const stores = [
  {
    id: 'ah-xl',
    naam: 'AH XL Brugge',
    afdeling: 'boodschappen',
    type: 'Supermarkt',
    lat: 51.201,
    lng: 3.218,
    cashback: 2,
    kleur: '#0aa0e0',
    emoji: '🛒',
    heeftPlattegrond: true,
  },
  {
    id: 'mediamarkt',
    naam: 'MediaMarkt',
    afdeling: 'elektronica',
    type: 'Elektronica',
    lat: 51.1955,
    lng: 3.236,
    cashback: 3,
    kleur: '#e3001b',
    emoji: '📺',
    heeftPlattegrond: false,
  },
  {
    id: 'decathlon',
    naam: 'Decathlon',
    afdeling: 'sport',
    type: 'Sport',
    lat: 51.22,
    lng: 3.24,
    cashback: 1.5,
    kleur: '#1559b2',
    emoji: '⚽',
    heeftPlattegrond: false,
  },
  {
    id: 'hema',
    naam: 'HEMA',
    afdeling: 'speelgoed',
    type: 'Warenhuis',
    lat: 51.2089,
    lng: 3.2255,
    cashback: 2.5,
    kleur: '#008bcb',
    emoji: '🧸',
    heeftPlattegrond: false,
  },
  {
    id: 'delhaize',
    naam: 'Delhaize Sint-Kruis',
    afdeling: 'boodschappen',
    type: 'Supermarkt',
    lat: 51.215,
    lng: 3.26,
    cashback: 2,
    kleur: '#d11f2e',
    emoji: '🛒',
    heeftPlattegrond: false,
  },
]

export function getStore(id) {
  return stores.find((s) => s.id === id) || null
}
