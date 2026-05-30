import StoreCard from './StoreCard.jsx'

// "Winkels voor jou" — een raster van winkel-tegels, al gesorteerd door de engine.
export default function StoreGrid({ stores }) {
  return (
    <div className="grid grid-cols-3 gap-x-3 gap-y-5">
      {stores.map((s) => (
        <StoreCard key={s.id} store={s} />
      ))}
    </div>
  )
}
