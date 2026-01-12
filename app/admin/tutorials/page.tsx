"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setTutorials, addTutorial, deleteTutorial } from "@/lib/slices/tutorialsSlice"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import mockTutorials from "@/data/mockTutorials.json"
import { Plus, Trash2, Play } from "lucide-react"

const ITEMS_PER_PAGE = 6

export default function ManageTutorialsPage() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { tutorials } = useAppSelector((state) => state.tutorials)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [openDialog, setOpenDialog] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [title, setTitle] = useState("")
  const [youtubeId, setYoutubeId] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login")
    }
  }, [isAuthenticated, user?.role, router])

  useEffect(() => {
    if (tutorials.length === 0) {
      dispatch(setTutorials(mockTutorials as any))
    }
  }, [dispatch, tutorials.length])

  const handleOpenDialog = () => {
    setTitle("")
    setYoutubeId("")
    setDescription("")
    setOpenDialog(true)
  }

  const handleSubmit = () => {
    if (!title || !youtubeId) {
      alert("Please fill in all required fields")
      return
    }

    dispatch(
      addTutorial({
        _id: `tutorial-${Date.now()}`,
        title,
        youtubeId,
        description,
        createdDate: new Date().toISOString(),
      }),
    )

    setOpenDialog(false)
    setCurrentPage(1)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this tutorial?")) {
      dispatch(deleteTutorial(id))
    }
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  const totalPages = Math.ceil(tutorials.length / ITEMS_PER_PAGE)
  const paginatedTutorials = tutorials.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Manage Tutorials</h1>
              <p className="text-muted-foreground">Add or remove YouTube tutorials</p>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button onClick={handleOpenDialog} className="flex gap-2">
                  <Plus className="w-4 h-4" />
                  Add Tutorial
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Tutorial</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1 bg-input border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">YouTube Video ID</label>
                    <Input
                      value={youtubeId}
                      onChange={(e) => setYoutubeId(e.target.value)}
                      className="mt-1 bg-input border-border"
                      placeholder="dQw4w9WgXcQ"
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
                    Add Tutorial
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tutorials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedTutorials.map((tutorial) => (
              <Card key={tutorial._id} className="bg-card border-border/50 overflow-hidden">
                <div className="relative w-full aspect-video bg-black group overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${tutorial.youtubeId}/maxresdefault.jpg`}
                    alt={tutorial.title}
                    className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <h3 className="font-semibold text-foreground line-clamp-2">{tutorial.title}</h3>
                </CardHeader>

                <CardContent>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(tutorial._id)}
                    className="w-full gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

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
