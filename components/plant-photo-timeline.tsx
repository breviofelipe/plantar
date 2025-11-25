"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { Plus, Trash2, Calendar } from "lucide-react"
import { compressImage } from "@/lib/image-compression"

interface Photo {
  _id: string
  photo: string
  caption?: string
  createdAt: string
}

interface PlantPhotoTimelineProps {
  photos: Photo[]
  onAddPhoto: (photo: string) => Promise<void>
  onDeletePhoto: (id: string) => Promise<void>
}

export default function PlantPhotoTimeline({ photos, onAddPhoto, onDeletePhoto }: PlantPhotoTimelineProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      
      setPreview(base64)
      compressImage(base64, 192, 0.7).then((compress) => {
        console.log("compressedPhoto sucesso")
        setSelectedFile(compress)
      }).catch((error) => {
        console.error("Image compression error:", error)
      })
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if (!selectedFile) return

    setIsUploading(true)
    try {
      await onAddPhoto(selectedFile)
      setSelectedFile(null)
      setPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const sortedPhotos = [...photos].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="space-y-6">
      {/* Upload Photo Form */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Adicionar Foto
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {preview ? (
            <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
              <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
            </div>
          ) : (
            <label className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
              <Plus className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Clique ou arraste uma foto aqui</p>
              <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            </label>
          )}

          {preview && (
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isUploading}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? "Salvando..." : "Salvar Foto"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPreview(null)
                  setSelectedFile(null)
                }}
                className="px-6 bg-muted hover:bg-muted/80 text-foreground py-2 rounded-lg font-semibold transition-all"
              >
                Cancelar
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Photos Timeline */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Galeria ({photos?.length || 0})</h2>
        {sortedPhotos.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground">Nenhuma foto ainda</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedPhotos.map((photo, index) => (
              <div
                key={photo._id}
                className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition-colors"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="md:w-48 h-48 bg-muted flex-shrink-0">
                    <img
                      src={photo.photo || "/placeholder.svg"}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {formatDate(photo.createdAt)}
                        </div>
                        <button
                          onClick={() => onDeletePhoto(photo._id)}
                          className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {photo.caption && <p className="text-foreground text-sm">{photo.caption}</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
