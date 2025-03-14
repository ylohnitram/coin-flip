"use client"

import { useEffect, useRef } from "react"

interface SoundManagerProps {
  isMuted: boolean
}

export default function SoundManager({ isMuted }: SoundManagerProps) {
  const flipSoundRef = useRef<HTMLAudioElement | null>(null)
  const resultSoundRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Preload audio files
    flipSoundRef.current = new Audio("/coin-flip.mp3")
    resultSoundRef.current = new Audio("/coin-result.mp3")

    // Add error handling
    const handleError = (e: Event) => {
      console.log("Audio preloading error:", e)
    }

    flipSoundRef.current.addEventListener("error", handleError)
    resultSoundRef.current.addEventListener("error", handleError)

    return () => {
      if (flipSoundRef.current) {
        flipSoundRef.current.removeEventListener("error", handleError)
      }
      if (resultSoundRef.current) {
        resultSoundRef.current.removeEventListener("error", handleError)
      }
    }
  }, [])

  // Update muted state when it changes
  useEffect(() => {
    if (flipSoundRef.current) {
      flipSoundRef.current.muted = isMuted
    }
    if (resultSoundRef.current) {
      resultSoundRef.current.muted = isMuted
    }
  }, [isMuted])

  return null // This component doesn't render anything
}

