import { connectToDatabase } from "@/lib/mongodb"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"

async function getDatabase() {
  const client = await connectToDatabase()
  return client.db("planttracker")
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const plant = await db.collection("all_plants").findOne({
      _id: new ObjectId(id),
      userId: user.id,
    })

    if (!plant) {
      return NextResponse.json({ error: "Planta não encontrada" }, { status: 404 })
    }

    return NextResponse.json(plant)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Erro ao buscar planta" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const result = await db.collection("all_plants").deleteOne({
      _id: new ObjectId(id),
      userId: user.id,
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Planta não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Erro ao deletar planta" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ specie: string, response: any }> }) {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { specie, response } = body
    const db = await getDatabase()

    const result = await db.collection("all_plants").insertOne(
      { species: specie, info: response, userId: user.id },
    )
    console.log("Nova planta adicionada com ID:", result.insertedId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Erro ao atualizar planta" }, { status: 500 })
  }
}
