"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setBooks } from "@/lib/slices/booksSlice"
import { setUsers } from "@/lib/slices/usersSlice"
import { setReviews } from "@/lib/slices/reviewsSlice"
import { setGenres } from "@/lib/slices/genresSlice"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import mockBooks from "@/data/mockBooks.json"
import mockReviews from "@/data/mockReviews.json"
import mockGenres from "@/data/mockGenres.json"
import { BookOpen, Users, MessageSquare, Star, TrendingUp } from "lucide-react"

const MOCK_USERS = [
  { _id: "user1", name: "John Reader", email: "user@example.com", role: "user" as const, createdDate: "2024-01-01" },
  { _id: "user2", name: "Jane Smith", email: "jane@example.com", role: "user" as const, createdDate: "2024-01-05" },
  { _id: "user3", name: "Robert Brown", email: "robert@example.com", role: "user" as const, createdDate: "2024-02-01" },
  { _id: "user4", name: "Sarah Davis", email: "sarah@example.com", role: "user" as const, createdDate: "2024-02-15" },
  { _id: "user5", name: "Michael Lee", email: "michael@example.com", role: "user" as const, createdDate: "2024-03-01" },
  { _id: "admin1", name: "Admin User", email: "admin@example.com", role: "admin" as const, createdDate: "2024-01-01" },
]

export default function AdminDashboard() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { books } = useAppSelector((state) => state.books)
  const { reviews } = useAppSelector((state) => state.reviews)
  const { genres } = useAppSelector((state) => state.genres)
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login")
    }
  }, [isAuthenticated, user?.role, router])

  useEffect(() => {
    if (books.length === 0) {
      dispatch(setBooks(mockBooks as any))
    }
    if (reviews.length === 0) {
      dispatch(setReviews(mockReviews as any))
    }
    if (genres.length === 0) {
      dispatch(setGenres(mockGenres as any))
    }
    dispatch(setUsers(MOCK_USERS as any))
  }, [dispatch, books.length, reviews.length, genres.length])

  const pendingReviews = reviews.filter((r) => r.status === "pending")
  const approvedReviews = reviews.filter((r) => r.status === "approved")

  const booksPerGenreData = genres.map((genre) => ({
    name: genre.name,
    books: books.filter((b) => b.genre === genre.name).length,
  }))

  const stats = [
    { label: "Total Books", value: books.length, icon: BookOpen, color: "text-blue-600" },
    { label: "Total Users", value: MOCK_USERS.length, icon: Users, color: "text-green-600" },
    { label: "Pending Reviews", value: pendingReviews.length, icon: MessageSquare, color: "text-orange-600" },
    { label: "Approved Reviews", value: approvedReviews.length, icon: Star, color: "text-yellow-600" },
  ]

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your BookWorm platform</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label} className="bg-card border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                      {stat.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Books Per Genre Chart */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <CardTitle>Books Per Genre</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={booksPerGenreData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="books" fill="hsl(var(--chart-1))" name="Books" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Reviews Overview */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle>Reviews Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-foreground">Pending Reviews</p>
                      <span className="text-2xl font-bold text-orange-600">{pendingReviews.length}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Awaiting moderation</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-foreground">Approved Reviews</p>
                      <span className="text-2xl font-bold text-green-600">{approvedReviews.length}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Published reviews</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-foreground">Total Reviews</p>
                      <span className="text-2xl font-bold text-blue-600">{reviews.length}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">All reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Books */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle>Recent Books ({books.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {books.slice(0, 5).map((book) => (
                    <div
                      key={book._id}
                      className="flex justify-between items-start p-3 rounded bg-muted/50 border border-border/50"
                    >
                      <div>
                        <p className="font-medium text-foreground text-sm">{book.title}</p>
                        <p className="text-xs text-muted-foreground">{book.author}</p>
                      </div>
                      <span className="text-xs font-medium text-primary">{book.genre}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Reviews */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle>Pending Reviews ({pendingReviews.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingReviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No pending reviews</p>
                ) : (
                  <div className="space-y-3">
                    {pendingReviews.slice(0, 5).map((review) => (
                      <div key={review._id} className="p-3 rounded bg-muted/50 border border-border/50">
                        <p className="font-medium text-foreground text-sm">{review.userName}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{review.reviewText}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Management Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Manage Books", href: "/admin/books", description: "Add, edit, or delete books" },
              { title: "Manage Genres", href: "/admin/genres", description: "Create and manage genres" },
              { title: "Manage Users", href: "/admin/users", description: "View and change user roles" },
              { title: "Moderate Reviews", href: "/admin/reviews", description: "Approve or delete reviews" },
              { title: "Manage Tutorials", href: "/admin/tutorials", description: "Add or remove tutorials" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-foreground mb-1">{link.title}</h3>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </a>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
