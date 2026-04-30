// src/actions/cart.ts
// ─────────────────────────────────────────────
// Cart is stored entirely in Redis as a hash:
//   key   → cart:{userId}
//   field → "{productId}:{variantId}"  (or "{productId}" if no variant)
//   value → JSON CartItem
//
// This gives O(1) add/remove/get per item and a
// single HGETALL to render the full cart page.
// The TTL is refreshed on every mutation so active
// shoppers never lose their cart.
// ─────────────────────────────────────────────

'use server'

import { z } from 'zod'
import { redis, keys, TTL } from '@/lib/redis'

// ─── Types ───────────────────────────────────

export type CartItem = {
  productId:   string
  variantId?:  string
  name:        string
  slug:        string
  imageUrl?:   string
  priceKobo:   number
  quantity:    number
}

export type Cart = {
  items:      CartItem[]
  totalKobo:  number
  itemCount:  number
}

// ─── Helpers ─────────────────────────────────

function fieldKey(productId: string, variantId?: string): string {
  return variantId ? `${productId}:${variantId}` : productId
}

async function rawToCart(raw: Record<string, string>): Promise<Cart> {
  const items = Object.values(raw).map((v) => JSON.parse(v) as CartItem)
  const totalKobo  = items.reduce((s, i) => s + i.priceKobo * i.quantity, 0)
  const itemCount  = items.reduce((s, i) => s + i.quantity, 0)
  return { items, totalKobo, itemCount }
}

// ─── Actions ─────────────────────────────────

const AddItemSchema = z.object({
  userId:    z.string().uuid(),
  productId: z.string().min(1),
  variantId: z.string().optional(),
  name:      z.string().min(1),
  slug:      z.string().min(1),
  imageUrl:  z.string().url().optional(),
  priceKobo: z.number().int().positive(),
  quantity:  z.number().int().min(1).max(99),
})

export async function addToCart(input: z.infer<typeof AddItemSchema>): Promise<Cart> {
  const data    = AddItemSchema.parse(input)
  const cartKey = keys.cart(data.userId)
  const field   = fieldKey(data.productId, data.variantId)

  // Merge with existing item if already in cart
  const existing = await redis.hget(cartKey, field)
  const current  = existing ? (JSON.parse(existing) as CartItem) : null

  const updated: CartItem = {
    productId:  data.productId,
    variantId:  data.variantId,
    name:       data.name,
    slug:       data.slug,
    imageUrl:   data.imageUrl,
    priceKobo:  data.priceKobo,
    quantity:   Math.min((current?.quantity ?? 0) + data.quantity, 99),
  }

  await redis.hset(cartKey, field, JSON.stringify(updated))
  await redis.expire(cartKey, TTL.CART)   // refresh TTL on every interaction

  const raw = await redis.hgetall(cartKey)
  return rawToCart(raw ?? {})
}

export async function removeFromCart(
  userId: string,
  productId: string,
  variantId?: string
): Promise<Cart> {
  const cartKey = keys.cart(userId)
  await redis.hdel(cartKey, fieldKey(productId, variantId))
  await redis.expire(cartKey, TTL.CART)

  const raw = await redis.hgetall(cartKey)
  return rawToCart(raw ?? {})
}

export async function updateQuantity(
  userId: string,
  productId: string,
  quantity: number,
  variantId?: string
): Promise<Cart> {
  const cartKey = keys.cart(userId)
  const field   = fieldKey(productId, variantId)

  if (quantity <= 0) {
    await redis.hdel(cartKey, field)
  } else {
    const existing = await redis.hget(cartKey, field)
    if (existing) {
      const item    = JSON.parse(existing) as CartItem
      item.quantity = Math.min(quantity, 99)
      await redis.hset(cartKey, field, JSON.stringify(item))
    }
  }

  await redis.expire(cartKey, TTL.CART)
  const raw = await redis.hgetall(cartKey)
  return rawToCart(raw ?? {})
}

export async function getCart(userId: string): Promise<Cart> {
  const raw = await redis.hgetall(keys.cart(userId))
  return rawToCart(raw ?? {})
}

export async function getCartCount(userId: string): Promise<number> {
  const raw = await redis.hgetall(keys.cart(userId))
  if (!raw) return 0
  return Object.values(raw).reduce((s, v) => {
    const item = JSON.parse(v) as CartItem
    return s + item.quantity
  }, 0)
}