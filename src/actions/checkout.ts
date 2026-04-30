// src/actions/checkout.ts
// ─────────────────────────────────────────────
// Next.js Server Action — the entire checkout
// flow in one ACID transaction.
//
// Order of operations on every checkout call:
//   1. Validate input (Zod)
//   2. Acquire checkout lock (Redis — prevents double-submit)
//   3. Idempotency check (Redis cache → Postgres fallback)
//   4. Atomic inventory decrement (Redis DECRBY)
//   5. Prisma interactive transaction:
//        a. Insert IdempotencyKey (status = PROCESSING)
//        b. Create Order + OrderItems
//        c. Write InventoryLedgerEntries
//        d. Update ProductInventory balances
//        e. Mark IdempotencyKey (status = SUCCEEDED, responseBody)
//   6. Clear user's cart (Redis)
//   7. Release checkout lock
// ─────────────────────────────────────────────

'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { redis, keys, TTL } from '@/lib/redis'
import { Currency, LedgerReason, IdempotencyStatus } from '@prisma/client'
import { addHours } from 'date-fns'

// ─── Input schema ────────────────────────────

const CheckoutItemSchema = z.object({
  productId:  z.string().min(1),
  variantId:  z.string().optional(),
  name:       z.string().min(1),
  slug:       z.string().min(1),
  imageUrl:   z.string().url().optional(),
  priceKobo:  z.number().int().positive(),
  quantity:   z.number().int().min(1).max(99),
})

const CheckoutSchema = z.object({
  /** UUID generated on the client when the user clicks "Pay". */
  idempotencyKey:   z.string().uuid(),
  userId:           z.string().uuid(),
  shippingAddressId: z.string().uuid(),
  items:            z.array(CheckoutItemSchema).min(1),
  currency:         z.nativeEnum(Currency).default('NGN'),
})

export type CheckoutInput  = z.infer<typeof CheckoutSchema>
export type CheckoutResult =
  | { success: true;  orderId: string; totalKobo: number }
  | { success: false; error: string;   code: CheckoutErrorCode }

type CheckoutErrorCode =
  | 'VALIDATION_ERROR'
  | 'DUPLICATE_REQUEST'   // idempotency key already PROCESSING (concurrent call)
  | 'ALREADY_SUCCEEDED'   // idempotency key already SUCCEEDED (return cached result)
  | 'INSUFFICIENT_STOCK'
  | 'CHECKOUT_LOCKED'     // user already has a checkout in-flight
  | 'TRANSACTION_FAILED'

// ─── Main action ─────────────────────────────

