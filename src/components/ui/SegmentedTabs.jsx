// Tab-switcher in pill-stijl (zoals op de home en in het profiel).
// `tabs` = [{ id, label }]; geeft de gekozen id terug via onChange.
export default function SegmentedTabs({ tabs, value, onChange, className = '' }) {
  return (
    <div className={`flex gap-1 rounded-full bg-slate-100 p-1 ${className}`}>
      {tabs.map((t) => {
        const actief = value === t.id
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
              actief ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
