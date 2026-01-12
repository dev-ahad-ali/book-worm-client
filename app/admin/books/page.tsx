"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setBooks, addBook, updateBook, deleteBook } from "@/lib/slices/booksSlice"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ImageUpload } from "@/components/image-upload"
import mockBooks from "@/data/mockBooks.json"
import { Plus, Edit2, Trash2 } from "lucide-react"
import type { Book } from "@/lib/slices/booksSlice"

const ITEMS_PER_PAGE = 5

export default function ManageBooksPage() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { books } = useAppSelector((state) => state.books)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [openDialog, setOpenDialog] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    coverImage: "",
    totalPages: 0,
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login")
    }
  }, [isAuthenticated, user?.role, router])

  useEffect(() => {
    if (books.length === 0) {
      dispatch(setBooks(mockBooks as any))
    }
  }, [dispatch, books.length])

  const handleOpenDialog = (book?: Book) => {
    if (book) {
      setEditingBook(book)
      setFormData({
        title: book.title,
        author: book.author,
        genre: book.genre,
        description: book.description,
        coverImage: book.coverImage,
        totalPages: book.totalPages,
      })
    } else {
      setEditingBook(null)
      setFormData({
        title: "",
        author: "",
        genre: "",
        description: "",
        coverImage: "",
        totalPages: 0,
      })
    }
    setOpenDialog(true)
  }

  const handleImageSelect = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      coverImage: imageUrl,
    }))
  }

  const handleSubmit = () => {
    if (!formData.title || !formData.author || !formData.genre) {
      alert("Please fill in all required fields")
      return
    }

    if (editingBook) {
      dispatch(
        updateBook({
          ...editingBook,
          ...formData,
        }),
      )
    } else {
      dispatch(
        addBook({
          _id: `book-${Date.now()}`,
          ...formData,
          averageRating: 0,
          reviewCount: 0,
          addedToShelvesCount: 0,
        }),
      )
    }

    setOpenDialog(false)
    setCurrentPage(1)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      dispatch(deleteBook(id))
    }
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE)
  const paginatedBooks = books.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Manage Books</h1>
              <p className="text-muted-foreground">Add, edit, or delete books from your catalog</p>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()} className="flex gap-2">
                  <Plus className="w-4 h-4" />
                  Add Book
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingBook ? "Edit Book" : "Add New Book"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <ImageUpload
                    onImageSelect={handleImageSelect}
                    currentImage={formData.coverImage}
                    label="Book Cover Image"
                  />

                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-1 bg-input border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Author</label>
                    <Input
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="mt-1 bg-input border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Genre</label>
                    <Input
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                      className="mt-1 bg-input border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Pages</label>
                    <Input
                      type="number"
                      value={formData.totalPages}
                      onChange={(e) => setFormData({ ...formData, totalPages: Number(e.target.value) })}
                      className="mt-1 bg-input border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1 bg-input border-border"
                    />
                  </div>
                  <Button className="w-full" onClick={handleSubmit}>
                    {editingBook ? "Update Book" : "Add Book"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Books Table */}
          <Card className="bg-card border-border/50">
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Title</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Author</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Genre</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Pages</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBooks.map((book) => (
                    <tr key={book._id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-4 px-4">
                        <p className="font-medium text-foreground line-clamp-1">{book.title}</p>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{book.author}</td>
                      <td className="py-4 px-4 text-muted-foreground">{book.genre}</td>
                      <td className="py-4 px-4 text-muted-foreground">{book.totalPages}</td>
                      <td className="py-4 px-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(book)}
                          className="bg-transparent"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(book._id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

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
        </div>
      </main>
      <Footer />
    </>
  )
}
