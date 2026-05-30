// Producten per winkel. `afdeling` matcht met profielvoorkeuren; `categorie` is fijnmazig
// en wordt gebruikt om alternatieven te zoeken bij lege rekken.
// `magazijnVoorraad` = achter de winkel; `rekkenVoorraad` = op de rekken (live in StoreContext).
// Een paar producten starten met 0 op rekken zodat het alternatieven-scherm iets te tonen heeft.
// `rekkenlocatie` (x, y op een 0-100 raster) voedt de 2D-plattegrond.

export const products = [
  // ---- AH XL Gent (boodschappen) ----
  { id: 'p-glutenvrije-pasta', storeId: 'ah-xl', naam: 'Glutenvrije penne', afdeling: 'boodschappen', categorie: 'pasta', merk: 'Schär', prijs: 2.49, dieet: ['glutenvrij'], prijsklasse: 'premium', magazijnVoorraad: 31, rekkenVoorraad: 7, rekkenlocatie: { label: 'Gang A1', x: 18, y: 25 } },
  { id: 'p-penne-barilla', storeId: 'ah-xl', naam: 'Penne', afdeling: 'boodschappen', categorie: 'pasta', merk: 'Barilla', prijs: 1.2, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 32, rekkenVoorraad: 8, rekkenlocatie: { label: 'Gang A1', x: 18, y: 25 } },
  { id: 'p-spaghetti-boni', storeId: 'ah-xl', naam: 'Spaghetti', afdeling: 'boodschappen', categorie: 'pasta', merk: 'Boni', prijs: 0.65, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 33, rekkenVoorraad: 9, rekkenlocatie: { label: 'Gang A1', x: 18, y: 25 } },
  { id: 'p-lasagnebladen', storeId: 'ah-xl', naam: 'Lasagnebladen', afdeling: 'boodschappen', categorie: 'pasta', merk: 'Barilla', prijs: 1.65, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 34, rekkenVoorraad: 10, rekkenlocatie: { label: 'Gang A1', x: 18, y: 25 } },

  { id: 'p-glutenvrij-brood', storeId: 'ah-xl', naam: 'Glutenvrij brood', afdeling: 'boodschappen', categorie: 'brood', merk: 'Schär', prijs: 3.19, dieet: ['glutenvrij'], prijsklasse: 'premium', doelRekkenVoorraad: 10, magazijnVoorraad: 22, rekkenVoorraad: 0, rekkenlocatie: { label: 'Gang B2', x: 50, y: 25 } },
  { id: 'p-glutenvrij-stokbrood', storeId: 'ah-xl', naam: 'Glutenvrij stokbrood', afdeling: 'boodschappen', categorie: 'brood', merk: 'Schär', prijs: 2.19, dieet: ['glutenvrij'], prijsklasse: 'premium', magazijnVoorraad: 36, rekkenVoorraad: 12, rekkenlocatie: { label: 'Gang B2', x: 50, y: 25 } },
  { id: 'p-volkorenbrood', storeId: 'ah-xl', naam: 'Volkorenbrood', afdeling: 'boodschappen', categorie: 'brood', merk: 'AH', prijs: 1.45, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 37, rekkenVoorraad: 13, rekkenlocatie: { label: 'Gang B2', x: 50, y: 25 } },
  { id: 'p-witbrood', storeId: 'ah-xl', naam: 'Wit brood', afdeling: 'boodschappen', categorie: 'brood', merk: 'Boni', prijs: 0.89, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 38, rekkenVoorraad: 14, rekkenlocatie: { label: 'Gang B2', x: 50, y: 25 } },
  { id: 'p-croissants', storeId: 'ah-xl', naam: 'Croissants 4st', afdeling: 'boodschappen', categorie: 'brood', merk: 'AH', prijs: 1.79, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 39, rekkenVoorraad: 15, rekkenlocatie: { label: 'Gang B2', x: 50, y: 25 } },

  { id: 'p-sojadrink', storeId: 'ah-xl', naam: 'Sojadrink', afdeling: 'boodschappen', categorie: 'zuivel', merk: 'Alpro', prijs: 1.99, dieet: ['glutenvrij', 'lactosevrij'], prijsklasse: 'middel', magazijnVoorraad: 40, rekkenVoorraad: 16, rekkenlocatie: { label: 'Gang C1', x: 82, y: 25 } },
  { id: 'p-halfvolle-melk', storeId: 'ah-xl', naam: 'Halfvolle melk', afdeling: 'boodschappen', categorie: 'zuivel', merk: 'Boni', prijs: 0.95, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 41, rekkenVoorraad: 17, rekkenlocatie: { label: 'Gang C1', x: 82, y: 25 } },
  { id: 'p-yoghurt-natuur', storeId: 'ah-xl', naam: 'Yoghurt natuur', afdeling: 'boodschappen', categorie: 'zuivel', merk: 'Danone', prijs: 1.59, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 42, rekkenVoorraad: 18, rekkenlocatie: { label: 'Gang C1', x: 82, y: 25 } },
  { id: 'p-jonge-kaas', storeId: 'ah-xl', naam: 'Jonge kaas plakken', afdeling: 'boodschappen', categorie: 'zuivel', merk: 'AH', prijs: 2.89, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 43, rekkenVoorraad: 19, rekkenlocatie: { label: 'Gang C1', x: 82, y: 25 } },

  { id: 'p-koffiebonen', storeId: 'ah-xl', naam: 'Koffiebonen', afdeling: 'boodschappen', categorie: 'koffie', merk: 'Lavazza', prijs: 6.99, dieet: ['glutenvrij'], prijsklasse: 'premium', magazijnVoorraad: 44, rekkenVoorraad: 6, rekkenlocatie: { label: 'Gang D3', x: 82, y: 65 } },
  { id: 'p-koffiepads', storeId: 'ah-xl', naam: 'Koffiepads', afdeling: 'boodschappen', categorie: 'koffie', merk: 'Senseo', prijs: 3.49, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 45, rekkenVoorraad: 7, rekkenlocatie: { label: 'Gang D3', x: 82, y: 65 } },
  { id: 'p-nespresso-capsules', storeId: 'ah-xl', naam: 'Espresso capsules', afdeling: 'boodschappen', categorie: 'koffie', merk: 'Nespresso', prijs: 4.79, dieet: ['glutenvrij'], prijsklasse: 'premium', doelRekkenVoorraad: 8, magazijnVoorraad: 0, rekkenVoorraad: 0, rekkenlocatie: { label: 'Gang D3', x: 82, y: 65 } },
  { id: 'p-oploskoffie', storeId: 'ah-xl', naam: 'Oploskoffie', afdeling: 'boodschappen', categorie: 'koffie', merk: 'Boni', prijs: 2.29, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 47, rekkenVoorraad: 9, rekkenlocatie: { label: 'Gang D3', x: 82, y: 65 } },
  { id: 'p-thee-groen', storeId: 'ah-xl', naam: 'Groene thee', afdeling: 'boodschappen', categorie: 'koffie', merk: 'Lipton', prijs: 2.49, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 48, rekkenVoorraad: 10, rekkenlocatie: { label: 'Gang D3', x: 82, y: 65 } },

  { id: 'p-cola-6pack', storeId: 'ah-xl', naam: 'Cola 6-pack', afdeling: 'boodschappen', categorie: 'frisdrank', merk: 'Coca-Cola', prijs: 4.5, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 49, rekkenVoorraad: 11, rekkenlocatie: { label: 'Gang E2', x: 50, y: 65 } },
  { id: 'p-bruiswater', storeId: 'ah-xl', naam: 'Bruiswater 6-pack', afdeling: 'boodschappen', categorie: 'frisdrank', merk: 'Spa', prijs: 3.29, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 50, rekkenVoorraad: 12, rekkenlocatie: { label: 'Gang E2', x: 50, y: 65 } },
  { id: 'p-appelsap', storeId: 'ah-xl', naam: 'Appelsap', afdeling: 'boodschappen', categorie: 'frisdrank', merk: 'Boni', prijs: 1.19, dieet: ['glutenvrij'], prijsklasse: 'budget', magazijnVoorraad: 51, rekkenVoorraad: 13, rekkenlocatie: { label: 'Gang E2', x: 50, y: 65 } },
  { id: 'p-chips', storeId: 'ah-xl', naam: 'Chips naturel', afdeling: 'boodschappen', categorie: 'snacks', merk: "Lay's", prijs: 1.79, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 52, rekkenVoorraad: 14, rekkenlocatie: { label: 'Gang E1', x: 18, y: 65 } },
  { id: 'p-nootjes', storeId: 'ah-xl', naam: 'Gemengde noten', afdeling: 'boodschappen', categorie: 'snacks', merk: 'AH', prijs: 2.59, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 53, rekkenVoorraad: 15, rekkenlocatie: { label: 'Gang E1', x: 18, y: 65 } },
  { id: 'p-chocolade', storeId: 'ah-xl', naam: 'Melkchocolade reep', afdeling: 'boodschappen', categorie: 'snacks', merk: 'Côte d\'Or', prijs: 1.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 54, rekkenVoorraad: 16, rekkenlocatie: { label: 'Gang E1', x: 18, y: 65 } },

  { id: 'p-appels', storeId: 'ah-xl', naam: 'Appels Jonagold 1kg', afdeling: 'boodschappen', categorie: 'fruit', merk: 'AH', prijs: 1.99, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 55, rekkenVoorraad: 17, rekkenlocatie: { label: 'Gang F1', x: 18, y: 45 } },
  { id: 'p-bananen', storeId: 'ah-xl', naam: 'Bananen 1kg', afdeling: 'boodschappen', categorie: 'fruit', merk: 'Chiquita', prijs: 1.69, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 56, rekkenVoorraad: 18, rekkenlocatie: { label: 'Gang F1', x: 18, y: 45 } },
  { id: 'p-tomaten', storeId: 'ah-xl', naam: 'Trostomaten', afdeling: 'boodschappen', categorie: 'groenten', merk: 'Boni', prijs: 1.29, dieet: ['glutenvrij'], prijsklasse: 'budget', magazijnVoorraad: 57, rekkenVoorraad: 19, rekkenlocatie: { label: 'Gang F1', x: 18, y: 45 } },

  { id: 'p-kipfilet', storeId: 'ah-xl', naam: 'Kipfilet 500g', afdeling: 'boodschappen', categorie: 'vlees', merk: 'AH', prijs: 4.49, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 58, rekkenVoorraad: 6, rekkenlocatie: { label: 'Gang F2', x: 50, y: 45 } },
  { id: 'p-gehakt', storeId: 'ah-xl', naam: 'Rundsgehakt 500g', afdeling: 'boodschappen', categorie: 'vlees', merk: 'Boni', prijs: 3.29, dieet: ['glutenvrij'], prijsklasse: 'budget', magazijnVoorraad: 59, rekkenVoorraad: 7, rekkenlocatie: { label: 'Gang F2', x: 50, y: 45 } },
  { id: 'p-zalmfilet', storeId: 'ah-xl', naam: 'Zalmfilet 2st', afdeling: 'boodschappen', categorie: 'vis', merk: 'AH', prijs: 7.99, dieet: ['glutenvrij'], prijsklasse: 'premium', magazijnVoorraad: 20, rekkenVoorraad: 0, rekkenlocatie: { label: 'Gang F2', x: 50, y: 45 } },

  { id: 'p-cornflakes', storeId: 'ah-xl', naam: 'Cornflakes', afdeling: 'boodschappen', categorie: 'ontbijt', merk: "Kellogg's", prijs: 2.79, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 61, rekkenVoorraad: 9, rekkenlocatie: { label: 'Gang F3', x: 82, y: 45 } },
  { id: 'p-muesli-glutenvrij', storeId: 'ah-xl', naam: 'Glutenvrije muesli', afdeling: 'boodschappen', categorie: 'ontbijt', merk: 'Schär', prijs: 3.99, dieet: ['glutenvrij'], prijsklasse: 'premium', magazijnVoorraad: 62, rekkenVoorraad: 10, rekkenlocatie: { label: 'Gang F3', x: 82, y: 45 } },
  { id: 'p-confituur', storeId: 'ah-xl', naam: 'Aardbeienconfituur', afdeling: 'boodschappen', categorie: 'ontbijt', merk: 'Materne', prijs: 2.19, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 63, rekkenVoorraad: 11, rekkenlocatie: { label: 'Gang F3', x: 82, y: 45 } },

  { id: 'p-macaroni', storeId: 'ah-xl', naam: 'Macaroni', afdeling: 'boodschappen', categorie: 'pasta', merk: 'Boni', prijs: 0.79, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 30, rekkenVoorraad: 12, rekkenlocatie: { label: 'Gang A1', x: 18, y: 25 } },
  { id: 'p-rijst', storeId: 'ah-xl', naam: 'Witte rijst 1kg', afdeling: 'boodschappen', categorie: 'pasta', merk: 'AH', prijs: 1.89, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 28, rekkenVoorraad: 11, rekkenlocatie: { label: 'Gang A1', x: 18, y: 25 } },
  { id: 'p-couscous', storeId: 'ah-xl', naam: 'Couscous', afdeling: 'boodschappen', categorie: 'pasta', merk: 'AH', prijs: 1.49, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 24, rekkenVoorraad: 8, rekkenlocatie: { label: 'Gang A1', x: 18, y: 25 } },

  { id: 'p-pistolets', storeId: 'ah-xl', naam: 'Pistolets 6st', afdeling: 'boodschappen', categorie: 'brood', merk: 'AH', prijs: 1.39, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 26, rekkenVoorraad: 10, rekkenlocatie: { label: 'Gang B2', x: 50, y: 25 } },
  { id: 'p-beschuit', storeId: 'ah-xl', naam: 'Beschuit', afdeling: 'boodschappen', categorie: 'brood', merk: 'Boni', prijs: 0.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 27, rekkenVoorraad: 9, rekkenlocatie: { label: 'Gang B2', x: 50, y: 25 } },

  { id: 'p-eieren', storeId: 'ah-xl', naam: 'Eieren 6st', afdeling: 'boodschappen', categorie: 'eieren', merk: 'AH', prijs: 1.79, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 35, rekkenVoorraad: 13, rekkenlocatie: { label: 'Gang C1', x: 82, y: 25 } },
  { id: 'p-boter', storeId: 'ah-xl', naam: 'Roomboter', afdeling: 'boodschappen', categorie: 'zuivel', merk: 'AH', prijs: 2.15, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 29, rekkenVoorraad: 14, rekkenlocatie: { label: 'Gang C1', x: 82, y: 25 } },
  { id: 'p-roomkaas', storeId: 'ah-xl', naam: 'Verse roomkaas', afdeling: 'boodschappen', categorie: 'zuivel', merk: 'AH', prijs: 1.99, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 22, rekkenVoorraad: 0, rekkenlocatie: { label: 'Gang C1', x: 82, y: 25 } },
  { id: 'p-hesp', storeId: 'ah-xl', naam: 'Gekookte hesp', afdeling: 'boodschappen', categorie: 'beleg', merk: 'AH', prijs: 2.49, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 33, rekkenVoorraad: 12, rekkenlocatie: { label: 'Gang C1', x: 82, y: 25 } },
  { id: 'p-salami', storeId: 'ah-xl', naam: 'Salami plakken', afdeling: 'boodschappen', categorie: 'beleg', merk: 'AH', prijs: 2.29, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 34, rekkenVoorraad: 11, rekkenlocatie: { label: 'Gang C1', x: 82, y: 25 } },

  { id: 'p-wortelen', storeId: 'ah-xl', naam: 'Wortelen 1kg', afdeling: 'boodschappen', categorie: 'groenten', merk: 'Boni', prijs: 1.09, dieet: ['glutenvrij'], prijsklasse: 'budget', magazijnVoorraad: 40, rekkenVoorraad: 16, rekkenlocatie: { label: 'Gang F1', x: 18, y: 45 } },
  { id: 'p-aardappelen', storeId: 'ah-xl', naam: 'Aardappelen 2.5kg', afdeling: 'boodschappen', categorie: 'groenten', merk: 'Boni', prijs: 2.49, dieet: ['glutenvrij'], prijsklasse: 'budget', magazijnVoorraad: 42, rekkenVoorraad: 18, rekkenlocatie: { label: 'Gang F1', x: 18, y: 45 } },
  { id: 'p-ui', storeId: 'ah-xl', naam: 'Uien net', afdeling: 'boodschappen', categorie: 'groenten', merk: 'Boni', prijs: 0.99, dieet: ['glutenvrij'], prijsklasse: 'budget', magazijnVoorraad: 44, rekkenVoorraad: 17, rekkenlocatie: { label: 'Gang F1', x: 18, y: 45 } },
  { id: 'p-sinaasappels', storeId: 'ah-xl', naam: 'Sinaasappels 2kg', afdeling: 'boodschappen', categorie: 'fruit', merk: 'AH', prijs: 2.79, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 38, rekkenVoorraad: 15, rekkenlocatie: { label: 'Gang F1', x: 18, y: 45 } },
  { id: 'p-druiven', storeId: 'ah-xl', naam: 'Pitloze druiven', afdeling: 'boodschappen', categorie: 'fruit', merk: 'AH', prijs: 2.99, dieet: ['glutenvrij'], prijsklasse: 'premium', magazijnVoorraad: 18, rekkenVoorraad: 6, rekkenlocatie: { label: 'Gang F1', x: 18, y: 45 } },

  { id: 'p-worst', storeId: 'ah-xl', naam: 'Verse worst 4st', afdeling: 'boodschappen', categorie: 'vlees', merk: 'AH', prijs: 3.49, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 31, rekkenVoorraad: 8, rekkenlocatie: { label: 'Gang F2', x: 50, y: 45 } },
  { id: 'p-tofu', storeId: 'ah-xl', naam: 'Natuur tofu', afdeling: 'boodschappen', categorie: 'vega', merk: 'Alpro', prijs: 2.49, dieet: ['glutenvrij', 'lactosevrij'], prijsklasse: 'middel', magazijnVoorraad: 21, rekkenVoorraad: 7, rekkenlocatie: { label: 'Gang F2', x: 50, y: 45 } },

  { id: 'p-tomatensaus', storeId: 'ah-xl', naam: 'Tomatensaus', afdeling: 'boodschappen', categorie: 'conserven', merk: 'Boni', prijs: 0.89, dieet: ['glutenvrij'], prijsklasse: 'budget', magazijnVoorraad: 50, rekkenVoorraad: 20, rekkenlocatie: { label: 'Gang G2', x: 50, y: 85 } },
  { id: 'p-pesto', storeId: 'ah-xl', naam: 'Groene pesto', afdeling: 'boodschappen', categorie: 'conserven', merk: 'AH', prijs: 1.99, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 32, rekkenVoorraad: 12, rekkenlocatie: { label: 'Gang G2', x: 50, y: 85 } },
  { id: 'p-bonen-blik', storeId: 'ah-xl', naam: 'Witte bonen in blik', afdeling: 'boodschappen', categorie: 'conserven', merk: 'Boni', prijs: 0.79, dieet: ['glutenvrij'], prijsklasse: 'budget', magazijnVoorraad: 48, rekkenVoorraad: 19, rekkenlocatie: { label: 'Gang G2', x: 50, y: 85 } },
  { id: 'p-mais-blik', storeId: 'ah-xl', naam: 'Maïs in blik', afdeling: 'boodschappen', categorie: 'conserven', merk: 'Boni', prijs: 0.85, dieet: ['glutenvrij'], prijsklasse: 'budget', magazijnVoorraad: 46, rekkenVoorraad: 18, rekkenlocatie: { label: 'Gang G2', x: 50, y: 85 } },
  { id: 'p-olijfolie', storeId: 'ah-xl', naam: 'Olijfolie 500ml', afdeling: 'boodschappen', categorie: 'conserven', merk: 'AH', prijs: 4.29, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 27, rekkenVoorraad: 10, rekkenlocatie: { label: 'Gang G2', x: 50, y: 85 } },

  { id: 'p-diepvriespizza', storeId: 'ah-xl', naam: 'Diepvriespizza margherita', afdeling: 'boodschappen', categorie: 'diepvries', merk: 'AH', prijs: 2.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 36, rekkenVoorraad: 13, rekkenlocatie: { label: 'Gang G1', x: 18, y: 85 } },
  { id: 'p-frietjes', storeId: 'ah-xl', naam: 'Diepvriesfrietjes 1kg', afdeling: 'boodschappen', categorie: 'diepvries', merk: 'Boni', prijs: 1.79, dieet: ['glutenvrij'], prijsklasse: 'budget', magazijnVoorraad: 39, rekkenVoorraad: 16, rekkenlocatie: { label: 'Gang G1', x: 18, y: 85 } },
  { id: 'p-diepvriesgroenten', storeId: 'ah-xl', naam: 'Wokgroenten diepvries', afdeling: 'boodschappen', categorie: 'diepvries', merk: 'Boni', prijs: 1.59, dieet: ['glutenvrij'], prijsklasse: 'budget', magazijnVoorraad: 41, rekkenVoorraad: 14, rekkenlocatie: { label: 'Gang G1', x: 18, y: 85 } },
  { id: 'p-roomijs', storeId: 'ah-xl', naam: 'Vanille roomijs', afdeling: 'boodschappen', categorie: 'diepvries', merk: 'AH', prijs: 2.49, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 25, rekkenVoorraad: 0, rekkenlocatie: { label: 'Gang G1', x: 18, y: 85 } },

  { id: 'p-pils', storeId: 'ah-xl', naam: 'Pils 6-pack', afdeling: 'boodschappen', categorie: 'dranken', merk: 'AH', prijs: 3.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 43, rekkenVoorraad: 15, rekkenlocatie: { label: 'Gang E2', x: 50, y: 65 } },
  { id: 'p-rode-wijn', storeId: 'ah-xl', naam: 'Rode wijn', afdeling: 'boodschappen', categorie: 'dranken', merk: 'AH', prijs: 5.49, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 30, rekkenVoorraad: 11, rekkenlocatie: { label: 'Gang E2', x: 50, y: 65 } },

  { id: 'p-afwasmiddel', storeId: 'ah-xl', naam: 'Afwasmiddel', afdeling: 'boodschappen', categorie: 'huishouden', merk: 'AH', prijs: 1.49, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 45, rekkenVoorraad: 17, rekkenlocatie: { label: 'Gang G3', x: 82, y: 85 } },
  { id: 'p-wc-papier', storeId: 'ah-xl', naam: 'Toiletpapier 8 rollen', afdeling: 'boodschappen', categorie: 'huishouden', merk: 'AH', prijs: 3.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 47, rekkenVoorraad: 18, rekkenlocatie: { label: 'Gang G3', x: 82, y: 85 } },
  { id: 'p-keukenrol', storeId: 'ah-xl', naam: 'Keukenrol 2st', afdeling: 'boodschappen', categorie: 'huishouden', merk: 'Boni', prijs: 1.29, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 49, rekkenVoorraad: 19, rekkenlocatie: { label: 'Gang G3', x: 82, y: 85 } },
  { id: 'p-tandpasta', storeId: 'ah-xl', naam: 'Tandpasta', afdeling: 'boodschappen', categorie: 'verzorging', merk: 'AH', prijs: 1.79, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 38, rekkenVoorraad: 14, rekkenlocatie: { label: 'Gang G3', x: 82, y: 85 } },
  { id: 'p-shampoo', storeId: 'ah-xl', naam: 'Shampoo', afdeling: 'boodschappen', categorie: 'verzorging', merk: 'AH', prijs: 2.29, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 35, rekkenVoorraad: 12, rekkenlocatie: { label: 'Gang G3', x: 82, y: 85 } },

  // ---- MediaMarkt Gent (elektronica) ----
  { id: 'p-airpods', storeId: 'mediamarkt', naam: 'AirPods', afdeling: 'elektronica', categorie: 'audio', merk: 'Apple', prijs: 149, dieet: [], prijsklasse: 'premium', magazijnVoorraad: 64, rekkenVoorraad: 12, rekkenlocatie: { label: 'Audio', x: 30, y: 40 } },
  { id: 'p-koptelefoon-sony', storeId: 'mediamarkt', naam: 'Draadloze koptelefoon', afdeling: 'elektronica', categorie: 'audio', merk: 'Sony', prijs: 89, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 25, rekkenVoorraad: 0, rekkenlocatie: { label: 'Audio', x: 30, y: 40 } },
  { id: 'p-bluetooth-speaker', storeId: 'mediamarkt', naam: 'Bluetooth speaker', afdeling: 'elektronica', categorie: 'audio', merk: 'JBL', prijs: 59, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 66, rekkenVoorraad: 14, rekkenlocatie: { label: 'Audio', x: 30, y: 40 } },

  { id: 'p-usbc-kabel', storeId: 'mediamarkt', naam: 'USB-C kabel', afdeling: 'elektronica', categorie: 'accessoires', merk: 'Goji', prijs: 9.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 67, rekkenVoorraad: 15, rekkenlocatie: { label: 'Accessoires', x: 70, y: 40 } },
  { id: 'p-powerbank', storeId: 'mediamarkt', naam: 'Powerbank 20.000mAh', afdeling: 'elektronica', categorie: 'accessoires', merk: 'Goji', prijs: 24.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 68, rekkenVoorraad: 16, rekkenlocatie: { label: 'Accessoires', x: 70, y: 40 } },
  { id: 'p-muis-draadloos', storeId: 'mediamarkt', naam: 'Draadloze muis', afdeling: 'elektronica', categorie: 'accessoires', merk: 'Logitech', prijs: 29.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 69, rekkenVoorraad: 17, rekkenlocatie: { label: 'Accessoires', x: 70, y: 40 } },

  { id: 'p-iphone', storeId: 'mediamarkt', naam: 'iPhone 16', afdeling: 'elektronica', categorie: 'smartphones', merk: 'Apple', prijs: 949, dieet: [], prijsklasse: 'premium', magazijnVoorraad: 70, rekkenVoorraad: 18, rekkenlocatie: { label: 'Smartphones', x: 50, y: 22 } },
  { id: 'p-samsung-galaxy', storeId: 'mediamarkt', naam: 'Galaxy S24', afdeling: 'elektronica', categorie: 'smartphones', merk: 'Samsung', prijs: 699, dieet: [], prijsklasse: 'premium', magazijnVoorraad: 71, rekkenVoorraad: 19, rekkenlocatie: { label: 'Smartphones', x: 50, y: 22 } },

  { id: 'p-laptop-hp', storeId: 'mediamarkt', naam: 'Laptop 15"', afdeling: 'elektronica', categorie: 'computers', merk: 'HP', prijs: 649, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 72, rekkenVoorraad: 6, rekkenlocatie: { label: 'Computers', x: 50, y: 60 } },
  { id: 'p-tablet', storeId: 'mediamarkt', naam: 'Tablet 11"', afdeling: 'elektronica', categorie: 'computers', merk: 'Samsung', prijs: 329, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 73, rekkenVoorraad: 7, rekkenlocatie: { label: 'Computers', x: 50, y: 60 } },

  { id: 'p-tv-lg', storeId: 'mediamarkt', naam: 'TV 55" 4K', afdeling: 'elektronica', categorie: 'tv', merk: 'LG', prijs: 549, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 74, rekkenVoorraad: 8, rekkenlocatie: { label: 'TV & Beeld', x: 25, y: 75 } },
  { id: 'p-soundbar', storeId: 'mediamarkt', naam: 'Soundbar', afdeling: 'elektronica', categorie: 'tv', merk: 'Samsung', prijs: 199, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 35, rekkenVoorraad: 0, rekkenlocatie: { label: 'TV & Beeld', x: 25, y: 75 } },

  { id: 'p-playstation', storeId: 'mediamarkt', naam: 'PlayStation 5', afdeling: 'elektronica', categorie: 'gaming', merk: 'Sony', prijs: 549, dieet: [], prijsklasse: 'premium', magazijnVoorraad: 36, rekkenVoorraad: 0, rekkenlocatie: { label: 'Gaming', x: 75, y: 75 } },
  { id: 'p-controller', storeId: 'mediamarkt', naam: 'Draadloze controller', afdeling: 'elektronica', categorie: 'gaming', merk: 'Sony', prijs: 69, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 77, rekkenVoorraad: 11, rekkenlocatie: { label: 'Gaming', x: 75, y: 75 } },

  { id: 'p-oortjes', storeId: 'mediamarkt', naam: 'Draadloze oortjes', afdeling: 'elektronica', categorie: 'audio', merk: 'Peaq', prijs: 39.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 30, rekkenVoorraad: 13, rekkenlocatie: { label: 'Audio', x: 30, y: 40 } },
  { id: 'p-platenspeler', storeId: 'mediamarkt', naam: 'Platenspeler', afdeling: 'elektronica', categorie: 'audio', merk: 'Peaq', prijs: 99, dieet: [], prijsklasse: 'premium', magazijnVoorraad: 12, rekkenVoorraad: 0, rekkenlocatie: { label: 'Audio', x: 30, y: 40 } },

  { id: 'p-hdmi-kabel', storeId: 'mediamarkt', naam: 'HDMI-kabel 2m', afdeling: 'elektronica', categorie: 'accessoires', merk: 'Goji', prijs: 7.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 60, rekkenVoorraad: 22, rekkenlocatie: { label: 'Accessoires', x: 70, y: 40 } },
  { id: 'p-oplader', storeId: 'mediamarkt', naam: 'USB-snellader', afdeling: 'elektronica', categorie: 'accessoires', merk: 'Goji', prijs: 14.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 55, rekkenVoorraad: 20, rekkenlocatie: { label: 'Accessoires', x: 70, y: 40 } },
  { id: 'p-telefoonhoesje', storeId: 'mediamarkt', naam: 'Telefoonhoesje', afdeling: 'elektronica', categorie: 'accessoires', merk: 'ISY', prijs: 12.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 48, rekkenVoorraad: 18, rekkenlocatie: { label: 'Accessoires', x: 70, y: 40 } },
  { id: 'p-laptoptas', storeId: 'mediamarkt', naam: 'Laptoptas 15"', afdeling: 'elektronica', categorie: 'accessoires', merk: 'ISY', prijs: 19.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 33, rekkenVoorraad: 12, rekkenlocatie: { label: 'Accessoires', x: 70, y: 40 } },

  { id: 'p-usb-stick', storeId: 'mediamarkt', naam: 'USB-stick 64GB', afdeling: 'elektronica', categorie: 'opslag', merk: 'Goji', prijs: 9.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 50, rekkenVoorraad: 19, rekkenlocatie: { label: 'Accessoires', x: 70, y: 40 } },
  { id: 'p-externe-schijf', storeId: 'mediamarkt', naam: 'Externe harde schijf 1TB', afdeling: 'elektronica', categorie: 'opslag', merk: 'Goji', prijs: 59, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 28, rekkenVoorraad: 9, rekkenlocatie: { label: 'Accessoires', x: 70, y: 40 } },
  { id: 'p-sd-kaart', storeId: 'mediamarkt', naam: 'Geheugenkaart 128GB', afdeling: 'elektronica', categorie: 'opslag', merk: 'Goji', prijs: 19.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 40, rekkenVoorraad: 15, rekkenlocatie: { label: 'Accessoires', x: 70, y: 40 } },

  { id: 'p-toetsenbord', storeId: 'mediamarkt', naam: 'Draadloos toetsenbord', afdeling: 'elektronica', categorie: 'computers', merk: 'Goji', prijs: 24.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 32, rekkenVoorraad: 11, rekkenlocatie: { label: 'Computers', x: 50, y: 60 } },
  { id: 'p-monitor', storeId: 'mediamarkt', naam: 'Monitor 27"', afdeling: 'elektronica', categorie: 'computers', merk: 'Peaq', prijs: 159, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 18, rekkenVoorraad: 6, rekkenlocatie: { label: 'Computers', x: 50, y: 60 } },
  { id: 'p-webcam', storeId: 'mediamarkt', naam: 'Webcam HD', afdeling: 'elektronica', categorie: 'computers', merk: 'ISY', prijs: 34.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 22, rekkenVoorraad: 8, rekkenlocatie: { label: 'Computers', x: 50, y: 60 } },

  { id: 'p-streaming-stick', storeId: 'mediamarkt', naam: 'Streaming-stick 4K', afdeling: 'elektronica', categorie: 'tv', merk: 'Peaq', prijs: 49, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 30, rekkenVoorraad: 12, rekkenlocatie: { label: 'TV & Beeld', x: 25, y: 75 } },

  { id: 'p-smartwatch', storeId: 'mediamarkt', naam: 'Smartwatch', afdeling: 'elektronica', categorie: 'wearables', merk: 'Peaq', prijs: 129, dieet: [], prijsklasse: 'premium', magazijnVoorraad: 20, rekkenVoorraad: 8, rekkenlocatie: { label: 'Wearables', x: 70, y: 22 } },
  { id: 'p-fitnesstracker', storeId: 'mediamarkt', naam: 'Fitnesstracker', afdeling: 'elektronica', categorie: 'wearables', merk: 'Peaq', prijs: 49, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 26, rekkenVoorraad: 10, rekkenlocatie: { label: 'Wearables', x: 70, y: 22 } },

  { id: 'p-actiecamera', storeId: 'mediamarkt', naam: 'Actiecamera', afdeling: 'elektronica', categorie: 'foto', merk: 'Peaq', prijs: 119, dieet: [], prijsklasse: 'premium', magazijnVoorraad: 14, rekkenVoorraad: 0, rekkenlocatie: { label: 'Foto', x: 30, y: 22 } },
  { id: 'p-digitale-camera', storeId: 'mediamarkt', naam: 'Digitale compactcamera', afdeling: 'elektronica', categorie: 'foto', merk: 'Peaq', prijs: 199, dieet: [], prijsklasse: 'premium', magazijnVoorraad: 11, rekkenVoorraad: 5, rekkenlocatie: { label: 'Foto', x: 30, y: 22 } },

  { id: 'p-slimme-lamp', storeId: 'mediamarkt', naam: 'Slimme lamp', afdeling: 'elektronica', categorie: 'smart home', merk: 'Peaq', prijs: 19.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 34, rekkenVoorraad: 13, rekkenlocatie: { label: 'Smart home', x: 50, y: 40 } },
  { id: 'p-slimme-stekker', storeId: 'mediamarkt', naam: 'Slimme stekker', afdeling: 'elektronica', categorie: 'smart home', merk: 'Peaq', prijs: 14.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 36, rekkenVoorraad: 14, rekkenlocatie: { label: 'Smart home', x: 50, y: 40 } },
  { id: 'p-robotstofzuiger', storeId: 'mediamarkt', naam: 'Robotstofzuiger', afdeling: 'elektronica', categorie: 'smart home', merk: 'ok.', prijs: 179, dieet: [], prijsklasse: 'premium', magazijnVoorraad: 10, rekkenVoorraad: 4, rekkenlocatie: { label: 'Smart home', x: 50, y: 40 } },

  { id: 'p-koffiezet', storeId: 'mediamarkt', naam: 'Koffiezetapparaat', afdeling: 'elektronica', categorie: 'klein huishoud', merk: 'ok.', prijs: 39.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 24, rekkenVoorraad: 9, rekkenlocatie: { label: 'Klein huishoud', x: 75, y: 55 } },
  { id: 'p-airfryer', storeId: 'mediamarkt', naam: 'Airfryer', afdeling: 'elektronica', categorie: 'klein huishoud', merk: 'ok.', prijs: 69, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 21, rekkenVoorraad: 8, rekkenlocatie: { label: 'Klein huishoud', x: 75, y: 55 } },
  { id: 'p-blender', storeId: 'mediamarkt', naam: 'Blender', afdeling: 'elektronica', categorie: 'klein huishoud', merk: 'ok.', prijs: 29.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 19, rekkenVoorraad: 7, rekkenlocatie: { label: 'Klein huishoud', x: 75, y: 55 } },
  { id: 'p-waterkoker', storeId: 'mediamarkt', naam: 'Waterkoker', afdeling: 'elektronica', categorie: 'klein huishoud', merk: 'ok.', prijs: 19.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 27, rekkenVoorraad: 11, rekkenlocatie: { label: 'Klein huishoud', x: 75, y: 55 } },
  { id: 'p-stofzuiger', storeId: 'mediamarkt', naam: 'Steelstofzuiger', afdeling: 'elektronica', categorie: 'klein huishoud', merk: 'ok.', prijs: 89, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 16, rekkenVoorraad: 6, rekkenlocatie: { label: 'Klein huishoud', x: 75, y: 55 } },

  { id: 'p-magnetron', storeId: 'mediamarkt', naam: 'Magnetron', afdeling: 'elektronica', categorie: 'witgoed', merk: 'ok.', prijs: 79, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 13, rekkenVoorraad: 5, rekkenlocatie: { label: 'Witgoed', x: 20, y: 55 } },
  { id: 'p-wasmachine', storeId: 'mediamarkt', naam: 'Wasmachine 7kg', afdeling: 'elektronica', categorie: 'witgoed', merk: 'ok.', prijs: 349, dieet: [], prijsklasse: 'premium', magazijnVoorraad: 8, rekkenVoorraad: 3, rekkenlocatie: { label: 'Witgoed', x: 20, y: 55 } },
  { id: 'p-koelkast', storeId: 'mediamarkt', naam: 'Koelkast', afdeling: 'elektronica', categorie: 'witgoed', merk: 'ok.', prijs: 299, dieet: [], prijsklasse: 'premium', magazijnVoorraad: 7, rekkenVoorraad: 0, rekkenlocatie: { label: 'Witgoed', x: 20, y: 55 } },

  // ---- Decathlon Gent (sport) ----
  { id: 'p-voetbal', storeId: 'decathlon', naam: 'Voetbal', afdeling: 'sport', categorie: 'balsport', merk: 'Kipsta', prijs: 12.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 78, rekkenVoorraad: 12, rekkenlocatie: { label: 'Teamsport', x: 40, y: 22 } },
  { id: 'p-basketbal', storeId: 'decathlon', naam: 'Basketbal', afdeling: 'sport', categorie: 'balsport', merk: 'Tarmak', prijs: 14.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 79, rekkenVoorraad: 13, rekkenlocatie: { label: 'Teamsport', x: 40, y: 22 } },

  { id: 'p-proteinereep', storeId: 'decathlon', naam: 'Proteïnereep', afdeling: 'sport', categorie: 'sportvoeding', merk: 'Aptonia', prijs: 1.99, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 15, rekkenVoorraad: 0, rekkenlocatie: { label: 'Voeding', x: 75, y: 35 } },
  { id: 'p-isodrank', storeId: 'decathlon', naam: 'Isotone sportdrank', afdeling: 'sport', categorie: 'sportvoeding', merk: 'Aptonia', prijs: 2.49, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 31, rekkenVoorraad: 15, rekkenlocatie: { label: 'Voeding', x: 75, y: 35 } },
  { id: 'p-drinkbus', storeId: 'decathlon', naam: 'Drinkbus 750ml', afdeling: 'sport', categorie: 'accessoires', merk: 'Kipsta', prijs: 4.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 32, rekkenVoorraad: 16, rekkenlocatie: { label: 'Voeding', x: 75, y: 35 } },

  { id: 'p-loopschoenen', storeId: 'decathlon', naam: 'Loopschoenen', afdeling: 'sport', categorie: 'schoenen', merk: 'Kalenji', prijs: 39.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 33, rekkenVoorraad: 17, rekkenlocatie: { label: 'Schoenen', x: 25, y: 50 } },
  { id: 'p-wandelschoenen', storeId: 'decathlon', naam: 'Wandelschoenen', afdeling: 'sport', categorie: 'schoenen', merk: 'Quechua', prijs: 49.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 34, rekkenVoorraad: 18, rekkenlocatie: { label: 'Schoenen', x: 25, y: 50 } },

  { id: 'p-sportshirt', storeId: 'decathlon', naam: 'Sport T-shirt', afdeling: 'sport', categorie: 'kleding', merk: 'Domyos', prijs: 7.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 35, rekkenVoorraad: 19, rekkenlocatie: { label: 'Kleding', x: 60, y: 50 } },
  { id: 'p-sportbroek', storeId: 'decathlon', naam: 'Trainingsbroek', afdeling: 'sport', categorie: 'kleding', merk: 'Domyos', prijs: 14.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 36, rekkenVoorraad: 6, rekkenlocatie: { label: 'Kleding', x: 60, y: 50 } },

  { id: 'p-yogamat', storeId: 'decathlon', naam: 'Yogamat', afdeling: 'sport', categorie: 'fitness', merk: 'Domyos', prijs: 19.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 37, rekkenVoorraad: 7, rekkenlocatie: { label: 'Fitness', x: 40, y: 75 } },
  { id: 'p-dumbells', storeId: 'decathlon', naam: 'Dumbells 2x5kg', afdeling: 'sport', categorie: 'fitness', merk: 'Domyos', prijs: 24.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 23, rekkenVoorraad: 0, rekkenlocatie: { label: 'Fitness', x: 40, y: 75 } },
  { id: 'p-fietshelm', storeId: 'decathlon', naam: 'Fietshelm', afdeling: 'sport', categorie: 'fietsen', merk: 'Btwin', prijs: 29.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 39, rekkenVoorraad: 9, rekkenlocatie: { label: 'Fietsen', x: 75, y: 75 } },

  { id: 'p-volleybal', storeId: 'decathlon', naam: 'Volleybal', afdeling: 'sport', categorie: 'balsport', merk: 'Kipsta', prijs: 11.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 30, rekkenVoorraad: 11, rekkenlocatie: { label: 'Teamsport', x: 40, y: 22 } },
  { id: 'p-handbal', storeId: 'decathlon', naam: 'Handbal', afdeling: 'sport', categorie: 'balsport', merk: 'Kipsta', prijs: 9.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 26, rekkenVoorraad: 9, rekkenlocatie: { label: 'Teamsport', x: 40, y: 22 } },

  { id: 'p-tennisracket', storeId: 'decathlon', naam: 'Tennisracket', afdeling: 'sport', categorie: 'racketsport', merk: 'Artengo', prijs: 24.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 18, rekkenVoorraad: 7, rekkenlocatie: { label: 'Racketsport', x: 60, y: 22 } },
  { id: 'p-badmintonset', storeId: 'decathlon', naam: 'Badmintonset', afdeling: 'sport', categorie: 'racketsport', merk: 'Artengo', prijs: 14.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 22, rekkenVoorraad: 8, rekkenlocatie: { label: 'Racketsport', x: 60, y: 22 } },
  { id: 'p-pingpongbat', storeId: 'decathlon', naam: 'Tafeltennisbat', afdeling: 'sport', categorie: 'racketsport', merk: 'Artengo', prijs: 7.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 28, rekkenVoorraad: 0, rekkenlocatie: { label: 'Racketsport', x: 60, y: 22 } },

  { id: 'p-zwembril', storeId: 'decathlon', naam: 'Zwembril', afdeling: 'sport', categorie: 'zwemmen', merk: 'Nabaiji', prijs: 6.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 34, rekkenVoorraad: 14, rekkenlocatie: { label: 'Zwemmen', x: 25, y: 22 } },
  { id: 'p-zwembroek', storeId: 'decathlon', naam: 'Zwembroek', afdeling: 'sport', categorie: 'zwemmen', merk: 'Nabaiji', prijs: 9.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 30, rekkenVoorraad: 12, rekkenlocatie: { label: 'Zwemmen', x: 25, y: 22 } },
  { id: 'p-badmuts', storeId: 'decathlon', naam: 'Badmuts', afdeling: 'sport', categorie: 'zwemmen', merk: 'Nabaiji', prijs: 3.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 32, rekkenVoorraad: 13, rekkenlocatie: { label: 'Zwemmen', x: 25, y: 22 } },

  { id: 'p-voetbalschoenen', storeId: 'decathlon', naam: 'Voetbalschoenen', afdeling: 'sport', categorie: 'schoenen', merk: 'Kipsta', prijs: 34.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 20, rekkenVoorraad: 6, rekkenlocatie: { label: 'Schoenen', x: 25, y: 50 } },
  { id: 'p-sandalen', storeId: 'decathlon', naam: 'Outdoor sandalen', afdeling: 'sport', categorie: 'schoenen', merk: 'Quechua', prijs: 19.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 24, rekkenVoorraad: 9, rekkenlocatie: { label: 'Schoenen', x: 25, y: 50 } },

  { id: 'p-sportsokken', storeId: 'decathlon', naam: 'Sportsokken 3-pack', afdeling: 'sport', categorie: 'kleding', merk: 'Domyos', prijs: 5.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 40, rekkenVoorraad: 16, rekkenlocatie: { label: 'Kleding', x: 60, y: 50 } },
  { id: 'p-regenjas', storeId: 'decathlon', naam: 'Regenjas', afdeling: 'sport', categorie: 'kleding', merk: 'Quechua', prijs: 24.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 22, rekkenVoorraad: 8, rekkenlocatie: { label: 'Kleding', x: 60, y: 50 } },
  { id: 'p-fleece', storeId: 'decathlon', naam: 'Fleece trui', afdeling: 'sport', categorie: 'kleding', merk: 'Quechua', prijs: 12.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 27, rekkenVoorraad: 10, rekkenlocatie: { label: 'Kleding', x: 60, y: 50 } },

  { id: 'p-weerstandsband', storeId: 'decathlon', naam: 'Weerstandsband', afdeling: 'sport', categorie: 'fitness', merk: 'Domyos', prijs: 7.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 35, rekkenVoorraad: 14, rekkenlocatie: { label: 'Fitness', x: 40, y: 75 } },
  { id: 'p-springtouw', storeId: 'decathlon', naam: 'Springtouw', afdeling: 'sport', categorie: 'fitness', merk: 'Domyos', prijs: 5.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 33, rekkenVoorraad: 13, rekkenlocatie: { label: 'Fitness', x: 40, y: 75 } },
  { id: 'p-kettlebell', storeId: 'decathlon', naam: 'Kettlebell 8kg', afdeling: 'sport', categorie: 'fitness', merk: 'Domyos', prijs: 19.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 16, rekkenVoorraad: 0, rekkenlocatie: { label: 'Fitness', x: 40, y: 75 } },

  { id: 'p-fietsslot', storeId: 'decathlon', naam: 'Fietsslot', afdeling: 'sport', categorie: 'fietsen', merk: 'Btwin', prijs: 14.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 28, rekkenVoorraad: 11, rekkenlocatie: { label: 'Fietsen', x: 75, y: 75 } },
  { id: 'p-fietspomp', storeId: 'decathlon', naam: 'Fietspomp', afdeling: 'sport', categorie: 'fietsen', merk: 'Btwin', prijs: 9.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 30, rekkenVoorraad: 12, rekkenlocatie: { label: 'Fietsen', x: 75, y: 75 } },
  { id: 'p-fietslicht', storeId: 'decathlon', naam: 'Fietslichtset', afdeling: 'sport', categorie: 'fietsen', merk: 'Btwin', prijs: 12.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 26, rekkenVoorraad: 10, rekkenlocatie: { label: 'Fietsen', x: 75, y: 75 } },

  { id: 'p-tent', storeId: 'decathlon', naam: 'Koepeltent 2-persoons', afdeling: 'sport', categorie: 'outdoor', merk: 'Quechua', prijs: 49.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 14, rekkenVoorraad: 5, rekkenlocatie: { label: 'Outdoor', x: 75, y: 55 } },
  { id: 'p-slaapzak', storeId: 'decathlon', naam: 'Slaapzak', afdeling: 'sport', categorie: 'outdoor', merk: 'Quechua', prijs: 24.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 18, rekkenVoorraad: 7, rekkenlocatie: { label: 'Outdoor', x: 75, y: 55 } },
  { id: 'p-rugzak', storeId: 'decathlon', naam: 'Wandelrugzak 30L', afdeling: 'sport', categorie: 'outdoor', merk: 'Quechua', prijs: 29.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 20, rekkenVoorraad: 8, rekkenlocatie: { label: 'Outdoor', x: 75, y: 55 } },
  { id: 'p-hoofdlamp', storeId: 'decathlon', naam: 'Hoofdlamp', afdeling: 'sport', categorie: 'outdoor', merk: 'Forclaz', prijs: 12.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 24, rekkenVoorraad: 9, rekkenlocatie: { label: 'Outdoor', x: 75, y: 55 } },

  { id: 'p-eiwitshake', storeId: 'decathlon', naam: 'Eiwitshake poeder', afdeling: 'sport', categorie: 'sportvoeding', merk: 'Aptonia', prijs: 14.99, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 22, rekkenVoorraad: 8, rekkenlocatie: { label: 'Voeding', x: 75, y: 35 } },
  { id: 'p-energiereep', storeId: 'decathlon', naam: 'Energiereep', afdeling: 'sport', categorie: 'sportvoeding', merk: 'Aptonia', prijs: 1.49, dieet: ['glutenvrij'], prijsklasse: 'budget', magazijnVoorraad: 40, rekkenVoorraad: 15, rekkenlocatie: { label: 'Voeding', x: 75, y: 35 } },

  // ---- HEMA Veldstraat (speelgoed) ----
  { id: 'p-lego-classic', storeId: 'hema', naam: 'Lego Classic doos', afdeling: 'speelgoed', categorie: 'bouwspeelgoed', merk: 'Lego', prijs: 29.99, dieet: [], prijsklasse: 'premium', magazijnVoorraad: 40, rekkenVoorraad: 10, rekkenlocatie: { label: 'Speelgoed', x: 35, y: 35 } },
  { id: 'p-houten-blokken', storeId: 'hema', naam: 'Houten blokken', afdeling: 'speelgoed', categorie: 'bouwspeelgoed', merk: 'HEMA', prijs: 12.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 41, rekkenVoorraad: 11, rekkenlocatie: { label: 'Speelgoed', x: 35, y: 35 } },
  { id: 'p-knuffelbeer', storeId: 'hema', naam: 'Knuffelbeer', afdeling: 'speelgoed', categorie: 'knuffels', merk: 'HEMA', prijs: 9.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 42, rekkenVoorraad: 12, rekkenlocatie: { label: 'Speelgoed', x: 35, y: 35 } },

  { id: 'p-puzzel-1000', storeId: 'hema', naam: 'Puzzel 1000 stukjes', afdeling: 'speelgoed', categorie: 'spellen', merk: 'HEMA', prijs: 8.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 28, rekkenVoorraad: 0, rekkenlocatie: { label: 'Spellen', x: 70, y: 35 } },
  { id: 'p-gezelschapsspel', storeId: 'hema', naam: 'Gezelschapsspel', afdeling: 'speelgoed', categorie: 'spellen', merk: 'HEMA', prijs: 14.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 44, rekkenVoorraad: 14, rekkenlocatie: { label: 'Spellen', x: 70, y: 35 } },
  { id: 'p-kaartspel', storeId: 'hema', naam: 'Kaartspel', afdeling: 'speelgoed', categorie: 'spellen', merk: 'HEMA', prijs: 2.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 45, rekkenVoorraad: 15, rekkenlocatie: { label: 'Spellen', x: 70, y: 35 } },

  { id: 'p-tekenset', storeId: 'hema', naam: 'Tekenset 24-delig', afdeling: 'speelgoed', categorie: 'hobby', merk: 'HEMA', prijs: 6.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 46, rekkenVoorraad: 16, rekkenlocatie: { label: 'Hobby', x: 50, y: 70 } },
  { id: 'p-klei', storeId: 'hema', naam: 'Boetseerklei set', afdeling: 'speelgoed', categorie: 'hobby', merk: 'HEMA', prijs: 5.49, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 47, rekkenVoorraad: 17, rekkenlocatie: { label: 'Hobby', x: 50, y: 70 } },

  { id: 'p-treinset', storeId: 'hema', naam: 'Houten treinset', afdeling: 'speelgoed', categorie: 'bouwspeelgoed', merk: 'HEMA', prijs: 19.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 22, rekkenVoorraad: 9, rekkenlocatie: { label: 'Speelgoed', x: 35, y: 35 } },
  { id: 'p-speelgoedauto', storeId: 'hema', naam: 'Speelgoedauto', afdeling: 'speelgoed', categorie: 'voertuigen', merk: 'HEMA', prijs: 4.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 40, rekkenVoorraad: 16, rekkenlocatie: { label: 'Speelgoed', x: 35, y: 35 } },
  { id: 'p-knuffelkonijn', storeId: 'hema', naam: 'Knuffelkonijn', afdeling: 'speelgoed', categorie: 'knuffels', merk: 'HEMA', prijs: 8.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 30, rekkenVoorraad: 12, rekkenlocatie: { label: 'Speelgoed', x: 35, y: 35 } },
  { id: 'p-poppenhuis', storeId: 'hema', naam: 'Poppenhuis-set', afdeling: 'speelgoed', categorie: 'bouwspeelgoed', merk: 'HEMA', prijs: 24.99, dieet: [], prijsklasse: 'premium', magazijnVoorraad: 12, rekkenVoorraad: 0, rekkenlocatie: { label: 'Speelgoed', x: 35, y: 35 } },

  { id: 'p-dobbelspel', storeId: 'hema', naam: 'Dobbelspel', afdeling: 'speelgoed', categorie: 'spellen', merk: 'HEMA', prijs: 6.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 34, rekkenVoorraad: 13, rekkenlocatie: { label: 'Spellen', x: 70, y: 35 } },
  { id: 'p-memospel', storeId: 'hema', naam: 'Memospel', afdeling: 'speelgoed', categorie: 'spellen', merk: 'HEMA', prijs: 5.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 32, rekkenVoorraad: 12, rekkenlocatie: { label: 'Spellen', x: 70, y: 35 } },
  { id: 'p-domino', storeId: 'hema', naam: 'Dominospel', afdeling: 'speelgoed', categorie: 'spellen', merk: 'HEMA', prijs: 7.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 28, rekkenVoorraad: 11, rekkenlocatie: { label: 'Spellen', x: 70, y: 35 } },

  { id: 'p-verfset', storeId: 'hema', naam: 'Verfset met penselen', afdeling: 'speelgoed', categorie: 'hobby', merk: 'HEMA', prijs: 9.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 26, rekkenVoorraad: 10, rekkenlocatie: { label: 'Hobby', x: 50, y: 70 } },
  { id: 'p-kralen-set', storeId: 'hema', naam: 'Kralen-set', afdeling: 'speelgoed', categorie: 'hobby', merk: 'HEMA', prijs: 6.49, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 30, rekkenVoorraad: 12, rekkenlocatie: { label: 'Hobby', x: 50, y: 70 } },
  { id: 'p-stickervellen', storeId: 'hema', naam: 'Stickervellen', afdeling: 'speelgoed', categorie: 'hobby', merk: 'HEMA', prijs: 2.49, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 45, rekkenVoorraad: 17, rekkenlocatie: { label: 'Hobby', x: 50, y: 70 } },

  { id: 'p-balpennen', storeId: 'hema', naam: 'Balpennen 4st', afdeling: 'speelgoed', categorie: 'schrijfwaren', merk: 'HEMA', prijs: 2.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 50, rekkenVoorraad: 20, rekkenlocatie: { label: 'Schrijfwaren', x: 50, y: 35 } },
  { id: 'p-notitieboek', storeId: 'hema', naam: 'Notitieboek A5', afdeling: 'speelgoed', categorie: 'schrijfwaren', merk: 'HEMA', prijs: 3.49, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 42, rekkenVoorraad: 16, rekkenlocatie: { label: 'Schrijfwaren', x: 50, y: 35 } },
  { id: 'p-markeerstiften', storeId: 'hema', naam: 'Markeerstiften 4st', afdeling: 'speelgoed', categorie: 'schrijfwaren', merk: 'HEMA', prijs: 3.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 38, rekkenVoorraad: 15, rekkenlocatie: { label: 'Schrijfwaren', x: 50, y: 35 } },

  { id: 'p-bellenblaas', storeId: 'hema', naam: 'Bellenblaas', afdeling: 'speelgoed', categorie: 'buitenspeelgoed', merk: 'HEMA', prijs: 1.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 48, rekkenVoorraad: 18, rekkenlocatie: { label: 'Buiten', x: 20, y: 55 } },
  { id: 'p-emmer-schepje', storeId: 'hema', naam: 'Emmer & schepje', afdeling: 'speelgoed', categorie: 'buitenspeelgoed', merk: 'HEMA', prijs: 3.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 36, rekkenVoorraad: 14, rekkenlocatie: { label: 'Buiten', x: 20, y: 55 } },
  { id: 'p-vlieger', storeId: 'hema', naam: 'Vlieger', afdeling: 'speelgoed', categorie: 'buitenspeelgoed', merk: 'HEMA', prijs: 6.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 24, rekkenVoorraad: 0, rekkenlocatie: { label: 'Buiten', x: 20, y: 55 } },

  { id: 'p-verjaardagskaarsjes', storeId: 'hema', naam: 'Verjaardagskaarsjes', afdeling: 'speelgoed', categorie: 'feest', merk: 'HEMA', prijs: 1.49, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 52, rekkenVoorraad: 21, rekkenlocatie: { label: 'Feest & wonen', x: 70, y: 70 } },
  { id: 'p-slingers', storeId: 'hema', naam: 'Feestslingers', afdeling: 'speelgoed', categorie: 'feest', merk: 'HEMA', prijs: 2.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 44, rekkenVoorraad: 17, rekkenlocatie: { label: 'Feest & wonen', x: 70, y: 70 } },
  { id: 'p-wegwerpbordjes', storeId: 'hema', naam: 'Wegwerpbordjes 10st', afdeling: 'speelgoed', categorie: 'feest', merk: 'HEMA', prijs: 2.49, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 46, rekkenVoorraad: 18, rekkenlocatie: { label: 'Feest & wonen', x: 70, y: 70 } },
  { id: 'p-geurkaars', storeId: 'hema', naam: 'Geurkaars', afdeling: 'speelgoed', categorie: 'wonen', merk: 'HEMA', prijs: 4.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 28, rekkenVoorraad: 11, rekkenlocatie: { label: 'Feest & wonen', x: 70, y: 70 } },

  // ---- Delhaize Sint-Pieters (boodschappen) ----
  // doelRekkenVoorraad = normale rekkenbezetting; demo-mix: uit / lege rekken / op rekken zonder magazijn / bijna op / veel
  { id: 'p-dh-spaghetti', storeId: 'delhaize', naam: 'Spaghetti', afdeling: 'boodschappen', categorie: 'pasta', merk: 'Delhaize', prijs: 1.09, dieet: [], prijsklasse: 'middel', doelRekkenVoorraad: 12, magazijnVoorraad: 45, rekkenVoorraad: 11, rekkenlocatie: { label: 'Gang 1', x: 20, y: 25 } },
  { id: 'p-dh-penne-365', storeId: 'delhaize', naam: 'Penne', afdeling: 'boodschappen', categorie: 'pasta', merk: 'Delhaize 365', prijs: 0.69, dieet: [], prijsklasse: 'budget', doelRekkenVoorraad: 12, magazijnVoorraad: 38, rekkenVoorraad: 10, rekkenlocatie: { label: 'Gang 1', x: 20, y: 25 } },
  { id: 'p-dh-glutenvrije-pasta', storeId: 'delhaize', naam: 'Glutenvrije fusilli', afdeling: 'boodschappen', categorie: 'pasta', merk: 'Schär', prijs: 2.59, dieet: ['glutenvrij'], prijsklasse: 'premium', doelRekkenVoorraad: 10, magazijnVoorraad: 28, rekkenVoorraad: 4, rekkenlocatie: { label: 'Gang 1', x: 20, y: 25 } },

  { id: 'p-dh-volkorenbrood', storeId: 'delhaize', naam: 'Volkorenbrood', afdeling: 'boodschappen', categorie: 'brood', merk: 'Delhaize', prijs: 1.59, dieet: [], prijsklasse: 'middel', doelRekkenVoorraad: 10, magazijnVoorraad: 32, rekkenVoorraad: 9, rekkenlocatie: { label: 'Gang 2', x: 50, y: 25 } },
  { id: 'p-dh-glutenvrij-brood', storeId: 'delhaize', naam: 'Glutenvrij brood', afdeling: 'boodschappen', categorie: 'brood', merk: 'Schär', prijs: 3.29, dieet: ['glutenvrij'], prijsklasse: 'premium', doelRekkenVoorraad: 10, magazijnVoorraad: 24, rekkenVoorraad: 0, rekkenlocatie: { label: 'Gang 2', x: 50, y: 25 } },
  { id: 'p-dh-witbrood', storeId: 'delhaize', naam: 'Wit brood', afdeling: 'boodschappen', categorie: 'brood', merk: 'Delhaize 365', prijs: 0.95, dieet: [], prijsklasse: 'budget', doelRekkenVoorraad: 10, magazijnVoorraad: 30, rekkenVoorraad: 3, rekkenlocatie: { label: 'Gang 2', x: 50, y: 25 } },

  { id: 'p-dh-melk', storeId: 'delhaize', naam: 'Halfvolle melk', afdeling: 'boodschappen', categorie: 'zuivel', merk: 'Delhaize', prijs: 1.05, dieet: [], prijsklasse: 'budget', doelRekkenVoorraad: 15, magazijnVoorraad: 55, rekkenVoorraad: 14, rekkenlocatie: { label: 'Gang 3', x: 80, y: 25 } },
  { id: 'p-dh-sojadrink', storeId: 'delhaize', naam: 'Sojadrink', afdeling: 'boodschappen', categorie: 'zuivel', merk: 'Alpro', prijs: 2.09, dieet: ['glutenvrij', 'lactosevrij'], prijsklasse: 'middel', doelRekkenVoorraad: 10, magazijnVoorraad: 22, rekkenVoorraad: 5, rekkenlocatie: { label: 'Gang 3', x: 80, y: 25 } },
  { id: 'p-dh-yoghurt', storeId: 'delhaize', naam: 'Griekse yoghurt', afdeling: 'boodschappen', categorie: 'zuivel', merk: 'Delhaize', prijs: 1.79, dieet: [], prijsklasse: 'middel', doelRekkenVoorraad: 8, magazijnVoorraad: 26, rekkenVoorraad: 7, rekkenlocatie: { label: 'Gang 3', x: 80, y: 25 } },

  { id: 'p-dh-koffie', storeId: 'delhaize', naam: 'Gemalen koffie', afdeling: 'boodschappen', categorie: 'koffie', merk: 'Douwe Egberts', prijs: 4.99, dieet: ['glutenvrij'], prijsklasse: 'middel', doelRekkenVoorraad: 10, magazijnVoorraad: 20, rekkenVoorraad: 2, rekkenlocatie: { label: 'Gang 4', x: 80, y: 65 } },
  { id: 'p-dh-koffiebonen', storeId: 'delhaize', naam: 'Koffiebonen', afdeling: 'boodschappen', categorie: 'koffie', merk: 'Lavazza', prijs: 7.29, dieet: ['glutenvrij'], prijsklasse: 'premium', doelRekkenVoorraad: 8, magazijnVoorraad: 18, rekkenVoorraad: 6, rekkenlocatie: { label: 'Gang 4', x: 80, y: 65 } },

  { id: 'p-dh-appels', storeId: 'delhaize', naam: 'Appels 1kg', afdeling: 'boodschappen', categorie: 'fruit', merk: 'Delhaize', prijs: 2.19, dieet: ['glutenvrij'], prijsklasse: 'middel', doelRekkenVoorraad: 10, magazijnVoorraad: 0, rekkenVoorraad: 0, rekkenlocatie: { label: 'Gang 5', x: 20, y: 45 } },
  { id: 'p-dh-sla', storeId: 'delhaize', naam: 'Krop sla', afdeling: 'boodschappen', categorie: 'groenten', merk: 'Delhaize', prijs: 1.15, dieet: ['glutenvrij'], prijsklasse: 'budget', doelRekkenVoorraad: 10, magazijnVoorraad: 0, rekkenVoorraad: 0, rekkenlocatie: { label: 'Gang 5', x: 20, y: 45 } },

  { id: 'p-dh-kipfilet', storeId: 'delhaize', naam: 'Kipfilet 500g', afdeling: 'boodschappen', categorie: 'vlees', merk: 'Delhaize', prijs: 4.79, dieet: ['glutenvrij'], prijsklasse: 'middel', doelRekkenVoorraad: 8, magazijnVoorraad: 16, rekkenVoorraad: 3, rekkenlocatie: { label: 'Gang 6', x: 50, y: 45 } },
  { id: 'p-dh-spek', storeId: 'delhaize', naam: 'Gerookt spek', afdeling: 'boodschappen', categorie: 'vlees', merk: 'Delhaize', prijs: 2.39, dieet: ['glutenvrij'], prijsklasse: 'middel', doelRekkenVoorraad: 10, magazijnVoorraad: 35, rekkenVoorraad: 9, rekkenlocatie: { label: 'Gang 6', x: 50, y: 45 } },

  { id: 'p-dh-cola', storeId: 'delhaize', naam: 'Cola 6-pack', afdeling: 'boodschappen', categorie: 'frisdrank', merk: 'Coca-Cola', prijs: 4.69, dieet: [], prijsklasse: 'middel', doelRekkenVoorraad: 12, magazijnVoorraad: 40, rekkenVoorraad: 0, rekkenlocatie: { label: 'Gang 7', x: 50, y: 65 } },
  { id: 'p-dh-chips', storeId: 'delhaize', naam: 'Chips paprika', afdeling: 'boodschappen', categorie: 'snacks', merk: "Lay's", prijs: 1.89, dieet: [], prijsklasse: 'middel', doelRekkenVoorraad: 10, magazijnVoorraad: 42, rekkenVoorraad: 4, rekkenlocatie: { label: 'Gang 7', x: 50, y: 65 } },

  { id: 'p-dh-macaroni', storeId: 'delhaize', naam: 'Macaroni', afdeling: 'boodschappen', categorie: 'pasta', merk: 'Delhaize 365', prijs: 0.75, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 40, rekkenVoorraad: 16, rekkenlocatie: { label: 'Gang 1', x: 20, y: 25 } },
  { id: 'p-dh-rijst', storeId: 'delhaize', naam: 'Witte rijst 1kg', afdeling: 'boodschappen', categorie: 'pasta', merk: 'Delhaize', prijs: 1.95, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 36, rekkenVoorraad: 14, rekkenlocatie: { label: 'Gang 1', x: 20, y: 25 } },

  { id: 'p-dh-pistolets', storeId: 'delhaize', naam: 'Pistolets 6st', afdeling: 'boodschappen', categorie: 'brood', merk: 'Delhaize', prijs: 1.45, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 32, rekkenVoorraad: 12, rekkenlocatie: { label: 'Gang 2', x: 50, y: 25 } },
  { id: 'p-dh-cornflakes', storeId: 'delhaize', naam: 'Cornflakes', afdeling: 'boodschappen', categorie: 'ontbijt', merk: 'Delhaize', prijs: 2.49, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 30, rekkenVoorraad: 11, rekkenlocatie: { label: 'Gang 2', x: 50, y: 25 } },
  { id: 'p-dh-muesli', storeId: 'delhaize', naam: 'Muesli', afdeling: 'boodschappen', categorie: 'ontbijt', merk: 'Delhaize', prijs: 2.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 28, rekkenVoorraad: 10, rekkenlocatie: { label: 'Gang 2', x: 50, y: 25 } },

  { id: 'p-dh-eieren', storeId: 'delhaize', naam: 'Eieren 6st', afdeling: 'boodschappen', categorie: 'eieren', merk: 'Delhaize', prijs: 1.85, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 34, rekkenVoorraad: 13, rekkenlocatie: { label: 'Gang 3', x: 80, y: 25 } },
  { id: 'p-dh-boter', storeId: 'delhaize', naam: 'Roomboter', afdeling: 'boodschappen', categorie: 'zuivel', merk: 'Delhaize', prijs: 2.25, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 29, rekkenVoorraad: 12, rekkenlocatie: { label: 'Gang 3', x: 80, y: 25 } },
  { id: 'p-dh-geraspte-kaas', storeId: 'delhaize', naam: 'Geraspte kaas', afdeling: 'boodschappen', categorie: 'zuivel', merk: 'Delhaize', prijs: 2.19, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 26, rekkenVoorraad: 0, rekkenlocatie: { label: 'Gang 3', x: 80, y: 25 } },
  { id: 'p-dh-hesp', storeId: 'delhaize', naam: 'Gekookte hesp', afdeling: 'boodschappen', categorie: 'beleg', merk: 'Delhaize', prijs: 2.45, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 31, rekkenVoorraad: 11, rekkenlocatie: { label: 'Gang 3', x: 80, y: 25 } },

  { id: 'p-dh-wortelen', storeId: 'delhaize', naam: 'Wortelen 1kg', afdeling: 'boodschappen', categorie: 'groenten', merk: 'Delhaize', prijs: 1.15, dieet: ['glutenvrij'], prijsklasse: 'budget', magazijnVoorraad: 42, rekkenVoorraad: 17, rekkenlocatie: { label: 'Gang 5', x: 20, y: 45 } },
  { id: 'p-dh-ui', storeId: 'delhaize', naam: 'Uien net', afdeling: 'boodschappen', categorie: 'groenten', merk: 'Delhaize', prijs: 1.05, dieet: ['glutenvrij'], prijsklasse: 'budget', magazijnVoorraad: 44, rekkenVoorraad: 18, rekkenlocatie: { label: 'Gang 5', x: 20, y: 45 } },
  { id: 'p-dh-bananen', storeId: 'delhaize', naam: 'Bananen 1kg', afdeling: 'boodschappen', categorie: 'fruit', merk: 'Delhaize', prijs: 1.75, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 38, rekkenVoorraad: 15, rekkenlocatie: { label: 'Gang 5', x: 20, y: 45 } },

  { id: 'p-dh-gehakt', storeId: 'delhaize', naam: 'Rundsgehakt 500g', afdeling: 'boodschappen', categorie: 'vlees', merk: 'Delhaize', prijs: 3.49, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 33, rekkenVoorraad: 12, rekkenlocatie: { label: 'Gang 6', x: 50, y: 45 } },
  { id: 'p-dh-zalm', storeId: 'delhaize', naam: 'Zalmfilet 2st', afdeling: 'boodschappen', categorie: 'vis', merk: 'Delhaize', prijs: 8.29, dieet: ['glutenvrij'], prijsklasse: 'premium', magazijnVoorraad: 16, rekkenVoorraad: 6, rekkenlocatie: { label: 'Gang 6', x: 50, y: 45 } },

  { id: 'p-dh-tomatensaus', storeId: 'delhaize', naam: 'Tomatensaus', afdeling: 'boodschappen', categorie: 'conserven', merk: 'Delhaize', prijs: 0.95, dieet: ['glutenvrij'], prijsklasse: 'budget', magazijnVoorraad: 48, rekkenVoorraad: 19, rekkenlocatie: { label: 'Gang 9', x: 80, y: 45 } },
  { id: 'p-dh-bonen-blik', storeId: 'delhaize', naam: 'Witte bonen in blik', afdeling: 'boodschappen', categorie: 'conserven', merk: 'Delhaize 365', prijs: 0.85, dieet: ['glutenvrij'], prijsklasse: 'budget', magazijnVoorraad: 46, rekkenVoorraad: 18, rekkenlocatie: { label: 'Gang 9', x: 80, y: 45 } },
  { id: 'p-dh-olijfolie', storeId: 'delhaize', naam: 'Olijfolie 500ml', afdeling: 'boodschappen', categorie: 'conserven', merk: 'Delhaize', prijs: 4.49, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 25, rekkenVoorraad: 9, rekkenlocatie: { label: 'Gang 9', x: 80, y: 45 } },

  { id: 'p-dh-diepvriespizza', storeId: 'delhaize', naam: 'Diepvriespizza margherita', afdeling: 'boodschappen', categorie: 'diepvries', merk: 'Delhaize', prijs: 3.19, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 34, rekkenVoorraad: 13, rekkenlocatie: { label: 'Gang 8', x: 20, y: 65 } },
  { id: 'p-dh-frietjes', storeId: 'delhaize', naam: 'Diepvriesfrietjes 1kg', afdeling: 'boodschappen', categorie: 'diepvries', merk: 'Delhaize 365', prijs: 1.89, dieet: ['glutenvrij'], prijsklasse: 'budget', magazijnVoorraad: 37, rekkenVoorraad: 15, rekkenlocatie: { label: 'Gang 8', x: 20, y: 65 } },
  { id: 'p-dh-roomijs', storeId: 'delhaize', naam: 'Vanille roomijs', afdeling: 'boodschappen', categorie: 'diepvries', merk: 'Delhaize', prijs: 2.59, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 22, rekkenVoorraad: 0, rekkenlocatie: { label: 'Gang 8', x: 20, y: 65 } },

  { id: 'p-dh-bier', storeId: 'delhaize', naam: 'Pils 6-pack', afdeling: 'boodschappen', categorie: 'dranken', merk: 'Delhaize', prijs: 4.19, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 41, rekkenVoorraad: 16, rekkenlocatie: { label: 'Gang 7', x: 50, y: 65 } },
  { id: 'p-dh-wijn', storeId: 'delhaize', naam: 'Rode wijn', afdeling: 'boodschappen', categorie: 'dranken', merk: 'Delhaize', prijs: 5.99, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 28, rekkenVoorraad: 11, rekkenlocatie: { label: 'Gang 7', x: 50, y: 65 } },

  { id: 'p-dh-afwasmiddel', storeId: 'delhaize', naam: 'Afwasmiddel', afdeling: 'boodschappen', categorie: 'huishouden', merk: 'Delhaize', prijs: 1.55, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 43, rekkenVoorraad: 17, rekkenlocatie: { label: 'Gang 10', x: 50, y: 85 } },
  { id: 'p-dh-wc-papier', storeId: 'delhaize', naam: 'Toiletpapier 8 rollen', afdeling: 'boodschappen', categorie: 'huishouden', merk: 'Delhaize', prijs: 4.19, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 45, rekkenVoorraad: 18, rekkenlocatie: { label: 'Gang 10', x: 50, y: 85 } },
  { id: 'p-dh-tandpasta', storeId: 'delhaize', naam: 'Tandpasta', afdeling: 'boodschappen', categorie: 'verzorging', merk: 'Delhaize', prijs: 1.85, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 35, rekkenVoorraad: 13, rekkenlocatie: { label: 'Gang 10', x: 50, y: 85 } },
  { id: 'p-dh-shampoo', storeId: 'delhaize', naam: 'Shampoo', afdeling: 'boodschappen', categorie: 'verzorging', merk: 'Delhaize', prijs: 2.39, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 32, rekkenVoorraad: 12, rekkenlocatie: { label: 'Gang 10', x: 50, y: 85 } },
]

export function getProduct(id) {
  return products.find((p) => p.id === id) || null
}

export function productsByStore(storeId) {
  return products.filter((p) => p.storeId === storeId)
}

/** Unieke productcategorieën per winkel (voor rek-labels op de plattegrond). */
export function categoriesForStore(storeId) {
  const cats = new Set()
  for (const p of products) {
    if (p.storeId === storeId && p.categorie) cats.add(p.categorie)
  }
  return [...cats].sort((a, b) => a.localeCompare(b, 'nl'))
}
