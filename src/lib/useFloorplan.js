import { useCallback, useEffect, useState } from 'react'
import { FLOORPLAN_CHANGE_EVENT, loadFloorplan } from './floorplanStorage.js'

function readPlan(storeId) {
  if (!storeId) return { elements: [], hasPlan: false }
  const plan = loadFloorplan(storeId)
  const elements = plan?.elements ?? []
  return { elements, hasPlan: elements.length > 0 }
}

export function useFloorplan(storeId) {
  const [data, setData] = useState(() => readPlan(storeId))

  const refresh = useCallback(() => {
    setData(readPlan(storeId))
  }, [storeId])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    function onChange(e) {
      const changedId = e?.detail?.storeId
      if (!changedId || changedId === storeId) refresh()
    }
    window.addEventListener(FLOORPLAN_CHANGE_EVENT, onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener(FLOORPLAN_CHANGE_EVENT, onChange)
      window.removeEventListener('storage', onChange)
    }
  }, [storeId, refresh])

  return data
}