export async function processCheckout(
  input: CheckoutInput
): Promise<CheckoutResult> {

  // Step 1 — Validate
  const parsed = CheckoutSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.message, code: 'VALIDATION_ERROR' }
  }
  const { idempotencyKey, userId, shippingAddressId, items, currency } = parsed.data

  const lockKey  = keys.checkoutLock(userId)
  const idemKey  = keys.idempotency(idempotencyKey)

  // Step 2 — Acquire checkout lock (SET NX EX)
  // Only one checkout per user can run at a time.
  const lockAcquired = await redis.set(lockKey, '1', 'EX', TTL.CHECKOUT_LOCK, 'NX')
  if (!lockAcquired) {
    return { success: false, error: 'Checkout already in progress.', code: 'CHECKOUT_LOCKED' }
  }

  try {

    // Step 3 — Idempotency check (Redis fast-path)
    const cachedIdem = await redis.get(idemKey)
    if (cachedIdem) {
      const cached = JSON.parse(cachedIdem) as CheckoutResult
      if ('code' in cached && cached.code === 'DUPLICATE_REQUEST') {
        return { success: false, error: 'Request already processing.', code: 'DUPLICATE_REQUEST' }
      }
      // Previously succeeded — return the original response without re-processing.
      return cached
    }

    // Postgres fallback (Redis may have evicted the key)
    const existingKey = await prisma.idempotencyKey.findUnique({
      where: { key: idempotencyKey },
      select: { status: true, responseBody: true },
    })
    if (existingKey) {
      if (existingKey.status === IdempotencyStatus.PROCESSING) {
        return { success: false, error: 'Request already processing.', code: 'DUPLICATE_REQUEST' }
      }
      if (existingKey.status === IdempotencyStatus.COMPLETED && existingKey.responseBody) {
        return existingKey.responseBody as CheckoutResult
      }
    }

    // Step 4 — Atomic inventory decrement in Redis
    // This is the fastest possible race-condition guard.
    // If stock goes negative, we abort before touching Postgres.
    const stockDecrements: Array<{ key: string; qty: number }> = []
    for (const item of items) {
      const stockKey = keys.stock(item.productId, item.variantId)
      const remaining = await redis.decrby(stockKey, item.quantity)

      if (remaining < 0) {
        // Roll back all decrements we've already applied this loop.
        for (const prev of stockDecrements) {
          await redis.incrby(prev.key, prev.qty)
        }
        await redis.incrby(stockKey, item.quantity) // roll back current
        return {
          success: false,
          error: `Insufficient stock for "${item.name}".`,
          code: 'INSUFFICIENT_STOCK',
        }
      }
      stockDecrements.push({ key: stockKey, qty: item.quantity })
    }

    // Step 5 — Prisma interactive transaction
    // Everything below is atomic: if any step throws, Postgres rolls back
    // AND we restore the Redis stock decrements in the catch block.
    const subtotalKobo = items.reduce((s, i) => s + i.priceKobo * i.quantity, 0)
    const totalKobo    = subtotalKobo  // extend here: + shippingKobo + taxKobo

    let result: CheckoutResult

    try {
      result = await prisma.$transaction(async (tx) => {

        // 5a — Reserve the idempotency key (PROCESSING)
        // Any concurrent request hitting step 3 above will now see this row.
        const idem = await tx.idempotencyKey.create({
          data: {
            key:         idempotencyKey,
            userId,
            requestPath: '/api/checkout',
            status:      IdempotencyStatus.PROCESSING,
            expiresAt:   addHours(new Date(), 24),
          },
        })

        // 5b — Create the Order
        const order = await tx.order.create({
          data: {
            userId,
            shippingAddressId,
            currency,
            subtotalKobo,
            totalKobo,
            idempotencyKey: { connect: { key: idempotencyKey } },
            items: {
              create: items.map((item) => ({
                productId:   item.productId,
                variantId:   item.variantId,
                productSlug: item.slug,
                name:        item.name,
                imageUrl:    item.imageUrl,
                priceKobo:   item.priceKobo,
                quantity:    item.quantity,
              })),
            },
            statusHistory: {
              create: { status: 'PENDING', note: 'Order created' },
            },
          },
        })

        // 5c + 5d — Write inventory ledger + update balances
        for (const item of items) {
          const inv = await tx.productInventory.update({
            where: {
              productId_variantId: {
                productId: item.productId,
                variantId: item.variantId ?? '',
              },
            },
            data: {
              quantityAvailable: { decrement: item.quantity },
            },
          })

          await tx.inventoryLedgerEntry.create({
            data: {
              inventoryId:  inv.id,
              orderId:      order.id,
              reason:       LedgerReason.PURCHASE,
              delta:        -item.quantity,
              balanceAfter: inv.quantityAvailable,
            },
          })
        }

        // 5e — Seal the idempotency key (SUCCEEDED + cached response)
        const successResult: CheckoutResult = {
          success:    true,
          orderId:    order.id,
          totalKobo,
        }

        await tx.idempotencyKey.update({
          where: { id: idem.id },
          data: {
            status:       IdempotencyStatus.SUCCEEDED,
            responseBody: successResult,
          },
        })

        return successResult
      }) // end $transaction

    } catch (txErr) {
      // Postgres rolled back — restore Redis stock decrements.
      for (const dec of stockDecrements) {
        await redis.incrby(dec.key, dec.qty)
      }
      console.error('[checkout] transaction failed:', txErr)
      return { success: false, error: 'Checkout failed. Please try again.', code: 'TRANSACTION_FAILED' }
    }

    // Step 6 — Clear the cart from Redis
    await redis.del(keys.cart(userId))

    // Cache the successful result in Redis for fast replay
    await redis.set(idemKey, JSON.stringify(result), 'EX', TTL.IDEMPOTENCY)

    return result

  } finally {
    // Step 7 — Always release the checkout lock
    await redis.del(lockKey)
  }
}
