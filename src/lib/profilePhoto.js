import { getAvatarPreset } from '../data/avatarPresets.js'

/** Neutrale achtergrond — geen profielkleur, zodat die niet samenvalt met de foto. */
export const PROFIEL_FOTO_ACHTERGROND = '#f1f5f9'
const EXPORT_GROOTTE = 320

export function isCustomProfielFoto(value) {
  return typeof value === 'string' && value.startsWith('data:')
}

function laadAfbeelding(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Afbeelding laden mislukt'))
    }
    img.src = url
  })
}

/** Vierkant bijsnijden op neutrale achtergrond (geen transparantie / profielkleur). */
export async function processProfielFotoBestand(file) {
  const img = await laadAfbeelding(file)
  const canvas = document.createElement('canvas')
  canvas.width = EXPORT_GROOTTE
  canvas.height = EXPORT_GROOTTE
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas niet beschikbaar')

  ctx.fillStyle = PROFIEL_FOTO_ACHTERGROND
  ctx.fillRect(0, 0, EXPORT_GROOTTE, EXPORT_GROOTTE)

  const scale = Math.max(EXPORT_GROOTTE / img.width, EXPORT_GROOTTE / img.height)
  const w = img.width * scale
  const h = img.height * scale
  const x = (EXPORT_GROOTTE - w) / 2
  const y = (EXPORT_GROOTTE - h) / 2
  ctx.drawImage(img, x, y, w, h)

  return canvas.toDataURL('image/jpeg', 0.88)
}

/** Weergave-info voor ProfileAvatar: preset, eigen foto of initiaal. */
export function resolveProfielFoto(profile) {
  const foto = profile?.profielFoto
  if (isCustomProfielFoto(foto)) {
    return { mode: 'custom', src: foto }
  }
  const preset = getAvatarPreset(foto)
  if (preset) {
    return { mode: 'preset', preset }
  }
  return {
    mode: 'initial',
    letter: (profile?.naam || '?')[0]?.toUpperCase() || '?',
    kleur: profile?.kleur || '#7c3aed',
  }
}
