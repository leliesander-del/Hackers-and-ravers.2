// Eén invoerstijl voor de hele app: wit, subtiele ring, violet focus.
export function Input({ className = '', ...rest }) {
  return (
    <input
      className={`w-full rounded-xl bg-white px-4 py-3 text-sm text-slate-800 outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:ring-2 focus:ring-brand-400 ${className}`}
      {...rest}
    />
  )
}

// Invoer met label erboven. Geef extra props door aan het input-element.
export function Field({ label, className = '', children, ...rest }) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>}
      {children ?? <Input className={className} {...rest} />}
    </label>
  )
}

// Selectievak met dezelfde stijl als Input.
export function Select({ className = '', children, ...rest }) {
  return (
    <select
      className={`w-full rounded-xl bg-white px-4 py-3 text-sm text-slate-800 outline-none ring-1 ring-slate-200 transition focus:ring-2 focus:ring-brand-400 ${className}`}
      {...rest}
    >
      {children}
    </select>
  )
}

export default Input
