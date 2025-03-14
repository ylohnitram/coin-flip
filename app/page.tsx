"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CoinFlip from "@/components/coin-flip"
import Statistics from "@/components/statistics"
import SettingsComponent from "@/components/settings"
import SoundManager, { playCoinFlipSound, playCoinResultSound } from "@/components/sound-manager"

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [coinType, setCoinType] = useState("gold")
  const [coinCount, setCoinCount] = useState(1)
  const [results, setResults] = useState<Array<{ result: string; timestamp: number }>>([])
  const [activeTab, setActiveTab] = useState("flip")
  const [customNames, setCustomNames] = useState({ heads: "Heads", tails: "Tails" })
  const [soundsLoaded, setSoundsLoaded] = useState(false)

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    const savedMuted = localStorage.getItem("muted") === "true"
    const savedCoinType = localStorage.getItem("coinType") || "gold"
    const savedResults = JSON.parse(localStorage.getItem("results") || "[]")
    const savedCustomNames = JSON.parse(localStorage.getItem("customNames") || '{"heads":"Heads","tails":"Tails"}')

    setIsDarkMode(savedDarkMode)
    setIsMuted(savedMuted)
    setCoinType(savedCoinType)
    setResults(savedResults)
    setCustomNames(savedCustomNames)
  }, [])

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode.toString())
    localStorage.setItem("muted", isMuted.toString())
    localStorage.setItem("coinType", coinType)
    localStorage.setItem("results", JSON.stringify(results))
    localStorage.setItem("customNames", JSON.stringify(customNames))
  }, [isDarkMode, isMuted, coinType, results, customNames])

  const flipCoin = () => {
    if (isFlipping) return

    setIsFlipping(true)
    setResult(null)

    // Play flip sound
    playCoinFlipSound()

    // Simulate multiple coin flips
    setTimeout(() => {
      const newResults = []
      for (let i = 0; i < coinCount; i++) {
        const newResult = Math.random() < 0.5 ? "heads" : "tails"
        newResults.push({ result: newResult, timestamp: Date.now() })
      }

      // Play result sound
      playCoinResultSound()

      setResults((prev) => [...newResults, ...prev])
      setResult(newResults[0].result)
      setIsFlipping(false)
    }, 1500)
  }

  return (
    <main className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <SoundManager 
        isMuted={isMuted} 
        onSoundLoad={loaded => setSoundsLoaded(loaded)} 
      />
      <div className="max-w-md mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Coin Flip</h1>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="flip">Flip</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="flip" className="mt-4">
            <Card className="p-6 flex flex-col items-center">
              <CoinFlip isFlipping={isFlipping} result={result} coinType={coinType} customNames={customNames} />

              <div className="mt-8 w-full">
                <Button className="w-full py-6 text-lg" onClick={flipCoin} disabled={isFlipping}>
                  {isFlipping ? "Flipping..." : `Flip ${coinCount > 1 ? coinCount + " coins" : "coin"}`}
                </Button>
              </div>

              {result && (
                <div className="mt-4 text-center">
                  <p className="text-xl font-medium">
                    {coinCount > 1
                      ? `${results.slice(0, coinCount).filter((r) => r.result === "heads").length} ${customNames.heads} / 
                         ${results.slice(0, coinCount).filter((r) => r.result === "tails").length} ${customNames.tails}`
                      : result === "heads"
                        ? customNames.heads
                        : customNames.tails}
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <Statistics results={results} customNames={customNames} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsComponent
              coinType={coinType}
              setCoinType={setCoinType}
              coinCount={coinCount}
              setCoinCount={setCoinCount}
              customNames={customNames}
              setCustomNames={setCustomNames}
              results={results}
              setResults={setResults}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
