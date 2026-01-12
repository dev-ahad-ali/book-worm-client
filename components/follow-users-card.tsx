"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, Users } from "lucide-react"
import type { SocialUser } from "@/lib/slices/socialSlice"

interface FollowUsersCardProps {
  suggestedUsers: SocialUser[]
  onFollow: (user: SocialUser) => void
}

export function FollowUsersCard({ suggestedUsers, onFollow }: FollowUsersCardProps) {
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set())

  const handleFollow = (user: SocialUser) => {
    setFollowedIds((prev) => new Set([...prev, user._id]))
    onFollow(user)
  }

  if (suggestedUsers.length === 0) {
    return (
      <Card className="bg-card border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <CardTitle>Suggested Readers</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No suggested users at this time</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <CardTitle>Suggested Readers</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestedUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={user.profileImage || "/placeholder.svg"} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.booksRead} books read</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => handleFollow(user)}
                disabled={followedIds.has(user._id)}
                className="flex-shrink-0"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                {followedIds.has(user._id) ? "Following" : "Follow"}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
