// Icon button with a guaranteed accessible tap target (min. 44x44px).
// `label` is required and set as aria-label, so screen readers can announce
// the button. The visual content (icon/emoji) comes via children.
const VARIANTS = {
  subtle: 'bg-slate-100 text-slate-600 hover:bg-slate-200',
  brand: 'bg-brand-100 text-brand-700 hover:bg-brand-200',
  ghost: 'bg-transparent text-slate-500 hover:bg-slate-100',
}

export default function IconButton({ label, variant = 'subtle', className = '', children, ...rest }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition active:scale-95 ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
