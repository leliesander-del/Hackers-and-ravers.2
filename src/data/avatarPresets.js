// Voorgestelde profielfoto's — elk met een achtergrondkleur die contrasteert met het pictogram.
export const AVATAR_PRESETS = [
  { id: 'winkel', label: 'Winkel', emoji: '🛒', kleur: '#0ea5e9' },
  { id: 'chef', label: 'Chef', emoji: '👨‍🍳', kleur: '#6366f1' },
  { id: 'groen', label: 'Groen', emoji: '🥗', kleur: '#f97316' },
  { id: 'fruit', label: 'Fruit', emoji: '🍎', kleur: '#2563eb' },
  { id: 'koffie', label: 'Koffie', emoji: '☕', kleur: '#14b8a6' },
  {
    id: 'oma',
    label: 'Oma',
    image: '/avatars/oma.png',
    kleur: '#FFFFFF', // white — geen grijs, beige of bruin uit het gezicht
  },
  { id: 'huis', label: 'Thuis', emoji: '🏠', kleur: '#ec4899' },
  { id: 'ster', label: 'Ster', emoji: '⭐', kleur: '#7c3aed' },
  { id: 'hart', label: 'Hart', emoji: '💜', kleur: '#22c55e' },
]

export function getAvatarPreset(id) {
  const zoekId = id === 'sport' ? 'oma' : id
  return AVATAR_PRESETS.find((p) => p.id === zoekId) || null
}
