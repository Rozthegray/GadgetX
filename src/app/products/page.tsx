// src/app/products/page.tsx
// ─────────────────────────────────────────────
// React Server Component — Product Listing Page
//
// All data fetching happens on the server:
//   • Products   → MongoDB  (zero client-side waterfall)
//   • Cart count → Redis    (hydrated in the same server render)
//
// Searchable, filterable, and sorted via URL search params
// so every state is shareable, bookmarkable, and crawlable
// (critical for TikTok bio links).
// ─────────────────────────────────────────────

import { Suspense } from 'react'
import { cache }    from 'react'
import { connectMongo }  from '@/lib/mongoose'
import { Product }       from '@/models/Product'
import { getCartCount }  from '@/actions/cart'
import { auth }          from '@/lib/auth'        // your NextAuth helper
import type { LeanProduct } from '@/models/Product'

// ─── Types ───────────────────────────────────

type SearchParams = {
  category?: string
  sort?:     'price_asc' | 'price_desc' | 'newest' | 'rating'
  q?:        string
  page?:     string
}

// ─── Data fetching ───────────────────────────

// React `cache()` deduplicates this call across the render tree
// so ProductGrid and any Suspense boundary can call it freely.
const getProducts = cache(async (params: SearchParams): Promise<LeanProduct[]> => {
  await connectMongo()

  const filter: Record<string, unknown> = { status: 'published' }

  if (params.category) {
    filter.category = params.category
  }

  // Full-text search — hits the text index on name + description
  if (params.q) {
    filter.$text = { $search: params.q }
  }

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    price_asc:  { priceKobo: 1 },
    price_desc: { priceKobo: -1 },
    newest:     { createdAt: -1 },
    rating:     { 'reviewSummary.average': -1 },
  }
  const sort = sortMap[params.sort ?? 'newest']

  const page  = Math.max(1, parseInt(params.page ?? '1', 10))
  const limit = 24
  const skip  = (page - 1) * limit

  // .lean() returns plain objects — safe to pass to Client Components
  // and serialize across the RSC boundary.
  return Product.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select('slug name brand priceKobo compareAtPriceKobo images category reviewSummary')
    .lean<LeanProduct[]>()
})

// ─── Page (RSC) ──────────────────────────────

export const metadata = {
  title: 'Products — StoreFront',
  description: 'Shop the latest phones, peripherals, and accessories.',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  // Parallel data fetching — both resolve before the first byte is sent.
  const session = await auth()
  const [products, cartCount] = await Promise.all([
    getProducts(searchParams),
    session?.user?.id ? getCartCount(session.user.id) : Promise.resolve(0),
  ])

  return (
    <main>
      <ProductListingHeader
        cartCount={cartCount}
        activeCategory={searchParams.category}
        activeSort={searchParams.sort}
        query={searchParams.q}
      />

      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid products={products} />
      </Suspense>
    </main>
  )
}

// ─── Components ──────────────────────────────

function ProductListingHeader({
  cartCount,
  activeCategory,
  activeSort,
  query,
}: {
  cartCount:      number
  activeCategory?: string
  activeSort?:     string
  query?:          string
}) {
  const categories = [
    'phones', 'laptops', 'keyboards', 'mice',
    'monitors', 'cooling', 'audio', 'accessories',
  ]

  return (
    <header>
      {/* Cart badge — count came from Redis on the server, no client fetch */}
      <a href="/cart" aria-label={`Cart, ${cartCount} items`}>
        Cart ({cartCount})
      </a>

      {/* Search — submits as ?q=... for RSC re-render */}
      <form method="GET" action="/products">
        <input
          name="q"
          defaultValue={query}
          placeholder="Search products…"
          autoComplete="off"
        />
        <button type="submit">Search</button>
      </form>

      {/* Category filters */}
      <nav aria-label="Product categories">
        <a href="/products" data-active={!activeCategory}>All</a>
        {categories.map((cat) => (
          <a
            key={cat}
            href={`/products?category=${cat}`}
            data-active={activeCategory === cat}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </a>
        ))}
      </nav>

      {/* Sort control */}
      <select
        name="sort"
        defaultValue={activeSort ?? 'newest'}
        // Note: a Client Component wrapper is needed for onChange.
        // This is intentionally minimal — add 'use client' to a
        // <SortSelect> wrapper if you want instant sort-on-change.
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="rating">Top Rated</option>
      </select>
    </header>
  )
}

function ProductGrid({ products }: { products: LeanProduct[] }) {
  if (products.length === 0) {
    return <p>No products found. Try a different filter.</p>
  }

  return (
    <ul role="list">
      {products.map((p) => (
        <li key={p._id}>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  )
}

function ProductCard({ product: p }: { product: LeanProduct }) {
  const image   = p.images?.[0]
  const onSale  = p.compareAtPriceKobo != null && p.compareAtPriceKobo > p.priceKobo
  const savings = onSale
    ? Math.round(((p.compareAtPriceKobo! - p.priceKobo) / p.compareAtPriceKobo!) * 100)
    : 0

  return (
    <a href={`/products/${p.slug}`}>
      {image && (
        <img
          src={image.url}
          alt={image.alt || p.name}
          width={image.width ?? 400}
          height={image.height ?? 400}
          loading="lazy"
        />
      )}
      {onSale && <span aria-label={`${savings}% off`}>-{savings}%</span>}

      <h2>{p.name}</h2>
      <p>{p.brand}</p>

      <div>
        <span>{formatKobo(p.priceKobo)}</span>
        {onSale && (
          <span aria-label="Original price">
            {formatKobo(p.compareAtPriceKobo!)}
          </span>
        )}
      </div>

      {p.reviewSummary.count > 0 && (
        <div aria-label={`${p.reviewSummary.average} out of 5 stars`}>
          ★ {p.reviewSummary.average.toFixed(1)}
          <span>({p.reviewSummary.count})</span>
        </div>
      )}
    </a>
  )
}

function ProductGridSkeleton() {
  return (
    <ul role="list" aria-label="Loading products" aria-busy="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <li key={i} aria-hidden="true" />
      ))}
    </ul>
  )
}

// ─── Utilities ───────────────────────────────

function formatKobo(kobo: number): string {
  return new Intl.NumberFormat('en-NG', {
    style:    'currency',
    currency: 'NGN',
    // Divide by 100 only at the display layer.
    // The integer lives in the database; the human-readable
    // string is created here and nowhere else.
  }).format(kobo / 100)
}