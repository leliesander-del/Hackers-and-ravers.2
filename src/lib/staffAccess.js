// Tijdelijk: enkel Lisa (profiel-id 'bediende') heeft toegang tot het personeelspaneel.
const GEKWALIFICEERDE_BEDIENDEN = new Set(['bediende'])

export function isGekwalificeerdeBediende(profile) {
  return profile?.type === 'bediende' && GEKWALIFICEERDE_BEDIENDEN.has(profile.id)
}
