"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/hooks"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import FollowerList from "@/components/follower-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Calendar } from "lucide-react"
import mockUsers from "@/data/mockUsers.json"

export default function ProfilePage() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { items: libraryItems } = useAppSelector((state) => state.library)
  const router = useRouter()
  const [followers, setFollowers] = useState<any[]>([])
  const [following, setFollowing] = useState<any[]>([])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Load followers and following data from mock users
  useEffect(() => {
    if (user?.id) {
      const currentUser = mockUsers.find((u) => u._id === "demo-user")
      if (currentUser) {
        // Get followers data
        const followerUsers = mockUsers.filter((u) => currentUser.followers?.includes(u._id))
        setFollowers(followerUsers)

        // Get following data
        const followingUsers = mockUsers.filter((u) => currentUser.following?.includes(u._id))
        setFollowing(followingUsers)
      }
    }
  }, [user])

  const readBooks = libraryItems.filter((item) => item.shelfType === "read").length
  const currentlyReading = libraryItems.filter((item) => item.shelfType === "currentlyReading").length
  const wantToRead = libraryItems.filter((item) => item.shelfType === "wantToRead").length

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and view your reading stats</p>
          </div>

          {/* Profile Card */}
          <Card className="bg-card border-border/50 mb-8">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
                  <p className="text-sm text-muted-foreground capitalize">{user.role} User</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4 border-t border-border pt-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email Address</p>
                    <p className="font-medium text-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Account Type</p>
                    <p className="font-medium text-foreground capitalize">{user.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium text-foreground">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Books Read</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{readBooks}</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Currently Reading</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{currentlyReading}</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Want to Read</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{wantToRead}</p>
              </CardContent>
            </Card>
          </div>

          {/* Followers and Following Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FollowerList title="Followers" users={followers} showUnfollowButton={false} />
            <FollowerList title="Following" users={following} showUnfollowButton={true} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
