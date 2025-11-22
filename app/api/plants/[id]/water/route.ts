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
    const db = await getDatabase()

    const result = await db
      .collection("plants")
      .updateOne({ _id: new ObjectId(id), userId: user.id }, { $set: { lastWateredDate: new Date() } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Planta não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Erro ao atualizar rega" }, { status: 500 })
  }
}
