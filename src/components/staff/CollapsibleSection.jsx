import { useState } from 'react'

export default function CollapsibleSection({ titel, aantal, kleur = 'slate', standaardOpen = false, children }) {
  const [open, setOpen] = useState(standaardOpen)

  const kleuren = {
    rose: { ring: 'ring-rose-100', badge: 'bg-rose-100 text-rose-700', titel: 'text-rose-800' },
    orange: { ring: 'ring-orange-100', badge: 'bg-orange-100 text-orange-800', titel: 'text-orange-900' },
    amber: { ring: 'ring-amber-100', badge: 'bg-amber-100 text-amber-700', titel: 'text-amber-800' },
    emerald: { ring: 'ring-emerald-100', badge: 'bg-emerald-100 text-emerald-700', titel: 'text-emerald-800' },
    violet: { ring: 'ring-violet-100', badge: 'bg-violet-100 text-violet-700', titel: 'text-violet-800' },
    slate: { ring: 'ring-slate-100', badge: 'bg-slate-100 text-slate-600', titel: 'text-slate-700' },
  }
  const k = kleuren[kleur] ?? kleuren.slate

  return (
    <section className={`rounded-2xl bg-white shadow-sm ring-1 ${k.ring}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <span className={`text-sm font-semibold ${k.titel}`}>{titel}</span>
        <span className="flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${k.badge}`}>{aantal}</span>
          <span className="text-slate-400">{open ? '▾' : '▸'}</span>
        </span>
      </button>
      {open && <div className="space-y-2 border-t border-slate-100 px-3 pb-3 pt-2">{children}</div>}
    </section>
  )
}
