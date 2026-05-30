/** Display name for product categories (shelf labels on the floor plan). */
const CATEGORY_LABELS = {
  // groceries
  pasta: 'Pasta',
  bread: 'Bread',
  dairy: 'Dairy',
  coffee: 'Coffee',
  soda: 'Soft drinks',
  snacks: 'Snacks',
  fruit: 'Fruit',
  vegetables: 'Vegetables',
  meat: 'Meat',
  fish: 'Fish',
  breakfast: 'Breakfast',
  eggs: 'Eggs',
  deli: 'Deli',
  vegetarian: 'Vegetarian',
  canned: 'Canned goods',
  frozen: 'Frozen',
  drinks: 'Drinks',
  household: 'Household',
  'personal-care': 'Personal care',
  // electronics
  audio: 'Audio',
  accessories: 'Accessories',
  smartphones: 'Smartphones',
  computers: 'Computers',
  tv: 'TV & Display',
  gaming: 'Gaming',
  wearables: 'Wearables',
  photo: 'Photo',
  'smart-home': 'Smart home',
  'small-appliances': 'Small appliances',
  'large-appliances': 'Appliances',
  storage: 'Storage',
  // sport
  'ball-sports': 'Ball sports',
  'sports-nutrition': 'Sports nutrition',
  shoes: 'Shoes',
  clothing: 'Clothing',
  fitness: 'Fitness',
  cycling: 'Cycling',
  'racket-sports': 'Racket sports',
  swimming: 'Swimming',
  outdoor: 'Outdoor',
  // toys
  'building-toys': 'Building toys',
  plush: 'Plush',
  games: 'Games',
  hobby: 'Hobby',
  stationery: 'Stationery',
  'outdoor-toys': 'Outdoor toys',
  party: 'Party',
  home: 'Home',
  vehicles: 'Vehicles',
}

export function formatCategoryLabel(c) {
  if (!c) return ''
  return CATEGORY_LABELS[c] || c.charAt(0).toUpperCase() + c.slice(1)
}
