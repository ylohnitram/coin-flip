"use client"

import { useRef, useEffect } from "react"
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

  useEffect(() => {
    if (!coinRef.current) return

    if (isFlipping) {
      // Apply random flip animation
      const randomFlips = 5 + Math.floor(Math.random() * 5) // 5-10 flips
      const randomDegrees = randomFlips * 180

      coinRef.current.style.transform = `rotateY(${randomDegrees}deg)`
      coinRef.current.style.transition = "transform 1.5s cubic-bezier(0.18, 0.89, 0.32, 1.28)"
    } else if (result) {
      // Set final position based on result
      const finalRotation = result === "heads" ? 0 : 180
      coinRef.current.style.transform = `rotateY(${finalRotation}deg)`
    } else {
      // Reset position
      coinRef.current.style.transform = "rotateY(0deg)"
      coinRef.current.style.transition = "none"
    }
  }, [isFlipping, result])

  return (
    <div className="perspective-1000 w-48 h-48 relative">
      <div
        ref={coinRef}
        className={cn("w-full h-full relative preserve-3d transition-transform", isFlipping && "animate-bounce")}
      >
        {/* Heads side */}
        <div className="absolute w-full h-full backface-hidden rounded-full shadow-lg flex items-center justify-center">
          <div
            className={cn(
              "w-full h-full rounded-full flex items-center justify-center text-center p-4",
              coinType === "gold" && "bg-amber-400 border-4 border-amber-500",
              coinType === "silver" && "bg-gray-300 border-4 border-gray-400",
              coinType === "bronze" && "bg-amber-700 border-4 border-amber-800",
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
              coinType === "gold" && "bg-amber-400 border-4 border-amber-500",
              coinType === "silver" && "bg-gray-300 border-4 border-gray-400",
              coinType === "bronze" && "bg-amber-700 border-4 border-amber-800",
            )}
          >
            <span className="text-xl font-bold">{customNames.tails}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

