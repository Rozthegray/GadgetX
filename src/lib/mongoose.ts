// src/lib/mongoose.ts
// ─────────────────────────────────────────────
// Mongoose connection singleton.
// Caches the connection promise on the global object
// so Next.js hot-reload never opens duplicate pools.
// ─────────────────────────────────────────────

import mongoose from 'mongoose'

declare global {
  var __mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

const cached = global.__mongoose ?? { conn: null, promise: null }
global.__mongoose = cached

export async function connectMongo(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI!, {
      bufferCommands: false,
      dbName: process.env.MONGO_DB ?? 'store_products',
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}