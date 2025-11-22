import { connectToDatabase } from "@/lib/mongodb"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"

async function getDatabase() {
  const client = await connectToDatabase()
  return client.db("planttracker")
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const db = await getDatabase()

    const plant = await db.collection("plants").findOne({ _id: new ObjectId(id), userId: user.id })

    if (!plant) {
      return NextResponse.json({ error: "Planta não encontrada" }, { status: 404 })
    }

    const newNote = {
      _id: new ObjectId(),
      content: body.content,
      createdAt: new Date(),
    }

    const result = await db.collection("plants").updateOne(
      { _id: new ObjectId(id), userId: user.id },
      {
        $push: { notes: newNote },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Planta não encontrada" }, { status: 404 })
    }

    return NextResponse.json(newNote, { status: 201 })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Erro ao adicionar nota" }, { status: 500 })
  }
}
