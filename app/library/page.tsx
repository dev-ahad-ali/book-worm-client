"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setBooks } from "@/lib/slices/booksSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BookCard from "@/components/book-card"
import mockBooks from "@/data/mockBooks.json"
import { BookMarked, Clock, CheckCircle } from "lucide-react"

export default function LibraryPage() {
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

  const wantToRead = libraryItems.filter((item) => item.shelfType === "wantToRead")
  const currentlyReading = libraryItems.filter((item) => item.shelfType === "currentlyReading")
  const read = libraryItems.filter((item) => item.shelfType === "read")

  const getBookById = (bookId: string) => books.find((b) => b._id === bookId)

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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">My Library</h1>
            <p className="text-muted-foreground">Manage and track your reading journey</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                  Read
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{read.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Shelves */}
          <Tabs defaultValue="wantToRead" className="space-y-4">
            <TabsList className="bg-muted border-border">
              <TabsTrigger value="wantToRead">Want to Read ({wantToRead.length})</TabsTrigger>
              <TabsTrigger value="currentlyReading">Currently Reading ({currentlyReading.length})</TabsTrigger>
              <TabsTrigger value="read">Read ({read.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="wantToRead" className="space-y-4">
              {wantToRead.length === 0 ? (
                <Card className="bg-card border-border/50">
                  <CardContent className="pt-8 text-center">
                    <p className="text-muted-foreground mb-4">No books in your Want to Read shelf yet.</p>
                    <a href="/browse" className="text-primary hover:underline font-medium">
                      Browse books to add
                    </a>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {wantToRead.map((item) => {
                    const book = getBookById(item.bookId)
                    return book ? <BookCard key={item.bookId} book={book} shelfType={item.shelfType} /> : null
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="currentlyReading" className="space-y-4">
              {currentlyReading.length === 0 ? (
                <Card className="bg-card border-border/50">
                  <CardContent className="pt-8 text-center">
                    <p className="text-muted-foreground mb-4">You're not currently reading any books.</p>
                    <a href="/browse" className="text-primary hover:underline font-medium">
                      Start reading a book
                    </a>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {currentlyReading.map((item) => {
                    const book = getBookById(item.bookId)
                    return book ? <BookCard key={item.bookId} book={book} shelfType={item.shelfType} /> : null
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="read" className="space-y-4">
              {read.length === 0 ? (
                <Card className="bg-card border-border/50">
                  <CardContent className="pt-8 text-center">
                    <p className="text-muted-foreground mb-4">You haven't finished reading any books yet.</p>
                    <a href="/browse" className="text-primary hover:underline font-medium">
                      Explore books and start reading
                    </a>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {read.map((item) => {
                    const book = getBookById(item.bookId)
                    return book ? <BookCard key={item.bookId} book={book} shelfType={item.shelfType} /> : null
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  )
}
