import { connectToDatabase } from "@/lib/mongodb"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { uploadImage } from "@/lib/cloudinary-client"

interface PlantInput {
  species: string
  plantedDate: string
  lastWateredDate?: string | null
  minGermination: string
  maxGermination: string
  wateringFrequency?: string
  photo?: string | null
  notes?: string
}

export async function GET(): Promise<NextResponse> {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await connectToDatabase()
    const db = client.db("planttracker")
    const plants = await db.collection("plants").find({ userId: user.id }).toArray()
    return NextResponse.json(plants)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Erro ao buscar plantas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: PlantInput = await request.json()
    const client = await connectToDatabase()
    const db = client.db("planttracker")
    let compressedPhoto = body.photo || null
    if(body.photo)
      compressedPhoto = await uploadImage(body.photo)

    const newPlant = {
      userId: user.id, // Add userId to plant
      species: body.species,
      plantedDate: new Date(body.plantedDate),
      lastWateredDate: body.lastWateredDate ? new Date(body.lastWateredDate) : null,
      minGermination: Number.parseInt(body.minGermination),
      maxGermination: Number.parseInt(body.maxGermination),
      wateringFrequency: Number.parseInt(body.wateringFrequency || "7"),
      photo: compressedPhoto,
      notes: [],
      photos: [],
      createdAt: new Date(),
    }

    const result = await db.collection("plants").insertOne(newPlant)
    return NextResponse.json({ _id: result.insertedId, ...newPlant }, { status: 201 })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Erro ao adicionar planta" }, { status: 500 })
  }
}
