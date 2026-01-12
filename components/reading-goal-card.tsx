"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Flame, Target, BookOpen, Star } from "lucide-react"
import type { ReadingGoal } from "@/lib/slices/readingGoalsSlice"

interface ReadingGoalCardProps {
  goal: ReadingGoal
}

export function ReadingGoalCard({ goal }: ReadingGoalCardProps) {
  const progressPercentage = (goal.booksReadThisYear / goal.annualGoal) * 100

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Annual Goal Progress */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Annual Reading Goal</CardTitle>
                <CardDescription>Books read this year</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-3xl font-bold text-foreground">{goal.booksReadThisYear}</span>
              <span className="text-sm text-muted-foreground">of {goal.annualGoal} books</span>
            </div>
            <Progress value={Math.min(progressPercentage, 100)} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round(progressPercentage)}% complete - {goal.annualGoal - goal.booksReadThisYear} books remaining
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Reading Streak */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900">
              <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Reading Streak</CardTitle>
              <CardDescription>Days with progress</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-orange-600 dark:text-orange-400">{goal.readingStreak}</span>
            <span className="text-muted-foreground">day streak</span>
          </div>
        </CardContent>
      </Card>

      {/* Pages Read */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Total Pages</CardTitle>
              <CardDescription>Pages read this year</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{goal.totalPagesRead}</span>
        </CardContent>
      </Card>

      {/* Average Rating & Favorite Genre */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900">
              <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Reading Insights</CardTitle>
              <CardDescription>Your stats</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg. Rating:</span>
              <span className="font-semibold text-foreground">{goal.averageRating.toFixed(1)} / 5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Favorite Genre:</span>
              <span className="font-semibold text-foreground">{goal.favoriteGenre}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
