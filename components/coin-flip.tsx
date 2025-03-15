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
  const [animationComplete, setAnimationComplete] = useState(true)
  const lastFlipTimestampRef = useRef<number>(0)

  // Zajistí, že je animace dokončena a spustí se jen jednou
  useEffect(() => {
    if (!coinRef.current) return

    const currentTimestamp = Date.now()

    if (isFlipping && animationComplete) {
      // Animace se spouští pouze pokud uplynul minimální čas od poslední animace
      if (currentTimestamp - lastFlipTimestampRef.current > 300) {
        setAnimationComplete(false)
        lastFlipTimestampRef.current = currentTimestamp
        
        // Aplikace náhodného počtu otočení
        const randomFlips = 5 + Math.floor(Math.random() * 5) // 5-10 otočení
        const randomDegrees = randomFlips * 180

        // Reset stylu pro zajištění konzistentní animace
        coinRef.current.style.transition = "none"
        coinRef.current.offsetHeight // Force reflow
        
        // Aplikace animace
        coinRef.current.style.transform = `rotateY(${randomDegrees}deg)`
        coinRef.current.style.transition = "transform 1.5s cubic-bezier(0.18, 0.89, 0.32, 1.28)"
        
        // Přidání listeneru na konec animace
        const handleAnimationEnd = () => {
          if (!coinRef.current) return
          setAnimationComplete(true)
        }
        
        coinRef.current.addEventListener('transitionend', handleAnimationEnd, { once: true })
      }
    } else if (!isFlipping && result && animationComplete) {
      // Nastavení konečné pozice podle výsledku
      const finalRotation = result === "heads" ? 0 : 180
      coinRef.current.style.transform = `rotateY(${finalRotation}deg)`
    }
  }, [isFlipping, result, animationComplete])

  // Reset animace při změně typu mince
  useEffect(() => {
    if (!isFlipping && coinRef.current) {
      coinRef.current.style.transition = "none"
      const finalRotation = result === "heads" ? 0 : 180
      coinRef.current.style.transform = `rotateY(${finalRotation}deg)`
      
      // Force reflow
      coinRef.current.offsetHeight
      
      coinRef.current.style.transition = "transform 1.5s cubic-bezier(0.18, 0.89, 0.32, 1.28)"
    }
  }, [coinType, result, isFlipping])

  // Získat styl mince podle typu
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
          isFlipping && !animationComplete && "animate-bounce"
        )}
      >
        {/* Strana heads */}
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

        {/* Strana tails */}
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
