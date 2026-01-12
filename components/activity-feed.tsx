"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookMarked, Star, CheckCircle, Play } from "lucide-react"
import type { Activity } from "@/lib/slices/activitySlice"

interface ActivityFeedProps {
  activities: Activity[]
}

const actionIcons = {
  added: <BookMarked className="w-4 h-4" />,
  rated: <Star className="w-4 h-4 fill-yellow-500" />,
  finished: <CheckCircle className="w-4 h-4 text-green-600" />,
  started: <Play className="w-4 h-4" />,
}

const actionText = {
  added: "added to shelf",
  rated: "rated",
  finished: "finished reading",
  started: "started reading",
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle>Community Activity</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No activity yet. Follow some readers to see their updates!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle>Community Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 8).map((activity) => (
            <div key={activity._id} className="flex gap-4 py-3 border-b border-border last:border-0">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.userId}`} />
                <AvatarFallback>{activity.userName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  <span className="font-semibold">{activity.userName}</span>{" "}
                  <span className="text-muted-foreground">{actionText[activity.action]}</span>
                </p>
                <p className="text-sm text-muted-foreground truncate">{activity.bookTitle}</p>
                {activity.rating && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    Rating: {activity.rating} / 5 stars
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </p>
              </div>
              <div className="text-muted-foreground flex-shrink-0">{actionIcons[activity.action]}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
