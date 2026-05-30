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

// Maaltijdmomenten en basisingrediënt-categorieën waarmee de vragenlijst
// gerechten kan rangschikken. De labels worden in de signupflow getoond.
export const MAALTIJDEN = [
  { id: 'ontbijt', label: 'Ontbijt', emoji: '🥐' },
  { id: 'lunch', label: 'Lunch', emoji: '🥪' },
  { id: 'avondmaal', label: 'Avondmaal', emoji: '🍽️' },
  { id: 'salade', label: 'Salade', emoji: '🥗' },
  { id: 'dessert', label: 'Dessert', emoji: '🍰' },
]

export const BASIS_INGREDIENTEN = [
  { id: 'pasta', label: 'Pasta', emoji: '🍝' },
  { id: 'rundvlees', label: 'Rundvlees', emoji: '🥩' },
  { id: 'kip', label: 'Kip', emoji: '🍗' },
  { id: 'vis', label: 'Vis', emoji: '🐟' },
  { id: 'groenten', label: 'Groenten', emoji: '🥦' },
  { id: 'kaas', label: 'Kaas & zuivel', emoji: '🧀' },
  { id: 'brood', label: 'Brood', emoji: '🍞' },
  { id: 'fruit', label: 'Fruit', emoji: '🍎' },
]

// Kooktijd-keuzes; `max` = bovengrens in minuten waarop recepten worden gefilterd.
export const KOOKTIJD_OPTIES = [
  { id: 'snel', label: 'Snel', sub: '< 15 min', emoji: '⚡', max: 15 },
  { id: 'gemiddeld', label: 'Gemiddeld', sub: '15 – 30 min', emoji: '⏱️', max: 30 },
  { id: 'uitgebreid', label: 'Uitgebreid', sub: '30 – 60 min', emoji: '🍳', max: 60 },
  { id: 'geen-haast', label: 'Geen haast', sub: '60 min +', emoji: '🕯️', max: Infinity },
]

