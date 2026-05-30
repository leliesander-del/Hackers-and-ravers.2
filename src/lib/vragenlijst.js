// Eenvoudige 4-staps vragenlijst die een boodschappenlijst samenstelt.
// Elke optie mapt naar één of meer productcategorieën. Na de laatste stap
// kiezen we de best passende producten op basis van het profiel (dieet + prijsklasse).
import { products } from '../data/products.js'

export const STAPPEN = [
  {
    sleutel: 'ontbijt',
    titel: 'Wat eet je voor het ontbijt?',
    opties: [
      { label: 'Brood & beleg', emoji: '🥐', categorieen: ['brood', 'ontbijt'] },
      { label: 'Granen & muesli', emoji: '🥣', categorieen: ['ontbijt'] },
      { label: 'Fruit', emoji: '🍎', categorieen: ['fruit'] },
      { label: 'Sla over', emoji: '⏭️', categorieen: [] },
    ],
  },
  {
    sleutel: 'hoofdmaaltijd',
    titel: 'Wat wil je als hoofdmaaltijd?',
    opties: [
      { label: 'Pasta', emoji: '🍝', categorieen: ['pasta', 'vlees', 'groenten'] },
      { label: 'Vlees & groenten', emoji: '🥩', categorieen: ['vlees', 'groenten'] },
      { label: 'Vis', emoji: '🐟', categorieen: ['vis', 'groenten'] },
      { label: 'Vegetarisch', emoji: '🥦', categorieen: ['groenten', 'zuivel', 'pasta'] },
    ],
  },
  {
    sleutel: 'drinken',
    titel: 'Wat wil je drinken?',
    opties: [
      { label: 'Koffie & thee', emoji: '☕', categorieen: ['koffie'] },
      { label: 'Frisdrank', emoji: '🥤', categorieen: ['frisdrank'] },
      { label: 'Zuivel', emoji: '🥛', categorieen: ['zuivel'] },
    ],
  },
  {
    sleutel: 'snacks',
    titel: 'En iets voor erbij?',
    opties: [
      { label: 'Hartige snacks', emoji: '🍿', categorieen: ['snacks'] },
      { label: 'Iets zoets', emoji: '🍫', categorieen: ['snacks'] },
      { label: 'Geen snacks', emoji: '🚫', categorieen: [] },
    ],
  },
]

// Alleen supermarkt-boodschappen komen in aanmerking voor de lijst.
const ETENSWAREN = products.filter((p) => p.afdeling === 'boodschappen')

// Kies max. 2 producten per gekozen categorie. Respecteer dieet (als er binnen
// dezelfde categorie een passend alternatief bestaat) en sorteer op prijsklasse-match.
export function kiesProducten(categorieen, profiel) {
  const gekozen = new Set(categorieen)
  if (gekozen.size === 0) return []

  const dieet = profiel?.voorkeuren?.dieet || []
  const prijsklasse = profiel?.voorkeuren?.prijsklasse

  const perCategorie = new Map()
  for (const p of ETENSWAREN) {
    if (!gekozen.has(p.categorie)) continue
    if (!perCategorie.has(p.categorie)) perCategorie.set(p.categorie, [])
    perCategorie.get(p.categorie).push(p)
  }

  const ids = []
  for (const lijst of perCategorie.values()) {
    let kandidaten = lijst
    if (dieet.length) {
      const metDieet = lijst.filter((p) => dieet.every((d) => p.dieet.includes(d)))
      if (metDieet.length) kandidaten = metDieet // alleen filteren als er een alternatief is
    }
    const gesorteerd = [...kandidaten].sort((a, b) => {
      const aMatch = a.prijsklasse === prijsklasse ? 0 : 1
      const bMatch = b.prijsklasse === prijsklasse ? 0 : 1
      if (aMatch !== bMatch) return aMatch - bMatch
      return a.prijs - b.prijs
    })
    ids.push(...gesorteerd.slice(0, 2).map((p) => p.id))
  }
  return ids
}
