import { useCallback, useEffect, useState } from 'react'

export function clampAantalWaarde(n, { min = 1, max = Infinity } = {}) {
  const waarde = Number.isFinite(n) ? n : min
  if (max < min) return min
  return Math.min(max, Math.max(min, waarde))
}

export function parseAantalTekst(tekst, { min = 1, max = Infinity } = {}) {
  return clampAantalWaarde(parseInt(tekst, 10), { min, max })
}

/** Aantal-invoer voor personeelsschermen, begrensd tot `maxAantal` (magazijn of rekken). */
export function useStaffAantal(maxAantal) {
  const max = Math.max(0, maxAantal ?? 0)
  const [aantalTekst, setAantalTekst] = useState('1')

  useEffect(() => {
    if (max <= 0) return
    setAantalTekst((huidig) => String(parseAantalTekst(huidig, { min: 1, max })))
  }, [max])

  const parseAantal = useCallback(
    (tekst = aantalTekst) => (max > 0 ? parseAantalTekst(tekst, { min: 1, max }) : 1),
    [aantalTekst, max],
  )

  const resetAantal = useCallback(() => {
    setAantalTekst('1')
  }, [])

  const wijzigAantal = useCallback(
    (delta) => {
      if (max <= 0) return
      setAantalTekst(String(clampAantalWaarde(parseAantal() + delta, { min: 1, max })))
    },
    [max, parseAantal],
  )

  const aantalInputProps = useCallback(
    (actie) => ({
      aantalTekst,
      maxAantal: max,
      onAantalChange: (e) => {
        const v = e.target.value
        if (v === '') {
          setAantalTekst('')
          return
        }
        if (!/^\d+$/.test(v)) return
        const n = parseInt(v, 10)
        if (max > 0 && n > max) setAantalTekst(String(max))
        else setAantalTekst(v)
      },
      onAantalBlur: () => {
        if (max <= 0) return
        setAantalTekst(String(parseAantalTekst(aantalTekst, { min: 1, max })))
      },
      onAantalKeyDown: (e) => {
        if (['e', 'E', '-', '+', '.', ','].includes(e.key)) e.preventDefault()
        if (e.key === 'Enter') actie()
      },
      onWijzigAantal: wijzigAantal,
    }),
    [aantalTekst, max, parseAantal, wijzigAantal],
  )

  return { parseAantal, resetAantal, aantalInputProps, maxAantal: max }
}
