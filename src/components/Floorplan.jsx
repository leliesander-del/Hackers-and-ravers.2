import { getEntrancePosition } from '../lib/floorplanStorage.js'
import { useFloorplan } from '../lib/useFloorplan.js'
import FloorplanRenderer from './floorplan/FloorplanRenderer.jsx'

export default function Floorplan({ storeId, products, highlight }) {
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

  const schappen = []
  for (const p of products) {
    if (p.schaplocatie && !schappen.some((s) => s.label === p.schaplocatie.label)) {
      schappen.push(p.schaplocatie)
    }
  }

  return (
    <FloorplanRenderer
      elements={[]}
      products={products}
      highlight={highlight}
      entrance={{ x: 50, y: 96 }}
      showShelves={schappen.length > 0}
    />
  )
}
