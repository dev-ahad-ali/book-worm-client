"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { addToLibrary, removeFromLibrary, moveToShelf } from "@/lib/slices/librarySlice"
import { Star, BookOpen, Clock, CheckCircle, Trash2 } from "lucide-react"
import type { Book } from "@/lib/slices/booksSlice"
import type { LibraryItem } from "@/lib/slices/librarySlice"

interface BookCardProps {
  book: Book
  shelfType?: LibraryItem["shelfType"]
}

export default function BookCard({ book, shelfType }: BookCardProps) {
  const dispatch = useAppDispatch()
  const { items: libraryItems } = useAppSelector((state) => state.library)

  const isInLibrary = libraryItems.some((item) => item.bookId === book._id)
  const currentShelfType = libraryItems.find((item) => item.bookId === book._id)?.shelfType

  const handleAddToShelf = (shelf: "wantToRead" | "currentlyReading" | "read") => {
    if (isInLibrary) {
      dispatch(moveToShelf({ bookId: book._id, shelfType: shelf }))
    } else {
      dispatch(
        addToLibrary({
          bookId: book._id,
          shelfType: shelf,
          addedDate: new Date().toISOString(),
        }),
      )
    }
  }

  const handleRemove = () => {
    dispatch(removeFromLibrary(book._id))
  }

  const shelfIcons = {
    wantToRead: <BookOpen className="w-4 h-4" />,
    currentlyReading: <Clock className="w-4 h-4" />,
    read: <CheckCircle className="w-4 h-4" />,
  }

  const shelfLabels = {
    wantToRead: "Want to Read",
    currentlyReading: "Currently Reading",
    read: "Read",
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden bg-card border-border/50 hover:shadow-lg transition-shadow">
      <Link href={`/book/${book._id}`} className="flex-shrink-0 overflow-hidden">
        <div className="relative w-full aspect-[2/3] bg-muted overflow-hidden">
          <img
            src={book.coverImage || "/placeholder.svg"}
            alt={book.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      <CardContent className="flex-grow p-4 space-y-2">
        <Link href={`/book/${book._id}`} className="block hover:opacity-80">
          <h3 className="font-semibold text-sm text-foreground line-clamp-2">{book.title}</h3>
        </Link>
        <p className="text-xs text-muted-foreground">{book.author}</p>

        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
          <span className="text-xs font-medium text-foreground">{book.averageRating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({book.reviewCount})</span>
        </div>

        {currentShelfType && (
          <div className="flex items-center gap-1 text-xs text-primary mt-2">
            {shelfIcons[currentShelfType]}
            {shelfLabels[currentShelfType]}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-3 pt-0 flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              {isInLibrary ? "Move" : "Add to Shelf"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
            {isInLibrary && (
              <>
                <hr className="my-1 border-border" />
                <DropdownMenuItem onClick={handleRemove} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
          <Link href={`/book/${book._id}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
