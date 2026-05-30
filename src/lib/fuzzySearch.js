function normalize(tekst) {
  return tekst
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

function levenshtein(a, b) {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length

  const rij = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let vorig = rij[0]
    rij[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = rij[j]
      rij[j] = Math.min(rij[j] + 1, rij[j - 1] + 1, vorig + (a[i - 1] === b[j - 1] ? 0 : 1))
      vorig = tmp
    }
  }
  return rij[b.length]
}

function scoreTekst(tekst, query) {
  const t = normalize(tekst)
  const q = normalize(query)
  if (!q) return 100

  if (t.includes(q)) return 100 - t.indexOf(q) * 0.05

  const woorden = t.split(/\s+/).filter(Boolean)
  for (const w of woorden) {
    if (w.startsWith(q)) return 85
  }

  let beste = levenshtein(q, t)
  for (const w of woorden) {
    if (w.length >= 2) beste = Math.min(beste, levenshtein(q, w))
  }

  const maxAfstand = q.length <= 4 ? 1 : q.length <= 8 ? 2 : 3
  if (beste <= maxAfstand) return 70 - beste * 12

  return 0
}

export function fuzzyZoekProducten(producten, query) {
  const q = query.trim()
  if (!q) return producten

  return producten
    .map((p) => {
      const velden = [p.naam, p.merk, p.categorie, p.rekkenlocatie?.label, p.id?.replace(/^p-/, '').replace(/-/g, ' ')]
      const score = Math.max(...velden.filter(Boolean).map((v) => scoreTekst(v, q)))
      return { product: p, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ product }) => product)
}
