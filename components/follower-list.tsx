"use client"

import { useState } from "react"
import { useAppDispatch } from "@/lib/hooks"
import { unfollowUser } from "@/lib/slices/socialSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface FollowerUser {
  _id: string
  name: string
  profileImage?: string
}

interface FollowerListProps {
  title: string
  users: FollowerUser[]
  showUnfollowButton?: boolean
}

export default function FollowerList({ title, users, showUnfollowButton = false }: FollowerListProps) {
  const dispatch = useAppDispatch()
  const [localUsers, setLocalUsers] = useState(users)

  const handleUnfollow = (userId: string) => {
    dispatch(unfollowUser(userId))
    setLocalUsers(localUsers.filter((u) => u._id !== userId))
  }

  if (localUsers.length === 0) {
    return (
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No {title.toLowerCase()} yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">
          {title} ({localUsers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {localUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage || "/placeholder.svg"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-primary">{user.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="font-medium text-foreground truncate">{user.name}</span>
              </div>
              {showUnfollowButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUnfollow(user._id)}
                  className="ml-2 text-destructive hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
