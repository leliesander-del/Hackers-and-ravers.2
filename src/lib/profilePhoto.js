import { getAvatarPreset } from '../data/avatarPresets.js'

/** Neutral background — not the profile color, so it doesn't clash with the photo. */
export const PROFILE_PHOTO_BACKGROUND = '#f1f5f9'
const EXPORT_SIZE = 320

export function isCustomProfilePhoto(value) {
  return typeof value === 'string' && value.startsWith('data:')
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    img.src = url
  })
}

/** Square crop on a neutral background (no transparency / profile color). */
export async function processProfilePhotoFile(file) {
  const img = await loadImage(file)
  const canvas = document.createElement('canvas')
  canvas.width = EXPORT_SIZE
  canvas.height = EXPORT_SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not available')

  ctx.fillStyle = PROFILE_PHOTO_BACKGROUND
  ctx.fillRect(0, 0, EXPORT_SIZE, EXPORT_SIZE)

  const scale = Math.max(EXPORT_SIZE / img.width, EXPORT_SIZE / img.height)
  const w = img.width * scale
  const h = img.height * scale
  const x = (EXPORT_SIZE - w) / 2
  const y = (EXPORT_SIZE - h) / 2
  ctx.drawImage(img, x, y, w, h)

  return canvas.toDataURL('image/jpeg', 0.88)
}

/** Display info for ProfileAvatar: preset, custom photo or initial. */
export function resolveProfilePhoto(profile) {
  const photo = profile?.profilePhoto
  if (isCustomProfilePhoto(photo)) {
    return { mode: 'custom', src: photo }
  }
  const preset = getAvatarPreset(photo)
  if (preset) {
    return { mode: 'preset', preset }
  }
  return {
    mode: 'initial',
    letter: (profile?.name || '?')[0]?.toUpperCase() || '?',
    color: profile?.color || '#7c3aed',
  }
}