// Gerechten -> de ingrediënt-termen die ze nodig hebben. Niet elke term zit in
// elk (beperkt) demo-assortiment; wat een gerecht sowieso niet kent staat in
// `ontbreekt` en melden we netjes.
//
// Extra metadata stuurt de vragenlijst (SignupPage) aan:
//   tijd    = bereidingstijd in minuten (hard filter op de gekozen kooktijd)
//   dieet   = welke dieetvoorkeuren dit gerecht respecteert (hard filter)
//   maaltijd= bij welke maaltijdmomenten het past (rangschikking)
//   basis   = basisingrediënt-categorieën (rangschikking)
//   prijs   = prijsklasse (rangschikking)
export const RECEPTEN = [
  { naam: 'spaghetti bolognese', emoji: '🍝', themas: ['italiaans', 'klassiek'], aliassen: ['spaghetti bolognese', 'bolognese', 'spaghetti'], ingredienten: ['spaghetti', 'gehakt', 'tomaten', 'kaas'], ontbreekt: ['ui', 'look'], tijd: 25, dieet: [], maaltijd: ['avondmaal'], basis: ['pasta', 'rundvlees', 'groenten', 'kaas'], prijs: 'middenklasse' },
  { naam: 'spaghetti carbonara', emoji: '🥓', themas: ['italiaans'], aliassen: ['carbonara'], ingredienten: ['spaghetti', 'spek', 'kaas'], ontbreekt: ['eieren'], tijd: 20, dieet: [], maaltijd: ['avondmaal'], basis: ['pasta', 'kaas'], prijs: 'middenklasse' },
  { naam: 'lasagne', emoji: '🧀', themas: ['italiaans', 'klassiek'], aliassen: ['lasagne', 'lasagna'], ingredienten: ['lasagnebladen', 'gehakt', 'tomaten', 'kaas'], ontbreekt: ['bechamel'], tijd: 45, dieet: [], maaltijd: ['avondmaal'], basis: ['pasta', 'rundvlees', 'groenten', 'kaas'], prijs: 'middenklasse' },
  { naam: 'pasta met tomatensaus', emoji: '🍅', themas: ['italiaans', 'snel'], aliassen: ['pasta', 'macaroni', 'penne'], ingredienten: ['penne', 'tomaten', 'kaas'], ontbreekt: [], tijd: 15, dieet: ['Vegetarisch'], maaltijd: ['avondmaal', 'lunch'], basis: ['pasta', 'groenten', 'kaas'], prijs: 'budget' },
  { naam: 'kip met groenten', emoji: '🍗', themas: ['klassiek', 'gezond'], aliassen: ['kip met groenten', 'gegrilde kip', 'kip'], ingredienten: ['kipfilet', 'groenten'], ontbreekt: ['aardappelen'], tijd: 30, dieet: ['Glutenvrij', 'Lactosevrij', 'Suikervrij'], maaltijd: ['avondmaal'], basis: ['kip', 'groenten'], prijs: 'middenklasse' },
  { naam: 'zalm met groenten', emoji: '🐟', themas: ['gezond', 'klassiek'], aliassen: ['zalm', 'vis'], ingredienten: ['zalm', 'groenten'], ontbreekt: ['citroen'], tijd: 25, dieet: ['Glutenvrij', 'Lactosevrij', 'Suikervrij'], maaltijd: ['avondmaal'], basis: ['vis', 'groenten'], prijs: 'premium' },
  { naam: 'verse salade', emoji: '🥗', themas: ['gezond', 'snel'], aliassen: ['salade', 'slaatje', 'sla'], ingredienten: ['sla', 'tomaten', 'kaas', 'kipfilet'], ontbreekt: ['dressing'], tijd: 10, dieet: ['Glutenvrij'], maaltijd: ['salade', 'lunch'], basis: ['groenten', 'kip', 'kaas'], prijs: 'middenklasse' },
  { naam: 'broodmaaltijd', emoji: '🥪', themas: ['snel', 'ontbijt'], aliassen: ['boterhammen', 'lunch', 'broodje', 'broodmaaltijd'], ingredienten: ['brood', 'kaas'], ontbreekt: ['hesp'], tijd: 5, dieet: ['Vegetarisch'], maaltijd: ['lunch', 'ontbijt'], basis: ['brood', 'kaas'], prijs: 'budget' },
  { naam: 'uitgebreid ontbijt', emoji: '🥐', themas: ['ontbijt'], aliassen: ['ontbijt', 'brunch'], ingredienten: ['brood', 'confituur', 'koffie'], ontbreekt: ['eieren'], tijd: 15, dieet: ['Vegetarisch'], maaltijd: ['ontbijt'], basis: ['brood'], prijs: 'budget' },
  { naam: 'fruit-smoothie', emoji: '🥤', themas: ['gezond', 'ontbijt'], aliassen: ['smoothie', 'smoothies'], ingredienten: ['bananen', 'appels', 'yoghurt'], ontbreekt: [], tijd: 5, dieet: ['Vegetarisch', 'Glutenvrij'], maaltijd: ['ontbijt', 'dessert'], basis: ['fruit', 'kaas'], prijs: 'budget' },
]

// Alle gerechten die bij minstens één van de gekozen thema's horen.
// Centrale recept-aanbeveling, gedeeld door de aanmeldvragenlijst én de kok-chat.
// Hard filter op dieet, kooktijd en vermeden ingrediënten; daarna rangschikken op
// hoe goed een recept aansluit bij de keukenstijl, het maaltijdmoment, de gewenste
// ingrediënten en de prijsklasse. Zo staan de beste matches bovenaan zonder dat de
// lijst onverwacht leegloopt.
export function rangschikRecepten({
  dieet = [],
  kooktijd = '',
  vermijden = [],
  themas = [],
  maaltijden = [],
  ingredienten = [],
  prijsklasse = '',
} = {}) {
  const maxTijd = KOOKTIJD_OPTIES.find((k) => k.id === kooktijd)?.max ?? Infinity
  const prijsLower = (prijsklasse || '').toLowerCase()

  return RECEPTEN.filter((r) => dieet.every((d) => r.dieet.includes(d)))
    .filter((r) => r.tijd <= maxTijd)
    .filter((r) => !vermijden.some((v) => r.basis.includes(v)))
    .map((r) => {
      let score = 0
      score += themas.filter((t) => r.themas.includes(t)).length * 2
      score += maaltijden.filter((m) => r.maaltijd.includes(m)).length * 2
      score += ingredienten.filter((i) => r.basis.includes(i)).length * 2
      if (prijsLower && r.prijs === prijsLower) score += 1
      return { ...r, score }
    })
    .sort((a, b) => b.score - a.score)
}

