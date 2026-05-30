// De personalisatie-engine. Eén patroon overal: filter -> score -> sorteer -> label.
// Een profiel zonder `voorkeuren` (de gast) valt terug op prijs/alfabet.

// =========================================================================
// Producten (zoekresultaten in een winkel)
// =========================================================================
export function rankProducts(products, profile) {
  const lid = !!profile?.voorkeuren

  const verrijkt = products.map((p) => {
    let score = 0
    let reden = null

    if (lid) {
      const v = profile.voorkeuren
      if (v.merken.includes(p.merk)) {
        score += 40
        reden = 'Jouw merk'
      }
      if (v.afdelingen.includes(p.afdeling)) score += 12
      if (v.dieet.length && v.dieet.every((d) => p.dieet.includes(d))) {
        score += 30
        reden = reden || `${v.dieet[0]} ✓`
      }
      if (p.prijsklasse === v.prijsklasse) {
        score += 12
        reden = reden || (v.prijsklasse === 'budget' ? 'Past bij je budget' : 'Past bij je voorkeur')
      }
    }

    // Niet op voorraad altijd onderaan.
    if (!p.opVoorraad) score -= 100

    const waarschuwing =
      lid &&
      profile.voorkeuren.dieet.includes('glutenvrij') &&
      ['pasta', 'brood', 'snacks'].includes(p.categorie) &&
      !p.dieet.includes('glutenvrij')
        ? 'Bevat mogelijk gluten'
        : null

    return { ...p, _score: score, _reden: reden, _waarschuwing: waarschuwing }
  })

  verrijkt.sort((a, b) => {
    if (lid && b._score !== a._score) return b._score - a._score
    // Gast (of gelijke score): op voorraad eerst, dan alfabetisch.
    if (a.opVoorraad !== b.opVoorraad) return a.opVoorraad ? -1 : 1
    return a.naam.localeCompare(b.naam)
  })
  return verrijkt
}

// =========================================================================
// Alternatieven (bij lege rekken)
// =========================================================================
export function rankAlternatives(product, allProducts, profile) {
  const lid = !!profile?.voorkeuren

  const kandidaten = allProducts.filter(
    (p) => p.storeId === product.storeId && p.categorie === product.categorie && p.id !== product.id && p.opVoorraad,
  )

  const verrijkt = kandidaten.map((p) => {
    let score = 0
    let reden = 'Zelfde categorie'

    if (lid) {
      const v = profile.voorkeuren
      if (v.dieet.length) {
        if (v.dieet.every((d) => p.dieet.includes(d))) {
          score += 60
          reden = `${v.dieet[0]} ✓`
        } else {
          score -= 70 // een glutenvrij lid krijgt nooit gluten vooraan
        }
      }
      if (v.merken.includes(p.merk)) {
        score += 40
        reden = reden.includes('✓') ? reden : 'Zelfde merk'
      }
      if (p.prijsklasse === v.prijsklasse) {
        score += 20
        if (reden === 'Zelfde categorie') reden = v.prijsklasse === 'budget' ? 'Voordeliger' : 'Past bij je voorkeur'
      }
    } else {
      // Gast: voorrang aan goedkoper.
      score += Math.max(0, 20 - p.prijs)
      reden = p.prijs < product.prijs ? 'Voordeliger' : 'Zelfde categorie'
    }

    // Prijs dicht bij het origineel telt licht mee.
    score += Math.max(0, 15 - Math.abs(p.prijs - product.prijs))

    return { ...p, _score: score, _reden: reden }
  })

  verrijkt.sort((a, b) => b._score - a._score)
  return verrijkt
}

function normalizeTekst(tekst) {
  return tekst
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

// Zelfde product (naam + merk) bij andere winkels die wél op rekken liggen.
export function findZelfdeProductAndereWinkels(product, allProducts) {
  const naam = normalizeTekst(product.naam)
  const merk = normalizeTekst(product.merk)

  return allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        p.storeId !== product.storeId &&
        normalizeTekst(p.naam) === naam &&
        normalizeTekst(p.merk) === merk &&
        p.opVoorraad,
    )
    .map((p) => ({ ...p, _reden: 'Zelfde product' }))
}
