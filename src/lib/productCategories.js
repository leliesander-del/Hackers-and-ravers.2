/** Weergavenaam voor product-categorieën (rek-labels op de plattegrond). */
const CATEGORY_LABELS = {
  pasta: 'Pasta',
  brood: 'Brood',
  zuivel: 'Zuivel',
  koffie: 'Koffie',
  frisdrank: 'Frisdrank',
  snacks: 'Snacks',
  fruit: 'Fruit',
  groenten: 'Groenten',
  vlees: 'Vlees',
  vis: 'Vis',
  ontbijt: 'Ontbijt',
  eieren: 'Eieren',
  beleg: 'Beleg',
  vega: 'Vega',
  verzorging: 'Verzorging',
  audio: 'Audio',
  accessoires: 'Accessoires',
  smartphones: 'Smartphones',
  computers: 'Computers',
  tv: 'TV & Beeld',
  gaming: 'Gaming',
  balsport: 'Balsport',
  sportvoeding: 'Sportvoeding',
  schoenen: 'Schoenen',
  kleding: 'Kleding',
  fitness: 'Fitness',
  fietsen: 'Fietsen',
  bouwspeelgoed: 'Bouwspeelgoed',
  knuffels: 'Knuffels',
  spellen: 'Spellen',
  hobby: 'Hobby',
}

export function formatCategoryLabel(c) {
  if (!c) return ''
  return CATEGORY_LABELS[c] || c.charAt(0).toUpperCase() + c.slice(1)
}
