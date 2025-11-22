"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { X, Upload } from "lucide-react"

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

interface PlantFormProps {
  onSubmit: (formData: FormData) => Promise<void> | void
  onCancel: () => void
}

export default function PlantForm({ onSubmit, onCancel }: PlantFormProps) {
  const [formData, setFormData] = useState<FormData>({
    species: "",
    plantedDate: "",
    lastWateredDate: "",
    minGermination: "",
    maxGermination: "",
    wateringFrequency: "7",
    notes: "",
    photo: null,
  })

  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64String = event.target?.result as string
        setFormData((prev) => ({ ...prev, photo: base64String }))
        setPhotoPreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = (): void => {
    setFormData((prev) => ({ ...prev, photo: null }))
    setPhotoPreview(null)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if (formData.species && formData.plantedDate && formData.minGermination && formData.maxGermination) {
      await onSubmit(formData)
      setFormData({
        species: "",
        plantedDate: "",
        lastWateredDate: "",
        minGermination: "",
        maxGermination: "",
        wateringFrequency: "7",
        notes: "",
        photo: null,
      })
      setPhotoPreview(null)
    }
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="bg-card border-2 border-accent rounded-xl p-6 md:p-8 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Registrar Nova Planta</h2>
        <button onClick={onCancel} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Espécie da Planta *</label>
          <input
            type="text"
            name="species"
            value={formData.species}
            onChange={handleChange}
            placeholder="Ex: Tomate, Alface, Rosa..."
            className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Data de Semeadura *</label>
            <input
              type="date"
              name="plantedDate"
              value={formData.plantedDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Última Rega</label>
            <input
              type="date"
              name="lastWateredDate"
              value={formData.lastWateredDate}
              onChange={handleChange}
              max={today}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Dias Mínimos de Germinação *</label>
            <input
              type="number"
              name="minGermination"
              value={formData.minGermination}
              onChange={handleChange}
              placeholder="Ex: 5"
              min="1"
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Dias Máximos de Germinação *</label>
            <input
              type="number"
              name="maxGermination"
              value={formData.maxGermination}
              onChange={handleChange}
              placeholder="Ex: 14"
              min="1"
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Frequência de Rega (dias) *</label>
          <input
            type="number"
            name="wateringFrequency"
            value={formData.wateringFrequency}
            onChange={handleChange}
            placeholder="Ex: 7"
            min="1"
            className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Notas</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Adicione observações sobre a planta..."
            className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none h-24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Foto da Planta (Opcional)</label>
          {photoPreview ? (
            <div className="relative mb-3">
              <img
                src={photoPreview || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border border-input"
              />
              <button
                type="button"
                onClick={removePhoto}
                className="absolute top-2 right-2 bg-destructive hover:bg-destructive/90 text-white p-2 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 w-full px-4 py-8 border-2 border-dashed border-accent rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors">
              <Upload className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-foreground">Clique para fazer upload</span>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2 rounded-lg font-semibold transition-all hover:shadow-lg"
          >
            Registrar Planta
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-muted hover:bg-muted/80 text-muted-foreground px-6 py-2 rounded-lg font-semibold transition-all"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
