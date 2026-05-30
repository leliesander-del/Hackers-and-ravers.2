// Voorraad-synchronisatie: trekt de actuele voorraad uit de databank van een
// winkel via een geconfigureerde API-connectie en zet die om naar een patch
// voor het inventaris-model in StoreContext.
//
// Een connectie kan een echte HTTP-API zijn (live fetch met methode, auth-header
// en API-sleutel) of een "demo-databron" die de gesimuleerde winkeldatabank
// gebruikt, zodat de flow ook zonder externe server werkt.

import { fetchMockStoreDatabase } from './mockStoreApi.js'

// Maakt van een externe API-respons een uniforme lijst { sku, magazijn, rekken }.
// Ondersteunt de meest voorkomende vormen ({ voorraad/items/data: [...] } of
// meteen een array) en verschillende veldnamen per rij.
export function normaliseerVoorraadRespons(data) {
  const lijst = Array.isArray(data) ? data : data?.voorraad || data?.items || data?.data || []
  if (!Array.isArray(lijst)) return []

  return lijst
    .map((rij) => {
      const sku = rij.sku ?? rij.id ?? rij.productId ?? rij.productCode
      if (!sku) return null
      const magazijn = Number(rij.magazijn ?? rij.warehouse ?? rij.magazijnVoorraad ?? rij.stockMagazijn ?? 0)
      const rekken = Number(rij.rekken ?? rij.shelf ?? rij.rekkenVoorraad ?? rij.stockRekken ?? 0)
      return {
        sku: String(sku),
        magazijn: Number.isFinite(magazijn) ? Math.max(0, Math.round(magazijn)) : 0,
        rekken: Number.isFinite(rekken) ? Math.max(0, Math.round(rekken)) : 0,
      }
    })
    .filter(Boolean)
}

// Haalt de voorraad op bij de connectie. Demo-databron -> gesimuleerde
// databank; anders een echte HTTP-fetch. Gooit een duidelijke fout bij
// netwerk-/statusproblemen.
export async function haalVoorraadOp(connection, storeId) {
  if (!connection) throw new Error('Geen connectie opgegeven.')

  if (connection.demo) {
    const data = await fetchMockStoreDatabase(storeId)
    return normaliseerVoorraadRespons(data)
  }

  if (!connection.baseUrl) throw new Error('Deze connectie heeft geen API-URL.')

  const headers = { Accept: 'application/json' }
  if (connection.authHeader && connection.apiKey) {
    headers[connection.authHeader] = connection.apiKey
  }

  let res
  try {
    res = await fetch(connection.baseUrl, { method: connection.method || 'GET', headers })
  } catch {
    throw new Error('Kon de API niet bereiken (netwerk of CORS).')
  }
  if (!res.ok) throw new Error(`API gaf status ${res.status}${res.statusText ? ` (${res.statusText})` : ''}.`)

  let data
  try {
    data = await res.json()
  } catch {
    throw new Error('De API gaf geen geldige JSON terug.')
  }
  return normaliseerVoorraadRespons(data)
}

// Bouwt de inventaris-patch { [productId]: { magazijn, rekken } } uit de
// opgehaalde rijen, beperkt tot producten die deze winkel echt voert. `huidig`
// (optioneel) laat toe te tellen hoeveel producten effectief wijzigen.
export function bouwVoorraadPatch(rijen, winkelProducten, huidig = {}) {
  const bestaat = new Set(winkelProducten.map((p) => p.id))
  const patch = {}
  let gewijzigd = 0

  for (const rij of rijen) {
    if (!bestaat.has(rij.sku)) continue
    patch[rij.sku] = { magazijn: rij.magazijn, rekken: rij.rekken }
    const oud = huidig[rij.sku]
    if (!oud || oud.magazijn !== rij.magazijn || oud.rekken !== rij.rekken) gewijzigd += 1
  }

  return { patch, herkend: Object.keys(patch).length, gewijzigd }
}
