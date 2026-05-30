// Hulpfuncties voor het magazijn/rekken-voorraadmodel.

import { doelRekkenVoorraad } from './staffStock.js'

export function buildInitialInventory(products) {
  const inv = {}
  for (const p of products) {
    inv[p.id] = {
      magazijn: p.magazijnVoorraad ?? 0,
      rekken: p.rekkenVoorraad ?? 0,
    }
  }
  return inv
}

export function enrichProduct(product, stock) {
  if (!product) return null
  const magazijn = stock?.magazijn ?? product.magazijnVoorraad ?? 0
  const rekken = stock?.rekken ?? product.rekkenVoorraad ?? 0
  const opRekken = rekken > 0
  const inMagazijn = magazijn > 0
  let voorraadStatus = 'rekken'
  if (!opRekken && inMagazijn) voorraadStatus = 'magazijn'
  if (!opRekken && !inMagazijn) voorraadStatus = 'op'

  const doelRekken = doelRekkenVoorraad(product)

  return {
    ...product,
    magazijnVoorraad: magazijn,
    rekkenVoorraad: rekken,
    doelRekkenVoorraad: doelRekken,
    opVoorraad: opRekken,
    opRekken,
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
