// Products per store. `department` matches profile preferences; `category` is fine-grained
// and is used to find alternatives when shelves are empty.
// `warehouseStock` = in the back of the store; `shelfStock` = on the shelves (live in StoreContext).
// A few products start with 0 on the shelves so the alternatives screen has something to show.
// `shelfLocation` (x, y on a 0-100 grid) feeds the 2D floor plan.

export const products = [
  // ---- AH XL Gent (groceries) ----
  { id: 'p-glutenvrije-pasta', storeId: 'ah-xl', name: 'Gluten-free penne', department: 'groceries', category: 'pasta', brand: 'Schär', price: 2.49, diet: ['gluten-free'], priceTier: 'premium', warehouseStock: 31, shelfStock: 7, shelfLocation: { label: 'Aisle A1', x: 18, y: 25 } },
  { id: 'p-penne-barilla', storeId: 'ah-xl', name: 'Penne', department: 'groceries', category: 'pasta', brand: 'Barilla', price: 1.2, diet: [], priceTier: 'mid', warehouseStock: 32, shelfStock: 8, shelfLocation: { label: 'Aisle A1', x: 18, y: 25 } },
  { id: 'p-spaghetti-boni', storeId: 'ah-xl', name: 'Spaghetti', department: 'groceries', category: 'pasta', brand: 'Boni', price: 0.65, diet: [], priceTier: 'budget', warehouseStock: 33, shelfStock: 9, shelfLocation: { label: 'Aisle A1', x: 18, y: 25 } },
  { id: 'p-lasagnebladen', storeId: 'ah-xl', name: 'Lasagne sheets', department: 'groceries', category: 'pasta', brand: 'Barilla', price: 1.65, diet: [], priceTier: 'mid', warehouseStock: 34, shelfStock: 10, shelfLocation: { label: 'Aisle A1', x: 18, y: 25 } },

  { id: 'p-glutenvrij-brood', storeId: 'ah-xl', name: 'Gluten-free bread', department: 'groceries', category: 'bread', brand: 'Schär', price: 3.19, diet: ['gluten-free'], priceTier: 'premium', targetShelfStock: 10, warehouseStock: 22, shelfStock: 0, shelfLocation: { label: 'Aisle B2', x: 50, y: 25 } },
  { id: 'p-glutenvrij-stokbrood', storeId: 'ah-xl', name: 'Gluten-free baguette', department: 'groceries', category: 'bread', brand: 'Schär', price: 2.19, diet: ['gluten-free'], priceTier: 'premium', warehouseStock: 36, shelfStock: 12, shelfLocation: { label: 'Aisle B2', x: 50, y: 25 } },
  { id: 'p-volkorenbrood', storeId: 'ah-xl', name: 'Wholewheat bread', department: 'groceries', category: 'bread', brand: 'AH', price: 1.45, diet: [], priceTier: 'mid', warehouseStock: 37, shelfStock: 13, shelfLocation: { label: 'Aisle B2', x: 50, y: 25 } },
  { id: 'p-witbrood', storeId: 'ah-xl', name: 'White bread', department: 'groceries', category: 'bread', brand: 'Boni', price: 0.89, diet: [], priceTier: 'budget', warehouseStock: 38, shelfStock: 14, shelfLocation: { label: 'Aisle B2', x: 50, y: 25 } },
  { id: 'p-croissants', storeId: 'ah-xl', name: 'Croissants 4pc', department: 'groceries', category: 'bread', brand: 'AH', price: 1.79, diet: [], priceTier: 'mid', warehouseStock: 39, shelfStock: 15, shelfLocation: { label: 'Aisle B2', x: 50, y: 25 } },

  { id: 'p-sojadrink', storeId: 'ah-xl', name: 'Soy drink', department: 'groceries', category: 'dairy', brand: 'Alpro', price: 1.99, diet: ['gluten-free', 'lactose-free'], priceTier: 'mid', warehouseStock: 40, shelfStock: 16, shelfLocation: { label: 'Aisle C1', x: 82, y: 25 } },
  { id: 'p-halfvolle-melk', storeId: 'ah-xl', name: 'Semi-skimmed milk', department: 'groceries', category: 'dairy', brand: 'Boni', price: 0.95, diet: [], priceTier: 'budget', warehouseStock: 41, shelfStock: 17, shelfLocation: { label: 'Aisle C1', x: 82, y: 25 } },
  { id: 'p-yoghurt-natuur', storeId: 'ah-xl', name: 'Plain yoghurt', department: 'groceries', category: 'dairy', brand: 'Danone', price: 1.59, diet: [], priceTier: 'mid', warehouseStock: 42, shelfStock: 18, shelfLocation: { label: 'Aisle C1', x: 82, y: 25 } },
  { id: 'p-jonge-kaas', storeId: 'ah-xl', name: 'Young cheese slices', department: 'groceries', category: 'dairy', brand: 'AH', price: 2.89, diet: [], priceTier: 'mid', warehouseStock: 43, shelfStock: 19, shelfLocation: { label: 'Aisle C1', x: 82, y: 25 } },

  { id: 'p-koffiebonen', storeId: 'ah-xl', name: 'Coffee beans', department: 'groceries', category: 'coffee', brand: 'Lavazza', price: 6.99, diet: ['gluten-free'], priceTier: 'premium', warehouseStock: 44, shelfStock: 6, shelfLocation: { label: 'Aisle D3', x: 82, y: 65 } },
  { id: 'p-koffiepads', storeId: 'ah-xl', name: 'Coffee pods', department: 'groceries', category: 'coffee', brand: 'Senseo', price: 3.49, diet: [], priceTier: 'mid', warehouseStock: 45, shelfStock: 7, shelfLocation: { label: 'Aisle D3', x: 82, y: 65 } },
  { id: 'p-nespresso-capsules', storeId: 'ah-xl', name: 'Espresso capsules', department: 'groceries', category: 'coffee', brand: 'Nespresso', price: 4.79, diet: ['gluten-free'], priceTier: 'premium', targetShelfStock: 8, warehouseStock: 0, shelfStock: 0, shelfLocation: { label: 'Aisle D3', x: 82, y: 65 } },
  { id: 'p-oploskoffie', storeId: 'ah-xl', name: 'Instant coffee', department: 'groceries', category: 'coffee', brand: 'Boni', price: 2.29, diet: [], priceTier: 'budget', warehouseStock: 47, shelfStock: 9, shelfLocation: { label: 'Aisle D3', x: 82, y: 65 } },
  { id: 'p-thee-groen', storeId: 'ah-xl', name: 'Green tea', department: 'groceries', category: 'coffee', brand: 'Lipton', price: 2.49, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 48, shelfStock: 10, shelfLocation: { label: 'Aisle D3', x: 82, y: 65 } },

  { id: 'p-cola-6pack', storeId: 'ah-xl', name: 'Cola 6-pack', department: 'groceries', category: 'soda', brand: 'Coca-Cola', price: 4.5, diet: [], priceTier: 'mid', warehouseStock: 49, shelfStock: 11, shelfLocation: { label: 'Aisle E2', x: 50, y: 65 } },
  { id: 'p-bruiswater', storeId: 'ah-xl', name: 'Sparkling water 6-pack', department: 'groceries', category: 'soda', brand: 'Spa', price: 3.29, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 50, shelfStock: 12, shelfLocation: { label: 'Aisle E2', x: 50, y: 65 } },
  { id: 'p-appelsap', storeId: 'ah-xl', name: 'Apple juice', department: 'groceries', category: 'soda', brand: 'Boni', price: 1.19, diet: ['gluten-free'], priceTier: 'budget', warehouseStock: 51, shelfStock: 13, shelfLocation: { label: 'Aisle E2', x: 50, y: 65 } },
  { id: 'p-chips', storeId: 'ah-xl', name: 'Plain crisps', department: 'groceries', category: 'snacks', brand: "Lay's", price: 1.79, diet: [], priceTier: 'mid', warehouseStock: 52, shelfStock: 14, shelfLocation: { label: 'Aisle E1', x: 18, y: 65 } },
  { id: 'p-nootjes', storeId: 'ah-xl', name: 'Mixed nuts', department: 'groceries', category: 'snacks', brand: 'AH', price: 2.59, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 53, shelfStock: 15, shelfLocation: { label: 'Aisle E1', x: 18, y: 65 } },
  { id: 'p-chocolade', storeId: 'ah-xl', name: 'Milk chocolate bar', department: 'groceries', category: 'snacks', brand: 'Côte d\'Or', price: 1.99, diet: [], priceTier: 'mid', warehouseStock: 54, shelfStock: 16, shelfLocation: { label: 'Aisle E1', x: 18, y: 65 } },

  { id: 'p-appels', storeId: 'ah-xl', name: 'Jonagold apples 1kg', department: 'groceries', category: 'fruit', brand: 'AH', price: 1.99, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 55, shelfStock: 17, shelfLocation: { label: 'Aisle F1', x: 18, y: 45 } },
  { id: 'p-bananen', storeId: 'ah-xl', name: 'Bananas 1kg', department: 'groceries', category: 'fruit', brand: 'Chiquita', price: 1.69, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 56, shelfStock: 18, shelfLocation: { label: 'Aisle F1', x: 18, y: 45 } },
  { id: 'p-tomaten', storeId: 'ah-xl', name: 'Vine tomatoes', department: 'groceries', category: 'vegetables', brand: 'Boni', price: 1.29, diet: ['gluten-free'], priceTier: 'budget', warehouseStock: 57, shelfStock: 19, shelfLocation: { label: 'Aisle F1', x: 18, y: 45 } },

  { id: 'p-kipfilet', storeId: 'ah-xl', name: 'Chicken breast 500g', department: 'groceries', category: 'meat', brand: 'AH', price: 4.49, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 58, shelfStock: 6, shelfLocation: { label: 'Aisle F2', x: 50, y: 45 } },
  { id: 'p-gehakt', storeId: 'ah-xl', name: 'Ground beef 500g', department: 'groceries', category: 'meat', brand: 'Boni', price: 3.29, diet: ['gluten-free'], priceTier: 'budget', warehouseStock: 59, shelfStock: 7, shelfLocation: { label: 'Aisle F2', x: 50, y: 45 } },
  { id: 'p-zalmfilet', storeId: 'ah-xl', name: 'Salmon fillet 2pc', department: 'groceries', category: 'fish', brand: 'AH', price: 7.99, diet: ['gluten-free'], priceTier: 'premium', warehouseStock: 20, shelfStock: 0, shelfLocation: { label: 'Aisle F2', x: 50, y: 45 } },

  { id: 'p-cornflakes', storeId: 'ah-xl', name: 'Cornflakes', department: 'groceries', category: 'breakfast', brand: "Kellogg's", price: 2.79, diet: [], priceTier: 'mid', warehouseStock: 61, shelfStock: 9, shelfLocation: { label: 'Aisle F3', x: 82, y: 45 } },
  { id: 'p-muesli-glutenvrij', storeId: 'ah-xl', name: 'Gluten-free muesli', department: 'groceries', category: 'breakfast', brand: 'Schär', price: 3.99, diet: ['gluten-free'], priceTier: 'premium', warehouseStock: 62, shelfStock: 10, shelfLocation: { label: 'Aisle F3', x: 82, y: 45 } },
  { id: 'p-confituur', storeId: 'ah-xl', name: 'Strawberry jam', department: 'groceries', category: 'breakfast', brand: 'Materne', price: 2.19, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 63, shelfStock: 11, shelfLocation: { label: 'Aisle F3', x: 82, y: 45 } },

  { id: 'p-macaroni', storeId: 'ah-xl', name: 'Macaroni', department: 'groceries', category: 'pasta', brand: 'Boni', price: 0.79, diet: [], priceTier: 'budget', warehouseStock: 30, shelfStock: 12, shelfLocation: { label: 'Aisle A1', x: 18, y: 25 } },
  { id: 'p-rijst', storeId: 'ah-xl', name: 'White rice 1kg', department: 'groceries', category: 'pasta', brand: 'AH', price: 1.89, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 28, shelfStock: 11, shelfLocation: { label: 'Aisle A1', x: 18, y: 25 } },
  { id: 'p-couscous', storeId: 'ah-xl', name: 'Couscous', department: 'groceries', category: 'pasta', brand: 'AH', price: 1.49, diet: [], priceTier: 'mid', warehouseStock: 24, shelfStock: 8, shelfLocation: { label: 'Aisle A1', x: 18, y: 25 } },

  { id: 'p-pistolets', storeId: 'ah-xl', name: 'Bread rolls 6pc', department: 'groceries', category: 'bread', brand: 'AH', price: 1.39, diet: [], priceTier: 'mid', warehouseStock: 26, shelfStock: 10, shelfLocation: { label: 'Aisle B2', x: 50, y: 25 } },
  { id: 'p-beschuit', storeId: 'ah-xl', name: 'Rusks', department: 'groceries', category: 'bread', brand: 'Boni', price: 0.99, diet: [], priceTier: 'budget', warehouseStock: 27, shelfStock: 9, shelfLocation: { label: 'Aisle B2', x: 50, y: 25 } },

  { id: 'p-eieren', storeId: 'ah-xl', name: 'Eggs 6pc', department: 'groceries', category: 'eggs', brand: 'AH', price: 1.79, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 35, shelfStock: 13, shelfLocation: { label: 'Aisle C1', x: 82, y: 25 } },
  { id: 'p-boter', storeId: 'ah-xl', name: 'Butter', department: 'groceries', category: 'dairy', brand: 'AH', price: 2.15, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 29, shelfStock: 14, shelfLocation: { label: 'Aisle C1', x: 82, y: 25 } },
  { id: 'p-roomkaas', storeId: 'ah-xl', name: 'Fresh cream cheese', department: 'groceries', category: 'dairy', brand: 'AH', price: 1.99, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 22, shelfStock: 0, shelfLocation: { label: 'Aisle C1', x: 82, y: 25 } },
  { id: 'p-hesp', storeId: 'ah-xl', name: 'Cooked ham', department: 'groceries', category: 'deli', brand: 'AH', price: 2.49, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 33, shelfStock: 12, shelfLocation: { label: 'Aisle C1', x: 82, y: 25 } },
  { id: 'p-salami', storeId: 'ah-xl', name: 'Salami slices', department: 'groceries', category: 'deli', brand: 'AH', price: 2.29, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 34, shelfStock: 11, shelfLocation: { label: 'Aisle C1', x: 82, y: 25 } },

  { id: 'p-wortelen', storeId: 'ah-xl', name: 'Carrots 1kg', department: 'groceries', category: 'vegetables', brand: 'Boni', price: 1.09, diet: ['gluten-free'], priceTier: 'budget', warehouseStock: 40, shelfStock: 16, shelfLocation: { label: 'Aisle F1', x: 18, y: 45 } },
  { id: 'p-aardappelen', storeId: 'ah-xl', name: 'Potatoes 2.5kg', department: 'groceries', category: 'vegetables', brand: 'Boni', price: 2.49, diet: ['gluten-free'], priceTier: 'budget', warehouseStock: 42, shelfStock: 18, shelfLocation: { label: 'Aisle F1', x: 18, y: 45 } },
  { id: 'p-ui', storeId: 'ah-xl', name: 'Onions net', department: 'groceries', category: 'vegetables', brand: 'Boni', price: 0.99, diet: ['gluten-free'], priceTier: 'budget', warehouseStock: 44, shelfStock: 17, shelfLocation: { label: 'Aisle F1', x: 18, y: 45 } },
  { id: 'p-sinaasappels', storeId: 'ah-xl', name: 'Oranges 2kg', department: 'groceries', category: 'fruit', brand: 'AH', price: 2.79, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 38, shelfStock: 15, shelfLocation: { label: 'Aisle F1', x: 18, y: 45 } },
  { id: 'p-druiven', storeId: 'ah-xl', name: 'Seedless grapes', department: 'groceries', category: 'fruit', brand: 'AH', price: 2.99, diet: ['gluten-free'], priceTier: 'premium', warehouseStock: 18, shelfStock: 6, shelfLocation: { label: 'Aisle F1', x: 18, y: 45 } },

  { id: 'p-worst', storeId: 'ah-xl', name: 'Fresh sausages 4pc', department: 'groceries', category: 'meat', brand: 'AH', price: 3.49, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 31, shelfStock: 8, shelfLocation: { label: 'Aisle F2', x: 50, y: 45 } },
  { id: 'p-tofu', storeId: 'ah-xl', name: 'Plain tofu', department: 'groceries', category: 'vegetarian', brand: 'Alpro', price: 2.49, diet: ['gluten-free', 'lactose-free'], priceTier: 'mid', warehouseStock: 21, shelfStock: 7, shelfLocation: { label: 'Aisle F2', x: 50, y: 45 } },

  { id: 'p-tomatensaus', storeId: 'ah-xl', name: 'Tomato sauce', department: 'groceries', category: 'canned', brand: 'Boni', price: 0.89, diet: ['gluten-free'], priceTier: 'budget', warehouseStock: 50, shelfStock: 20, shelfLocation: { label: 'Aisle G2', x: 50, y: 85 } },
  { id: 'p-pesto', storeId: 'ah-xl', name: 'Green pesto', department: 'groceries', category: 'canned', brand: 'AH', price: 1.99, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 32, shelfStock: 12, shelfLocation: { label: 'Aisle G2', x: 50, y: 85 } },
  { id: 'p-bonen-blik', storeId: 'ah-xl', name: 'Canned white beans', department: 'groceries', category: 'canned', brand: 'Boni', price: 0.79, diet: ['gluten-free'], priceTier: 'budget', warehouseStock: 48, shelfStock: 19, shelfLocation: { label: 'Aisle G2', x: 50, y: 85 } },
  { id: 'p-mais-blik', storeId: 'ah-xl', name: 'Canned corn', department: 'groceries', category: 'canned', brand: 'Boni', price: 0.85, diet: ['gluten-free'], priceTier: 'budget', warehouseStock: 46, shelfStock: 18, shelfLocation: { label: 'Aisle G2', x: 50, y: 85 } },
  { id: 'p-olijfolie', storeId: 'ah-xl', name: 'Olive oil 500ml', department: 'groceries', category: 'canned', brand: 'AH', price: 4.29, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 27, shelfStock: 10, shelfLocation: { label: 'Aisle G2', x: 50, y: 85 } },

  { id: 'p-diepvriespizza', storeId: 'ah-xl', name: 'Frozen margherita pizza', department: 'groceries', category: 'frozen', brand: 'AH', price: 2.99, diet: [], priceTier: 'mid', warehouseStock: 36, shelfStock: 13, shelfLocation: { label: 'Aisle G1', x: 18, y: 85 } },
  { id: 'p-frietjes', storeId: 'ah-xl', name: 'Frozen fries 1kg', department: 'groceries', category: 'frozen', brand: 'Boni', price: 1.79, diet: ['gluten-free'], priceTier: 'budget', warehouseStock: 39, shelfStock: 16, shelfLocation: { label: 'Aisle G1', x: 18, y: 85 } },
  { id: 'p-diepvriesgroenten', storeId: 'ah-xl', name: 'Frozen wok vegetables', department: 'groceries', category: 'frozen', brand: 'Boni', price: 1.59, diet: ['gluten-free'], priceTier: 'budget', warehouseStock: 41, shelfStock: 14, shelfLocation: { label: 'Aisle G1', x: 18, y: 85 } },
  { id: 'p-roomijs', storeId: 'ah-xl', name: 'Vanilla ice cream', department: 'groceries', category: 'frozen', brand: 'AH', price: 2.49, diet: [], priceTier: 'mid', warehouseStock: 25, shelfStock: 0, shelfLocation: { label: 'Aisle G1', x: 18, y: 85 } },

  { id: 'p-pils', storeId: 'ah-xl', name: 'Lager 6-pack', department: 'groceries', category: 'drinks', brand: 'AH', price: 3.99, diet: [], priceTier: 'mid', warehouseStock: 43, shelfStock: 15, shelfLocation: { label: 'Aisle E2', x: 50, y: 65 } },
  { id: 'p-rode-wijn', storeId: 'ah-xl', name: 'Red wine', department: 'groceries', category: 'drinks', brand: 'AH', price: 5.49, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 30, shelfStock: 11, shelfLocation: { label: 'Aisle E2', x: 50, y: 65 } },

  { id: 'p-afwasmiddel', storeId: 'ah-xl', name: 'Dish soap', department: 'groceries', category: 'household', brand: 'AH', price: 1.49, diet: [], priceTier: 'budget', warehouseStock: 45, shelfStock: 17, shelfLocation: { label: 'Aisle G3', x: 82, y: 85 } },
  { id: 'p-wc-papier', storeId: 'ah-xl', name: 'Toilet paper 8 rolls', department: 'groceries', category: 'household', brand: 'AH', price: 3.99, diet: [], priceTier: 'mid', warehouseStock: 47, shelfStock: 18, shelfLocation: { label: 'Aisle G3', x: 82, y: 85 } },
  { id: 'p-keukenrol', storeId: 'ah-xl', name: 'Kitchen roll 2pc', department: 'groceries', category: 'household', brand: 'Boni', price: 1.29, diet: [], priceTier: 'budget', warehouseStock: 49, shelfStock: 19, shelfLocation: { label: 'Aisle G3', x: 82, y: 85 } },
  { id: 'p-tandpasta', storeId: 'ah-xl', name: 'Toothpaste', department: 'groceries', category: 'personal-care', brand: 'AH', price: 1.79, diet: [], priceTier: 'mid', warehouseStock: 38, shelfStock: 14, shelfLocation: { label: 'Aisle G3', x: 82, y: 85 } },
  { id: 'p-shampoo', storeId: 'ah-xl', name: 'Shampoo', department: 'groceries', category: 'personal-care', brand: 'AH', price: 2.29, diet: [], priceTier: 'mid', warehouseStock: 35, shelfStock: 12, shelfLocation: { label: 'Aisle G3', x: 82, y: 85 } },

  // ---- MediaMarkt Gent (electronics) ----
  { id: 'p-airpods', storeId: 'mediamarkt', name: 'AirPods', department: 'electronics', category: 'audio', brand: 'Apple', price: 149, diet: [], priceTier: 'premium', warehouseStock: 64, shelfStock: 12, shelfLocation: { label: 'Audio', x: 30, y: 40 } },
  { id: 'p-koptelefoon-sony', storeId: 'mediamarkt', name: 'Wireless headphones', department: 'electronics', category: 'audio', brand: 'Sony', price: 89, diet: [], priceTier: 'mid', warehouseStock: 25, shelfStock: 0, shelfLocation: { label: 'Audio', x: 30, y: 40 } },
  { id: 'p-bluetooth-speaker', storeId: 'mediamarkt', name: 'Bluetooth speaker', department: 'electronics', category: 'audio', brand: 'JBL', price: 59, diet: [], priceTier: 'mid', warehouseStock: 66, shelfStock: 14, shelfLocation: { label: 'Audio', x: 30, y: 40 } },

  { id: 'p-usbc-kabel', storeId: 'mediamarkt', name: 'USB-C cable', department: 'electronics', category: 'accessories', brand: 'Goji', price: 9.99, diet: [], priceTier: 'budget', warehouseStock: 67, shelfStock: 15, shelfLocation: { label: 'Accessories', x: 70, y: 40 } },
  { id: 'p-powerbank', storeId: 'mediamarkt', name: 'Power bank 20,000mAh', department: 'electronics', category: 'accessories', brand: 'Goji', price: 24.99, diet: [], priceTier: 'budget', warehouseStock: 68, shelfStock: 16, shelfLocation: { label: 'Accessories', x: 70, y: 40 } },
  { id: 'p-muis-draadloos', storeId: 'mediamarkt', name: 'Wireless mouse', department: 'electronics', category: 'accessories', brand: 'Logitech', price: 29.99, diet: [], priceTier: 'mid', warehouseStock: 69, shelfStock: 17, shelfLocation: { label: 'Accessories', x: 70, y: 40 } },

  { id: 'p-iphone', storeId: 'mediamarkt', name: 'iPhone 16', department: 'electronics', category: 'smartphones', brand: 'Apple', price: 949, diet: [], priceTier: 'premium', warehouseStock: 70, shelfStock: 18, shelfLocation: { label: 'Smartphones', x: 50, y: 22 } },
  { id: 'p-samsung-galaxy', storeId: 'mediamarkt', name: 'Galaxy S24', department: 'electronics', category: 'smartphones', brand: 'Samsung', price: 699, diet: [], priceTier: 'premium', warehouseStock: 71, shelfStock: 19, shelfLocation: { label: 'Smartphones', x: 50, y: 22 } },

  { id: 'p-laptop-hp', storeId: 'mediamarkt', name: 'Laptop 15"', department: 'electronics', category: 'computers', brand: 'HP', price: 649, diet: [], priceTier: 'mid', warehouseStock: 72, shelfStock: 6, shelfLocation: { label: 'Computers', x: 50, y: 60 } },
  { id: 'p-tablet', storeId: 'mediamarkt', name: 'Tablet 11"', department: 'electronics', category: 'computers', brand: 'Samsung', price: 329, diet: [], priceTier: 'mid', warehouseStock: 73, shelfStock: 7, shelfLocation: { label: 'Computers', x: 50, y: 60 } },

  { id: 'p-tv-lg', storeId: 'mediamarkt', name: 'TV 55" 4K', department: 'electronics', category: 'tv', brand: 'LG', price: 549, diet: [], priceTier: 'mid', warehouseStock: 74, shelfStock: 8, shelfLocation: { label: 'TV & Display', x: 25, y: 75 } },
  { id: 'p-soundbar', storeId: 'mediamarkt', name: 'Soundbar', department: 'electronics', category: 'tv', brand: 'Samsung', price: 199, diet: [], priceTier: 'mid', warehouseStock: 35, shelfStock: 0, shelfLocation: { label: 'TV & Display', x: 25, y: 75 } },

  { id: 'p-playstation', storeId: 'mediamarkt', name: 'PlayStation 5', department: 'electronics', category: 'gaming', brand: 'Sony', price: 549, diet: [], priceTier: 'premium', warehouseStock: 36, shelfStock: 0, shelfLocation: { label: 'Gaming', x: 75, y: 75 } },
  { id: 'p-controller', storeId: 'mediamarkt', name: 'Wireless controller', department: 'electronics', category: 'gaming', brand: 'Sony', price: 69, diet: [], priceTier: 'mid', warehouseStock: 77, shelfStock: 11, shelfLocation: { label: 'Gaming', x: 75, y: 75 } },

  { id: 'p-oortjes', storeId: 'mediamarkt', name: 'Wireless earbuds', department: 'electronics', category: 'audio', brand: 'Peaq', price: 39.99, diet: [], priceTier: 'mid', warehouseStock: 30, shelfStock: 13, shelfLocation: { label: 'Audio', x: 30, y: 40 } },
  { id: 'p-platenspeler', storeId: 'mediamarkt', name: 'Turntable', department: 'electronics', category: 'audio', brand: 'Peaq', price: 99, diet: [], priceTier: 'premium', warehouseStock: 12, shelfStock: 0, shelfLocation: { label: 'Audio', x: 30, y: 40 } },

  { id: 'p-hdmi-kabel', storeId: 'mediamarkt', name: 'HDMI cable 2m', department: 'electronics', category: 'accessories', brand: 'Goji', price: 7.99, diet: [], priceTier: 'budget', warehouseStock: 60, shelfStock: 22, shelfLocation: { label: 'Accessories', x: 70, y: 40 } },
  { id: 'p-oplader', storeId: 'mediamarkt', name: 'USB fast charger', department: 'electronics', category: 'accessories', brand: 'Goji', price: 14.99, diet: [], priceTier: 'budget', warehouseStock: 55, shelfStock: 20, shelfLocation: { label: 'Accessories', x: 70, y: 40 } },
  { id: 'p-telefoonhoesje', storeId: 'mediamarkt', name: 'Phone case', department: 'electronics', category: 'accessories', brand: 'ISY', price: 12.99, diet: [], priceTier: 'budget', warehouseStock: 48, shelfStock: 18, shelfLocation: { label: 'Accessories', x: 70, y: 40 } },
  { id: 'p-laptoptas', storeId: 'mediamarkt', name: 'Laptop bag 15"', department: 'electronics', category: 'accessories', brand: 'ISY', price: 19.99, diet: [], priceTier: 'budget', warehouseStock: 33, shelfStock: 12, shelfLocation: { label: 'Accessories', x: 70, y: 40 } },

  { id: 'p-usb-stick', storeId: 'mediamarkt', name: 'USB stick 64GB', department: 'electronics', category: 'storage', brand: 'Goji', price: 9.99, diet: [], priceTier: 'budget', warehouseStock: 50, shelfStock: 19, shelfLocation: { label: 'Accessories', x: 70, y: 40 } },
  { id: 'p-externe-schijf', storeId: 'mediamarkt', name: 'External hard drive 1TB', department: 'electronics', category: 'storage', brand: 'Goji', price: 59, diet: [], priceTier: 'mid', warehouseStock: 28, shelfStock: 9, shelfLocation: { label: 'Accessories', x: 70, y: 40 } },
  { id: 'p-sd-kaart', storeId: 'mediamarkt', name: 'Memory card 128GB', department: 'electronics', category: 'storage', brand: 'Goji', price: 19.99, diet: [], priceTier: 'budget', warehouseStock: 40, shelfStock: 15, shelfLocation: { label: 'Accessories', x: 70, y: 40 } },

  { id: 'p-toetsenbord', storeId: 'mediamarkt', name: 'Wireless keyboard', department: 'electronics', category: 'computers', brand: 'Goji', price: 24.99, diet: [], priceTier: 'budget', warehouseStock: 32, shelfStock: 11, shelfLocation: { label: 'Computers', x: 50, y: 60 } },
  { id: 'p-monitor', storeId: 'mediamarkt', name: 'Monitor 27"', department: 'electronics', category: 'computers', brand: 'Peaq', price: 159, diet: [], priceTier: 'mid', warehouseStock: 18, shelfStock: 6, shelfLocation: { label: 'Computers', x: 50, y: 60 } },
  { id: 'p-webcam', storeId: 'mediamarkt', name: 'HD webcam', department: 'electronics', category: 'computers', brand: 'ISY', price: 34.99, diet: [], priceTier: 'budget', warehouseStock: 22, shelfStock: 8, shelfLocation: { label: 'Computers', x: 50, y: 60 } },

  { id: 'p-streaming-stick', storeId: 'mediamarkt', name: 'Streaming stick 4K', department: 'electronics', category: 'tv', brand: 'Peaq', price: 49, diet: [], priceTier: 'mid', warehouseStock: 30, shelfStock: 12, shelfLocation: { label: 'TV & Display', x: 25, y: 75 } },

  { id: 'p-smartwatch', storeId: 'mediamarkt', name: 'Smartwatch', department: 'electronics', category: 'wearables', brand: 'Peaq', price: 129, diet: [], priceTier: 'premium', warehouseStock: 20, shelfStock: 8, shelfLocation: { label: 'Wearables', x: 70, y: 22 } },
  { id: 'p-fitnesstracker', storeId: 'mediamarkt', name: 'Fitness tracker', department: 'electronics', category: 'wearables', brand: 'Peaq', price: 49, diet: [], priceTier: 'mid', warehouseStock: 26, shelfStock: 10, shelfLocation: { label: 'Wearables', x: 70, y: 22 } },

  { id: 'p-actiecamera', storeId: 'mediamarkt', name: 'Action camera', department: 'electronics', category: 'photo', brand: 'Peaq', price: 119, diet: [], priceTier: 'premium', warehouseStock: 14, shelfStock: 0, shelfLocation: { label: 'Photo', x: 30, y: 22 } },
  { id: 'p-digitale-camera', storeId: 'mediamarkt', name: 'Digital compact camera', department: 'electronics', category: 'photo', brand: 'Peaq', price: 199, diet: [], priceTier: 'premium', warehouseStock: 11, shelfStock: 5, shelfLocation: { label: 'Photo', x: 30, y: 22 } },

  { id: 'p-slimme-lamp', storeId: 'mediamarkt', name: 'Smart bulb', department: 'electronics', category: 'smart-home', brand: 'Peaq', price: 19.99, diet: [], priceTier: 'budget', warehouseStock: 34, shelfStock: 13, shelfLocation: { label: 'Smart home', x: 50, y: 40 } },
  { id: 'p-slimme-stekker', storeId: 'mediamarkt', name: 'Smart plug', department: 'electronics', category: 'smart-home', brand: 'Peaq', price: 14.99, diet: [], priceTier: 'budget', warehouseStock: 36, shelfStock: 14, shelfLocation: { label: 'Smart home', x: 50, y: 40 } },
  { id: 'p-robotstofzuiger', storeId: 'mediamarkt', name: 'Robot vacuum', department: 'electronics', category: 'smart-home', brand: 'ok.', price: 179, diet: [], priceTier: 'premium', warehouseStock: 10, shelfStock: 4, shelfLocation: { label: 'Smart home', x: 50, y: 40 } },

  { id: 'p-koffiezet', storeId: 'mediamarkt', name: 'Coffee maker', department: 'electronics', category: 'small-appliances', brand: 'ok.', price: 39.99, diet: [], priceTier: 'mid', warehouseStock: 24, shelfStock: 9, shelfLocation: { label: 'Small appliances', x: 75, y: 55 } },
  { id: 'p-airfryer', storeId: 'mediamarkt', name: 'Air fryer', department: 'electronics', category: 'small-appliances', brand: 'ok.', price: 69, diet: [], priceTier: 'mid', warehouseStock: 21, shelfStock: 8, shelfLocation: { label: 'Small appliances', x: 75, y: 55 } },
  { id: 'p-blender', storeId: 'mediamarkt', name: 'Blender', department: 'electronics', category: 'small-appliances', brand: 'ok.', price: 29.99, diet: [], priceTier: 'budget', warehouseStock: 19, shelfStock: 7, shelfLocation: { label: 'Small appliances', x: 75, y: 55 } },
  { id: 'p-waterkoker', storeId: 'mediamarkt', name: 'Kettle', department: 'electronics', category: 'small-appliances', brand: 'ok.', price: 19.99, diet: [], priceTier: 'budget', warehouseStock: 27, shelfStock: 11, shelfLocation: { label: 'Small appliances', x: 75, y: 55 } },
  { id: 'p-stofzuiger', storeId: 'mediamarkt', name: 'Stick vacuum', department: 'electronics', category: 'small-appliances', brand: 'ok.', price: 89, diet: [], priceTier: 'mid', warehouseStock: 16, shelfStock: 6, shelfLocation: { label: 'Small appliances', x: 75, y: 55 } },

  { id: 'p-magnetron', storeId: 'mediamarkt', name: 'Microwave', department: 'electronics', category: 'large-appliances', brand: 'ok.', price: 79, diet: [], priceTier: 'mid', warehouseStock: 13, shelfStock: 5, shelfLocation: { label: 'Appliances', x: 20, y: 55 } },
  { id: 'p-wasmachine', storeId: 'mediamarkt', name: 'Washing machine 7kg', department: 'electronics', category: 'large-appliances', brand: 'ok.', price: 349, diet: [], priceTier: 'premium', warehouseStock: 8, shelfStock: 3, shelfLocation: { label: 'Appliances', x: 20, y: 55 } },
  { id: 'p-koelkast', storeId: 'mediamarkt', name: 'Refrigerator', department: 'electronics', category: 'large-appliances', brand: 'ok.', price: 299, diet: [], priceTier: 'premium', warehouseStock: 7, shelfStock: 0, shelfLocation: { label: 'Appliances', x: 20, y: 55 } },

  // ---- Decathlon Gent (sport) ----
  { id: 'p-voetbal', storeId: 'decathlon', name: 'Football', department: 'sport', category: 'ball-sports', brand: 'Kipsta', price: 12.99, diet: [], priceTier: 'mid', warehouseStock: 78, shelfStock: 12, shelfLocation: { label: 'Team sports', x: 40, y: 22 } },
  { id: 'p-basketbal', storeId: 'decathlon', name: 'Basketball', department: 'sport', category: 'ball-sports', brand: 'Tarmak', price: 14.99, diet: [], priceTier: 'mid', warehouseStock: 79, shelfStock: 13, shelfLocation: { label: 'Team sports', x: 40, y: 22 } },

  { id: 'p-proteinereep', storeId: 'decathlon', name: 'Protein bar', department: 'sport', category: 'sports-nutrition', brand: 'Aptonia', price: 1.99, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 15, shelfStock: 0, shelfLocation: { label: 'Nutrition', x: 75, y: 35 } },
  { id: 'p-isodrank', storeId: 'decathlon', name: 'Isotonic sports drink', department: 'sport', category: 'sports-nutrition', brand: 'Aptonia', price: 2.49, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 31, shelfStock: 15, shelfLocation: { label: 'Nutrition', x: 75, y: 35 } },
  { id: 'p-drinkbus', storeId: 'decathlon', name: 'Water bottle 750ml', department: 'sport', category: 'accessories', brand: 'Kipsta', price: 4.99, diet: [], priceTier: 'budget', warehouseStock: 32, shelfStock: 16, shelfLocation: { label: 'Nutrition', x: 75, y: 35 } },

  { id: 'p-loopschoenen', storeId: 'decathlon', name: 'Running shoes', department: 'sport', category: 'shoes', brand: 'Kalenji', price: 39.99, diet: [], priceTier: 'mid', warehouseStock: 33, shelfStock: 17, shelfLocation: { label: 'Shoes', x: 25, y: 50 } },
  { id: 'p-wandelschoenen', storeId: 'decathlon', name: 'Hiking shoes', department: 'sport', category: 'shoes', brand: 'Quechua', price: 49.99, diet: [], priceTier: 'mid', warehouseStock: 34, shelfStock: 18, shelfLocation: { label: 'Shoes', x: 25, y: 50 } },

  { id: 'p-sportshirt', storeId: 'decathlon', name: 'Sport T-shirt', department: 'sport', category: 'clothing', brand: 'Domyos', price: 7.99, diet: [], priceTier: 'budget', warehouseStock: 35, shelfStock: 19, shelfLocation: { label: 'Clothing', x: 60, y: 50 } },
  { id: 'p-sportbroek', storeId: 'decathlon', name: 'Training pants', department: 'sport', category: 'clothing', brand: 'Domyos', price: 14.99, diet: [], priceTier: 'mid', warehouseStock: 36, shelfStock: 6, shelfLocation: { label: 'Clothing', x: 60, y: 50 } },

  { id: 'p-yogamat', storeId: 'decathlon', name: 'Yoga mat', department: 'sport', category: 'fitness', brand: 'Domyos', price: 19.99, diet: [], priceTier: 'mid', warehouseStock: 37, shelfStock: 7, shelfLocation: { label: 'Fitness', x: 40, y: 75 } },
  { id: 'p-dumbells', storeId: 'decathlon', name: 'Dumbbells 2x5kg', department: 'sport', category: 'fitness', brand: 'Domyos', price: 24.99, diet: [], priceTier: 'mid', warehouseStock: 23, shelfStock: 0, shelfLocation: { label: 'Fitness', x: 40, y: 75 } },
  { id: 'p-fietshelm', storeId: 'decathlon', name: 'Bike helmet', department: 'sport', category: 'cycling', brand: 'Btwin', price: 29.99, diet: [], priceTier: 'mid', warehouseStock: 39, shelfStock: 9, shelfLocation: { label: 'Cycling', x: 75, y: 75 } },

  { id: 'p-volleybal', storeId: 'decathlon', name: 'Volleyball', department: 'sport', category: 'ball-sports', brand: 'Kipsta', price: 11.99, diet: [], priceTier: 'mid', warehouseStock: 30, shelfStock: 11, shelfLocation: { label: 'Team sports', x: 40, y: 22 } },
  { id: 'p-handbal', storeId: 'decathlon', name: 'Handball', department: 'sport', category: 'ball-sports', brand: 'Kipsta', price: 9.99, diet: [], priceTier: 'budget', warehouseStock: 26, shelfStock: 9, shelfLocation: { label: 'Team sports', x: 40, y: 22 } },

  { id: 'p-tennisracket', storeId: 'decathlon', name: 'Tennis racket', department: 'sport', category: 'racket-sports', brand: 'Artengo', price: 24.99, diet: [], priceTier: 'mid', warehouseStock: 18, shelfStock: 7, shelfLocation: { label: 'Racket sports', x: 60, y: 22 } },
  { id: 'p-badmintonset', storeId: 'decathlon', name: 'Badminton set', department: 'sport', category: 'racket-sports', brand: 'Artengo', price: 14.99, diet: [], priceTier: 'mid', warehouseStock: 22, shelfStock: 8, shelfLocation: { label: 'Racket sports', x: 60, y: 22 } },
  { id: 'p-pingpongbat', storeId: 'decathlon', name: 'Table tennis bat', department: 'sport', category: 'racket-sports', brand: 'Artengo', price: 7.99, diet: [], priceTier: 'budget', warehouseStock: 28, shelfStock: 0, shelfLocation: { label: 'Racket sports', x: 60, y: 22 } },

  { id: 'p-zwembril', storeId: 'decathlon', name: 'Swim goggles', department: 'sport', category: 'swimming', brand: 'Nabaiji', price: 6.99, diet: [], priceTier: 'budget', warehouseStock: 34, shelfStock: 14, shelfLocation: { label: 'Swimming', x: 25, y: 22 } },
  { id: 'p-zwembroek', storeId: 'decathlon', name: 'Swim trunks', department: 'sport', category: 'swimming', brand: 'Nabaiji', price: 9.99, diet: [], priceTier: 'budget', warehouseStock: 30, shelfStock: 12, shelfLocation: { label: 'Swimming', x: 25, y: 22 } },
  { id: 'p-badmuts', storeId: 'decathlon', name: 'Swim cap', department: 'sport', category: 'swimming', brand: 'Nabaiji', price: 3.99, diet: [], priceTier: 'budget', warehouseStock: 32, shelfStock: 13, shelfLocation: { label: 'Swimming', x: 25, y: 22 } },

  { id: 'p-voetbalschoenen', storeId: 'decathlon', name: 'Football boots', department: 'sport', category: 'shoes', brand: 'Kipsta', price: 34.99, diet: [], priceTier: 'mid', warehouseStock: 20, shelfStock: 6, shelfLocation: { label: 'Shoes', x: 25, y: 50 } },
  { id: 'p-sandalen', storeId: 'decathlon', name: 'Outdoor sandals', department: 'sport', category: 'shoes', brand: 'Quechua', price: 19.99, diet: [], priceTier: 'mid', warehouseStock: 24, shelfStock: 9, shelfLocation: { label: 'Shoes', x: 25, y: 50 } },

  { id: 'p-sportsokken', storeId: 'decathlon', name: 'Sport socks 3-pack', department: 'sport', category: 'clothing', brand: 'Domyos', price: 5.99, diet: [], priceTier: 'budget', warehouseStock: 40, shelfStock: 16, shelfLocation: { label: 'Clothing', x: 60, y: 50 } },
  { id: 'p-regenjas', storeId: 'decathlon', name: 'Rain jacket', department: 'sport', category: 'clothing', brand: 'Quechua', price: 24.99, diet: [], priceTier: 'mid', warehouseStock: 22, shelfStock: 8, shelfLocation: { label: 'Clothing', x: 60, y: 50 } },
  { id: 'p-fleece', storeId: 'decathlon', name: 'Fleece sweater', department: 'sport', category: 'clothing', brand: 'Quechua', price: 12.99, diet: [], priceTier: 'budget', warehouseStock: 27, shelfStock: 10, shelfLocation: { label: 'Clothing', x: 60, y: 50 } },

  { id: 'p-weerstandsband', storeId: 'decathlon', name: 'Resistance band', department: 'sport', category: 'fitness', brand: 'Domyos', price: 7.99, diet: [], priceTier: 'budget', warehouseStock: 35, shelfStock: 14, shelfLocation: { label: 'Fitness', x: 40, y: 75 } },
  { id: 'p-springtouw', storeId: 'decathlon', name: 'Jump rope', department: 'sport', category: 'fitness', brand: 'Domyos', price: 5.99, diet: [], priceTier: 'budget', warehouseStock: 33, shelfStock: 13, shelfLocation: { label: 'Fitness', x: 40, y: 75 } },
  { id: 'p-kettlebell', storeId: 'decathlon', name: 'Kettlebell 8kg', department: 'sport', category: 'fitness', brand: 'Domyos', price: 19.99, diet: [], priceTier: 'mid', warehouseStock: 16, shelfStock: 0, shelfLocation: { label: 'Fitness', x: 40, y: 75 } },

  { id: 'p-fietsslot', storeId: 'decathlon', name: 'Bike lock', department: 'sport', category: 'cycling', brand: 'Btwin', price: 14.99, diet: [], priceTier: 'mid', warehouseStock: 28, shelfStock: 11, shelfLocation: { label: 'Cycling', x: 75, y: 75 } },
  { id: 'p-fietspomp', storeId: 'decathlon', name: 'Bike pump', department: 'sport', category: 'cycling', brand: 'Btwin', price: 9.99, diet: [], priceTier: 'budget', warehouseStock: 30, shelfStock: 12, shelfLocation: { label: 'Cycling', x: 75, y: 75 } },
  { id: 'p-fietslicht', storeId: 'decathlon', name: 'Bike light set', department: 'sport', category: 'cycling', brand: 'Btwin', price: 12.99, diet: [], priceTier: 'mid', warehouseStock: 26, shelfStock: 10, shelfLocation: { label: 'Cycling', x: 75, y: 75 } },

  { id: 'p-tent', storeId: 'decathlon', name: 'Dome tent 2-person', department: 'sport', category: 'outdoor', brand: 'Quechua', price: 49.99, diet: [], priceTier: 'mid', warehouseStock: 14, shelfStock: 5, shelfLocation: { label: 'Outdoor', x: 75, y: 55 } },
  { id: 'p-slaapzak', storeId: 'decathlon', name: 'Sleeping bag', department: 'sport', category: 'outdoor', brand: 'Quechua', price: 24.99, diet: [], priceTier: 'mid', warehouseStock: 18, shelfStock: 7, shelfLocation: { label: 'Outdoor', x: 75, y: 55 } },
  { id: 'p-rugzak', storeId: 'decathlon', name: 'Hiking backpack 30L', department: 'sport', category: 'outdoor', brand: 'Quechua', price: 29.99, diet: [], priceTier: 'mid', warehouseStock: 20, shelfStock: 8, shelfLocation: { label: 'Outdoor', x: 75, y: 55 } },
  { id: 'p-hoofdlamp', storeId: 'decathlon', name: 'Headlamp', department: 'sport', category: 'outdoor', brand: 'Forclaz', price: 12.99, diet: [], priceTier: 'budget', warehouseStock: 24, shelfStock: 9, shelfLocation: { label: 'Outdoor', x: 75, y: 55 } },

  { id: 'p-eiwitshake', storeId: 'decathlon', name: 'Protein shake powder', department: 'sport', category: 'sports-nutrition', brand: 'Aptonia', price: 14.99, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 22, shelfStock: 8, shelfLocation: { label: 'Nutrition', x: 75, y: 35 } },
  { id: 'p-energiereep', storeId: 'decathlon', name: 'Energy bar', department: 'sport', category: 'sports-nutrition', brand: 'Aptonia', price: 1.49, diet: ['gluten-free'], priceTier: 'budget', warehouseStock: 40, shelfStock: 15, shelfLocation: { label: 'Nutrition', x: 75, y: 35 } },

  // ---- HEMA Veldstraat (toys) ----
  { id: 'p-lego-classic', storeId: 'hema', name: 'Lego Classic box', department: 'toys', category: 'building-toys', brand: 'Lego', price: 29.99, diet: [], priceTier: 'premium', warehouseStock: 40, shelfStock: 10, shelfLocation: { label: 'Toys', x: 35, y: 35 } },
  { id: 'p-houten-blokken', storeId: 'hema', name: 'Wooden blocks', department: 'toys', category: 'building-toys', brand: 'HEMA', price: 12.99, diet: [], priceTier: 'mid', warehouseStock: 41, shelfStock: 11, shelfLocation: { label: 'Toys', x: 35, y: 35 } },
  { id: 'p-knuffelbeer', storeId: 'hema', name: 'Teddy bear', department: 'toys', category: 'plush', brand: 'HEMA', price: 9.99, diet: [], priceTier: 'budget', warehouseStock: 42, shelfStock: 12, shelfLocation: { label: 'Toys', x: 35, y: 35 } },

  { id: 'p-puzzel-1000', storeId: 'hema', name: 'Puzzle 1000 pieces', department: 'toys', category: 'games', brand: 'HEMA', price: 8.99, diet: [], priceTier: 'budget', warehouseStock: 28, shelfStock: 0, shelfLocation: { label: 'Games', x: 70, y: 35 } },
  { id: 'p-gezelschapsspel', storeId: 'hema', name: 'Board game', department: 'toys', category: 'games', brand: 'HEMA', price: 14.99, diet: [], priceTier: 'mid', warehouseStock: 44, shelfStock: 14, shelfLocation: { label: 'Games', x: 70, y: 35 } },
  { id: 'p-kaartspel', storeId: 'hema', name: 'Card game', department: 'toys', category: 'games', brand: 'HEMA', price: 2.99, diet: [], priceTier: 'budget', warehouseStock: 45, shelfStock: 15, shelfLocation: { label: 'Games', x: 70, y: 35 } },

  { id: 'p-tekenset', storeId: 'hema', name: 'Drawing set 24-piece', department: 'toys', category: 'hobby', brand: 'HEMA', price: 6.99, diet: [], priceTier: 'budget', warehouseStock: 46, shelfStock: 16, shelfLocation: { label: 'Hobby', x: 50, y: 70 } },
  { id: 'p-klei', storeId: 'hema', name: 'Modelling clay set', department: 'toys', category: 'hobby', brand: 'HEMA', price: 5.49, diet: [], priceTier: 'budget', warehouseStock: 47, shelfStock: 17, shelfLocation: { label: 'Hobby', x: 50, y: 70 } },

  { id: 'p-treinset', storeId: 'hema', name: 'Wooden train set', department: 'toys', category: 'building-toys', brand: 'HEMA', price: 19.99, diet: [], priceTier: 'mid', warehouseStock: 22, shelfStock: 9, shelfLocation: { label: 'Toys', x: 35, y: 35 } },
  { id: 'p-speelgoedauto', storeId: 'hema', name: 'Toy car', department: 'toys', category: 'vehicles', brand: 'HEMA', price: 4.99, diet: [], priceTier: 'budget', warehouseStock: 40, shelfStock: 16, shelfLocation: { label: 'Toys', x: 35, y: 35 } },
  { id: 'p-knuffelkonijn', storeId: 'hema', name: 'Plush bunny', department: 'toys', category: 'plush', brand: 'HEMA', price: 8.99, diet: [], priceTier: 'budget', warehouseStock: 30, shelfStock: 12, shelfLocation: { label: 'Toys', x: 35, y: 35 } },
  { id: 'p-poppenhuis', storeId: 'hema', name: 'Dollhouse set', department: 'toys', category: 'building-toys', brand: 'HEMA', price: 24.99, diet: [], priceTier: 'premium', warehouseStock: 12, shelfStock: 0, shelfLocation: { label: 'Toys', x: 35, y: 35 } },

  { id: 'p-dobbelspel', storeId: 'hema', name: 'Dice game', department: 'toys', category: 'games', brand: 'HEMA', price: 6.99, diet: [], priceTier: 'budget', warehouseStock: 34, shelfStock: 13, shelfLocation: { label: 'Games', x: 70, y: 35 } },
  { id: 'p-memospel', storeId: 'hema', name: 'Memory game', department: 'toys', category: 'games', brand: 'HEMA', price: 5.99, diet: [], priceTier: 'budget', warehouseStock: 32, shelfStock: 12, shelfLocation: { label: 'Games', x: 70, y: 35 } },
  { id: 'p-domino', storeId: 'hema', name: 'Dominoes', department: 'toys', category: 'games', brand: 'HEMA', price: 7.99, diet: [], priceTier: 'budget', warehouseStock: 28, shelfStock: 11, shelfLocation: { label: 'Games', x: 70, y: 35 } },

  { id: 'p-verfset', storeId: 'hema', name: 'Paint set with brushes', department: 'toys', category: 'hobby', brand: 'HEMA', price: 9.99, diet: [], priceTier: 'mid', warehouseStock: 26, shelfStock: 10, shelfLocation: { label: 'Hobby', x: 50, y: 70 } },
  { id: 'p-kralen-set', storeId: 'hema', name: 'Beads set', department: 'toys', category: 'hobby', brand: 'HEMA', price: 6.49, diet: [], priceTier: 'budget', warehouseStock: 30, shelfStock: 12, shelfLocation: { label: 'Hobby', x: 50, y: 70 } },
  { id: 'p-stickervellen', storeId: 'hema', name: 'Sticker sheets', department: 'toys', category: 'hobby', brand: 'HEMA', price: 2.49, diet: [], priceTier: 'budget', warehouseStock: 45, shelfStock: 17, shelfLocation: { label: 'Hobby', x: 50, y: 70 } },

  { id: 'p-balpennen', storeId: 'hema', name: 'Ballpoint pens 4pc', department: 'toys', category: 'stationery', brand: 'HEMA', price: 2.99, diet: [], priceTier: 'budget', warehouseStock: 50, shelfStock: 20, shelfLocation: { label: 'Stationery', x: 50, y: 35 } },
  { id: 'p-notitieboek', storeId: 'hema', name: 'Notebook A5', department: 'toys', category: 'stationery', brand: 'HEMA', price: 3.49, diet: [], priceTier: 'budget', warehouseStock: 42, shelfStock: 16, shelfLocation: { label: 'Stationery', x: 50, y: 35 } },
  { id: 'p-markeerstiften', storeId: 'hema', name: 'Highlighters 4pc', department: 'toys', category: 'stationery', brand: 'HEMA', price: 3.99, diet: [], priceTier: 'budget', warehouseStock: 38, shelfStock: 15, shelfLocation: { label: 'Stationery', x: 50, y: 35 } },

  { id: 'p-bellenblaas', storeId: 'hema', name: 'Bubble blower', department: 'toys', category: 'outdoor-toys', brand: 'HEMA', price: 1.99, diet: [], priceTier: 'budget', warehouseStock: 48, shelfStock: 18, shelfLocation: { label: 'Outdoor', x: 20, y: 55 } },
  { id: 'p-emmer-schepje', storeId: 'hema', name: 'Bucket & spade', department: 'toys', category: 'outdoor-toys', brand: 'HEMA', price: 3.99, diet: [], priceTier: 'budget', warehouseStock: 36, shelfStock: 14, shelfLocation: { label: 'Outdoor', x: 20, y: 55 } },
  { id: 'p-vlieger', storeId: 'hema', name: 'Kite', department: 'toys', category: 'outdoor-toys', brand: 'HEMA', price: 6.99, diet: [], priceTier: 'budget', warehouseStock: 24, shelfStock: 0, shelfLocation: { label: 'Outdoor', x: 20, y: 55 } },

  { id: 'p-verjaardagskaarsjes', storeId: 'hema', name: 'Birthday candles', department: 'toys', category: 'party', brand: 'HEMA', price: 1.49, diet: [], priceTier: 'budget', warehouseStock: 52, shelfStock: 21, shelfLocation: { label: 'Party & home', x: 70, y: 70 } },
  { id: 'p-slingers', storeId: 'hema', name: 'Party garlands', department: 'toys', category: 'party', brand: 'HEMA', price: 2.99, diet: [], priceTier: 'budget', warehouseStock: 44, shelfStock: 17, shelfLocation: { label: 'Party & home', x: 70, y: 70 } },
  { id: 'p-wegwerpbordjes', storeId: 'hema', name: 'Disposable plates 10pc', department: 'toys', category: 'party', brand: 'HEMA', price: 2.49, diet: [], priceTier: 'budget', warehouseStock: 46, shelfStock: 18, shelfLocation: { label: 'Party & home', x: 70, y: 70 } },
  { id: 'p-geurkaars', storeId: 'hema', name: 'Scented candle', department: 'toys', category: 'home', brand: 'HEMA', price: 4.99, diet: [], priceTier: 'mid', warehouseStock: 28, shelfStock: 11, shelfLocation: { label: 'Party & home', x: 70, y: 70 } },

  // ---- Delhaize Sint-Pieters (groceries) ----
  // targetShelfStock = normal shelf capacity; demo mix: out / empty shelves / on shelves without warehouse / almost out / plenty
  { id: 'p-dh-spaghetti', storeId: 'delhaize', name: 'Spaghetti', department: 'groceries', category: 'pasta', brand: 'Delhaize', price: 1.09, diet: [], priceTier: 'mid', targetShelfStock: 12, warehouseStock: 45, shelfStock: 11, shelfLocation: { label: 'Aisle 1', x: 20, y: 25 } },
  { id: 'p-dh-penne-365', storeId: 'delhaize', name: 'Penne', department: 'groceries', category: 'pasta', brand: 'Delhaize 365', price: 0.69, diet: [], priceTier: 'budget', targetShelfStock: 12, warehouseStock: 38, shelfStock: 10, shelfLocation: { label: 'Aisle 1', x: 20, y: 25 } },
  { id: 'p-dh-glutenvrije-pasta', storeId: 'delhaize', name: 'Gluten-free fusilli', department: 'groceries', category: 'pasta', brand: 'Schär', price: 2.59, diet: ['gluten-free'], priceTier: 'premium', targetShelfStock: 10, warehouseStock: 28, shelfStock: 4, shelfLocation: { label: 'Aisle 1', x: 20, y: 25 } },

  { id: 'p-dh-volkorenbrood', storeId: 'delhaize', name: 'Wholewheat bread', department: 'groceries', category: 'bread', brand: 'Delhaize', price: 1.59, diet: [], priceTier: 'mid', targetShelfStock: 10, warehouseStock: 32, shelfStock: 9, shelfLocation: { label: 'Aisle 2', x: 50, y: 25 } },
  { id: 'p-dh-glutenvrij-brood', storeId: 'delhaize', name: 'Gluten-free bread', department: 'groceries', category: 'bread', brand: 'Schär', price: 3.29, diet: ['gluten-free'], priceTier: 'premium', targetShelfStock: 10, warehouseStock: 24, shelfStock: 0, shelfLocation: { label: 'Aisle 2', x: 50, y: 25 } },
  { id: 'p-dh-witbrood', storeId: 'delhaize', name: 'White bread', department: 'groceries', category: 'bread', brand: 'Delhaize 365', price: 0.95, diet: [], priceTier: 'budget', targetShelfStock: 10, warehouseStock: 30, shelfStock: 3, shelfLocation: { label: 'Aisle 2', x: 50, y: 25 } },

  { id: 'p-dh-melk', storeId: 'delhaize', name: 'Semi-skimmed milk', department: 'groceries', category: 'dairy', brand: 'Delhaize', price: 1.05, diet: [], priceTier: 'budget', targetShelfStock: 15, warehouseStock: 55, shelfStock: 14, shelfLocation: { label: 'Aisle 3', x: 80, y: 25 } },
  { id: 'p-dh-sojadrink', storeId: 'delhaize', name: 'Soy drink', department: 'groceries', category: 'dairy', brand: 'Alpro', price: 2.09, diet: ['gluten-free', 'lactose-free'], priceTier: 'mid', targetShelfStock: 10, warehouseStock: 22, shelfStock: 5, shelfLocation: { label: 'Aisle 3', x: 80, y: 25 } },
  { id: 'p-dh-yoghurt', storeId: 'delhaize', name: 'Greek yoghurt', department: 'groceries', category: 'dairy', brand: 'Delhaize', price: 1.79, diet: [], priceTier: 'mid', targetShelfStock: 8, warehouseStock: 26, shelfStock: 7, shelfLocation: { label: 'Aisle 3', x: 80, y: 25 } },

  { id: 'p-dh-koffie', storeId: 'delhaize', name: 'Ground coffee', department: 'groceries', category: 'coffee', brand: 'Douwe Egberts', price: 4.99, diet: ['gluten-free'], priceTier: 'mid', targetShelfStock: 10, warehouseStock: 20, shelfStock: 2, shelfLocation: { label: 'Aisle 4', x: 80, y: 65 } },
  { id: 'p-dh-koffiebonen', storeId: 'delhaize', name: 'Coffee beans', department: 'groceries', category: 'coffee', brand: 'Lavazza', price: 7.29, diet: ['gluten-free'], priceTier: 'premium', targetShelfStock: 8, warehouseStock: 18, shelfStock: 6, shelfLocation: { label: 'Aisle 4', x: 80, y: 65 } },

  { id: 'p-dh-appels', storeId: 'delhaize', name: 'Apples 1kg', department: 'groceries', category: 'fruit', brand: 'Delhaize', price: 2.19, diet: ['gluten-free'], priceTier: 'mid', targetShelfStock: 10, warehouseStock: 0, shelfStock: 0, shelfLocation: { label: 'Aisle 5', x: 20, y: 45 } },
  { id: 'p-dh-sla', storeId: 'delhaize', name: 'Head of lettuce', department: 'groceries', category: 'vegetables', brand: 'Delhaize', price: 1.15, diet: ['gluten-free'], priceTier: 'budget', targetShelfStock: 10, warehouseStock: 0, shelfStock: 0, shelfLocation: { label: 'Aisle 5', x: 20, y: 45 } },

  { id: 'p-dh-kipfilet', storeId: 'delhaize', name: 'Chicken breast 500g', department: 'groceries', category: 'meat', brand: 'Delhaize', price: 4.79, diet: ['gluten-free'], priceTier: 'mid', targetShelfStock: 8, warehouseStock: 16, shelfStock: 3, shelfLocation: { label: 'Aisle 6', x: 50, y: 45 } },
  { id: 'p-dh-spek', storeId: 'delhaize', name: 'Smoked bacon', department: 'groceries', category: 'meat', brand: 'Delhaize', price: 2.39, diet: ['gluten-free'], priceTier: 'mid', targetShelfStock: 10, warehouseStock: 35, shelfStock: 9, shelfLocation: { label: 'Aisle 6', x: 50, y: 45 } },

  { id: 'p-dh-cola', storeId: 'delhaize', name: 'Cola 6-pack', department: 'groceries', category: 'soda', brand: 'Coca-Cola', price: 4.69, diet: [], priceTier: 'mid', targetShelfStock: 12, warehouseStock: 40, shelfStock: 0, shelfLocation: { label: 'Aisle 7', x: 50, y: 65 } },
  { id: 'p-dh-chips', storeId: 'delhaize', name: 'Paprika crisps', department: 'groceries', category: 'snacks', brand: "Lay's", price: 1.89, diet: [], priceTier: 'mid', targetShelfStock: 10, warehouseStock: 42, shelfStock: 4, shelfLocation: { label: 'Aisle 7', x: 50, y: 65 } },

  { id: 'p-dh-macaroni', storeId: 'delhaize', name: 'Macaroni', department: 'groceries', category: 'pasta', brand: 'Delhaize 365', price: 0.75, diet: [], priceTier: 'budget', warehouseStock: 40, shelfStock: 16, shelfLocation: { label: 'Aisle 1', x: 20, y: 25 } },
  { id: 'p-dh-rijst', storeId: 'delhaize', name: 'White rice 1kg', department: 'groceries', category: 'pasta', brand: 'Delhaize', price: 1.95, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 36, shelfStock: 14, shelfLocation: { label: 'Aisle 1', x: 20, y: 25 } },

  { id: 'p-dh-pistolets', storeId: 'delhaize', name: 'Bread rolls 6pc', department: 'groceries', category: 'bread', brand: 'Delhaize', price: 1.45, diet: [], priceTier: 'mid', warehouseStock: 32, shelfStock: 12, shelfLocation: { label: 'Aisle 2', x: 50, y: 25 } },
  { id: 'p-dh-cornflakes', storeId: 'delhaize', name: 'Cornflakes', department: 'groceries', category: 'breakfast', brand: 'Delhaize', price: 2.49, diet: [], priceTier: 'mid', warehouseStock: 30, shelfStock: 11, shelfLocation: { label: 'Aisle 2', x: 50, y: 25 } },
  { id: 'p-dh-muesli', storeId: 'delhaize', name: 'Muesli', department: 'groceries', category: 'breakfast', brand: 'Delhaize', price: 2.99, diet: [], priceTier: 'mid', warehouseStock: 28, shelfStock: 10, shelfLocation: { label: 'Aisle 2', x: 50, y: 25 } },

  { id: 'p-dh-eieren', storeId: 'delhaize', name: 'Eggs 6pc', department: 'groceries', category: 'eggs', brand: 'Delhaize', price: 1.85, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 34, shelfStock: 13, shelfLocation: { label: 'Aisle 3', x: 80, y: 25 } },
  { id: 'p-dh-boter', storeId: 'delhaize', name: 'Butter', department: 'groceries', category: 'dairy', brand: 'Delhaize', price: 2.25, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 29, shelfStock: 12, shelfLocation: { label: 'Aisle 3', x: 80, y: 25 } },
  { id: 'p-dh-geraspte-kaas', storeId: 'delhaize', name: 'Grated cheese', department: 'groceries', category: 'dairy', brand: 'Delhaize', price: 2.19, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 26, shelfStock: 0, shelfLocation: { label: 'Aisle 3', x: 80, y: 25 } },
  { id: 'p-dh-hesp', storeId: 'delhaize', name: 'Cooked ham', department: 'groceries', category: 'deli', brand: 'Delhaize', price: 2.45, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 31, shelfStock: 11, shelfLocation: { label: 'Aisle 3', x: 80, y: 25 } },

  { id: 'p-dh-wortelen', storeId: 'delhaize', name: 'Carrots 1kg', department: 'groceries', category: 'vegetables', brand: 'Delhaize', price: 1.15, diet: ['gluten-free'], priceTier: 'budget', warehouseStock: 42, shelfStock: 17, shelfLocation: { label: 'Aisle 5', x: 20, y: 45 } },
  { id: 'p-dh-ui', storeId: 'delhaize', name: 'Onions net', department: 'groceries', category: 'vegetables', brand: 'Delhaize', price: 1.05, diet: ['gluten-free'], priceTier: 'budget', warehouseStock: 44, shelfStock: 18, shelfLocation: { label: 'Aisle 5', x: 20, y: 45 } },
  { id: 'p-dh-bananen', storeId: 'delhaize', name: 'Bananas 1kg', department: 'groceries', category: 'fruit', brand: 'Delhaize', price: 1.75, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 38, shelfStock: 15, shelfLocation: { label: 'Aisle 5', x: 20, y: 45 } },

  { id: 'p-dh-gehakt', storeId: 'delhaize', name: 'Ground beef 500g', department: 'groceries', category: 'meat', brand: 'Delhaize', price: 3.49, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 33, shelfStock: 12, shelfLocation: { label: 'Aisle 6', x: 50, y: 45 } },
  { id: 'p-dh-zalm', storeId: 'delhaize', name: 'Salmon fillet 2pc', department: 'groceries', category: 'fish', brand: 'Delhaize', price: 8.29, diet: ['gluten-free'], priceTier: 'premium', warehouseStock: 16, shelfStock: 6, shelfLocation: { label: 'Aisle 6', x: 50, y: 45 } },

  { id: 'p-dh-tomatensaus', storeId: 'delhaize', name: 'Tomato sauce', department: 'groceries', category: 'canned', brand: 'Delhaize', price: 0.95, diet: ['gluten-free'], priceTier: 'budget', warehouseStock: 48, shelfStock: 19, shelfLocation: { label: 'Aisle 9', x: 80, y: 45 } },
  { id: 'p-dh-bonen-blik', storeId: 'delhaize', name: 'Canned white beans', department: 'groceries', category: 'canned', brand: 'Delhaize 365', price: 0.85, diet: ['gluten-free'], priceTier: 'budget', warehouseStock: 46, shelfStock: 18, shelfLocation: { label: 'Aisle 9', x: 80, y: 45 } },
  { id: 'p-dh-olijfolie', storeId: 'delhaize', name: 'Olive oil 500ml', department: 'groceries', category: 'canned', brand: 'Delhaize', price: 4.49, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 25, shelfStock: 9, shelfLocation: { label: 'Aisle 9', x: 80, y: 45 } },

  { id: 'p-dh-diepvriespizza', storeId: 'delhaize', name: 'Frozen margherita pizza', department: 'groceries', category: 'frozen', brand: 'Delhaize', price: 3.19, diet: [], priceTier: 'mid', warehouseStock: 34, shelfStock: 13, shelfLocation: { label: 'Aisle 8', x: 20, y: 65 } },
  { id: 'p-dh-frietjes', storeId: 'delhaize', name: 'Frozen fries 1kg', department: 'groceries', category: 'frozen', brand: 'Delhaize 365', price: 1.89, diet: ['gluten-free'], priceTier: 'budget', warehouseStock: 37, shelfStock: 15, shelfLocation: { label: 'Aisle 8', x: 20, y: 65 } },
  { id: 'p-dh-roomijs', storeId: 'delhaize', name: 'Vanilla ice cream', department: 'groceries', category: 'frozen', brand: 'Delhaize', price: 2.59, diet: [], priceTier: 'mid', warehouseStock: 22, shelfStock: 0, shelfLocation: { label: 'Aisle 8', x: 20, y: 65 } },

  { id: 'p-dh-bier', storeId: 'delhaize', name: 'Lager 6-pack', department: 'groceries', category: 'drinks', brand: 'Delhaize', price: 4.19, diet: [], priceTier: 'mid', warehouseStock: 41, shelfStock: 16, shelfLocation: { label: 'Aisle 7', x: 50, y: 65 } },
  { id: 'p-dh-wijn', storeId: 'delhaize', name: 'Red wine', department: 'groceries', category: 'drinks', brand: 'Delhaize', price: 5.99, diet: ['gluten-free'], priceTier: 'mid', warehouseStock: 28, shelfStock: 11, shelfLocation: { label: 'Aisle 7', x: 50, y: 65 } },

  { id: 'p-dh-afwasmiddel', storeId: 'delhaize', name: 'Dish soap', department: 'groceries', category: 'household', brand: 'Delhaize', price: 1.55, diet: [], priceTier: 'budget', warehouseStock: 43, shelfStock: 17, shelfLocation: { label: 'Aisle 10', x: 50, y: 85 } },
  { id: 'p-dh-wc-papier', storeId: 'delhaize', name: 'Toilet paper 8 rolls', department: 'groceries', category: 'household', brand: 'Delhaize', price: 4.19, diet: [], priceTier: 'mid', warehouseStock: 45, shelfStock: 18, shelfLocation: { label: 'Aisle 10', x: 50, y: 85 } },
  { id: 'p-dh-tandpasta', storeId: 'delhaize', name: 'Toothpaste', department: 'groceries', category: 'personal-care', brand: 'Delhaize', price: 1.85, diet: [], priceTier: 'mid', warehouseStock: 35, shelfStock: 13, shelfLocation: { label: 'Aisle 10', x: 50, y: 85 } },
  { id: 'p-dh-shampoo', storeId: 'delhaize', name: 'Shampoo', department: 'groceries', category: 'personal-care', brand: 'Delhaize', price: 2.39, diet: [], priceTier: 'mid', warehouseStock: 32, shelfStock: 12, shelfLocation: { label: 'Aisle 10', x: 50, y: 85 } },
]

export function getProduct(id) {
  return products.find((p) => p.id === id) || null
}

export function productsByStore(storeId) {
  return products.filter((p) => p.storeId === storeId)
}

/** Unique product categories per store (for shelf labels on the floor plan). */
export function categoriesForStore(storeId) {
  const cats = new Set()
  for (const p of products) {
    if (p.storeId === storeId && p.category) cats.add(p.category)
  }
  return [...cats].sort((a, b) => a.localeCompare(b, 'en'))
}
