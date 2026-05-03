// src/app/products/page.tsx
import { Suspense, cache } from 'react'
import { connectMongo } from '@/lib/mongoose'
import { Product } from '@/models/Product'
import { getCartCount } from '@/actions/cart'
import type { LeanProduct } from '@/models/Product'
import SortDropdown from '@/components/SortDropdown'
import Navbar from '@/components/Navbar'
import ProductCard from '@/components/ProductCard'
import Footer from '@/components/Footer'
import { Search, SlidersHorizontal } from 'lucide-react'

export const dynamic = 'force-dynamic';

// ─── Types ───────────────────────────────────
type SearchParams = {
  category?: string
  sort?:     'price_asc' | 'price_desc' | 'newest' | 'rating'
  q?:        string
  page?:     string
}

// ─── Data fetching ───────────────────────────
const getProducts = cache(async (params: SearchParams): Promise<LeanProduct[]> => {
  await connectMongo()

  const filter: Record<string, unknown> = { status: 'published' }
  if (params.category) filter.category = params.category
  if (params.q) filter.$text = { $search: params.q }

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

  return Product.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select('slug name brand priceKobo compareAtPriceKobo images category reviewSummary specs') // Added specs for the chipset badge!
    .lean<LeanProduct[]>()
})

// ─── Page (RSC) ──────────────────────────────
export const metadata = {
  title: 'Products — GadgetX',
  description: 'Shop the latest tournament-ready phones, cooling systems, and accessories.',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams;
  
  // 🔥 THE FIX: We use our Guest ID since we haven't built the login system yet!
  const GUEST_USER_ID = "00000000-0000-0000-0000-000000000000";

  const [products, cartCount] = await Promise.all([
    getProducts(params),
    getCartCount(GUEST_USER_ID),
  ])

  return (
    <main className="min-h-screen bg-zinc-950 font-sans text-white">
      <Navbar />

      {/* Premium Page Header */}
      <div className="pt-32 pb-12 px-6 max-w-[1400px] mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 capitalize">
          {params.category ? `${params.category} Arsenal` : 'All Devices'}
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-light">
          {params.q 
            ? `Search results for "${params.q}"` 
            : 'Experience uncompromising performance with tournament-grade mobile hardware.'}
        </p>
      </div>

      <ProductListingHeader
        activeCategory={params.category}
        activeSort={params.sort}
        query={params.q}
      />

      <div className="max-w-[1400px] mx-auto px-6 pb-32">
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid products={products} />
        </Suspense>
      </div>

      <Footer />
    </main>
  )
}
// ─── Components ──────────────────────────────

function ProductListingHeader({
  activeCategory,
  activeSort,
  query,
}: {
  activeCategory?: string
  activeSort?:     string
  query?:          string
}) {
  const categories = [
    'phones', 'tablets', 'cooling', 'accessories'
  ]

  return (
    <div className="sticky top-16 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-white/5 mb-12">
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        {/* Category Filters */}
        <nav className="flex gap-6 overflow-x-auto w-full md:w-auto scrollbar-hide text-[13px] font-medium text-gray-400" aria-label="Product categories">
          <a href="/products" className={!activeCategory ? "text-white border-b-2 border-white pb-1 whitespace-nowrap" : "hover:text-white transition whitespace-nowrap pb-1 border-b-2 border-transparent"}>All</a>
          {categories.map((cat) => (
            <a
              key={cat}
              href={`/products?category=${cat}`}
              className={activeCategory === cat ? "text-white border-b-2 border-white pb-1 whitespace-nowrap capitalize" : "hover:text-white transition whitespace-nowrap pb-1 border-b-2 border-transparent capitalize"}
            >
              {cat}
            </a>
          ))}
        </nav>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <form method="GET" action="/products" className="relative flex-grow md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              name="q"
              defaultValue={query}
              placeholder="Search products…"
              autoComplete="off"
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
            />
          </form>

          <div className="relative">
             <SlidersHorizontal size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
           {/* Search & Sort Controls */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <form method="GET" action="/products" className="relative flex-grow md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              name="q"
              defaultValue={query}
              placeholder="Search products…"
              autoComplete="off"
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
            />
          </form>

          {/* 🔥 THE FIX: We injected our Client Component here! */}
          <SortDropdown activeSort={activeSort} />
          
        </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductGrid({ products }: { products: LeanProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="w-full py-32 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-3xl">
         <Search size={48} className="text-white/20 mb-4" strokeWidth={1} />
         <h2 className="text-xl font-bold text-white mb-2">No Arsenal Found</h2>
         <p className="text-gray-400">We couldn't find any devices matching that filter.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
      {products.map((p) => {
        // Map the lean MongoDB document to the prop structure expected by our Premium ProductCard
        const mappedItem = {
          slug: p.slug,
          name: p.name,
          priceKobo: p.priceKobo,
          images: p.images,
          specs: p.specs // Used for the floating chipset badge
        };
        return <ProductCard key={p._id.toString()} item={mappedItem} />
      })}
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-4 animate-pulse">
          <div className="w-full aspect-[4/5] bg-white/5 rounded-2xl"></div>
          <div className="h-4 bg-white/5 w-3/4 rounded"></div>
          <div className="h-5 bg-white/5 w-1/3 rounded"></div>
        </div>
      ))}
    </div>
  )
}