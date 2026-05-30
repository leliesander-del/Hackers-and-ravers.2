// Offline "AI"-assistent voor de boodschappenlijst.
//
// Volledig in de browser, zonder backend of API-key (zie README: gegarandeerd-
// werkende demo). De assistent doet twee dingen:
//   1. Herkent gerechten ("spaghetti bolognese", "salade", "ontbijt") en vertaalt
//      die naar de ingrediënten die je ervoor nodig hebt.
//   2. Herkent losse ingrediënten die je opnoemt ("melk, kaas en tomaten").
//
// BELANGRIJK: de assistent koppelt nog géén winkels of concrete producten. Ze
// levert abstracte *ingrediënt-termen* op die op de lijst belanden. Pas wanneer
// de klant een winkel kiest, matcht `kiesBesteProduct` elke term tegen het
// assortiment van díe winkel (zie StoreContext.resolveCartVoorWinkel).
import { fuzzyZoekProducten } from './fuzzySearch.js'

function normaliseer(tekst) {
  return (tekst || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

// Losse ingrediënt-trefwoorden -> een canonieke term voor de lijst.
// Elke `woorden`-lijst zijn synoniemen/spreektaal; `term` is wat op de lijst komt.
const INGREDIENT_TREFWOORDEN = [
  { woorden: ['spaghetti'], term: 'spaghetti' },
  { woorden: ['penne'], term: 'penne' },
  { woorden: ['lasagne', 'lasagna', 'lasagnebladen'], term: 'lasagnebladen' },
  { woorden: ['pasta', 'macaroni', 'fusilli'], term: 'penne' },
  { woorden: ['brood', 'boterham', 'boterhammen'], term: 'brood' },
  { woorden: ['stokbrood', 'baguette'], term: 'stokbrood' },
  { woorden: ['croissant', 'croissants'], term: 'croissants' },
  { woorden: ['confituur', 'jam', 'confiture'], term: 'confituur' },
  { woorden: ['muesli', 'granen', 'ontbijtgranen', 'cornflakes'], term: 'muesli' },
  { woorden: ['melk'], term: 'melk' },
  { woorden: ['kaas'], term: 'kaas' },
  { woorden: ['yoghurt', 'yogurt'], term: 'yoghurt' },
  { woorden: ['soja', 'sojadrink', 'sojamelk'], term: 'sojadrink' },
  { woorden: ['koffie'], term: 'koffie' },
  { woorden: ['thee'], term: 'thee' },
  { woorden: ['cola'], term: 'cola' },
  { woorden: ['water', 'bruiswater', 'spuitwater', 'plat water'], term: 'water' },
  { woorden: ['appelsap', 'sap', 'fruitsap'], term: 'appelsap' },
  { woorden: ['chips'], term: 'chips' },
  { woorden: ['noten', 'nootjes'], term: 'noten' },
  { woorden: ['chocolade', 'chocola', 'choco'], term: 'chocolade' },
  { woorden: ['appel', 'appels', 'appeltjes'], term: 'appels' },
  { woorden: ['banaan', 'bananen'], term: 'bananen' },
  { woorden: ['tomaat', 'tomaten', 'trostomaten'], term: 'tomaten' },
  { woorden: ['sla', 'salade', 'krop'], term: 'sla' },
  { woorden: ['groente', 'groenten'], term: 'groenten' },
  { woorden: ['gehakt', 'rundsgehakt'], term: 'gehakt' },
  { woorden: ['kip', 'kipfilet'], term: 'kipfilet' },
  { woorden: ['spek', 'bacon', 'spekjes'], term: 'spek' },
  { woorden: ['vlees'], term: 'vlees' },
  { woorden: ['vis', 'zalm', 'zalmfilet'], term: 'zalm' },
]

// Nettere weergavenamen voor de lijst; val terug op de term met een hoofdletter.
const TERM_LABELS = {
  penne: 'Pasta (penne)',
  lasagnebladen: 'Lasagnebladen',
  sojadrink: 'Sojadrink',
  appelsap: 'Appelsap',
  kipfilet: 'Kipfilet',
  zalm: 'Vis (zalm)',
  sla: 'Sla',
  groenten: 'Groenten',
}

export function labelVoorTerm(term) {
  return TERM_LABELS[term] || term.charAt(0).toUpperCase() + term.slice(1)
}

// Maak een lijst-item voor een ingrediënt-term.
export function ingredientItem(term) {
  return { key: term, kind: 'ingredient', label: labelVoorTerm(term) }
}

// Brede thema's waarmee de vragenlijst opent. Elk gerecht hoort bij één of meer
// thema's, zodat we na een brede keuze concrete gerechten kunnen voorstellen.
export const THEMAS = [
  { id: 'italiaans', label: 'Italiaans', emoji: '🍝' },
  { id: 'klassiek', label: 'Klassiekers', emoji: '🍗' },
  { id: 'gezond', label: 'Gezond & licht', emoji: '🥗' },
  { id: 'snel', label: 'Snel & simpel', emoji: '⏱️' },
  { id: 'ontbijt', label: 'Ontbijt & brunch', emoji: '☀️' },
]

// Gerechten -> de ingrediënt-termen die ze nodig hebben. Niet elke term zit in
// elk (beperkt) demo-assortiment; wat een gerecht sowieso niet kent staat in
// `ontbreekt` en melden we netjes.
export const RECEPTEN = [
  { naam: 'spaghetti bolognese', emoji: '🍝', themas: ['italiaans', 'klassiek'], aliassen: ['spaghetti bolognese', 'bolognese', 'spaghetti'], ingredienten: ['spaghetti', 'gehakt', 'tomaten', 'kaas'], ontbreekt: ['ui', 'look'] },
  { naam: 'spaghetti carbonara', emoji: '🥓', themas: ['italiaans'], aliassen: ['carbonara'], ingredienten: ['spaghetti', 'spek', 'kaas'], ontbreekt: ['eieren'] },
  { naam: 'lasagne', emoji: '🧀', themas: ['italiaans', 'klassiek'], aliassen: ['lasagne', 'lasagna'], ingredienten: ['lasagnebladen', 'gehakt', 'tomaten', 'kaas'], ontbreekt: ['bechamel'] },
  { naam: 'pasta met tomatensaus', emoji: '🍅', themas: ['italiaans', 'snel'], aliassen: ['pasta', 'macaroni', 'penne'], ingredienten: ['penne', 'tomaten', 'kaas'], ontbreekt: [] },
  { naam: 'kip met groenten', emoji: '🍗', themas: ['klassiek', 'gezond'], aliassen: ['kip met groenten', 'gegrilde kip', 'kip'], ingredienten: ['kipfilet', 'groenten'], ontbreekt: ['aardappelen'] },
  { naam: 'zalm met groenten', emoji: '🐟', themas: ['gezond', 'klassiek'], aliassen: ['zalm', 'vis'], ingredienten: ['zalm', 'groenten'], ontbreekt: ['citroen'] },
  { naam: 'verse salade', emoji: '🥗', themas: ['gezond', 'snel'], aliassen: ['salade', 'slaatje', 'sla'], ingredienten: ['sla', 'tomaten', 'kaas', 'kipfilet'], ontbreekt: ['dressing'] },
  { naam: 'broodmaaltijd', emoji: '🥪', themas: ['snel', 'ontbijt'], aliassen: ['boterhammen', 'lunch', 'broodje', 'broodmaaltijd'], ingredienten: ['brood', 'kaas'], ontbreekt: ['hesp'] },
  { naam: 'uitgebreid ontbijt', emoji: '🥐', themas: ['ontbijt'], aliassen: ['ontbijt', 'brunch'], ingredienten: ['brood', 'confituur', 'koffie'], ontbreekt: ['eieren'] },
  { naam: 'fruit-smoothie', emoji: '🥤', themas: ['gezond', 'ontbijt'], aliassen: ['smoothie', 'smoothies'], ingredienten: ['bananen', 'appels', 'yoghurt'], ontbreekt: [] },
]

// Alle gerechten die bij minstens één van de gekozen thema's horen.
export function gerechtenVoorThemas(themaIds) {
  if (!themaIds?.length) return RECEPTEN
  const set = new Set(themaIds)
  return RECEPTEN.filter((r) => r.themas.some((t) => set.has(t)))
}

// De ingrediënt-termen voor een set gekozen gerechten (winkel-onafhankelijk).
// Geeft ook terug welke ingrediënten geen enkel recept in voorraad heeft.
export function ingredientenVoorGerechten(recepten) {
  const termen = []
  const gezien = new Set()
  const nietGevonden = new Set()
  for (const r of recepten) {
    r.ontbreekt?.forEach((o) => nietGevonden.add(o))
    for (const term of r.ingredienten) {
      if (!gezien.has(term)) {
        gezien.add(term)
        termen.push(term)
      }
    }
  }
  return { termen, nietGevonden: [...nietGevonden] }
}

// Kies het best passende product voor één ingrediënt-term uit een gegeven pool
// (bijv. de producten van één winkel), met voorkeur voor het dieet en de
// prijsklasse van het profiel. Geeft null als de term niet in de pool zit.
export function kiesBesteProduct(pool, term, profiel) {
  const treffers = fuzzyZoekProducten(pool || [], term)
  if (!treffers.length) return null

  const dieet = profiel?.voorkeuren?.dieet || []
  const prijsklasse = profiel?.voorkeuren?.prijsklasse

  let kandidaten = treffers
  if (dieet.length) {
    const metDieet = treffers.filter((p) => dieet.every((d) => p.dieet.includes(d)))
    if (metDieet.length) kandidaten = metDieet // alleen filteren als er een alternatief is
  }

  return [...kandidaten].sort((a, b) => {
    // Producten die op het schap liggen eerst (anders kan je ze nu niet pakken).
    const as = a.opSchap === false ? 1 : 0
    const bs = b.opSchap === false ? 1 : 0
    if (as !== bs) return as - bs
    const am = a.prijsklasse === prijsklasse ? 0 : 1
    const bm = b.prijsklasse === prijsklasse ? 0 : 1
    if (am !== bm) return am - bm
    return a.prijs - b.prijs
  })[0]
}

// Komt `naald` als heel woord (of woordgroep) voor in `hooiberg`?
function bevatWoord(hooiberg, naald) {
  if (naald.includes(' ')) return hooiberg.includes(naald)
  return new RegExp(`(^|[^a-z])${naald}([^a-z]|$)`).test(hooiberg)
}

const VERVOEGINGEN = {
  ingredient: (n) => (n === 1 ? 'ingrediënt' : 'ingrediënten'),
}

/**
 * Verwerk een bericht van de gebruiker (getypt of ingesproken).
 * @returns {{antwoord:string, items:{key,kind,label}[],
 *            nietGevonden:string[], gerechten:string[], suggesties:string[]}}
 */
export function verwerkBericht(tekst) {
  const t = normaliseer(tekst)
  if (!t.trim()) {
    return leegAntwoord('Zeg of typ gerust wat je wil eten of nodig hebt — bijvoorbeeld "spaghetti bolognese" of "melk, kaas en appels".')
  }

  // 1. Herken gerechten.
  const gerechten = RECEPTEN.filter((r) => r.aliassen.some((a) => bevatWoord(t, normaliseer(a))))

  // 2. Verzamel ingrediënt-termen: uit gerechten + losse trefwoorden.
  const termen = []
  const gezien = new Set()
  const ontbrekendeIngredienten = new Set()
  for (const r of gerechten) {
    r.ingredienten.forEach((i) => {
      if (!gezien.has(i)) {
        gezien.add(i)
        termen.push(i)
      }
    })
    r.ontbreekt.forEach((o) => ontbrekendeIngredienten.add(o))
  }
  for (const k of INGREDIENT_TREFWOORDEN) {
    if (k.woorden.some((w) => bevatWoord(t, normaliseer(w))) && !gezien.has(k.term)) {
      gezien.add(k.term)
      termen.push(k.term)
    }
  }

  // 3. Bouw een gespreksantwoord.
  if (!termen.length) {
    return leegAntwoord(
      'Hmm, dat herken ik niet als gerecht of ingrediënt. Probeer iets als "lasagne" of "salade", of noem ingrediënten zoals "kipfilet en tomaten".',
    )
  }

  const items = termen.map(ingredientItem)
  const labels = items.map((i) => i.label.toLowerCase())
  const nietGevonden = [...ontbrekendeIngredienten]

  let antwoord = ''
  if (gerechten.length) {
    const gerechtNamen = gerechten.map((g) => g.naam)
    antwoord = `Lekker! Voor ${lijstZin(gerechtNamen)} zet ik ${labels.length} ${VERVOEGINGEN.ingredient(labels.length)} op je lijst: ${lijstZin(labels)}.`
  } else {
    antwoord = `Op je lijst gezet: ${lijstZin(labels)}.`
  }
  if (nietGevonden.length) {
    antwoord += ` ${hoofdletter(lijstZin(nietGevonden))} ${nietGevonden.length === 1 ? 'staat' : 'staan'} niet in onze recepten — die voeg je zelf toe.`
  }

  const suggesties = bouwSuggesties(gezien)
  if (suggesties.length) {
    antwoord += ` Wil je er nog iets bij, zoals ${lijstZin(suggesties.map((s) => s.toLowerCase()))}?`
  }

  return { antwoord, items, nietGevonden, gerechten: gerechten.map((g) => g.naam), suggesties }
}

// Stel max. 2 aanvullende ingrediënten voor die nog niet op de lijst staan.
// De labels zijn meteen herkenbare woorden, zodat een tik ze toevoegt.
function bouwSuggesties(gezieneTermen) {
  const opties = [
    { term: 'koffie', label: 'Koffie' },
    { term: 'appels', label: 'Appels' },
    { term: 'chocolade', label: 'Chocolade' },
    { term: 'cola', label: 'Cola' },
  ]
  return opties
    .filter((o) => !gezieneTermen.has(o.term))
    .slice(0, 2)
    .map((o) => o.label)
}

function leegAntwoord(antwoord) {
  return { antwoord, items: [], nietGevonden: [], gerechten: [], suggesties: [] }
}

function lijstZin(items) {
  const arr = items.filter(Boolean)
  if (arr.length === 0) return ''
  if (arr.length === 1) return arr[0]
  return `${arr.slice(0, -1).join(', ')} en ${arr[arr.length - 1]}`
}

function hoofdletter(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

export const BEGROETING =
  'Hoi! Ik ben je boodschappen-assistent. Vertel me wat je wil koken of eten, dan zet ik de ingrediënten op je lijst. Je kan ook gewoon producten opnoemen. De winkel kies je later.'

export const VOORBEELDEN = ['Spaghetti bolognese', 'Salade met kip', 'Ontbijt', 'Melk, kaas en appels']
