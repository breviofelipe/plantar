"use client"

import { use, useState, useEffect } from "react"
import { ArrowLeft, ImageIcon, FileText } from "lucide-react"
import Link from "next/link"
import PlantPhotoTimeline from "@/components/plant-photo-timeline"
import NotesSection from "@/components/notes-section"

export default function PlantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [plant, setPlant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("notes")

  useEffect(() => {
    fetchPlantDetails()
  }, [id])

  const fetchPlantDetails = async () => {
    try {
      const res = await fetch(`/api/plants/${id}`)
      if (res.ok) {
        const data = await res.json()
        setPlant(data)
      }
    } catch (error) {
      console.error("Erro ao carregar planta:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddNote = async (note: string) => {
    try {
      const res = await fetch(`/api/plants/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: note }),
      })
      if (res.ok) {
        await fetchPlantDetails()
      }
    } catch (error) {
      console.error("Erro ao adicionar nota:", error)
    }
  }

  const handleAddPhoto = async (photo: string) => {
    try {
      const res = await fetch(`/api/plants/${id}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo }),
      })
      if (res.ok) {
        await fetchPlantDetails()
      }
    } catch (error) {
      console.error("Erro ao adicionar foto:", error)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      const res = await fetch(`/api/plants/${id}/notes/${noteId}`, {
        method: "DELETE",
      })
      if (res.ok) {
        await fetchPlantDetails()
      }
    } catch (error) {
      console.error("Erro ao deletar nota:", error)
    }
  }

  const handleDeletePhoto = async (photoId: string) => {
    try {
      const res = await fetch(`/api/plants/${id}/photos/${photoId}`, {
        method: "DELETE",
      })
      if (res.ok) {
        await fetchPlantDetails()
      }
    } catch (error) {
      console.error("Erro ao deletar foto:", error)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse text-muted-foreground">Carregando...</div>
        </div>
      </main>
    )
  }

  if (!plant) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground">Planta não encontrada</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Voltar para minhas plantas
          </Link>

          <div className="bg-card rounded-xl p-8 border border-border">
            <h1 className="text-4xl font-bold text-foreground mb-2">{plant.species}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Data de Semeadura</p>
                <p className="text-lg font-semibold text-foreground">
                  {new Date(plant.plantedDate).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Última Rega</p>
                <p className="text-lg font-semibold text-foreground">
                  {plant.lastWateredDate
                    ? new Date(plant.lastWateredDate).toLocaleDateString("pt-BR")
                    : "Nunca foi regada"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Período de Germinação</p>
                <p className="text-lg font-semibold text-foreground">
                  {plant.minGermination} - {plant.maxGermination} dias
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all border-b-2 ${
              activeTab === "notes"
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            <FileText className="w-5 h-5" />
            Anotações
          </button>
          <button
            onClick={() => setActiveTab("photos")}
            className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all border-b-2 ${
              activeTab === "photos"
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            Galeria
          </button>
        </div>

        {/* Content */}
        {activeTab === "notes" && (
          <NotesSection notes={plant.notes || []} onAddNote={handleAddNote} onDeleteNote={handleDeleteNote} />
        )}
        {activeTab === "photos" && (
          <PlantPhotoTimeline
            photos={plant.photos || []}
            onAddPhoto={handleAddPhoto}
            onDeletePhoto={handleDeletePhoto}
          />
        )}
      </div>
    </main>
  )
}
