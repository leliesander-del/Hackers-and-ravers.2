// Acties/deals. `doelgroep` bevat tags die matchen met profielvoorkeuren
// (afdeling, dieet, prijsklasse of merk). De Wallet toont per profiel andere deals.

export const deals = [
  { id: 'd-glutenvrij', titel: '15% op glutenvrije producten', winkel: 'AH XL Brugge', korting: '-15%', kleur: '#7c3aed', doelgroep: ['glutenvrij', 'boodschappen'] },
  { id: 'd-lavazza', titel: '2+1 gratis Lavazza koffie', winkel: 'AH XL Brugge', korting: '2+1', kleur: '#6b4226', doelgroep: ['premium', 'Lavazza', 'boodschappen'] },
  { id: 'd-cola', titel: 'Cola multipack €3,50', winkel: 'Delhaize', korting: '€3,50', kleur: '#d11f2e', doelgroep: ['budget', 'Coca-Cola', 'boodschappen'] },
  { id: 'd-lego', titel: '20% op alle Lego', winkel: 'HEMA', korting: '-20%', kleur: '#facc15', doelgroep: ['speelgoed', 'Lego'] },
  { id: 'd-airpods', titel: 'AirPods nu €129', winkel: 'MediaMarkt', korting: '€129', kleur: '#111827', doelgroep: ['elektronica', 'premium', 'Apple'] },
  { id: 'd-huismerk', titel: '1+1 gratis huismerk', winkel: 'AH XL Brugge', korting: '1+1', kleur: '#0aa0e0', doelgroep: ['budget', 'boodschappen'] },
  { id: 'd-sport', titel: '10% op sportvoeding', winkel: 'Decathlon', korting: '-10%', kleur: '#1559b2', doelgroep: ['sport'] },
  { id: 'd-zuivel', titel: 'Alpro 2e halve prijs', winkel: 'AH XL Brugge', korting: '-50%', kleur: '#16a34a', doelgroep: ['glutenvrij', 'Alpro', 'boodschappen'] },
  { id: 'd-weekend', titel: 'Weekendkorting verse broodjes', winkel: 'Delhaize', korting: '-30%', kleur: '#ea580c', doelgroep: ['boodschappen'] },
  { id: 'd-multipack', titel: 'Familie multipacks in actie', winkel: 'Delhaize', korting: 'deal', kleur: '#0ea5e9', doelgroep: ['budget', 'boodschappen'] },
]
