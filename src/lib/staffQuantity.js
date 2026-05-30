import { useCallback, useEffect, useState } from 'react'

export function clampQuantityValue(n, { min = 1, max = Infinity } = {}) {
  const value = Number.isFinite(n) ? n : min
  if (max < min) return min
  return Math.min(max, Math.max(min, value))
}

export function parseQuantityText(text, { min = 1, max = Infinity } = {}) {
  return clampQuantityValue(parseInt(text, 10), { min, max })
}

/** Quantity input for staff screens, capped at `maxQuantity` (warehouse or shelves). */
export function useStaffQuantity(maxQuantity) {
  const max = Math.max(0, maxQuantity ?? 0)
  const [quantityText, setQuantityText] = useState('1')

  useEffect(() => {
    if (max <= 0) return
    setQuantityText((current) => String(parseQuantityText(current, { min: 1, max })))
  }, [max])

  const parseQuantity = useCallback(
    (text = quantityText) => (max > 0 ? parseQuantityText(text, { min: 1, max }) : 1),
    [quantityText, max],
  )

  const resetQuantity = useCallback(() => {
    setQuantityText('1')
  }, [])

  const changeQuantity = useCallback(
    (delta) => {
      if (max <= 0) return
      setQuantityText(String(clampQuantityValue(parseQuantity() + delta, { min: 1, max })))
    },
    [max, parseQuantity],
  )

  const quantityInputProps = useCallback(
    (action) => ({
      quantityText,
      maxQuantity: max,
      onQuantityChange: (e) => {
        const v = e.target.value
        if (v === '') {
          setQuantityText('')
          return
        }
        if (!/^\d+$/.test(v)) return
        const n = parseInt(v, 10)
        if (max > 0 && n > max) setQuantityText(String(max))
        else setQuantityText(v)
      },
      onQuantityBlur: () => {
        if (max <= 0) return
        setQuantityText(String(parseQuantityText(quantityText, { min: 1, max })))
      },
      onQuantityKeyDown: (e) => {
        if (['e', 'E', '-', '+', '.', ','].includes(e.key)) e.preventDefault()
        if (e.key === 'Enter') action()
      },
      onChangeQuantity: changeQuantity,
    }),
    [quantityText, max, parseQuantity, changeQuantity],
  )

  return { parseQuantity, resetQuantity, quantityInputProps, maxQuantity: max }
}