// ── Kok-gesprek ──────────────────────────────────────────────────────────────
// De chat voert de vragenlijst als een gesprek: de kok stelt stap voor stap
// vragen ("doorvragen") en stelt op het einde gerechten voor. Elk antwoord
// landt in `voorkeuren` en voedt rangschikRecepten().

export const KOK_BEGROETING =
  'Hoi, ik ben je kok! Vertel me waar je zin in hebt — typ of spreek gerust vrijuit — dan stel ik een paar vragen en zoek ik samen met jou de juiste gerechten. Zullen we beginnen?'

// Bouw quick-reply-opties uit een datalijst (THEMAS, BASIS_INGREDIENTEN, …).
const opt = (lijst) => lijst.map((o) => ({ id: o.id, label: o.label, emoji: o.emoji }))

// Het script van vragen. `multi` = meerdere antwoorden, `overslaan` = mag leeg.
// `key` is het veld in de voorkeuren dat rangschikRecepten() leest.
export const KOK_VRAGEN = [
  { key: 'kooktijd', multi: false, vraag: 'Hoeveel tijd heb je vandaag om te koken?', opties: opt(KOOKTIJD_OPTIES) },
  {
    key: 'personen',
    multi: false,
    vraag: 'Voor hoeveel personen kook je?',
    opties: [
      { id: '1', label: 'Voor mezelf', emoji: '🧑' },
      { id: '2', label: 'Twee', emoji: '👫' },
      { id: '3-4', label: '3 – 4', emoji: '👨‍👩‍👧' },
      { id: '5+', label: '5 of meer', emoji: '👨‍👩‍👧‍👦' },
    ],
  },
  { key: 'themas', multi: true, vraag: 'Waar heb je zin in? Kies gerust meerdere keukens.', opties: opt(THEMAS) },
  { key: 'maaltijden', multi: true, overslaan: true, vraag: 'Voor welk moment van de dag?', opties: opt(MAALTIJDEN) },
  { key: 'ingredienten', multi: true, overslaan: true, vraag: 'Zijn er ingrediënten waar je graag mee werkt?', opties: opt(BASIS_INGREDIENTEN) },
  { key: 'vermijden', multi: true, overslaan: true, vraag: 'En iets dat ik beter laat liggen?', opties: opt(BASIS_INGREDIENTEN) },
]

// Een kok-achtige reactie op een gegeven antwoord, vóór de volgende vraag.
export function kokReactie(key, labels) {
  const stuk = lijstZin(labels).toLowerCase()
  switch (key) {
    case 'kooktijd':
      return `Top — ik hou rekening met "${stuk}".`
    case 'personen':
      return labels[0] === 'Voor mezelf' ? 'Lekker voor jezelf koken, ook fijn!' : `Genoteerd, koken voor ${stuk}.`
    case 'themas':
      return labels.length ? `Mmm, ${stuk} — daar kan ik wel iets mee!` : 'Geen voorkeur? Dan verras ik je straks.'
    case 'maaltijden':
      return labels.length ? `Helder, voor ${stuk} dus.` : 'Maakt niet uit wanneer — prima.'
    case 'ingredienten':
      return labels.length ? `Fijn, ik werk graag met ${stuk}.` : 'Oké, dan hou ik alle opties open.'
    case 'vermijden':
      return labels.length ? `Begrepen — ${stuk} laat ik weg.` : 'Niets te vermijden, dat maakt het makkelijk.'
    default:
      return 'Genoteerd!'
  }
}

// Herken welke opties van een vraag in vrije tekst voorkomen (chips zijn primair,
// maar wie liever typt — "iets snels met kip" — wordt ook begrepen).
export function herkenKeuzes(opties, tekst) {
  const t = normaliseer(tekst)
  const woorden = new Set(t.split(/[^a-z]+/).filter((w) => w.length >= 3))
  return opties.filter((o) => {
    if (woorden.has(normaliseer(o.id))) return true
    const labelWoorden = normaliseer(o.label).split(/[^a-z]+/).filter((w) => w.length >= 4)
    return labelWoorden.some((lw) => woorden.has(lw))
  })
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
