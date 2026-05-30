// The personalization engine. One pattern everywhere: filter -> score -> sort -> label.
// A profile without `preferences` (the guest) falls back to price/alphabet.

// =========================================================================
// Products (search results in a store)
// =========================================================================
export function rankProducts(products, profile) {
  const isMember = !!profile?.preferences

  const enriched = products.map((p) => {
    let score = 0
    let reason = null

    if (isMember) {
      const v = profile.preferences
      if (v.brands.includes(p.brand)) {
        score += 40
        reason = 'Your brand'
      }
      if (v.departments.includes(p.department)) score += 12
      if (v.diet.length && v.diet.every((d) => p.diet.includes(d))) {
        score += 30
        reason = reason || `${v.diet[0]} ✓`
      }
      if (p.priceTier === v.priceTier) {
        score += 12
        reason = reason || (v.priceTier === 'budget' ? 'Fits your budget' : 'Fits your preference')
      }
    }

    // Out of stock always at the bottom.
    if (!p.inStock) score -= 100

    const warning =
      isMember &&
      profile.preferences.diet.includes('gluten-free') &&
      ['pasta', 'bread', 'snacks'].includes(p.category) &&
      !p.diet.includes('gluten-free')
        ? 'May contain gluten'
        : null

    return { ...p, _score: score, _reason: reason, _warning: warning }
  })

  enriched.sort((a, b) => {
    if (isMember && b._score !== a._score) return b._score - a._score
    // Guest (or equal score): in stock first, then alphabetical.
    if (a.inStock !== b.inStock) return a.inStock ? -1 : 1
    return a.name.localeCompare(b.name)
  })
  return enriched
}

// =========================================================================
// Alternatives (when shelves are empty)
// =========================================================================
export function rankAlternatives(product, allProducts, profile) {
  const isMember = !!profile?.preferences

  const candidates = allProducts.filter(
    (p) => p.storeId === product.storeId && p.category === product.category && p.id !== product.id && p.inStock,
  )

  const enriched = candidates.map((p) => {
    let score = 0
    let reason = 'Same category'

    if (isMember) {
      const v = profile.preferences
      if (v.diet.length) {
        if (v.diet.every((d) => p.diet.includes(d))) {
          score += 60
          reason = `${v.diet[0]} ✓`
        } else {
          score -= 70 // a gluten-free member never gets gluten up front
        }
      }
      if (v.brands.includes(p.brand)) {
        score += 40
        reason = reason.includes('✓') ? reason : 'Same brand'
      }
      if (p.priceTier === v.priceTier) {
        score += 20
        if (reason === 'Same category') reason = v.priceTier === 'budget' ? 'Cheaper' : 'Fits your preference'
      }
    } else {
      // Guest: prefer cheaper.
      score += Math.max(0, 20 - p.price)
      reason = p.price < product.price ? 'Cheaper' : 'Same category'
    }

    // Price close to the original counts slightly.
    score += Math.max(0, 15 - Math.abs(p.price - product.price))

    return { ...p, _score: score, _reason: reason }
  })

  enriched.sort((a, b) => b._score - a._score)
  return enriched
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

// Same product (name + brand) at other stores that do have it on the shelves.
export function findSameProductOtherStores(product, allProducts) {
  const name = normalizeText(product.name)
  const brand = normalizeText(product.brand)

  return allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        p.storeId !== product.storeId &&
        normalizeText(p.name) === name &&
        normalizeText(p.brand) === brand &&
        p.inStock,
    )
    .map((p) => ({ ...p, _reason: 'Same product' }))
}
