"use client"

import { useState, useEffect } from "react"
import { Plus, Leaf } from "lucide-react"
import PlantForm from "@/components/plant-form"
import PlantCard from "@/components/plant-card"
import Header from "@/components/header"

interface Plant {
  _id: string
  species: string
  plantedDate: string
  lastWateredDate?: string | null
  minGermination: number
  maxGermination: number
  wateringFrequency: number
  photo?: string | null
  notes?: string
}

interface FormData {
  species: string
  plantedDate: string
  lastWateredDate: string
  minGermination: string
  maxGermination: string
  wateringFrequency: string
  notes: string
  photo: string | null
}

export default function Home() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [showForm, setShowForm] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchPlants()
  }, [])

  const fetchPlants = async (): Promise<void> => {
    try {
      const res = await fetch("/api/plants")
      if (res.ok) {
        const data: Plant[] = await res.json()
        setPlants(data)
      }
    } catch (error) {
      console.error("Erro ao carregar plantas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPlant = async (plantData: FormData): Promise<void> => {
    try {
      const res = await fetch("/api/plants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plantData),
      })
      if (res.ok) {
        await fetchPlants()
        setShowForm(false)
      }
    } catch (error) {
      console.error("Erro ao adicionar planta:", error)
    }
  }

  const handleDeletePlant = async (id: string): Promise<void> => {
    try {
      const res = await fetch(`/api/plants/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        await fetchPlants()
      }
    } catch (error) {
      console.error("Erro ao deletar planta:", error)
    }
  }

  const handleWaterPlant = async (id: string): Promise<void> => {
    try {
      const res = await fetch(`/api/plants/${id}/water`, {
        method: "POST",
      })
      if (res.ok) {
        await fetchPlants()
      }
    } catch (error) {
      console.error("Erro ao regar planta:", error)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2 flex items-center gap-2">
                <Leaf className="w-8 h-8 md:w-10 md:h-10" />
                Meu Jardim Digital
              </h1>
              <p className="text-muted-foreground text-lg">Acompanhe o crescimento das suas plantas com facilidade</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Nova Planta</span>
              <span className="sm:hidden">Adicionar</span>
            </button>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="mb-8 animate-in">
              <PlantForm onSubmit={handleAddPlant} onCancel={() => setShowForm(false)} />
            </div>
          )}
        </div>

        {/* Plants Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-muted-foreground">Carregando suas plantas...</div>
          </div>
        ) : plants.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <Leaf className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">Nenhuma planta ainda</h2>
            <p className="text-muted-foreground mb-6">Comece adicionando sua primeira planta ao jardim digital</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Adicionar Planta
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.map((plant) => (
              <PlantCard key={plant._id} plant={plant} onDelete={handleDeletePlant} onWater={handleWaterPlant} />
            ))}
          </div>
        )}
      </div>
    </main>
    
  )
}
