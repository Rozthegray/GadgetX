// src/lib/redis.ts
// ─────────────────────────────────────────────
// Singleton Redis client for Next.js.
// In serverless environments each lambda gets its own process,
// so the module-level singleton is the right pattern here.
// ─────────────────────────────────────────────

import Redis from 'ioredis'

declare global {
  // Prevents multiple client instances during Next.js hot-reload in dev.
  var __redis: Redis | undefined
}

function createClient(): Redis {
  const client = new Redis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: false,
  })

  client.on('error', (err) => {
    console.error('[Redis] connection error:', err)
  })

  return client
}

export const redis =
  process.env.NODE_ENV === 'production'
    ? createClient()
    : (global.__redis ??= createClient())

// ─────────────────────────────────────────────
// Typed key helpers — centralised so a typo
// can never produce a mismatched key in prod.
// ─────────────────────────────────────────────

export const keys = {
  /** Shopping cart for a user.  TTL: 7 days. */
  cart: (userId: string) => `cart:${userId}` as const,

  /** Real-time stock count for a product/variant.  No TTL — updated on restock. */
  stock: (productId: string, variantId?: string) =>
    variantId
      ? `stock:${productId}:${variantId}`
      : `stock:${productId}`,

  /** Checkout lock — prevents two concurrent checkouts for the same user. */
  checkoutLock: (userId: string) => `lock:checkout:${userId}` as const,

  /** Idempotency short-circuit cache (mirrors the Postgres table for hot reads). */
  idempotency: (key: string) => `idem:${key}` as const,
} as const

// ─────────────────────────────────────────────
// TTL constants (seconds)
// ─────────────────────────────────────────────

export const TTL = {
  CART:            60 * 60 * 24 * 7,   // 7 days
  CHECKOUT_LOCK:   30,                   // 30 seconds max for a checkout attempt
  IDEMPOTENCY:     60 * 60 * 24,        // 24 hours — mirrors Postgres expiresAt
} as const