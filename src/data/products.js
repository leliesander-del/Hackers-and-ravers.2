// Producten per winkel. `afdeling` matcht met profielvoorkeuren; `categorie` is fijnmazig
// en wordt gebruikt om alternatieven te zoeken bij een leeg schap.
// `magazijnVoorraad` = achter de winkel; `schapVoorraad` = op de rekken (live in StoreContext).
// Een paar producten starten met schap 0 zodat het alternatieven-scherm iets te tonen heeft.
// `schaplocatie` (x, y op een 0-100 raster) voedt de 2D-plattegrond.

export const products = [
  // ---- AH XL Gent (boodschappen) ----
  { id: 'p-glutenvrije-pasta', storeId: 'ah-xl', naam: 'Glutenvrije penne', afdeling: 'boodschappen', categorie: 'pasta', merk: 'Schär', prijs: 2.49, dieet: ['glutenvrij'], prijsklasse: 'premium', magazijnVoorraad: 31, schapVoorraad: 7, schaplocatie: { label: 'Gang A1', x: 18, y: 25 } },
  { id: 'p-penne-barilla', storeId: 'ah-xl', naam: 'Penne', afdeling: 'boodschappen', categorie: 'pasta', merk: 'Barilla', prijs: 1.2, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 32, schapVoorraad: 8, schaplocatie: { label: 'Gang A1', x: 18, y: 25 } },
  { id: 'p-spaghetti-boni', storeId: 'ah-xl', naam: 'Spaghetti', afdeling: 'boodschappen', categorie: 'pasta', merk: 'Boni', prijs: 0.65, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 33, schapVoorraad: 9, schaplocatie: { label: 'Gang A1', x: 18, y: 25 } },
  { id: 'p-lasagnebladen', storeId: 'ah-xl', naam: 'Lasagnebladen', afdeling: 'boodschappen', categorie: 'pasta', merk: 'Barilla', prijs: 1.65, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 34, schapVoorraad: 10, schaplocatie: { label: 'Gang A1', x: 18, y: 25 } },

  { id: 'p-glutenvrij-brood', storeId: 'ah-xl', naam: 'Glutenvrij brood', afdeling: 'boodschappen', categorie: 'brood', merk: 'Schär', prijs: 3.19, dieet: ['glutenvrij'], prijsklasse: 'premium', magazijnVoorraad: 20, schapVoorraad: 0, schaplocatie: { label: 'Gang B2', x: 50, y: 25 } },
  { id: 'p-glutenvrij-stokbrood', storeId: 'ah-xl', naam: 'Glutenvrij stokbrood', afdeling: 'boodschappen', categorie: 'brood', merk: 'Schär', prijs: 2.19, dieet: ['glutenvrij'], prijsklasse: 'premium', magazijnVoorraad: 36, schapVoorraad: 12, schaplocatie: { label: 'Gang B2', x: 50, y: 25 } },
  { id: 'p-volkorenbrood', storeId: 'ah-xl', naam: 'Volkorenbrood', afdeling: 'boodschappen', categorie: 'brood', merk: 'AH', prijs: 1.45, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 37, schapVoorraad: 13, schaplocatie: { label: 'Gang B2', x: 50, y: 25 } },
  { id: 'p-witbrood', storeId: 'ah-xl', naam: 'Wit brood', afdeling: 'boodschappen', categorie: 'brood', merk: 'Boni', prijs: 0.89, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 38, schapVoorraad: 14, schaplocatie: { label: 'Gang B2', x: 50, y: 25 } },
  { id: 'p-croissants', storeId: 'ah-xl', naam: 'Croissants 4st', afdeling: 'boodschappen', categorie: 'brood', merk: 'AH', prijs: 1.79, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 39, schapVoorraad: 15, schaplocatie: { label: 'Gang B2', x: 50, y: 25 } },

  { id: 'p-sojadrink', storeId: 'ah-xl', naam: 'Sojadrink', afdeling: 'boodschappen', categorie: 'zuivel', merk: 'Alpro', prijs: 1.99, dieet: ['glutenvrij', 'lactosevrij'], prijsklasse: 'middel', magazijnVoorraad: 40, schapVoorraad: 16, schaplocatie: { label: 'Gang C1', x: 82, y: 25 } },
  { id: 'p-halfvolle-melk', storeId: 'ah-xl', naam: 'Halfvolle melk', afdeling: 'boodschappen', categorie: 'zuivel', merk: 'Boni', prijs: 0.95, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 41, schapVoorraad: 17, schaplocatie: { label: 'Gang C1', x: 82, y: 25 } },
  { id: 'p-yoghurt-natuur', storeId: 'ah-xl', naam: 'Yoghurt natuur', afdeling: 'boodschappen', categorie: 'zuivel', merk: 'Danone', prijs: 1.59, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 42, schapVoorraad: 18, schaplocatie: { label: 'Gang C1', x: 82, y: 25 } },
  { id: 'p-jonge-kaas', storeId: 'ah-xl', naam: 'Jonge kaas plakken', afdeling: 'boodschappen', categorie: 'zuivel', merk: 'AH', prijs: 2.89, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 43, schapVoorraad: 19, schaplocatie: { label: 'Gang C1', x: 82, y: 25 } },

  { id: 'p-koffiebonen', storeId: 'ah-xl', naam: 'Koffiebonen', afdeling: 'boodschappen', categorie: 'koffie', merk: 'Lavazza', prijs: 6.99, dieet: ['glutenvrij'], prijsklasse: 'premium', magazijnVoorraad: 44, schapVoorraad: 6, schaplocatie: { label: 'Gang D3', x: 82, y: 65 } },
  { id: 'p-koffiepads', storeId: 'ah-xl', naam: 'Koffiepads', afdeling: 'boodschappen', categorie: 'koffie', merk: 'Senseo', prijs: 3.49, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 45, schapVoorraad: 7, schaplocatie: { label: 'Gang D3', x: 82, y: 65 } },
  { id: 'p-nespresso-capsules', storeId: 'ah-xl', naam: 'Espresso capsules', afdeling: 'boodschappen', categorie: 'koffie', merk: 'Nespresso', prijs: 4.79, dieet: ['glutenvrij'], prijsklasse: 'premium', magazijnVoorraad: 31, schapVoorraad: 0, schaplocatie: { label: 'Gang D3', x: 82, y: 65 } },
  { id: 'p-oploskoffie', storeId: 'ah-xl', naam: 'Oploskoffie', afdeling: 'boodschappen', categorie: 'koffie', merk: 'Boni', prijs: 2.29, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 47, schapVoorraad: 9, schaplocatie: { label: 'Gang D3', x: 82, y: 65 } },
  { id: 'p-thee-groen', storeId: 'ah-xl', naam: 'Groene thee', afdeling: 'boodschappen', categorie: 'koffie', merk: 'Lipton', prijs: 2.49, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 48, schapVoorraad: 10, schaplocatie: { label: 'Gang D3', x: 82, y: 65 } },

  { id: 'p-cola-6pack', storeId: 'ah-xl', naam: 'Cola 6-pack', afdeling: 'boodschappen', categorie: 'frisdrank', merk: 'Coca-Cola', prijs: 4.5, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 49, schapVoorraad: 11, schaplocatie: { label: 'Gang E2', x: 50, y: 65 } },
  { id: 'p-bruiswater', storeId: 'ah-xl', naam: 'Bruiswater 6-pack', afdeling: 'boodschappen', categorie: 'frisdrank', merk: 'Spa', prijs: 3.29, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 50, schapVoorraad: 12, schaplocatie: { label: 'Gang E2', x: 50, y: 65 } },
  { id: 'p-appelsap', storeId: 'ah-xl', naam: 'Appelsap', afdeling: 'boodschappen', categorie: 'frisdrank', merk: 'Boni', prijs: 1.19, dieet: ['glutenvrij'], prijsklasse: 'budget', magazijnVoorraad: 51, schapVoorraad: 13, schaplocatie: { label: 'Gang E2', x: 50, y: 65 } },
  { id: 'p-chips', storeId: 'ah-xl', naam: 'Chips naturel', afdeling: 'boodschappen', categorie: 'snacks', merk: "Lay's", prijs: 1.79, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 52, schapVoorraad: 14, schaplocatie: { label: 'Gang E1', x: 18, y: 65 } },
  { id: 'p-nootjes', storeId: 'ah-xl', naam: 'Gemengde noten', afdeling: 'boodschappen', categorie: 'snacks', merk: 'AH', prijs: 2.59, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 53, schapVoorraad: 15, schaplocatie: { label: 'Gang E1', x: 18, y: 65 } },
  { id: 'p-chocolade', storeId: 'ah-xl', naam: 'Melkchocolade reep', afdeling: 'boodschappen', categorie: 'snacks', merk: 'Côte d\'Or', prijs: 1.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 54, schapVoorraad: 16, schaplocatie: { label: 'Gang E1', x: 18, y: 65 } },

  { id: 'p-appels', storeId: 'ah-xl', naam: 'Appels Jonagold 1kg', afdeling: 'boodschappen', categorie: 'fruit', merk: 'AH', prijs: 1.99, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 55, schapVoorraad: 17, schaplocatie: { label: 'Gang F1', x: 18, y: 45 } },
  { id: 'p-bananen', storeId: 'ah-xl', naam: 'Bananen 1kg', afdeling: 'boodschappen', categorie: 'fruit', merk: 'Chiquita', prijs: 1.69, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 56, schapVoorraad: 18, schaplocatie: { label: 'Gang F1', x: 18, y: 45 } },
  { id: 'p-tomaten', storeId: 'ah-xl', naam: 'Trostomaten', afdeling: 'boodschappen', categorie: 'groenten', merk: 'Boni', prijs: 1.29, dieet: ['glutenvrij'], prijsklasse: 'budget', magazijnVoorraad: 57, schapVoorraad: 19, schaplocatie: { label: 'Gang F1', x: 18, y: 45 } },

  { id: 'p-kipfilet', storeId: 'ah-xl', naam: 'Kipfilet 500g', afdeling: 'boodschappen', categorie: 'vlees', merk: 'AH', prijs: 4.49, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 58, schapVoorraad: 6, schaplocatie: { label: 'Gang F2', x: 50, y: 45 } },
  { id: 'p-gehakt', storeId: 'ah-xl', naam: 'Rundsgehakt 500g', afdeling: 'boodschappen', categorie: 'vlees', merk: 'Boni', prijs: 3.29, dieet: ['glutenvrij'], prijsklasse: 'budget', magazijnVoorraad: 59, schapVoorraad: 7, schaplocatie: { label: 'Gang F2', x: 50, y: 45 } },
  { id: 'p-zalmfilet', storeId: 'ah-xl', naam: 'Zalmfilet 2st', afdeling: 'boodschappen', categorie: 'vis', merk: 'AH', prijs: 7.99, dieet: ['glutenvrij'], prijsklasse: 'premium', magazijnVoorraad: 20, schapVoorraad: 0, schaplocatie: { label: 'Gang F2', x: 50, y: 45 } },

  { id: 'p-cornflakes', storeId: 'ah-xl', naam: 'Cornflakes', afdeling: 'boodschappen', categorie: 'ontbijt', merk: "Kellogg's", prijs: 2.79, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 61, schapVoorraad: 9, schaplocatie: { label: 'Gang F3', x: 82, y: 45 } },
  { id: 'p-muesli-glutenvrij', storeId: 'ah-xl', naam: 'Glutenvrije muesli', afdeling: 'boodschappen', categorie: 'ontbijt', merk: 'Schär', prijs: 3.99, dieet: ['glutenvrij'], prijsklasse: 'premium', magazijnVoorraad: 62, schapVoorraad: 10, schaplocatie: { label: 'Gang F3', x: 82, y: 45 } },
  { id: 'p-confituur', storeId: 'ah-xl', naam: 'Aardbeienconfituur', afdeling: 'boodschappen', categorie: 'ontbijt', merk: 'Materne', prijs: 2.19, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 63, schapVoorraad: 11, schaplocatie: { label: 'Gang F3', x: 82, y: 45 } },

  // ---- MediaMarkt Gent (elektronica) ----
  { id: 'p-airpods', storeId: 'mediamarkt', naam: 'AirPods', afdeling: 'elektronica', categorie: 'audio', merk: 'Apple', prijs: 149, dieet: [], prijsklasse: 'premium', magazijnVoorraad: 64, schapVoorraad: 12, schaplocatie: { label: 'Audio', x: 30, y: 40 } },
  { id: 'p-koptelefoon-sony', storeId: 'mediamarkt', naam: 'Draadloze koptelefoon', afdeling: 'elektronica', categorie: 'audio', merk: 'Sony', prijs: 89, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 25, schapVoorraad: 0, schaplocatie: { label: 'Audio', x: 30, y: 40 } },
  { id: 'p-bluetooth-speaker', storeId: 'mediamarkt', naam: 'Bluetooth speaker', afdeling: 'elektronica', categorie: 'audio', merk: 'JBL', prijs: 59, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 66, schapVoorraad: 14, schaplocatie: { label: 'Audio', x: 30, y: 40 } },

  { id: 'p-usbc-kabel', storeId: 'mediamarkt', naam: 'USB-C kabel', afdeling: 'elektronica', categorie: 'accessoires', merk: 'Goji', prijs: 9.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 67, schapVoorraad: 15, schaplocatie: { label: 'Accessoires', x: 70, y: 40 } },
  { id: 'p-powerbank', storeId: 'mediamarkt', naam: 'Powerbank 20.000mAh', afdeling: 'elektronica', categorie: 'accessoires', merk: 'Goji', prijs: 24.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 68, schapVoorraad: 16, schaplocatie: { label: 'Accessoires', x: 70, y: 40 } },
  { id: 'p-muis-draadloos', storeId: 'mediamarkt', naam: 'Draadloze muis', afdeling: 'elektronica', categorie: 'accessoires', merk: 'Logitech', prijs: 29.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 69, schapVoorraad: 17, schaplocatie: { label: 'Accessoires', x: 70, y: 40 } },

  { id: 'p-iphone', storeId: 'mediamarkt', naam: 'iPhone 16', afdeling: 'elektronica', categorie: 'smartphones', merk: 'Apple', prijs: 949, dieet: [], prijsklasse: 'premium', magazijnVoorraad: 70, schapVoorraad: 18, schaplocatie: { label: 'Smartphones', x: 50, y: 22 } },
  { id: 'p-samsung-galaxy', storeId: 'mediamarkt', naam: 'Galaxy S24', afdeling: 'elektronica', categorie: 'smartphones', merk: 'Samsung', prijs: 699, dieet: [], prijsklasse: 'premium', magazijnVoorraad: 71, schapVoorraad: 19, schaplocatie: { label: 'Smartphones', x: 50, y: 22 } },

  { id: 'p-laptop-hp', storeId: 'mediamarkt', naam: 'Laptop 15"', afdeling: 'elektronica', categorie: 'computers', merk: 'HP', prijs: 649, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 72, schapVoorraad: 6, schaplocatie: { label: 'Computers', x: 50, y: 60 } },
  { id: 'p-tablet', storeId: 'mediamarkt', naam: 'Tablet 11"', afdeling: 'elektronica', categorie: 'computers', merk: 'Samsung', prijs: 329, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 73, schapVoorraad: 7, schaplocatie: { label: 'Computers', x: 50, y: 60 } },

  { id: 'p-tv-lg', storeId: 'mediamarkt', naam: 'TV 55" 4K', afdeling: 'elektronica', categorie: 'tv', merk: 'LG', prijs: 549, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 74, schapVoorraad: 8, schaplocatie: { label: 'TV & Beeld', x: 25, y: 75 } },
  { id: 'p-soundbar', storeId: 'mediamarkt', naam: 'Soundbar', afdeling: 'elektronica', categorie: 'tv', merk: 'Samsung', prijs: 199, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 35, schapVoorraad: 0, schaplocatie: { label: 'TV & Beeld', x: 25, y: 75 } },

  { id: 'p-playstation', storeId: 'mediamarkt', naam: 'PlayStation 5', afdeling: 'elektronica', categorie: 'gaming', merk: 'Sony', prijs: 549, dieet: [], prijsklasse: 'premium', magazijnVoorraad: 36, schapVoorraad: 0, schaplocatie: { label: 'Gaming', x: 75, y: 75 } },
  { id: 'p-controller', storeId: 'mediamarkt', naam: 'Draadloze controller', afdeling: 'elektronica', categorie: 'gaming', merk: 'Sony', prijs: 69, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 77, schapVoorraad: 11, schaplocatie: { label: 'Gaming', x: 75, y: 75 } },

  // ---- Decathlon Gent (sport) ----
  { id: 'p-voetbal', storeId: 'decathlon', naam: 'Voetbal', afdeling: 'sport', categorie: 'balsport', merk: 'Kipsta', prijs: 12.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 78, schapVoorraad: 12, schaplocatie: { label: 'Teamsport', x: 40, y: 22 } },
  { id: 'p-basketbal', storeId: 'decathlon', naam: 'Basketbal', afdeling: 'sport', categorie: 'balsport', merk: 'Tarmak', prijs: 14.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 79, schapVoorraad: 13, schaplocatie: { label: 'Teamsport', x: 40, y: 22 } },

  { id: 'p-proteinereep', storeId: 'decathlon', naam: 'Proteïnereep', afdeling: 'sport', categorie: 'sportvoeding', merk: 'Aptonia', prijs: 1.99, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 15, schapVoorraad: 0, schaplocatie: { label: 'Voeding', x: 75, y: 35 } },
  { id: 'p-isodrank', storeId: 'decathlon', naam: 'Isotone sportdrank', afdeling: 'sport', categorie: 'sportvoeding', merk: 'Aptonia', prijs: 2.49, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 31, schapVoorraad: 15, schaplocatie: { label: 'Voeding', x: 75, y: 35 } },
  { id: 'p-drinkbus', storeId: 'decathlon', naam: 'Drinkbus 750ml', afdeling: 'sport', categorie: 'accessoires', merk: 'Kipsta', prijs: 4.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 32, schapVoorraad: 16, schaplocatie: { label: 'Voeding', x: 75, y: 35 } },

  { id: 'p-loopschoenen', storeId: 'decathlon', naam: 'Loopschoenen', afdeling: 'sport', categorie: 'schoenen', merk: 'Kalenji', prijs: 39.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 33, schapVoorraad: 17, schaplocatie: { label: 'Schoenen', x: 25, y: 50 } },
  { id: 'p-wandelschoenen', storeId: 'decathlon', naam: 'Wandelschoenen', afdeling: 'sport', categorie: 'schoenen', merk: 'Quechua', prijs: 49.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 34, schapVoorraad: 18, schaplocatie: { label: 'Schoenen', x: 25, y: 50 } },

  { id: 'p-sportshirt', storeId: 'decathlon', naam: 'Sport T-shirt', afdeling: 'sport', categorie: 'kleding', merk: 'Domyos', prijs: 7.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 35, schapVoorraad: 19, schaplocatie: { label: 'Kleding', x: 60, y: 50 } },
  { id: 'p-sportbroek', storeId: 'decathlon', naam: 'Trainingsbroek', afdeling: 'sport', categorie: 'kleding', merk: 'Domyos', prijs: 14.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 36, schapVoorraad: 6, schaplocatie: { label: 'Kleding', x: 60, y: 50 } },

  { id: 'p-yogamat', storeId: 'decathlon', naam: 'Yogamat', afdeling: 'sport', categorie: 'fitness', merk: 'Domyos', prijs: 19.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 37, schapVoorraad: 7, schaplocatie: { label: 'Fitness', x: 40, y: 75 } },
  { id: 'p-dumbells', storeId: 'decathlon', naam: 'Dumbells 2x5kg', afdeling: 'sport', categorie: 'fitness', merk: 'Domyos', prijs: 24.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 23, schapVoorraad: 0, schaplocatie: { label: 'Fitness', x: 40, y: 75 } },
  { id: 'p-fietshelm', storeId: 'decathlon', naam: 'Fietshelm', afdeling: 'sport', categorie: 'fietsen', merk: 'Btwin', prijs: 29.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 39, schapVoorraad: 9, schaplocatie: { label: 'Fietsen', x: 75, y: 75 } },

  // ---- HEMA Veldstraat (speelgoed) ----
  { id: 'p-lego-classic', storeId: 'hema', naam: 'Lego Classic doos', afdeling: 'speelgoed', categorie: 'bouwspeelgoed', merk: 'Lego', prijs: 29.99, dieet: [], prijsklasse: 'premium', magazijnVoorraad: 40, schapVoorraad: 10, schaplocatie: { label: 'Speelgoed', x: 35, y: 35 } },
  { id: 'p-houten-blokken', storeId: 'hema', naam: 'Houten blokken', afdeling: 'speelgoed', categorie: 'bouwspeelgoed', merk: 'HEMA', prijs: 12.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 41, schapVoorraad: 11, schaplocatie: { label: 'Speelgoed', x: 35, y: 35 } },
  { id: 'p-knuffelbeer', storeId: 'hema', naam: 'Knuffelbeer', afdeling: 'speelgoed', categorie: 'knuffels', merk: 'HEMA', prijs: 9.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 42, schapVoorraad: 12, schaplocatie: { label: 'Speelgoed', x: 35, y: 35 } },

  { id: 'p-puzzel-1000', storeId: 'hema', naam: 'Puzzel 1000 stukjes', afdeling: 'speelgoed', categorie: 'spellen', merk: 'HEMA', prijs: 8.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 28, schapVoorraad: 0, schaplocatie: { label: 'Spellen', x: 70, y: 35 } },
  { id: 'p-gezelschapsspel', storeId: 'hema', naam: 'Gezelschapsspel', afdeling: 'speelgoed', categorie: 'spellen', merk: 'HEMA', prijs: 14.99, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 44, schapVoorraad: 14, schaplocatie: { label: 'Spellen', x: 70, y: 35 } },
  { id: 'p-kaartspel', storeId: 'hema', naam: 'Kaartspel', afdeling: 'speelgoed', categorie: 'spellen', merk: 'HEMA', prijs: 2.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 45, schapVoorraad: 15, schaplocatie: { label: 'Spellen', x: 70, y: 35 } },

  { id: 'p-tekenset', storeId: 'hema', naam: 'Tekenset 24-delig', afdeling: 'speelgoed', categorie: 'hobby', merk: 'HEMA', prijs: 6.99, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 46, schapVoorraad: 16, schaplocatie: { label: 'Hobby', x: 50, y: 70 } },
  { id: 'p-klei', storeId: 'hema', naam: 'Boetseerklei set', afdeling: 'speelgoed', categorie: 'hobby', merk: 'HEMA', prijs: 5.49, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 47, schapVoorraad: 17, schaplocatie: { label: 'Hobby', x: 50, y: 70 } },

  // ---- Delhaize Sint-Pieters (boodschappen) ----
  { id: 'p-dh-spaghetti', storeId: 'delhaize', naam: 'Spaghetti', afdeling: 'boodschappen', categorie: 'pasta', merk: 'Delhaize', prijs: 1.09, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 48, schapVoorraad: 18, schaplocatie: { label: 'Gang 1', x: 20, y: 25 } },
  { id: 'p-dh-penne-365', storeId: 'delhaize', naam: 'Penne', afdeling: 'boodschappen', categorie: 'pasta', merk: 'Delhaize 365', prijs: 0.69, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 49, schapVoorraad: 19, schaplocatie: { label: 'Gang 1', x: 20, y: 25 } },
  { id: 'p-dh-glutenvrije-pasta', storeId: 'delhaize', naam: 'Glutenvrije fusilli', afdeling: 'boodschappen', categorie: 'pasta', merk: 'Schär', prijs: 2.59, dieet: ['glutenvrij'], prijsklasse: 'premium', magazijnVoorraad: 50, schapVoorraad: 6, schaplocatie: { label: 'Gang 1', x: 20, y: 25 } },

  { id: 'p-dh-volkorenbrood', storeId: 'delhaize', naam: 'Volkorenbrood', afdeling: 'boodschappen', categorie: 'brood', merk: 'Delhaize', prijs: 1.59, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 51, schapVoorraad: 7, schaplocatie: { label: 'Gang 2', x: 50, y: 25 } },
  { id: 'p-dh-glutenvrij-brood', storeId: 'delhaize', naam: 'Glutenvrij brood', afdeling: 'boodschappen', categorie: 'brood', merk: 'Schär', prijs: 3.29, dieet: ['glutenvrij'], prijsklasse: 'premium', magazijnVoorraad: 37, schapVoorraad: 0, schaplocatie: { label: 'Gang 2', x: 50, y: 25 } },
  { id: 'p-dh-witbrood', storeId: 'delhaize', naam: 'Wit brood', afdeling: 'boodschappen', categorie: 'brood', merk: 'Delhaize 365', prijs: 0.95, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 53, schapVoorraad: 9, schaplocatie: { label: 'Gang 2', x: 50, y: 25 } },

  { id: 'p-dh-melk', storeId: 'delhaize', naam: 'Halfvolle melk', afdeling: 'boodschappen', categorie: 'zuivel', merk: 'Delhaize', prijs: 1.05, dieet: [], prijsklasse: 'budget', magazijnVoorraad: 54, schapVoorraad: 10, schaplocatie: { label: 'Gang 3', x: 80, y: 25 } },
  { id: 'p-dh-sojadrink', storeId: 'delhaize', naam: 'Sojadrink', afdeling: 'boodschappen', categorie: 'zuivel', merk: 'Alpro', prijs: 2.09, dieet: ['glutenvrij', 'lactosevrij'], prijsklasse: 'middel', magazijnVoorraad: 55, schapVoorraad: 11, schaplocatie: { label: 'Gang 3', x: 80, y: 25 } },
  { id: 'p-dh-yoghurt', storeId: 'delhaize', naam: 'Griekse yoghurt', afdeling: 'boodschappen', categorie: 'zuivel', merk: 'Delhaize', prijs: 1.79, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 56, schapVoorraad: 12, schaplocatie: { label: 'Gang 3', x: 80, y: 25 } },

  { id: 'p-dh-koffie', storeId: 'delhaize', naam: 'Gemalen koffie', afdeling: 'boodschappen', categorie: 'koffie', merk: 'Douwe Egberts', prijs: 4.99, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 57, schapVoorraad: 13, schaplocatie: { label: 'Gang 4', x: 80, y: 65 } },
  { id: 'p-dh-koffiebonen', storeId: 'delhaize', naam: 'Koffiebonen', afdeling: 'boodschappen', categorie: 'koffie', merk: 'Lavazza', prijs: 7.29, dieet: ['glutenvrij'], prijsklasse: 'premium', magazijnVoorraad: 58, schapVoorraad: 14, schaplocatie: { label: 'Gang 4', x: 80, y: 65 } },

  { id: 'p-dh-appels', storeId: 'delhaize', naam: 'Appels 1kg', afdeling: 'boodschappen', categorie: 'fruit', merk: 'Delhaize', prijs: 2.19, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 59, schapVoorraad: 15, schaplocatie: { label: 'Gang 5', x: 20, y: 45 } },
  { id: 'p-dh-sla', storeId: 'delhaize', naam: 'Krop sla', afdeling: 'boodschappen', categorie: 'groenten', merk: 'Delhaize', prijs: 1.15, dieet: ['glutenvrij'], prijsklasse: 'budget', magazijnVoorraad: 60, schapVoorraad: 16, schaplocatie: { label: 'Gang 5', x: 20, y: 45 } },

  { id: 'p-dh-kipfilet', storeId: 'delhaize', naam: 'Kipfilet 500g', afdeling: 'boodschappen', categorie: 'vlees', merk: 'Delhaize', prijs: 4.79, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 61, schapVoorraad: 17, schaplocatie: { label: 'Gang 6', x: 50, y: 45 } },
  { id: 'p-dh-spek', storeId: 'delhaize', naam: 'Gerookt spek', afdeling: 'boodschappen', categorie: 'vlees', merk: 'Delhaize', prijs: 2.39, dieet: ['glutenvrij'], prijsklasse: 'middel', magazijnVoorraad: 62, schapVoorraad: 18, schaplocatie: { label: 'Gang 6', x: 50, y: 45 } },

  { id: 'p-dh-cola', storeId: 'delhaize', naam: 'Cola 6-pack', afdeling: 'boodschappen', categorie: 'frisdrank', merk: 'Coca-Cola', prijs: 4.69, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 63, schapVoorraad: 19, schaplocatie: { label: 'Gang 7', x: 50, y: 65 } },
  { id: 'p-dh-chips', storeId: 'delhaize', naam: 'Chips paprika', afdeling: 'boodschappen', categorie: 'snacks', merk: "Lay's", prijs: 1.89, dieet: [], prijsklasse: 'middel', magazijnVoorraad: 64, schapVoorraad: 6, schaplocatie: { label: 'Gang 7', x: 50, y: 65 } },
]

export function getProduct(id) {
  return products.find((p) => p.id === id) || null
}

export function productsByStore(storeId) {
  return products.filter((p) => p.storeId === storeId)
}
