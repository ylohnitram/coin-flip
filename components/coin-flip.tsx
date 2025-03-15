"use client"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface CoinFlipProps {
  isFlipping: boolean
  result: string | null
  coinType: string
  customNames: {
    heads: string
    tails: string
  }
}

export default function CoinFlip({ isFlipping, result, coinType, customNames }: CoinFlipProps) {
  const coinRef = useRef<HTMLDivElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const flipCountRef = useRef(0)

  // Handle coin animation
  useEffect(() => {
    if (!coinRef.current) return
    
    if (isFlipping && !isAnimating) {
      setIsAnimating(true)
      
      // Track number of flips to create different rotation each time
      flipCountRef.current += 1
      
      // Calculate random number of rotations (5-10 rotations)
      const randomFlips = 5 + Math.floor(Math.random() * 5)
      const randomDegrees = randomFlips * 180
      
      // Add direction based on flip count (alternate direction occasionally)
      const direction = flipCountRef.current % 2 === 0 ? 1 : -1
      const finalDegrees = randomDegrees * direction
      
      // Apply animation immediately
      coinRef.current.style.transition = "transform 0s"
      coinRef.current.style.transform = "rotateY(0deg)"
      
      // Force reflow to ensure the animation will play
      void coinRef.current.offsetHeight
      
      // Set the proper animation
      coinRef.current.style.transition = "transform 1.5s cubic-bezier(0.18, 0.89, 0.32, 1.28)"
      coinRef.current.style.transform = `rotateY(${finalDegrees}deg)`
      
      // Listen for animation end
      const handleTransitionEnd = () => {
        if (!coinRef.current) return
        setIsAnimating(false)
      }
      
      coinRef.current.addEventListener('transitionend', handleTransitionEnd, { once: true })
      
      return () => {
        if (coinRef.current) {
          coinRef.current.removeEventListener('transitionend', handleTransitionEnd)
        }
      }
    }
  }, [isFlipping, isAnimating])
  
  // Apply final position when result is available and animation is complete
  useEffect(() => {
    if (!isFlipping && result && !isAnimating && coinRef.current) {
      // Set final state based on result
      const finalRotation = result === "heads" ? "0deg" : "180deg"
      
      // Apply without animation
      coinRef.current.style.transition = "transform 0.3s ease"
      coinRef.current.style.transform = `rotateY(${finalRotation})`
    }
  }, [isFlipping, result, isAnimating])

  // Get coin styles based on coinType
  const getCoinStyles = (type: string) => {
    switch (type) {
      case "gold":
        return "bg-amber-400 border-4 border-amber-500"
      case "silver":
        return "bg-gray-300 border-4 border-gray-400"
      case "bronze":
        return "bg-amber-700 border-4 border-amber-800"
      case "white":
        return "bg-gray-100 border-4 border-gray-200 text-gray-800"
      case "black":
        return "bg-gray-800 border-4 border-gray-900 text-white"
      case "blue":
        return "bg-blue-500 border-4 border-blue-600 text-white"
      default:
        return "bg-amber-400 border-4 border-amber-500"
    }
  }

  return (
    <div className="perspective-1000 w-48 h-48 relative">
      <div
        ref={coinRef}
        className={cn(
          "w-full h-full relative preserve-3d transition-transform", 
          isFlipping && "animate-bounce"
        )}
      >
        {/* Heads side */}
        <div className="absolute w-full h-full backface-hidden rounded-full shadow-lg flex items-center justify-center">
          <div
            className={cn(
              "w-full h-full rounded-full flex items-center justify-center text-center p-4",
              getCoinStyles(coinType)
            )}
          >
            <span className="text-xl font-bold">{customNames.heads}</span>
          </div>
        </div>

        {/* Tails side */}
        <div className="absolute w-full h-full backface-hidden rounded-full shadow-lg flex items-center justify-center rotate-y-180">
          <div
            className={cn(
              "w-full h-full rounded-full flex items-center justify-center text-center p-4",
              getCoinStyles(coinType)
            )}
          >
            <span className="text-xl font-bold">{customNames.tails}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
