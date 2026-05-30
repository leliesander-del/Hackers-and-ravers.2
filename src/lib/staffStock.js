// Voorraadclassificatie voor het rekkenvuller-scherm.

/** Product staat fysiek op de rekken (kassa toont alleen deze). */
export function ligtOpRekken(product) {
  return (product.rekkenVoorraad ?? 0) > 0
}

export function filterOpRekken(producten) {
  return producten.filter(ligtOpRekken)
}

export function doelRekkenVoorraad(product) {
  if (product.doelRekkenVoorraad != null) return product.doelRekkenVoorraad
  if (product.rekkenVoorraad > 0) return product.rekkenVoorraad
  return product.afdeling === 'elektronica' || product.afdeling === 'sport' ? 4 : 10
}

export function classificeerRekkenVoorraad(product) {
  const doel = doelRekkenVoorraad(product)
  const rekken = product.rekkenVoorraad ?? 0
  const magazijn = product.magazijnVoorraad ?? 0
  const halveDrempel = Math.ceil(doel / 2)

  if (rekken === 0 && magazijn === 0) return 'uit'
  if (rekken === 0 && magazijn > 0) return 'legeRekken'
  if (rekken > 0 && rekken <= halveDrempel) return 'rekkenBijnaOp'
  return 'veel'
}

export function groepeerVoorraadPerRekken(producten) {
  const uit = []
  const legeRekken = []
  const rekkenBijnaOp = []
  const veel = []

  for (const p of producten) {
    const status = classificeerRekkenVoorraad(p)
    if (status === 'uit') uit.push(p)
    else if (status === 'legeRekken') legeRekken.push(p)
    else if (status === 'rekkenBijnaOp') rekkenBijnaOp.push(p)
    else veel.push(p)
  }

  const sortNaam = (a, b) => a.naam.localeCompare(b.naam)
  const sortRekkenLaag = (a, b) => a.rekkenVoorraad - b.rekkenVoorraad

  uit.sort(sortNaam)
  legeRekken.sort(sortNaam)
  rekkenBijnaOp.sort(sortRekkenLaag)
  veel.sort((a, b) => b.rekkenVoorraad - a.rekkenVoorraad)

  return { uit, legeRekken, rekkenBijnaOp, veel }
}
