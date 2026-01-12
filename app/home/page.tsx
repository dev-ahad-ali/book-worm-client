"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setBooks } from "@/lib/slices/booksSlice"
import { setReadingGoals, setCurrentGoal } from "@/lib/slices/readingGoalsSlice"
import { setActivities } from "@/lib/slices/activitySlice"
import { setSuggestedUsers, followUser } from "@/lib/slices/socialSlice"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BookCard from "@/components/book-card"
import { ReadingGoalCard } from "@/components/reading-goal-card"
import { GenreDistributionChart } from "@/components/charts/genre-distribution-chart"
import { MonthlyBooksChart } from "@/components/charts/monthly-books-chart"
import { PagesOverTimeChart } from "@/components/charts/pages-over-time-chart"
import { ActivityFeed } from "@/components/activity-feed"
import { FollowUsersCard } from "@/components/follow-users-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import mockBooks from "@/data/mockBooks.json"
import mockReadingGoals from "@/data/mockReadingGoals.json"
import mockActivityFeed from "@/data/mockActivityFeed.json"
import mockUsers from "@/data/mockUsers.json"
import { Lightbulb, BookMarked, Clock, CheckCircle } from "lucide-react"
import type { SocialUser } from "@/lib/slices/socialSlice"

export default function HomePage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { books } = useAppSelector((state) => state.books)
  const { items: libraryItems } = useAppSelector((state) => state.library)
  const { currentGoal } = useAppSelector((state) => state.readingGoals)
  const { activities } = useAppSelector((state) => state.activity)
  const { suggestedUsers } = useAppSelector((state) => state.social)
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (books.length === 0) {
      dispatch(setBooks(mockBooks as any))
    }
  }, [dispatch, books.length])

  useEffect(() => {
    if (!currentGoal) {
      dispatch(setReadingGoals(mockReadingGoals as any))
      const demoGoal = (mockReadingGoals as any)[0]
      if (demoGoal) {
        dispatch(setCurrentGoal(demoGoal))
      }
    }
  }, [dispatch, currentGoal])

  useEffect(() => {
    if (activities.length === 0) {
      dispatch(setActivities(mockActivityFeed as any))
    }
  }, [dispatch, activities.length])

  useEffect(() => {
    if (suggestedUsers.length === 0) {
      const suggestedData = (mockUsers as any)
        .filter((u: any) => u._id !== "demo-user")
        .slice(0, 4)
        .map((u: any) => ({
          _id: u._id,
          name: u.name,
          email: u.email,
          profileImage: u.profileImage,
          booksRead: Math.floor(Math.random() * 50) + 10,
          followers: Math.floor(Math.random() * 100) + 5,
          following: Math.floor(Math.random() * 50),
        }))
      dispatch(setSuggestedUsers(suggestedData))
    }
  }, [dispatch, suggestedUsers.length])

  // Get reading stats
  const wantToRead = libraryItems.filter((item) => item.shelfType === "wantToRead")
  const currentlyReading = libraryItems.filter((item) => item.shelfType === "currentlyReading")
  const read = libraryItems.filter((item) => item.shelfType === "read")

  // Get genres from read books
  const readBookIds = libraryItems.filter((item) => item.shelfType === "read").map((item) => item.bookId)
  const readBooks = books.filter((b) => readBookIds.includes(b._id))
  const favoriteGenres = readBooks.length > 0 ? [...new Set(readBooks.map((b) => b.genre))] : []

  // Chart data for genre distribution
  const genreData = books.reduce(
    (acc, book) => {
      const existing = acc.find((g) => g.name === book.genre)
      if (existing) {
        existing.value += 1
      } else {
        acc.push({ name: book.genre, value: 1 })
      }
      return acc
    },
    [] as Array<{ name: string; value: number }>,
  )

  // Monthly books data (demo)
  const monthlyData = [
    { month: "Jan", books: 3 },
    { month: "Feb", books: 2 },
    { month: "Mar", books: 4 },
    { month: "Apr", books: 2 },
    { month: "May", books: 3 },
    { month: "Jun", books: 2 },
    { month: "Jul", books: 1 },
    { month: "Aug", books: 2 },
    { month: "Sep", books: 2 },
    { month: "Oct", books: 2 },
    { month: "Nov", books: 1 },
    { month: "Dec", books: 0 },
  ]

  // Weekly pages data (demo)
  const weeklyData = [
    { week: "W1", pages: 120 },
    { week: "W2", pages: 150 },
    { week: "W3", pages: 100 },
    { week: "W4", pages: 180 },
    { week: "W5", pages: 160 },
    { week: "W6", pages: 140 },
    { week: "W7", pages: 175 },
    { week: "W8", pages: 120 },
  ]

  // Get recommended books
  let recommendedBooks = [...books]

  if (favoriteGenres.length > 0) {
    // Prefer books from favorite genres
    recommendedBooks.sort((a, b) => {
      const aIsGenre = favoriteGenres.includes(a.genre) ? 1 : 0
      const bIsGenre = favoriteGenres.includes(b.genre) ? 1 : 0
      return bIsGenre - aIsGenre || b.averageRating - a.averageRating
    })
  } else {
    // If no books read, sort by rating
    recommendedBooks.sort((a, b) => b.averageRating - a.averageRating)
  }

  // Remove already added books
  const addedBookIds = libraryItems.map((item) => item.bookId)
  recommendedBooks = recommendedBooks.filter((b) => !addedBookIds.includes(b._id)).slice(0, 6)

  const handleFollowUser = (user: SocialUser) => {
    dispatch(followUser(user))
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground text-lg">Discover your next favorite book and track your progress</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <Card className="bg-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BookMarked className="w-4 h-4 text-primary" />
                  Want to Read
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{wantToRead.length}</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" />
                  Currently Reading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{currentlyReading.length}</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Books Read
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{read.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Reading Goals Section */}
          {currentGoal && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">Your Reading Challenge</h2>
              <ReadingGoalCard goal={currentGoal} />
            </div>
          )}

          {/* Analytics & Social Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Your Reading Analytics & Community</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GenreDistributionChart data={genreData} />
              <MonthlyBooksChart data={monthlyData} />
              <PagesOverTimeChart data={weeklyData} />
              <div className="space-y-6">
                <ActivityFeed activities={activities} />
                <FollowUsersCard suggestedUsers={suggestedUsers} onFollow={handleFollowUser} />
              </div>
            </div>
          </div>

          {/* Personalized Recommendations Section */}
          <div className="mb-12">
            <div className="flex items-start gap-3 mb-6">
              <Lightbulb className="w-6 h-6 text-primary mt-1" />
              <div>
                <h2 className="text-3xl font-bold text-foreground">Personalized Recommendations</h2>
                <p className="text-muted-foreground mt-2">
                  {favoriteGenres.length > 0
                    ? `Based on your reading history in ${favoriteGenres.slice(0, 2).join(", ")}...`
                    : "Discover books based on top-rated selections"}
                </p>
              </div>
            </div>

            {recommendedBooks.length === 0 ? (
              <Card className="bg-card border-border/50">
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    {libraryItems.length === 0
                      ? "Start adding books to your library to get personalized recommendations!"
                      : "You've already added all recommended books. Keep reading!"}
                  </p>
                  {libraryItems.length === 0 && (
                    <a href="/browse" className="text-primary hover:underline font-medium">
                      Browse books to start →
                    </a>
                  )}
                </CardContent>
              </Card>
            ) : (
              <>
                {favoriteGenres.length > 0 && (
                  <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">Your favorite genres:</span> {favoriteGenres.join(", ")}
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedBooks.map((book) => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
