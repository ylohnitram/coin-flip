"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface SettingsProps {
  coinType: string
  setCoinType: (type: string) => void
  coinCount: number
  setCoinCount: (count: number) => void
  customNames: {
    heads: string
    tails: string
  }
  setCustomNames: (names: { heads: string; tails: string }) => void
  results: Array<{ result: string; timestamp: number }>
  setResults: (results: Array<{ result: string; timestamp: number }>) => void
}

export default function Settings({
  coinType,
  setCoinType,
  coinCount,
  setCoinCount,
  customNames,
  setCustomNames,
  results,
  setResults,
}: SettingsProps) {
  const [headsName, setHeadsName] = useState(customNames.heads)
  const [tailsName, setTailsName] = useState(customNames.tails)

  const handleSaveNames = () => {
    setCustomNames({
      heads: headsName || "Heads",
      tails: tailsName || "Tails",
    })
  }

  const handleClearStats = () => {
    setResults([])
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Settings</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Coin Appearance</h3>
          <Select value={coinType} onValueChange={setCoinType}>
            <SelectTrigger>
              <SelectValue placeholder="Select coin type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gold">Gold</SelectItem>
              <SelectItem value="silver">Silver</SelectItem>
              <SelectItem value="bronze">Bronze</SelectItem>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="black">Black</SelectItem>
              <SelectItem value="blue">Blue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Number of Coins</h3>
          <div className="flex items-center gap-4">
            <Slider
              value={[coinCount]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => setCoinCount(value[0])}
              className="flex-1"
            />
            <span className="w-8 text-center">{coinCount}</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Custom Names</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="heads-name">Heads Name</Label>
              <Input
                id="heads-name"
                value={headsName}
                onChange={(e) => setHeadsName(e.target.value)}
                placeholder="Heads"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tails-name">Tails Name</Label>
              <Input
                id="tails-name"
                value={tailsName}
                onChange={(e) => setTailsName(e.target.value)}
                placeholder="Tails"
              />
            </div>
            <Button onClick={handleSaveNames}>Save Names</Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Reset Data</h3>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Statistics
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your flip history and statistics. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearStats}>Yes, clear statistics</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  )
}
