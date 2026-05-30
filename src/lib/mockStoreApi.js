// Gesimuleerde winkel-databank. Geeft de voorraad van een winkel terug in de
// vorm zoals een echte ERP-/kassasysteem-API dat zou doen (een lijst rijen met
// een SKU en de magazijn-/rekkenvoorraad). inventorySync gebruikt dit als bron
// wanneer een connectie als "demo-databron" is gemarkeerd, zodat de volledige
// synchronisatie-flow werkt zonder dat er een externe server draait.
//
// De waarden komen uit products.js — de bron van waarheid — zodat een sync de
// live (gedrifte) voorraad terugzet naar wat de winkeldatabank zegt.

import { products } from '../data/products.js'

// Bouwt de API-payload voor één winkel.
export function mockStoreDatabaseResponse(storeId) {
  const voorraad = products
    .filter((p) => p.storeId === storeId)
    .map((p) => ({
      sku: p.id,
      naam: p.naam,
      magazijn: p.magazijnVoorraad ?? 0,
      rekken: p.rekkenVoorraad ?? 0,
    }))

  return {
    store: storeId,
    bron: 'demo-databank',
    opgehaaldOp: new Date().toISOString(),
    aantal: voorraad.length,
    voorraad,
  }
}

// Simuleert een netwerk-call met een kleine vertraging, zodat de UI een echte
// laad-toestand kan tonen.
export function fetchMockStoreDatabase(storeId) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockStoreDatabaseResponse(storeId)), 400)
  })
}
