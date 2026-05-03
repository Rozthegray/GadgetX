'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { redis, keys, TTL } from '@/lib/redis'

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
  idempotencyKey:   z.string().uuid(),
  userId:           z.string().uuid(),
  shippingAddressId: z.string().uuid(),
  items:            z.array(CheckoutItemSchema).min(1),
  currency:         z.string().default('NGN'), 
})

export type CheckoutInput  = z.infer<typeof CheckoutSchema>
export type CheckoutResult =
  | { success: true;  orderId: string; totalKobo: number }
  | { success: false; error: string;   code: CheckoutErrorCode }

type CheckoutErrorCode =
  | 'VALIDATION_ERROR'
  | 'DUPLICATE_REQUEST'
  | 'INSUFFICIENT_STOCK'
  | 'CHECKOUT_LOCKED'
  | 'TRANSACTION_FAILED'

// ─── Main action ─────────────────────────────

export async function processCheckout(
  input: CheckoutInput
): Promise<CheckoutResult> {

  const parsed = CheckoutSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.message, code: 'VALIDATION_ERROR' }
  }
  const { idempotencyKey, userId, shippingAddressId, items, currency } = parsed.data

  const lockKey  = keys.checkoutLock(userId)
  const idemKey  = keys.idempotency(idempotencyKey)

  const lockAcquired = await redis.set(lockKey, '1', 'EX', TTL.CHECKOUT_LOCK, 'NX')
  if (!lockAcquired) {
    return { success: false, error: 'Checkout already in progress.', code: 'CHECKOUT_LOCKED' }
  }

  try {
    const cachedIdem = await redis.get(idemKey)
    if (cachedIdem) {
      return { success: false, error: 'Request already processing.', code: 'DUPLICATE_REQUEST' }
    }

    // 🔥 FIX: We now only select the columns your database actually has!
    const existingKey = await prisma.idempotencyKey.findUnique({
      where: { key: idempotencyKey },
      select: { key: true, orderId: true },
    })
    
    if (existingKey) {
       return { success: false, error: 'Request already processed.', code: 'DUPLICATE_REQUEST' }
    }

    const stockDecrements: Array<{ key: string; qty: number }> = []
    for (const item of items) {
      const stockKey = keys.stock(item.productId, item.variantId)
      const remaining = await redis.decrby(stockKey, item.quantity)

      if (remaining < 0) {
        for (const prev of stockDecrements) {
          await redis.incrby(prev.key, prev.qty)
        }
        await redis.incrby(stockKey, item.quantity)
        return {
          success: false,
          error: `Insufficient stock for "${item.name}".`,
          code: 'INSUFFICIENT_STOCK',
        }
      }
      stockDecrements.push({ key: stockKey, qty: item.quantity })
    }

    const subtotalKobo = items.reduce((s, i) => s + i.priceKobo * i.quantity, 0)
    const totalKobo    = subtotalKobo

    let result: CheckoutResult

    try {
      result = await prisma.$transaction(async (tx) => {

        const order = await tx.order.create({
          data: {
            userId,
            shippingAddressId,
            currency,
            subtotalKobo,
            totalKobo,
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

        // 🔥 FIX: We create the idempotency key and link it to the order we just created
        await tx.idempotencyKey.create({
          data: {
            key: idempotencyKey,
            orderId: order.id
          },
        })

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
              reason:       'PURCHASE', 
              delta:        -item.quantity,
              balanceAfter: inv.quantityAvailable,
            },
          })
        }

        return {
          success:    true,
          orderId:    order.id,
          totalKobo,
        }
      })

    } catch (txErr) {
      for (const dec of stockDecrements) {
        await redis.incrby(dec.key, dec.qty)
      }
      console.error('[checkout] transaction failed:', txErr)
      return { success: false, error: 'Checkout failed. Please try again.', code: 'TRANSACTION_FAILED' }
    }

    await redis.del(keys.cart(userId))
    await redis.set(idemKey, 'processed', 'EX', TTL.IDEMPOTENCY)

    return result

  } finally {
    await redis.del(lockKey)
  }
}

// Add this to the BOTTOM of src/actions/checkout.ts

export async function preFlightStockCheck(items: Array<{ productId: string, variantId?: string, quantity: number, name: string }>) {
  try {
    for (const item of items) {
      // Look up the current stock in Postgres Vault
      const inventory = await prisma.productInventory.findUnique({
        where: {
          productId_variantId: {
            productId: item.productId,
            variantId: item.variantId ?? '',
          }
        }
      });

      if (!inventory) {
        return { success: false, error: `Critical Error: Inventory record missing for ${item.name}.` };
      }

      if (inventory.quantityAvailable < item.quantity) {
        return { 
          success: false, 
          error: `Sorry! "${item.name}" is out of stock. Someone just bought the last one.`,
          outOfStock: true
        };
      }
    }
    
    // If it survives the loop, we are good to charge!
    return { success: true };

  } catch (error) {
    console.error("Pre-flight check failed:", error);
    return { success: false, error: "Failed to verify stock levels." };
  }
}