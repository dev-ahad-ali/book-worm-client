"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setReviews, updateReviewStatus, deleteReview } from "@/lib/slices/reviewsSlice"
import { setBooks } from "@/lib/slices/booksSlice"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import mockReviews from "@/data/mockReviews.json"
import mockBooks from "@/data/mockBooks.json"
import { Check, X, Star } from "lucide-react"

const ITEMS_PER_PAGE = 6

export default function ModerateReviewsPage() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { reviews } = useAppSelector((state) => state.reviews)
  const { books } = useAppSelector((state) => state.books)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [pendingPage, setPendingPage] = useState(1)
  const [approvedPage, setApprovedPage] = useState(1)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login")
    }
  }, [isAuthenticated, user?.role, router])

  useEffect(() => {
    if (reviews.length === 0) {
      dispatch(setReviews(mockReviews as any))
    }
    if (books.length === 0) {
      dispatch(setBooks(mockBooks as any))
    }
  }, [dispatch, reviews.length, books.length])

  const pendingReviews = reviews.filter((r) => r.status === "pending")
  const approvedReviews = reviews.filter((r) => r.status === "approved")

  const pendingTotalPages = Math.ceil(pendingReviews.length / ITEMS_PER_PAGE)
  const paginatedPending = pendingReviews.slice((pendingPage - 1) * ITEMS_PER_PAGE, pendingPage * ITEMS_PER_PAGE)

  const approvedTotalPages = Math.ceil(approvedReviews.length / ITEMS_PER_PAGE)
  const paginatedApproved = approvedReviews.slice((approvedPage - 1) * ITEMS_PER_PAGE, approvedPage * ITEMS_PER_PAGE)

  const handleApprove = (reviewId: string) => {
    dispatch(updateReviewStatus({ reviewId, status: "approved" }))
  }

  const handleReject = (reviewId: string) => {
    dispatch(deleteReview(reviewId))
  }

  const getBookTitle = (bookId: string) => books.find((b) => b._id === bookId)?.title || "Unknown"

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  const ReviewCard = ({ review }: { review: (typeof reviews)[0] }) => (
    <Card className="bg-card border-border/50">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-foreground">{review.userName}</p>
              <p className="text-xs text-muted-foreground">{getBookTitle(review.bookId)}</p>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                />
              ))}
            </div>
          </div>

          <p className="text-sm text-foreground">{review.reviewText}</p>

          {review.status === "pending" && (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleApprove(review._id)} className="flex-1 gap-2">
                <Check className="w-4 h-4" />
                Approve
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleReject(review._id)} className="flex-1 gap-2">
                <X className="w-4 h-4" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Moderate Reviews</h1>
            <p className="text-muted-foreground">Approve or reject user reviews</p>
          </div>

          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList className="bg-muted border-border">
              <TabsTrigger value="pending">Pending ({pendingReviews.length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({approvedReviews.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {paginatedPending.length === 0 ? (
                <Card className="bg-card border-border/50">
                  <CardContent className="pt-8 pb-8 text-center">
                    <p className="text-muted-foreground">No pending reviews</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="space-y-4">
                    {paginatedPending.map((review) => (
                      <ReviewCard key={review._id} review={review} />
                    ))}
                  </div>
                  {pendingTotalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        disabled={pendingPage === 1}
                        onClick={() => setPendingPage(pendingPage - 1)}
                        className="bg-transparent"
                      >
                        Previous
                      </Button>
                      {Array.from({ length: pendingTotalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={page === pendingPage ? "default" : "outline"}
                          onClick={() => setPendingPage(page)}
                          className={page !== pendingPage ? "bg-transparent" : ""}
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        disabled={pendingPage === pendingTotalPages}
                        onClick={() => setPendingPage(pendingPage + 1)}
                        className="bg-transparent"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="approved">
              {paginatedApproved.length === 0 ? (
                <Card className="bg-card border-border/50">
                  <CardContent className="pt-8 pb-8 text-center">
                    <p className="text-muted-foreground">No approved reviews</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="space-y-4">
                    {paginatedApproved.map((review) => (
                      <ReviewCard key={review._id} review={review} />
                    ))}
                  </div>
                  {approvedTotalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        disabled={approvedPage === 1}
                        onClick={() => setApprovedPage(approvedPage - 1)}
                        className="bg-transparent"
                      >
                        Previous
                      </Button>
                      {Array.from({ length: approvedTotalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={page === approvedPage ? "default" : "outline"}
                          onClick={() => setApprovedPage(page)}
                          className={page !== approvedPage ? "bg-transparent" : ""}
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        disabled={approvedPage === approvedTotalPages}
                        onClick={() => setApprovedPage(approvedPage + 1)}
                        className="bg-transparent"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  )
}
