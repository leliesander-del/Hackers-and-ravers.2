import { getEntrancePosition } from '../lib/floorplanStorage.js'
import { useFloorplan } from '../lib/useFloorplan.js'
import FloorplanRenderer from './floorplan/FloorplanRenderer.jsx'
import InteractiveFloorplan from './InteractiveFloorplan.jsx'

// Toont de door de winkelbeheerder opgeslagen plattegrond, of anders de interactieve demo-plattegrond.
export default function Floorplan({ storeId, products, highlightId, highlight, routeIds }) {
  const { elements, hasPlan } = useFloorplan(storeId)

  if (hasPlan) {
    const entrance = getEntrancePosition(storeId)
    return (
      <FloorplanRenderer
        elements={elements}
        products={products}
        highlight={highlight}
        entrance={entrance}
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
