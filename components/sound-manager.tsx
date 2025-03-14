"use client"

import { useEffect, useRef } from "react"

interface SoundManagerProps {
  isMuted: boolean
  onSoundLoad?: (loaded: boolean) => void
}

// Global audio references that can be accessed from other components
let flipSound: HTMLAudioElement | null = null
let resultSound: HTMLAudioElement | null = null

// Function to play sounds that can be called from anywhere
export function playCoinFlipSound() {
  if (flipSound && !flipSound.muted) {
    // Reset the audio to the beginning
    flipSound.currentTime = 0
    // Play the sound
    flipSound.play().catch(e => console.log("Error playing flip sound:", e))
  }
}

export function playCoinResultSound() {
  if (resultSound && !resultSound.muted) {
    // Reset the audio to the beginning
    resultSound.currentTime = 0
    // Play the sound
    resultSound.play().catch(e => console.log("Error playing result sound:", e))
  }
}

export default function SoundManager({ isMuted, onSoundLoad }: SoundManagerProps) {
  const soundsLoadedRef = useRef(false)

  useEffect(() => {
    // Create audio elements if they don't exist yet
    if (!flipSound) {
      flipSound = new Audio("/coin-flip.mp3")
      flipSound.preload = "auto"
    }
    
    if (!resultSound) {
      resultSound = new Audio("/coin-result.mp3")
      resultSound.preload = "auto"
    }

    // Add load event listeners
    const handleFlipSoundLoad = () => {
      console.log("Flip sound loaded successfully")
      checkAllLoaded()
    }
    
    const handleResultSoundLoad = () => {
      console.log("Result sound loaded successfully")
      checkAllLoaded()
    }

    // Add error handling
    const handleFlipSoundError = (e: Event) => {
      console.log("Error loading flip sound:", e)
      onSoundLoad?.(false)
    }
    
    const handleResultSoundError = (e: Event) => {
      console.log("Error loading result sound:", e)
      onSoundLoad?.(false)
    }
    
    // Check if all sounds are loaded
    const checkAllLoaded = () => {
      if (!soundsLoadedRef.current && flipSound && resultSound) {
        soundsLoadedRef.current = true
        onSoundLoad?.(true)
      }
    }

    // Add event listeners
    flipSound.addEventListener("canplaythrough", handleFlipSoundLoad)
    resultSound.addEventListener("canplaythrough", handleResultSoundLoad)
    flipSound.addEventListener("error", handleFlipSoundError)
    resultSound.addEventListener("error", handleResultSoundError)

    // Clean up event listeners on unmount
    return () => {
      if (flipSound) {
        flipSound.removeEventListener("canplaythrough", handleFlipSoundLoad)
        flipSound.removeEventListener("error", handleFlipSoundError)
      }
      if (resultSound) {
        resultSound.removeEventListener("canplaythrough", handleResultSoundLoad)
        resultSound.removeEventListener("error", handleResultSoundError)
      }
    }
  }, [onSoundLoad])

  // Update muted state when it changes
  useEffect(() => {
    if (flipSound) {
      flipSound.muted = isMuted
    }
    if (resultSound) {
      resultSound.muted = isMuted
    }
  }, [isMuted])

  return null // This component doesn't render anything
}
