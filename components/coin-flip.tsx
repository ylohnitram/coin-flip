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
  const containerRef = useRef<HTMLDivElement>(null)

  // Řízení animace otáčení
  useEffect(() => {
    const coin = coinRef.current
    const container = containerRef.current
    if (!coin || !container) return

    const showResult = () => {
      coin.style.animation = "";
      coin.style.transform = result === "heads" ? "rotateY(0deg)" : "rotateY(180deg)";
    }

    if (isFlipping) {
      // Přidáme animaci nadskočení na kontejner
      container.style.animation = "bounce 1.5s ease-in-out";
      
      // Přidáme animaci rotace na minci
      // Nastavíme náhodný počet otáček (5-10)
      const rotations = 5 + Math.floor(Math.random() * 5);
      const degrees = rotations * 360;
      
      // Resetujeme aktuální animaci
      coin.style.animation = "";
      coin.style.transform = "rotateY(0deg)";
      
      // Vynutíme reflow
      void coin.offsetHeight;
      
      // Vytvoříme animaci přímo v JS
      const animation = `
        @keyframes flip-coin-${Date.now()} {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(${degrees}deg); }
        }
      `;
      
      // Vložíme animaci do dokumentu
      const styleSheet = document.createElement('style');
      styleSheet.textContent = animation;
      document.head.appendChild(styleSheet);
      
      // Aplikujeme animaci
      const animationName = animation.match(/@keyframes\s+([^\s{]+)/)?.[1] || '';
      coin.style.animation = `${animationName} 1.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards`;
      
      // Odstraníme vložený styl po dokončení animace
      setTimeout(() => {
        document.head.removeChild(styleSheet);
        showResult();
      }, 1500);
    } else if (result) {
      // Nastavíme konečnou pozici bez animace
      showResult();
    }
  }, [isFlipping, result])

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
    <div ref={containerRef} className="w-48 h-48 relative">
      <div
        ref={coinRef}
        className="w-full h-full relative"
        style={{ 
          perspective: "1000px",
          transformStyle: "preserve-3d",
          transition: "transform 0.3s ease" 
        }}
      >
        {/* Heads strana */}
        <div 
          className="absolute w-full h-full rounded-full shadow-lg flex items-center justify-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div
            className={cn(
              "w-full h-full rounded-full flex items-center justify-center text-center p-4",
              getCoinStyles(coinType)
            )}
          >
            <span className="text-xl font-bold">{customNames.heads}</span>
          </div>
        </div>

        {/* Tails strana */}
        <div 
          className="absolute w-full h-full rounded-full shadow-lg flex items-center justify-center"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
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
