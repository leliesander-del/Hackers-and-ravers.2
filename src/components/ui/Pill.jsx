// Selecteerbare pill-knop (chip). Actief = gevuld violet, anders neutraal.
export default function Pill({ active = false, className = '', children, ...rest }) {
  return (
    <button
      className={`rounded-full px-4 py-2 text-sm font-medium transition active:scale-[0.97] ${
        active
          ? 'bg-brand-600 text-white shadow-sm'
          : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-200'
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
