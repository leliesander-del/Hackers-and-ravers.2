// Icoonknop met gegarandeerd toegankelijk tap-target (min. 44x44px).
// `label` is verplicht en wordt als aria-label gezet, zodat screenreaders
// de knop kunnen aankondigen. De visuele inhoud (icoon/emoji) komt via children.
const VARIANTEN = {
  subtle: 'bg-slate-100 text-slate-600 hover:bg-slate-200',
  brand: 'bg-brand-100 text-brand-700 hover:bg-brand-200',
  ghost: 'bg-transparent text-slate-500 hover:bg-slate-100',
}

export default function IconButton({ label, variant = 'subtle', className = '', children, ...rest }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition active:scale-95 ${VARIANTEN[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
