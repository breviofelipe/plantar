import { connectToDatabase } from "@/lib/mongodb"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"
import { compressImage } from "@/lib/image-compression"

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

    let compressedPhoto = body.photo
    if (body.photo) {
      try {
        compressedPhoto = await compressImage(body.photo, 1200, 0.8)
      } catch (error) {
        console.error("Image compression error:", error)
      }
    }

    const newPhoto = {
      _id: new ObjectId(),
      photo: compressedPhoto,
      caption: body.caption || "",
      createdAt: new Date(),
    }

    const result = await db.collection("plants").updateOne(
      { _id: new ObjectId(id), userId: user.id },
      {
        $push: { photos: newPhoto },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Planta não encontrada" }, { status: 404 })
    }

    return NextResponse.json(newPhoto, { status: 201 })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Erro ao adicionar foto" }, { status: 500 })
  }
}
