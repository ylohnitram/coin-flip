"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"

interface StatisticsProps {
  results: Array<{ result: string; timestamp: number }>
  customNames: {
    heads: string
    tails: string
  }
}

export default function Statistics({ results, customNames }: StatisticsProps) {
  const [timeRange, setTimeRange] = useState("all")

  // Filter results based on time range
  const getFilteredResults = () => {
    if (timeRange === "all") return results

    const now = Date.now()
    const timeFilters = {
      today: now - 24 * 60 * 60 * 1000,
      week: now - 7 * 24 * 60 * 60 * 1000,
      month: now - 30 * 24 * 60 * 60 * 1000,
    }

    return results.filter((r) => r.timestamp >= timeFilters[timeRange as keyof typeof timeFilters])
  }

  const filteredResults = getFilteredResults()
  const headsCount = filteredResults.filter((r) => r.result === "heads").length
  const tailsCount = filteredResults.filter((r) => r.result === "tails").length
  const totalFlips = filteredResults.length

  // Prepare data for pie chart
  const pieData = [
    { name: customNames.heads, value: headsCount },
    { name: customNames.tails, value: tailsCount },
  ]

  // Prepare data for streak analysis
  const getStreakData = () => {
    if (filteredResults.length === 0) return []

    let currentStreak = 1
    let maxHeadsStreak = 0
    let maxTailsStreak = 0
    let currentType = filteredResults[0].result

    for (let i = 1; i < filteredResults.length; i++) {
      if (filteredResults[i].result === currentType) {
        currentStreak++
      } else {
        if (currentType === "heads") {
          maxHeadsStreak = Math.max(maxHeadsStreak, currentStreak)
        } else {
          maxTailsStreak = Math.max(maxTailsStreak, currentStreak)
        }
        currentStreak = 1
        currentType = filteredResults[i].result
      }
    }

    // Check the last streak
    if (currentType === "heads") {
      maxHeadsStreak = Math.max(maxHeadsStreak, currentStreak)
    } else {
      maxTailsStreak = Math.max(maxTailsStreak, currentStreak)
    }

    return [
      { name: customNames.heads, value: maxHeadsStreak },
      { name: customNames.tails, value: maxTailsStreak },
    ]
  }

  const streakData = getStreakData()

  // Colors for charts
  const COLORS = ["#f59e0b", "#3b82f6"]

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Statistics</h2>

      <Tabs defaultValue="all" onValueChange={setTimeRange}>
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="all">All Time</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
        </TabsList>
      </Tabs>

      {totalFlips === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No flips recorded yet. Start flipping coins to see statistics!
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Flips</p>
              <p className="text-2xl font-bold">{totalFlips}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Ratio</p>
              <p className="text-2xl font-bold">
                {totalFlips > 0
                  ? `${Math.round((headsCount / totalFlips) * 100)}% / ${Math.round((tailsCount / totalFlips) * 100)}%`
                  : "0% / 0%"}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Results Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Longest Streaks</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={streakData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {streakData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </Card>
  )
}

