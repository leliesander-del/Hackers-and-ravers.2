import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { profiles } from '../data/profiles.js'

export default function LoginPage() {
  const { login } = useStore()
  const navigate = useNavigate()

  function kies(id) {
    login(id)
    navigate('/')
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-gradient-to-b from-violet-600 to-violet-500 px-6 pb-10 pt-16 text-white">
      <div className="mb-10">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl">📍</div>
        <h1 className="text-3xl font-bold">StoreNav</h1>
        <p className="mt-1 text-violet-100">Kies je klantenkaart en zie hoe de app zich aan jou aanpast.</p>
      </div>

      <div className="space-y-3">
        {profiles.map((p) => (
          <button
            key={p.id}
            onClick={() => kies(p.id)}
            className="flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left text-slate-800 shadow-lg transition active:scale-[0.98]"
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
              style={{ backgroundColor: p.kleur }}
            >
              {p.naam[0]}
            </span>
            <span className="flex-1">
              <span className="block font-semibold">{p.naam}</span>
              <span className="block text-sm text-slate-500">{p.omschrijving}</span>
            </span>
            <span className="text-violet-500">→</span>
          </button>
        ))}
      </div>

      <p className="mt-auto pt-10 text-center text-sm text-violet-100">
        <Link to="/beheer/login" className="underline hover:text-white">
          Winkelbeheerder? Log hier in
        </Link>
      </p>

      <p className="pt-2 text-center text-xs text-violet-200">
        Demo · fictieve profielen · geen echte gegevens
      </p>
    </div>
  )
}
