// Mock-profielen. Elk profiel stuurt de personalisatie aan: de voorkeuren bepalen
// de volgorde van winkels, zoekresultaten, alternatieven en deals.
// "Gast" heeft geen voorkeuren -> de app valt terug op afstand/alfabetisch.

export const profiles = [
  {
    id: 'sander',
    naam: 'Sander',
    type: 'lid',
    omschrijving: 'Premium · glutenvrij',
    kleur: '#7c3aed',
    persoon: { email: 'sander@example.be', telefoon: '0470 12 34 56', adres: 'Korenmarkt 12, 9000 Gent' },
    voorkeuren: {
      afdelingen: ['boodschappen', 'elektronica'],
      merken: ['Schär', 'Lavazza', 'Apple', 'Alpro'],
      dieet: ['glutenvrij'],
      prijsklasse: 'premium',
    },
    loyaltyPunten: 1240,
    cashbackSaldo: 18.5,
    cashbackTier: 'Premium',
  },
  {
    id: 'marc',
    naam: 'Marc',
    type: 'lid',
    omschrijving: 'Gezin · prijsbewust',
    kleur: '#0ea5e9',
    persoon: { email: 'marc@example.be', telefoon: '0498 65 43 21', adres: 'Veldstraat 5, 9000 Gent' },
    voorkeuren: {
      afdelingen: ['boodschappen', 'speelgoed'],
      merken: ['Boni', 'Lego', 'Coca-Cola'],
      dieet: [],
      prijsklasse: 'budget',
    },
    loyaltyPunten: 540,
    cashbackSaldo: 7.2,
    cashbackTier: 'Standaard',
  },
  {
    id: 'bediende',
    naam: 'Lisa',
    type: 'bediende',
    omschrijving: 'Rekkenvuller · Delhaize',
    kleur: '#059669',
    personeelWinkelId: 'delhaize',
    voorkeuren: null,
    loyaltyPunten: 0,
    cashbackSaldo: 0,
    cashbackTier: 'Personeel',
  },
  {
    id: 'gast',
    naam: 'Gast',
    type: 'gast',
    omschrijving: 'Geen personalisatie',
    kleur: '#64748b',
    voorkeuren: null,
    loyaltyPunten: 0,
    cashbackSaldo: 0,
    cashbackTier: '—',
  },
]

export function getProfile(id) {
  return profiles.find((p) => p.id === id) || null
}
