"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setBooks } from "@/lib/slices/booksSlice"
import { setGenres } from "@/lib/slices/genresSlice"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BookCard from "@/components/book-card"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import mockBooks from "@/data/mockBooks.json"
import mockGenres from "@/data/mockGenres.json"
import { Search, X } from "lucide-react"

export default function BrowsePage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { books } = useAppSelector((state) => state.books)
  const { genres } = useAppSelector((state) => state.genres)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [ratingFilter, setRatingFilter] = useState<number>(0)
  const [sortBy, setSortBy] = useState<"rating" | "shelved">("rating")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (books.length === 0) {
      dispatch(setBooks(mockBooks as any))
    }
    if (genres.length === 0) {
      dispatch(setGenres(mockGenres as any))
    }
  }, [dispatch, books.length, genres.length])

  // Filter and search logic
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGenre = selectedGenres.length === 0 || selectedGenres.includes(book.genre)

    const matchesRating = book.averageRating >= ratingFilter

    return matchesSearch && matchesGenre && matchesRating
  })

  // Sort
  if (sortBy === "rating") {
    filteredBooks.sort((a, b) => b.averageRating - a.averageRating)
  } else {
    filteredBooks.sort((a, b) => b.addedToShelvesCount - a.addedToShelvesCount)
  }

  // Pagination
  const itemsPerPage = 6
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage)
  const paginatedBooks = filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const toggleGenre = (genreId: string) => {
    setSelectedGenres((prev) => (prev.includes(genreId) ? prev.filter((g) => g !== genreId) : [...prev, genreId]))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedGenres([])
    setRatingFilter(0)
    setCurrentPage(1)
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
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Browse Books</h1>
            <p className="text-muted-foreground">Discover new books and add them to your shelves</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-card border-border/50 sticky top-20">
                <CardContent className="p-6 space-y-6">
                  {/* Search */}
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Search</label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Title or author..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value)
                          setCurrentPage(1)
                        }}
                        className="pl-8 bg-input border-border"
                      />
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-3">Minimum Rating</label>
                    <div className="space-y-2">
                      {[0, 3, 3.5, 4, 4.5].map((rating) => (
                        <label key={rating} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="rating"
                            value={rating}
                            checked={ratingFilter === rating}
                            onChange={(e) => {
                              setRatingFilter(Number(e.target.value))
                              setCurrentPage(1)
                            }}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-muted-foreground">
                            {rating === 0 ? "All" : rating + " stars"}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Genre Filter */}
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-3">Genres</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {genres.map((genre) => (
                        <label key={genre._id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedGenres.includes(genre.name)}
                            onChange={() => toggleGenre(genre.name)}
                            className="w-4 h-4 rounded"
                          />
                          <span className="text-sm text-muted-foreground">{genre.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {(searchTerm || selectedGenres.length > 0 || ratingFilter > 0) && (
                    <Button variant="outline" className="w-full bg-transparent" onClick={clearFilters}>
                      <X className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Books Grid */}
            <div className="lg:col-span-3">
              {/* Sort and Results Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {paginatedBooks.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{" "}
                  {Math.min(currentPage * itemsPerPage, filteredBooks.length)} of {filteredBooks.length} books
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "rating" | "shelved")}
                  className="px-3 py-2 rounded-md border border-border bg-card text-foreground text-sm"
                >
                  <option value="rating">Sort by Rating</option>
                  <option value="shelved">Sort by Most Shelved</option>
                </select>
              </div>

              {/* Books Grid */}
              {paginatedBooks.length === 0 ? (
                <Card className="bg-card border-border/50">
                  <CardContent className="pt-12 pb-12 text-center">
                    <p className="text-muted-foreground mb-2">No books found matching your criteria.</p>
                    {searchTerm || selectedGenres.length > 0 || ratingFilter > 0 ? (
                      <Button variant="link" onClick={clearFilters} className="text-primary">
                        Clear filters and try again
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedBooks.map((book) => (
                      <BookCard key={book._id} book={book} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="bg-transparent"
                      >
                        Previous
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className={page !== currentPage ? "bg-transparent" : ""}
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="bg-transparent"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
