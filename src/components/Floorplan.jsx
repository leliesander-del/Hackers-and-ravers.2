import { useFloorplan } from '../lib/useFloorplan.js'
import InteractiveFloorplan from './InteractiveFloorplan.jsx'
import PlanFloorplan from './PlanFloorplan.jsx'

// Demo-plattegrond uit productdata, of opgeslagen editor-plattegrond (zelfde weergave als beheer).
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
