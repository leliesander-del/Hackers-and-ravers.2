// Standard card surface: white, soft shadow, subtle border, rounded-2xl.
export default function Card({ as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag
      className={`rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
