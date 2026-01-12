"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setGenres, addGenre, updateGenre, deleteGenre } from "@/lib/slices/genresSlice"
import { setBooks } from "@/lib/slices/booksSlice"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import mockGenres from "@/data/mockGenres.json"
import mockBooks from "@/data/mockBooks.json"
import { Plus, Edit2, Trash2, BookOpen } from "lucide-react"
import type { Genre } from "@/lib/slices/genresSlice"

export default function ManreGenresPage() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { genres } = useAppSelector((state) => state.genres)
  const { books } = useAppSelector((state) => state.books)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [openDialog, setOpenDialog] = useState(false)
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login")
    }
  }, [isAuthenticated, user?.role, router])

  useEffect(() => {
    if (genres.length === 0) {
      dispatch(setGenres(mockGenres as any))
    }
  }, [dispatch, genres.length])

  useEffect(() => {
    if (books.length === 0) {
      dispatch(setBooks(mockBooks as any))
    }
  }, [dispatch, books.length])

  const getGenreBookCount = (genreName: string) => {
    return books.filter((book) => book.genre === genreName).length
  }

  const handleOpenDialog = (genre?: Genre) => {
    if (genre) {
      setEditingGenre(genre)
      setName(genre.name)
      setDescription(genre.description || "")
    } else {
      setEditingGenre(null)
      setName("")
      setDescription("")
    }
    setOpenDialog(true)
  }

  const handleSubmit = () => {
    if (!name) {
      alert("Please enter a genre name")
      return
    }

    if (editingGenre) {
      dispatch(
        updateGenre({
          ...editingGenre,
          name,
          description,
        }),
      )
    } else {
      dispatch(
        addGenre({
          _id: `genre-${Date.now()}`,
          name,
          description,
        }),
      )
    }

    setOpenDialog(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this genre?")) {
      dispatch(deleteGenre(id))
    }
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Manage Genres</h1>
              <p className="text-muted-foreground">Create and manage book categories</p>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()} className="flex gap-2">
                  <Plus className="w-4 h-4" />
                  Add Genre
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingGenre ? "Edit Genre" : "Add New Genre"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Genre Name</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 bg-input border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1 bg-input border-border"
                      placeholder="Optional"
                    />
                  </div>
                  <Button className="w-full" onClick={handleSubmit}>
                    {editingGenre ? "Update Genre" : "Add Genre"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Genres Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {genres.map((genre) => (
              <Card key={genre._id} className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{genre.name}</h3>
                      {genre.description && <p className="text-xs text-muted-foreground mt-1">{genre.description}</p>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 p-3 rounded-lg bg-muted/50 border border-border/50 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Books</p>
                      <p className="text-lg font-bold text-foreground">{getGenreBookCount(genre.name)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(genre)}
                      className="flex-1 bg-transparent"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(genre._id)} className="flex-1">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
