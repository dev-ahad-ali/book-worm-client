"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setBooks } from "@/lib/slices/booksSlice"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BookCard from "@/components/book-card"
import { Card, CardContent } from "@/components/ui/card"
import mockBooks from "@/data/mockBooks.json"
import { Lightbulb } from "lucide-react"

export default function RecommendationsPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { books } = useAppSelector((state) => state.books)
  const { items: libraryItems } = useAppSelector((state) => state.library)
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

  // Get genres from read books
  const readBookIds = libraryItems.filter((item) => item.shelfType === "read").map((item) => item.bookId)
  const readBooks = books.filter((b) => readBookIds.includes(b._id))
  const favoriteGenres = readBooks.length > 0 ? [...new Set(readBooks.map((b) => b.genre))] : []

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
  recommendedBooks = recommendedBooks.filter((b) => !addedBookIds.includes(b._id)).slice(0, 12)

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-primary mt-1" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">Personalized Recommendations</h1>
                <p className="text-muted-foreground mt-2">
                  {favoriteGenres.length > 0
                    ? `Based on your reading history in ${favoriteGenres.slice(0, 2).join(", ")}...`
                    : "Discover books based on top-rated selections"}
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
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
                <div className="mb-8 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Your favorite genres:</span> {favoriteGenres.join(", ")}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {recommendedBooks.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
