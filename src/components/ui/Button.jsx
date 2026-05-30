// Eén knop-primitive voor de hele app. Het merk-accent is violet (brand).
// Varianten: primary (gevuld), secondary (neutraal), ghost, danger.
const VARIANTEN = {
  primary:
    'bg-brand-600 text-white shadow-sm hover:bg-brand-700 disabled:opacity-50',
  secondary:
    'bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50',
  ghost:
    'bg-transparent text-brand-700 hover:bg-brand-50 disabled:opacity-50',
  danger:
    'bg-danger text-white shadow-sm hover:brightness-95 disabled:opacity-50',
}

// Maten houden rekening met een minimale tap-hoogte van ~44px (touch-target).
const MATEN = {
  sm: 'min-h-[40px] px-3 py-2 text-sm',
  md: 'min-h-[44px] px-5 py-3 text-sm',
  lg: 'min-h-[48px] py-3.5 text-sm',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  pill = false,
  className = '',
  type = 'button',
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-1.5 font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed ${
        pill ? 'rounded-full' : 'rounded-xl'
      } ${MATEN[size]} ${VARIANTEN[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
