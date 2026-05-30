import { useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import ProfileAvatar from '../components/ProfileAvatar.jsx'
import { AVATAR_PRESETS } from '../data/avatarPresets.js'
import PresetAvatarFace from '../components/PresetAvatarFace.jsx'
import { isCustomProfielFoto, processProfielFotoBestand } from '../lib/profilePhoto.js'

const MAX_BYTES = 2 * 1024 * 1024
const TOEGESTANE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function ProfilePhotoPage() {
  const { activeProfile, updateProfile } = useStore()
  const fileRef = useRef(null)
  const [fout, setFout] = useState('')
  const [laden, setLaden] = useState(false)

  if (activeProfile.type === 'gast') {
    return <Navigate to="/profiel" replace />
  }

  const huidige = activeProfile.profielFoto

  function kiesPreset(id) {
    setFout('')
    updateProfile({ profielFoto: id })
  }

  function verwerkBestand(file) {
    setFout('')
    if (!file) return
    if (!TOEGESTANE_TYPES.includes(file.type)) {
      setFout('Kies een JPEG-, PNG- of WebP-afbeelding.')
      return
    }
    if (file.size > MAX_BYTES) {
      setFout('De foto mag maximaal 2 MB zijn.')
      return
    }

    setLaden(true)
    processProfielFotoBestand(file)
      .then((dataUrl) => updateProfile({ profielFoto: dataUrl }))
      .catch(() => setFout('De foto kon niet worden verwerkt.'))
      .finally(() => setLaden(false))
  }

  function verwijderFoto() {
    setFout('')
    updateProfile({ profielFoto: null })
  }

  return (
    <div>
      <PageHeader title="Profielfoto" subtitle="Kies een avatar of upload je eigen foto" back />

      <div className="space-y-5 px-4 py-4">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <ProfileAvatar profile={activeProfile} size="xl" />
          <p className="text-center text-sm text-slate-500">
            Zo zie je eruit in de app. Tik op een voorstel of upload een eigen foto.
          </p>
        </div>

        <section className="space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-sm font-semibold text-slate-500">Voorgesteld</h2>
          <div className="grid grid-cols-3 gap-3">
            {AVATAR_PRESETS.map((preset) => {
              const actief = huidige === preset.id
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => kiesPreset(preset.id)}
                  className={`relative flex flex-col items-center gap-1.5 rounded-xl bg-slate-50 p-3 ring-1 transition active:scale-[0.97] hover:bg-slate-100 ${
                    actief ? 'ring-2 ring-brand-500' : 'ring-slate-200'
                  }`}
                  aria-pressed={actief}
                  aria-label={preset.label}
                >
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-full bg-white p-0.5 ring-2 ${
                      actief ? 'ring-brand-500' : 'ring-slate-300'
                    }`}
                  >
                    <PresetAvatarFace
                      emoji={preset.emoji}
                      image={preset.image}
                      kleur={preset.kleur}
                      alt={preset.image ? preset.label : ''}
                    />
                  </span>
                  <span className="text-xs font-medium text-slate-600">{preset.label}</span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-sm font-semibold text-slate-500">Eigen foto</h2>
          <input
            ref={fileRef}
            type="file"
            accept={TOEGESTANE_TYPES.join(',')}
            className="hidden"
            onChange={(e) => {
              verwerkBestand(e.target.files?.[0])
              e.target.value = ''
            }}
          />
          <button
            type="button"
            disabled={laden}
            onClick={() => fileRef.current?.click()}
            className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 active:scale-[0.98] disabled:opacity-60"
          >
            {laden ? 'Bezig met laden…' : 'Foto kiezen vanaf apparaat'}
          </button>
          {(isCustomProfielFoto(huidige) || huidige) && (
            <button
              type="button"
              onClick={verwijderFoto}
              className="w-full rounded-xl bg-slate-100 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200 active:scale-[0.98]"
            >
              Terug naar standaard (initiaal)
            </button>
          )}
          {fout && (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600 ring-1 ring-rose-200">{fout}</p>
          )}
        </section>

        <Link
          to="/profiel"
          className="block w-full rounded-full bg-brand-100 py-3 text-center text-sm font-semibold text-brand-700 transition hover:bg-brand-200 active:scale-[0.98]"
        >
          Terug naar profiel
        </Link>
      </div>
    </div>
  )
}
