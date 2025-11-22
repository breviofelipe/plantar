import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not defined")
}

let cachedClient: MongoClient | null = null

export async function connectToDatabase(): Promise<MongoClient> {
  if (cachedClient) {
    return cachedClient
  }

  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  cachedClient = client
  return client
}
