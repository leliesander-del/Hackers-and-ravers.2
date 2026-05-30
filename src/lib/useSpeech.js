import { useCallback, useEffect, useRef, useState } from 'react'

// Voice-first layer on top of the Web Speech API (built into the browser, no key needed).
//  - Speech recognition (SpeechRecognition) in English.
//  - Text-to-speech (speechSynthesis) to read answers aloud.
// Not every browser supports this (Chrome/Edge do, Firefox partially). That's why
// the hook returns `supported` so the UI can fall back gracefully.
const SpeechRecognition =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null

export function useSpeech({ onResult } = {}) {
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [error, setError] = useState(null)
  const recognizerRef = useRef(null)
  const onResultRef = useRef(onResult)

  // Keep the callback current without rebuilding the recognizer.
  useEffect(() => {
    onResultRef.current = onResult
  }, [onResult])

  const supported = !!SpeechRecognition

  useEffect(() => {
    if (!supported) return undefined

    const recognizer = new SpeechRecognition()
    recognizer.lang = 'en-US'
    recognizer.interimResults = true
    recognizer.continuous = false
    recognizer.maxAlternatives = 1

    recognizer.onresult = (event) => {
      let interimText = ''
      let finalText = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const chunk = event.results[i]
        if (chunk.isFinal) finalText += chunk[0].transcript
        else interimText += chunk[0].transcript
      }
      if (finalText) {
        setInterim('')
        onResultRef.current?.(finalText.trim())
      } else {
        setInterim(interimText)
      }
    }
    recognizer.onerror = (event) => {
      setError(event.error)
      setListening(false)
    }
    recognizer.onend = () => {
      setListening(false)
      setInterim('')
    }

    recognizerRef.current = recognizer
    return () => {
      recognizer.onresult = null
      recognizer.onerror = null
      recognizer.onend = null
      try {
        recognizer.abort()
      } catch {
        /* already stopped */
      }
    }
  }, [supported])

  const startListening = useCallback(() => {
    if (!recognizerRef.current || listening) return
    setError(null)
    setInterim('')
    try {
      recognizerRef.current.start()
      setListening(true)
    } catch {
      /* start() fails if it is already running — ignore */
    }
  }, [listening])

  const stopListening = useCallback(() => {
    if (!recognizerRef.current) return
    try {
      recognizerRef.current.stop()
    } catch {
      /* already stopped */
    }
    setListening(false)
  }, [])

  // Read an answer aloud (best effort; fail silently if synthesis is missing).
  const speak = useCallback((text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text) return
    try {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      window.speechSynthesis.speak(utterance)
    } catch {
      /* synthesis not available */
    }
  }, [])

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel()
  }, [])

  return { supported, listening, interim, error, startListening, stopListening, speak, stopSpeaking }
}
