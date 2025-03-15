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

      {/* SEO Text Content - hidden on smaller screens but visible to search engines */}
      <section className="max-w-3xl mx-auto mt-12 px-4 text-gray-700 dark:text-gray-300 sm:block">
        <h2 className="text-xl font-bold mb-4">About Coin Flip Tool</h2>
        <p className="mb-3">
          Need help making a random decision? Our Coin Flip Tool provides a simple, fair way to choose between two options. Whether you're deciding who goes first in a game, settling a friendly debate, or just need a random choice, our virtual coin toss gives you a quick answer.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-4">Features of Our Coin Flip App</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Realistic coin flip animation with sound effects</li>
          <li>Customizable coin appearance (gold, silver, or bronze)</li>
          <li>Option to flip multiple coins at once</li>
          <li>Custom labels for heads and tails</li>
          <li>Comprehensive statistics to track your results</li>
          <li>Works offline with PWA support</li>
          <li>Dark and light mode for comfortable use day or night</li>
        </ul>
        
        <h2 className="text-xl font-bold mt-6 mb-4">How to Use the Coin Flipper</h2>
        <p className="mb-3">
          Using our coin flip tool is simple. Just press the "Flip coin" button and watch as the virtual coin spins in the air before revealing your result. You can customize the coin's appearance in the settings tab, and view your flip history in the statistics tab.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-4">Why Use a Virtual Coin Flip?</h2>
        <p className="mb-3">
          A virtual coin flip ensures complete randomness and eliminates any concerns about an uneven or weighted physical coin. It's also convenient when you don't have a real coin handy or need to flip multiple coins at once.
        </p>
      </section>
    </main>
  )
}
