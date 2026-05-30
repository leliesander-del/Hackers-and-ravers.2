// Tab switcher in pill style (like on the home and in the profile).
// `tabs` = [{ id, label }]; returns the chosen id via onChange.
export default function SegmentedTabs({ tabs, value, onChange, className = '' }) {
  return (
    <div className={`flex gap-1 rounded-full bg-slate-100 p-1 ${className}`}>
      {tabs.map((t) => {
        const active = value === t.id
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
              active ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
