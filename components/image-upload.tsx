"use client"

import type React from "react"
import { useState } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void
  currentImage?: string
  label?: string
}

export function ImageUpload({ onImageSelect, currentImage, label = "Upload Image" }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreview(result)
        onImageSelect(result)
      }
      reader.readAsDataURL(file)
    } else {
      alert("Please select a valid image file")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleClearImage = () => {
    setPreview(null)
    onImageSelect("")
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {preview ? (
        <div className="relative">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleClearImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <Card
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            isDragging ? "border-primary bg-primary/5" : "border-border bg-muted/30"
          }`}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <label className="flex flex-col items-center justify-center py-8 px-4 cursor-pointer">
            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium text-foreground">Drag and drop your image here</p>
            <p className="text-xs text-muted-foreground mt-1">or click to select a file</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
              aria-label="Upload image"
            />
          </label>
        </Card>
      )}
    </div>
  )
}
