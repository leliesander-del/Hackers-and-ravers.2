// Producten per winkel. `afdeling` matcht met profielvoorkeuren; `categorie` is fijnmazig
// en wordt gebruikt om alternatieven te zoeken bij een leeg schap.
// `magazijnVoorraad` = achter de winkel; `schapVoorraad` = op de rekken (live in StoreContext).
// Een paar producten starten met schap 0 zodat het alternatieven-scherm iets te tonen heeft.
// `schaplocatie` (x, y op een 0-100 raster) voedt de 2D-plattegrond.

export const products = [
  // ---- AH XL Brugge (boodschappen) ----
  { id: 'p-glutenvrije-pasta', storeId: 'ah-xl', naam: 'Glutenvrije penne', afdeling: 'boodschappen', categorie: 'pasta', merk: 'Schär', prijs: 2.49, dieet: ['glutenvrij'], prijsklasse: 'premium', magazijnVoorraad: 48, schapVoorraad: 10, schaplocatie: { label: 'Gang A1', x: 18, y: 25 } },
  { id: 'p-penne-barilla', storeId: 'ah-xl', naam: 'Penne', afdeling: 'boodschappen', categorie: 'pasta', merk: 'Barilla', prijs: 1.2, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 60, schapVoorraad: 14, schaplocatie: { label: 'Gang A1', x: 18, y: 25 } },
  { id: 'p-spaghetti-boni', storeId: 'ah-xl', naam: 'Spaghetti', afdeling: 'boodschappen', categorie: 'pasta', merk: 'Boni', prijs: 0.65, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 72, schapVoorraad: 18, schaplocatie: { label: 'Gang A1', x: 18, y: 25 } },

  { id: 'p-glutenvrij-brood', storeId: 'ah-xl', naam: 'Glutenvrij brood', afdeling: 'boodschappen', categorie: 'brood', merk: 'Schär', prijs: 3.19, dieet: ['glutenvrij'], prijsklasse: 'premium', magazijnVoorraad: 24, schapVoorraad: 0, schaplocatie: { label: 'Gang B2', x: 50, y: 25 } },
  { id: 'p-glutenvrij-stokbrood', storeId: 'ah-xl', naam: 'Glutenvrij stokbrood', afdeling: 'boodschappen', categorie: 'brood', merk: 'Schär', prijs: 2.19, dieet: ['glutenvrij'], prijsklasse: 'premium', magazijnVoorraad: 36, schapVoorraad: 8, schaplocatie: { label: 'Gang B2', x: 50, y: 25 } },
  { id: 'p-volkorenbrood', storeId: 'ah-xl', naam: 'Volkorenbrood', afdeling: 'boodschappen', categorie: 'brood', merk: 'AH', prijs: 1.45, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 40, schapVoorraad: 12, schaplocatie: { label: 'Gang B2', x: 50, y: 25 } },
  { id: 'p-witbrood', storeId: 'ah-xl', naam: 'Wit brood', afdeling: 'boodschappen', categorie: 'brood', merk: 'Boni', prijs: 0.89, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 55, schapVoorraad: 15, schaplocatie: { label: 'Gang B2', x: 50, y: 25 } },

  { id: 'p-sojadrink', storeId: 'ah-xl', naam: 'Sojadrink', afdeling: 'boodschappen', categorie: 'zuivel', merk: 'Alpro', prijs: 1.99, dieet: ['glutenvrij', 'lactosevrij'], prijsklasse: 'middel', magazijnVoorraad: 42, schapVoorraad: 10, schaplocatie: { label: 'Gang C1', x: 82, y: 25 } },
  { id: 'p-halfvolle-melk', storeId: 'ah-xl', naam: 'Halfvolle melk', afdeling: 'boodschappen', categorie: 'zuivel', merk: 'Boni', prijs: 0.95, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 80, schapVoorraad: 20, schaplocatie: { label: 'Gang C1', x: 82, y: 25 } },

  { id: 'p-koffiebonen', storeId: 'ah-xl', naam: 'Koffiebonen', afdeling: 'boodschappen', categorie: 'koffie', merk: 'Lavazza', prijs: 6.99, dieet: ['glutenvrij'], prijsklasse: 'premium', magazijnVoorraad: 30, schapVoorraad: 6, schaplocatie: { label: 'Gang D3', x: 82, y: 65 } },
  { id: 'p-koffiepads', storeId: 'ah-xl', naam: 'Koffiepads', afdeling: 'boodschappen', categorie: 'koffie', merk: 'Senseo', prijs: 3.49, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 45, schapVoorraad: 9, schaplocatie: { label: 'Gang D3', x: 82, y: 65 } },
  { id: 'p-nespresso-capsules', storeId: 'ah-xl', naam: 'Espresso capsules', afdeling: 'boodschappen', categorie: 'koffie', merk: 'Nespresso', prijs: 4.79, dieet: ['glutenvrij'], prijsklasse: 'premium', magazijnVoorraad: 20, schapVoorraad: 0, schaplocatie: { label: 'Gang D3', x: 82, y: 65 } },
  { id: 'p-oploskoffie', storeId: 'ah-xl', naam: 'Oploskoffie', afdeling: 'boodschappen', categorie: 'koffie', merk: 'Boni', prijs: 2.29, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 50, schapVoorraad: 11, schaplocatie: { label: 'Gang D3', x: 82, y: 65 } },

  { id: 'p-cola-6pack', storeId: 'ah-xl', naam: 'Cola 6-pack', afdeling: 'boodschappen', categorie: 'frisdrank', merk: 'Coca-Cola', prijs: 4.5, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 36, schapVoorraad: 8, schaplocatie: { label: 'Gang E2', x: 50, y: 65 } },
  { id: 'p-chips', storeId: 'ah-xl', naam: 'Chips naturel', afdeling: 'boodschappen', categorie: 'snacks', merk: "Lay's", prijs: 1.79, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 44, schapVoorraad: 12, schaplocatie: { label: 'Gang E1', x: 18, y: 65 } },

  // ---- MediaMarkt (elektronica) ----
  { id: 'p-airpods', storeId: 'mediamarkt', naam: 'AirPods', afdeling: 'elektronica', categorie: 'audio', merk: 'Apple', prijs: 149, dieet: [], prijsklasse: 'premium', magazijnVoorraad: 15, schapVoorraad: 3, schaplocatie: { label: 'Audio', x: 30, y: 40 } },
  { id: 'p-koptelefoon-sony', storeId: 'mediamarkt', naam: 'Draadloze koptelefoon', afdeling: 'elektronica', categorie: 'audio', merk: 'Sony', prijs: 89, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 12, schapVoorraad: 0, schaplocatie: { label: 'Audio', x: 30, y: 40 } },
  { id: 'p-usbc-kabel', storeId: 'mediamarkt', naam: 'USB-C kabel', afdeling: 'elektronica', categorie: 'accessoires', merk: 'Goji', prijs: 9.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 60, schapVoorraad: 15, schaplocatie: { label: 'Accessoires', x: 70, y: 40 } },

  // ---- Decathlon (sport) ----
  { id: 'p-voetbal', storeId: 'decathlon', naam: 'Voetbal', afdeling: 'sport', categorie: 'balsport', merk: 'Kipsta', prijs: 12.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 25, schapVoorraad: 6, schaplocatie: { label: 'Teamsport', x: 40, y: 50 } },
  { id: 'p-proteinereep', storeId: 'decathlon', naam: 'Proteïnereep', afdeling: 'sport', categorie: 'sportvoeding', merk: 'Aptonia', prijs: 1.99, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 40, schapVoorraad: 0, schaplocatie: { label: 'Voeding', x: 60, y: 50 } },

  // ---- HEMA (speelgoed) ----
  { id: 'p-lego-classic', storeId: 'hema', naam: 'Lego Classic doos', afdeling: 'speelgoed', categorie: 'bouwspeelgoed', merk: 'Lego', prijs: 29.99, dieet: [], prijsklasse: 'premium', magazijnVoorraad: 18, schapVoorraad: 4, schaplocatie: { label: 'Speelgoed', x: 50, y: 50 } },
]

export function getProduct(id) {
  return products.find((p) => p.id === id) || null
}

export function productsByStore(storeId) {
  return products.filter((p) => p.storeId === storeId)
}
