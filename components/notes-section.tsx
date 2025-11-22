"use client"

import { useState, type FormEvent } from "react"
import { Plus, Trash2, Clock } from "lucide-react"

interface Note {
  _id: string
  content: string
  createdAt: string
}

interface NotesSectionProps {
  notes: Note[]
  onAddNote: (content: string) => Promise<void>
  onDeleteNote: (id: string) => Promise<void>
}

export default function NotesSection({ notes, onAddNote, onDeleteNote }: NotesSectionProps) {
  const [newNote, setNewNote] = useState<string>("")
  const [isAdding, setIsAdding] = useState<boolean>(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if (!newNote.trim()) return

    await onAddNote(newNote)
    setNewNote("")
    setIsAdding(false)
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Add Note Form */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Adicionar Anotação
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Digite sua anotação sobre a planta..."
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={4}
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!newNote.trim()}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Salvar Anotação
            </button>
            {isAdding && (
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false)
                  setNewNote("")
                }}
                className="px-6 bg-muted hover:bg-muted/80 text-foreground py-2 rounded-lg font-semibold transition-all"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Anotações ({notes.length})</h2>
        {notes.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground">Nenhuma anotação ainda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-card rounded-xl p-4 border border-border hover:border-primary transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {formatDate(note.createdAt)}
                  </div>
                  <button
                    onClick={() => onDeleteNote(note._id)}
                    className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-foreground whitespace-pre-wrap">{note.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
