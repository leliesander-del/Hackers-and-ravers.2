import { useFloorplan } from '../lib/useFloorplan.js'
import InteractiveFloorplan from './InteractiveFloorplan.jsx'
import PlanFloorplan from './PlanFloorplan.jsx'

// Demo floor plan from product data, or saved editor floor plan (same rendering as management).
export default function Floorplan({ storeId, products, highlightId, highlight, routeIds }) {
  const { elements, hasPlan } = useFloorplan(storeId)

  if (hasPlan) {
    return (
      <PlanFloorplan
        elements={elements}
        products={products}
        highlightId={highlightId}
        routeIds={routeIds}
      />
    )
  }

  return (
    <InteractiveFloorplan
      products={products}
      highlightId={highlightId}
      highlight={highlight}
      routeIds={routeIds}
    />
  )
}
