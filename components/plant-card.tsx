"use client"

import { Droplet, Trash2, Calendar, FileText, Sprout, ChevronRight, AlertCircle } from "lucide-react"
import Link from "next/link"
import type { ObjectId } from "mongodb"
import Tips from "./Tips"
import { useState } from "react"
import Typewriter from "./Typewriter"

interface Plant {
  _id: ObjectId | string
  species: string
  plantedDate: string | Date
  lastWateredDate?: string | Date | null
  minGermination: number
  maxGermination: number
  wateringFrequency: number
  photo?: string | null
  notes?: any[] | null
}

interface WateringStatus {
  status: "never" | "ok" | "soon" | "overdue"
  daysOverdue?: number
  daysUntilNext?: number
  isAlert: boolean
}

interface PlantCardProps {
  plant: Plant
  onDelete: (id: string | ObjectId) => void
  onWater: (id: string | ObjectId) => void
}

export default function PlantCard({ plant, onDelete, onWater }: PlantCardProps) {
  const calculateDaysSincePlanted = (date: string | Date): number => {
    const planted = new Date(date)
    const today = new Date()
    const diff = today.getTime() - planted.getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  const calculateDaysSinceWatered = (date: string | Date): number => {
    const watered = new Date(date)
    const today = new Date()
    const diff = today.getTime() - watered.getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  const isGerminating = (): boolean => {
    const daysSince = calculateDaysSincePlanted(plant.plantedDate)
    return daysSince <= plant.maxGermination
  }

  const getWateringStatus = (): WateringStatus => {
    if (!plant.lastWateredDate) {
      return { status: "never", daysOverdue: undefined, isAlert: true }
    }

    const daysSinceWatered = calculateDaysSinceWatered(plant.lastWateredDate)
    const wateringFrequency = plant.wateringFrequency || 7
    const daysUntilNextWater = wateringFrequency - daysSinceWatered

    if (daysUntilNextWater <= 0) {
      return { status: "overdue", daysOverdue: Math.abs(daysUntilNextWater), isAlert: true }
    } else if (daysUntilNextWater <= 2) {
      return { status: "soon", daysUntilNext: daysUntilNextWater, isAlert: true }
    }

    return { status: "ok", daysUntilNext: daysUntilNextWater, isAlert: false }
  }

  const daysSincePlanted = calculateDaysSincePlanted(plant.plantedDate)
  const daysSinceWatered = plant.lastWateredDate ? calculateDaysSinceWatered(plant.lastWateredDate) : null
  const wateringStatus = getWateringStatus()

  const [llmResponse, setLlmResponse] = useState<string>("")
  const [showLlmChat, setShowLlmChat] = useState<boolean>(false)

  const handleAddNote = (note: any) => {
    setLlmResponse(note)
    handleShowLlmChat()
  }

  const handleShowLlmChat = () => {
    setShowLlmChat(!showLlmChat)
  }

  const formatDate = (dateString: string | Date): string => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    // 
    <div>
      <div className="bg-card border-2 border-accent rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:border-primary overflow-hidden cursor-pointer group relative">
        {plant.photo && (
          <div className="mb-4 -mx-6 -mt-6">
            <img
              src={plant.photo || "/placeholder.svg"}
              alt={plant.species}
              className="w-full h-40 object-cover rounded-t-lg"
            />
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <Link href={`/plants/${plant._id}`} className="flex-1">
            <h3 className="text-2xl font-bold text-foreground">{plant.species}</h3>
            <div className="flex items-center gap-2 mb-1">
              {isGerminating() && (
                <span className="inline-flex items-center gap-1 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                  <Sprout className="w-3 h-3" />
                  Germinando
                </span>
              )}
              {wateringStatus.isAlert && (
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    wateringStatus.status === "overdue"
                      ? "bg-destructive/20 text-destructive"
                      : "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                  }`}
                >
                  <AlertCircle className="w-3 h-3" />
                  {wateringStatus.status === "overdue" ? "Seca" : "Próxima"}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {daysSincePlanted} dias desde a semeadura{" "}
              {plant.minGermination &&
                plant.maxGermination &&
                `(Germinação: ${plant.minGermination}-${plant.maxGermination} dias)`}
            </p>
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault()
              onDelete(plant._id)
            }}
            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Info Grid */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-5 h-5 text-accent flex-shrink-0" />
            <div>
              <p className="text-muted-foreground">Data de Semeadura</p>
              <p className="font-semibold text-foreground">{formatDate(plant.plantedDate)}</p>
            </div>
          </div>

          {plant.lastWateredDate && (
            <div className="flex items-center gap-3 text-sm">
              <Droplet className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-muted-foreground">Última Rega</p>
                <p className="font-semibold text-foreground">
                  {formatDate(plant.lastWateredDate)} ({daysSinceWatered} dia{daysSinceWatered !== 1 ? "s" : ""} atrás)
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-muted-foreground">Próxima Rega</p>
              <p
                className={`font-semibold ${
                  wateringStatus.status === "overdue"
                    ? "text-destructive"
                    : wateringStatus.status === "soon"
                      ? "text-yellow-700 dark:text-yellow-400"
                      : "text-foreground"
                }`}
              >
                {wateringStatus.status === "never"
                  ? "Nunca foi regada"
                  : wateringStatus.status === "overdue"
                    ? `Passada há ${wateringStatus.daysOverdue} dia${wateringStatus.daysOverdue !== 1 ? "s" : ""}`
                    : `Em ${wateringStatus.daysUntilNext} dia${wateringStatus.daysUntilNext !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          {plant.notes && (
            <div className="flex items-start justify-between gap-3 text-sm">
              <FileText className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <div className="flex items-start justify-between">
                <p className="text-muted-foreground">Última Dica</p>
                <Tips isAuto={false} plant={plant} handleAddNote={(note: any) => {
                      handleAddNote(note);
                      fetch(`/api/plants/${plant._id}/notes`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ content: note }),
                      }).then(() => { console.log('Dica adicionada com sucesso');})
                }} />
                  
                </div>
                {!showLlmChat && plant.notes.length > 0 && <p className="font-semibold text-foreground">{plant.notes[plant.notes.length  - 1].content}</p>}
                {showLlmChat && <Typewriter text={llmResponse} />}
              </div>
            </div>
          )}
        </div>

        {/* Water Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            onWater(plant._id)
          }}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg font-semibold transition-all hover:shadow-lg flex items-center justify-center gap-2"
        >
          <Droplet className="w-4 h-4" />
          Regar Agora
        </button>

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>
  )
}
