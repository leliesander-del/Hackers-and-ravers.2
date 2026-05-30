// Standaard kaart-oppervlak: wit, zachte schaduw, subtiele rand, rounded-2xl.
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
