import { resolveProfilePhoto } from '../lib/profilePhoto.js'
import PresetAvatarFace from './PresetAvatarFace.jsx'

const SIZES = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-12 w-12 text-lg',
  lg: 'h-24 w-24 text-4xl',
  xl: 'h-32 w-32 text-5xl',
}

const RING_NEUTRAL = 'ring-2 ring-slate-300 shadow-sm'

export default function ProfileAvatar({ profile, size = 'md', className = '' }) {
  const info = resolveProfilePhoto(profile)
  const dim = SIZES[size] || SIZES.md

  if (info.mode === 'custom') {
    return (
      <div
        className={`${dim} shrink-0 overflow-hidden rounded-full bg-slate-100 ${RING_NEUTRAL} ${className}`}
      >
        <img src={info.src} alt="" className="h-full w-full object-cover" />
      </div>
    )
  }

  if (info.mode === 'preset') {
    const emojiSize = size === 'xl' ? 'text-5xl' : size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-lg' : 'text-sm'
    return (
      <span
        className={`${dim} flex shrink-0 items-center justify-center rounded-full bg-white p-0.5 ${RING_NEUTRAL} ${className}`}
        aria-hidden
      >
        <PresetAvatarFace
          emoji={info.preset.emoji}
          image={info.preset.image}
          color={info.preset.color}
          emojiClass={emojiSize}
          alt={info.preset.image ? info.preset.label : ''}
        />
      </span>
    )
  }

  return (
    <span
      className={`${dim} flex shrink-0 items-center justify-center rounded-full bg-white p-0.5 font-bold text-white ${RING_NEUTRAL} ${className}`}
      aria-hidden
    >
      <span
        className="flex h-full w-full items-center justify-center rounded-full"
        style={{ backgroundColor: info.color }}
      >
        {info.letter}
      </span>
    </span>
  )
}
