import { notFound } from "next/navigation";
import mongoose from "mongoose";
import Link from "next/link";
import { Product } from "@/models/Product";
import { ShieldCheck, Zap, ShoppingCart, ChevronRight, Check, Repeat } from "lucide-react";  // act Helper to format kobo to NGN
const formatNaira = (kobo: number) => {
  return new Intl.NumberFormat('en-NG', { 
    style: 'currency', 
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(kobo / 100);
};

export default async function ProductDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  // 1. Unwrap the params Promise (Next.js 15+ requirement)
  const params = await props.params;

  // 2. Establish DB Connection
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }

  // 3. Fetch the specific product by slug
  const product = await Product.findOne({ slug: params.slug, status: 'published' }).lean();

  // 4. If the product doesn't exist, trigger the Next.js 404 page
  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-red-600 selection:text-white pb-24">
      
      {/* Top Breadcrumb Navigation */}
      <div className="w-full bg-zinc-950 border-b border-zinc-900 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center text-xs font-bold tracking-widest text-zinc-500 uppercase">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-red-500">{product.category}</span>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-zinc-300 truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square w-full bg-zinc-950 border border-zinc-800 flex items-center justify-center p-8 overflow-hidden">
              <img 
                src={product.images?.[0]?.url || '/images/placeholder.jpg'} 
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
            {/* Thumbnail Placeholder */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img: any, i: number) => (
                  <div key={i} className="w-24 h-24 shrink-0 border border-zinc-800 bg-zinc-950 cursor-pointer hover:border-red-500 transition">
                     <img src={img.url} alt={`${product.name} - View ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Buy Box */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
                {product.subCategory || "Hardware"}
              </span>
              <span className="px-3 py-1 bg-zinc-900 text-zinc-300 border border-zinc-800 text-xs font-bold uppercase tracking-wider">
                {product.specs?.authenticity || "Verified"}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
              {product.name}
            </h1>
            
            <p className="text-lg text-zinc-400 font-light mb-8">
              {product.description}
            </p>

            <div className="text-5xl font-black text-white mb-8 border-b border-zinc-900 pb-8">
              {formatNaira(product.priceKobo)}
            </div>

            {/* Variants (Colors/Storage) */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8 border-b border-zinc-900 pb-8">
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">Available Variants</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant: any) => (
                    <button 
                      key={variant.variantId}
                      className="px-4 py-2 border border-zinc-800 bg-zinc-950 hover:border-red-500 hover:text-red-500 transition text-sm font-bold"
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Core Specs Snapshot */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {product.tags?.slice(0, 4).map((tag: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm text-zinc-300 bg-zinc-900 p-3 border border-zinc-800 uppercase font-bold tracking-wider">
                  <Check size={16} className="text-red-500" /> {tag}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="flex-1 bg-red-600 text-white px-8 py-5 font-black uppercase tracking-widest hover:bg-red-700 transition flex items-center justify-center gap-3 text-lg">
                <ShoppingCart size={24} /> Add to Loadout
              </button>
              <button className="flex-1 bg-zinc-900 text-white border border-zinc-800 px-8 py-5 font-black uppercase tracking-widest hover:border-red-500 transition flex items-center justify-center gap-3 text-lg">
                <Zap size={24} className="text-red-500" /> Buy Now
              </button>
            </div>

            {/* Guarantees */}
            <div className="space-y-4 text-sm text-zinc-500 font-medium">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-red-500" size={20} />
                Tested and verified for competitive gaming.
              </div>
              <div className="flex items-center gap-3">
                <Repeat className="text-red-500" size={20} />
                Eligible for hardware swap and upgrade program.
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </main>
  );
}
