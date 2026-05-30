import { useCallback, useEffect, useRef, useState } from 'react'

// Voice-first laag bovenop de Web Speech API (zit in de browser, geen key nodig).
//  - Spraakherkenning (SpeechRecognition) in het Nederlands.
//  - Tekst-naar-spraak (speechSynthesis) om antwoorden voor te lezen.
// Niet elke browser ondersteunt dit (Chrome/Edge wel, Firefox deels). Daarom
// geeft de hook `ondersteund` terug zodat de UI netjes kan terugvallen.
const SpeechRecognition =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null

export function useSpraak({ onResultaat } = {}) {
  const [luistert, setLuistert] = useState(false)
  const [tussentijds, setTussentijds] = useState('')
  const [fout, setFout] = useState(null)
  const herkennerRef = useRef(null)
  const onResultaatRef = useRef(onResultaat)

  // Houd de callback actueel zonder de herkenner opnieuw op te bouwen.
  useEffect(() => {
    onResultaatRef.current = onResultaat
  }, [onResultaat])

  const ondersteund = !!SpeechRecognition

  useEffect(() => {
    if (!ondersteund) return undefined

    const herkenner = new SpeechRecognition()
    herkenner.lang = 'nl-BE'
    herkenner.interimResults = true
    herkenner.continuous = false
    herkenner.maxAlternatives = 1

    herkenner.onresult = (event) => {
      let interim = ''
      let definitief = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const stuk = event.results[i]
        if (stuk.isFinal) definitief += stuk[0].transcript
        else interim += stuk[0].transcript
      }
      if (definitief) {
        setTussentijds('')
        onResultaatRef.current?.(definitief.trim())
      } else {
        setTussentijds(interim)
      }
    }
    herkenner.onerror = (event) => {
      setFout(event.error)
      setLuistert(false)
    }
    herkenner.onend = () => {
      setLuistert(false)
      setTussentijds('')
    }

    herkennerRef.current = herkenner
    return () => {
      herkenner.onresult = null
      herkenner.onerror = null
      herkenner.onend = null
      try {
        herkenner.abort()
      } catch {
        /* al gestopt */
      }
    }
  }, [ondersteund])

  const startLuisteren = useCallback(() => {
    if (!herkennerRef.current || luistert) return
    setFout(null)
    setTussentijds('')
    try {
      herkennerRef.current.start()
      setLuistert(true)
    } catch {
      /* start() faalt als hij al loopt — negeer */
    }
  }, [luistert])

  const stopLuisteren = useCallback(() => {
    if (!herkennerRef.current) return
    try {
      herkennerRef.current.stop()
    } catch {
      /* al gestopt */
    }
    setLuistert(false)
  }, [])

  // Lees een antwoord voor (best effort; stil falen als synthese ontbreekt).
  const spreek = useCallback((tekst) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !tekst) return
    try {
      window.speechSynthesis.cancel()
      const uiting = new SpeechSynthesisUtterance(tekst)
      uiting.lang = 'nl-BE'
      window.speechSynthesis.speak(uiting)
    } catch {
      /* synthese niet beschikbaar */
    }
  }, [])

  const stopSpreken = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel()
  }, [])

  return { ondersteund, luistert, tussentijds, fout, startLuisteren, stopLuisteren, spreek, stopSpreken }
}
