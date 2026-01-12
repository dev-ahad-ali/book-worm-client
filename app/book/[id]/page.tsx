"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setBooks } from "@/lib/slices/booksSlice"
import { setReviews } from "@/lib/slices/reviewsSlice"
import { addToLibrary, removeFromLibrary, moveToShelf } from "@/lib/slices/librarySlice"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import mockBooks from "@/data/mockBooks.json"
import mockReviews from "@/data/mockReviews.json"
import { Star, BookOpen, Clock, CheckCircle, MessageCircle } from "lucide-react"

export default function BookDetailsPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { books } = useAppSelector((state) => state.books)
  const { reviews } = useAppSelector((state) => state.reviews)
  const { items: libraryItems } = useAppSelector((state) => state.library)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const params = useParams()
  const bookId = params.id as string

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (books.length === 0) {
      dispatch(setBooks(mockBooks as any))
    }
    if (reviews.length === 0) {
      dispatch(setReviews(mockReviews as any))
    }
  }, [dispatch, books.length, reviews.length])

  const book = books.find((b) => b._id === bookId)
  const bookReviews = reviews.filter((r) => r.bookId === bookId && r.status === "approved")
  const libraryItem = libraryItems.find((item) => item.bookId === bookId)

  const handleAddToShelf = (shelf: "wantToRead" | "currentlyReading" | "read") => {
    if (libraryItem) {
      dispatch(moveToShelf({ bookId, shelfType: shelf }))
    } else {
      dispatch(
        addToLibrary({
          bookId,
          shelfType: shelf,
          addedDate: new Date().toISOString(),
        }),
      )
    }
  }

  const handleRemove = () => {
    dispatch(removeFromLibrary(bookId))
  }

  if (!isAuthenticated || !book) {
    return null
  }

  const avgReviewRating =
    bookReviews.length > 0 ? (bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length).toFixed(1) : "0"

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Button variant="outline" onClick={() => router.back()} className="mb-6 bg-transparent">
            ← Back
          </Button>

          {/* Book Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Book Cover */}
            <div className="md:col-span-1">
              <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-lg bg-muted">
                <img
                  src={book.coverImage || "/placeholder.svg"}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Book Info */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <p className="text-sm text-primary font-medium uppercase mb-2">{book.genre}</p>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{book.title}</h1>
                <p className="text-lg text-muted-foreground">by {book.author}</p>
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.round(book.averageRating) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-foreground">{book.averageRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({book.reviewCount} ratings)</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">{book.description}</p>

              {/* Details */}
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium text-foreground">Pages:</span>
                  <span className="text-muted-foreground"> {book.totalPages}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-foreground">Added to Shelves:</span>
                  <span className="text-muted-foreground"> {book.addedToShelvesCount.toLocaleString()}</span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="flex-1">{libraryItem ? "Move to Shelf" : "Add to Shelf"}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => handleAddToShelf("wantToRead")}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Want to Read
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddToShelf("currentlyReading")}>
                      <Clock className="w-4 h-4 mr-2" />
                      Currently Reading
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddToShelf("read")}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Read
                    </DropdownMenuItem>
                    {libraryItem && (
                      <>
                        <hr className="my-1 border-border" />
                        <DropdownMenuItem onClick={handleRemove} className="text-destructive">
                          Remove from Library
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" asChild className="flex-1 bg-transparent">
                  <a href={`/book/${bookId}/reviews`}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Write Review
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Reviews</h2>
              <p className="text-muted-foreground">
                {bookReviews.length === 0 ? "No reviews yet" : `${bookReviews.length} reviews`}
              </p>
            </div>

            {bookReviews.length === 0 ? (
              <Card className="bg-card border-border/50">
                <CardContent className="pt-8 pb-8 text-center">
                  <p className="text-muted-foreground mb-4">Be the first to review this book!</p>
                  <Button asChild>
                    <a href={`/book/${bookId}/reviews`}>Write a Review</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookReviews.map((review) => (
                  <Card key={review._id} className="bg-card border-border/50">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-foreground">{review.userName}</h4>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.createdDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{review.reviewText}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
