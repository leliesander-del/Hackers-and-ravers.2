// Hulpfuncties voor het magazijn/schap-voorraadmodel.

export function buildInitialInventory(products) {
  const inv = {}
  for (const p of products) {
    inv[p.id] = {
      magazijn: p.magazijnVoorraad ?? 0,
      schap: p.schapVoorraad ?? 0,
    }
  }
  return inv
}

export function enrichProduct(product, stock) {
  if (!product) return null
  const magazijn = stock?.magazijn ?? product.magazijnVoorraad ?? 0
  const schap = stock?.schap ?? product.schapVoorraad ?? 0
  const opSchap = schap > 0
  const inMagazijn = magazijn > 0
  let voorraadStatus = 'schap'
  if (!opSchap && inMagazijn) voorraadStatus = 'magazijn'
  if (!opSchap && !inMagazijn) voorraadStatus = 'op'

  return {
    ...product,
    magazijnVoorraad: magazijn,
    schapVoorraad: schap,
    opVoorraad: opSchap,
    opSchap,
    inMagazijn,
    voorraadStatus,
  }
}

// QR of handmatige invoer -> product-id (bijv. storenav://product/p-koffiebonen).
export function parseProductQr(input) {
  const raw = input.trim()
  if (!raw) return null

  const urlMatch = raw.match(/product[/:]([a-z0-9-]+)/i)
  if (urlMatch) return urlMatch[1]

  const idMatch = raw.match(/^(p-[a-z0-9-]+)$/i)
  if (idMatch) return idMatch[1]

  return null
}

export function productQrPayload(productId) {
  return `storenav://product/${productId}`
}
