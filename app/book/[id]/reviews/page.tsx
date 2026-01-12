"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { addReview } from "@/lib/slices/reviewsSlice"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"

export default function WriteReviewPage() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { books } = useAppSelector((state) => state.books)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const params = useParams()
  const bookId = params.id as string

  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const book = books.find((b) => b._id === bookId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!rating || !reviewText.trim()) {
      setError("Please provide a rating and review text")
      return
    }

    if (reviewText.length < 10) {
      setError("Review must be at least 10 characters long")
      return
    }

    dispatch(
      addReview({
        _id: `review-${Date.now()}`,
        bookId,
        userId: user!.id,
        userName: user!.name,
        rating,
        reviewText,
        status: "pending",
        createdDate: new Date().toISOString(),
      }),
    )

    setSubmitted(true)
    setTimeout(() => router.push(`/book/${bookId}`), 2000)
  }

  if (!isAuthenticated || !book) {
    return null
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button variant="outline" onClick={() => router.back()} className="mb-6 bg-transparent">
            ← Back to Book
          </Button>

          <div className="space-y-6">
            {/* Book Info */}
            <div className="flex gap-4">
              <div className="w-16 h-24 rounded overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={book.coverImage || "/placeholder.svg"}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-bold text-foreground">{book.title}</h2>
                <p className="text-muted-foreground">by {book.author}</p>
              </div>
            </div>

            {/* Review Form */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle>Write Your Review</CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="p-6 text-center space-y-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-green-800 dark:text-green-200 font-medium">Review submitted successfully!</p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Your review is pending approval. You'll be redirected shortly...
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
                        {error}
                      </div>
                    )}

                    {/* Rating */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                star <= rating
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-muted-foreground hover:text-yellow-500"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {rating > 0 && <p className="text-sm text-muted-foreground">{rating} out of 5 stars</p>}
                    </div>

                    {/* Review Text */}
                    <div className="space-y-3">
                      <label htmlFor="review" className="text-sm font-medium text-foreground">
                        Your Review
                      </label>
                      <Textarea
                        id="review"
                        placeholder="Share your thoughts about this book..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={6}
                        className="bg-input border-border resize-none"
                      />
                      <p className="text-xs text-muted-foreground">{reviewText.length} characters</p>
                    </div>

                    <Button type="submit" className="w-full">
                      Submit Review
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
