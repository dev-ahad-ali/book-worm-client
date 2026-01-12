"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setTutorials } from "@/lib/slices/tutorialsSlice"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import mockTutorials from "@/data/mockTutorials.json"
import { Play } from "lucide-react"

export default function TutorialsPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { tutorials } = useAppSelector((state) => state.tutorials)
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (tutorials.length === 0) {
      dispatch(setTutorials(mockTutorials as any))
    }
  }, [dispatch, tutorials.length])

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Tutorials & Tips</h1>
            <p className="text-muted-foreground">Learn how to get the most out of BookWorm and improve your reading</p>
          </div>

          {/* Tutorials Grid */}
          {tutorials.length === 0 ? (
            <Card className="bg-card border-border/50">
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-muted-foreground">No tutorials available yet. Check back soon!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map((tutorial) => (
                <Card
                  key={tutorial._id}
                  className="bg-card border-border/50 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Video Thumbnail */}
                  <div className="relative w-full aspect-video bg-black group overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${tutorial.youtubeId}/maxresdefault.jpg`}
                      alt={tutorial.title}
                      className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                      <Play className="w-12 h-12 text-white fill-white" />
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-lg">{tutorial.title}</CardTitle>
                  </CardHeader>

                  {tutorial.description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{tutorial.description}</p>
                    </CardContent>
                  )}

                  {/* Watch Button */}
                  <div className="px-6 pb-4">
                    <a
                      href={`https://www.youtube.com/watch?v=${tutorial.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium"
                    >
                      <Play className="w-4 h-4" />
                      Watch Video
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
