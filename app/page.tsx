import Link from "next/link";
import mongoose from "mongoose";
import { Product } from "@/models/Product"; 
import { 
  Gamepad2, Repeat, Wrench, Zap, Crosshair, 
  Search, Swords, ChevronRight, Flame, ChevronLeft, Smartphone
} from "lucide-react";

import VersusArena from "@/components/VersusArena";

// Helper to format kobo to NGN
const formatNaira = (kobo: number) => {
  return new Intl.NumberFormat('en-NG', { 
    style: 'currency', 
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(kobo / 100);
};

export default async function HomePage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 1. Unwrap the searchParams Promise
  const searchParams = await props.searchParams;

  // 2. Establish DB Connection
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }

  // 3. Pagination & Brand Logic
  const page = Number(searchParams.page) || 1;
  const limit = 16;
  const skip = (page - 1) * limit;
  const activeBrand = typeof searchParams.brand === 'string' ? searchParams.brand : 'Apple';

  // 4. Fetch Data
  const totalProducts = await Product.countDocuments({ status: 'published' });
  const totalPages = Math.ceil(totalProducts / limit);
  
  // Latest Drops (Page 1)
  const latestDrops = await Product.find({ status: 'published' })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // Brand Specific Phones
  const brandProducts = await Product.find({ 
    status: 'published',
    name: { $regex: activeBrand, $options: 'i' } // Simple search for brand in product name
  })
    .limit(8)
    .lean();

  return (
    <main className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-red-600 selection:text-white pb-24">
      
      {/* 1. TOP UTILITY BAR */}
      <div className="w-full bg-zinc-950 border-b border-zinc-900 py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-xs font-bold tracking-widest text-zinc-400 uppercase">
          <div className="flex gap-6">
            <Link href="/sell" className="hover:text-red-500 transition flex items-center gap-1"><Zap size={14} /> Sell</Link>
            <Link href="/swap" className="hover:text-red-500 transition flex items-center gap-1"><Repeat size={14} /> Swap</Link>
            <Link href="/fix" className="hover:text-red-500 transition flex items-center gap-1"><Wrench size={14} /> Fix</Link>
          </div>
          <div className="text-red-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Live Inventory: {totalProducts} Devices
          </div>
        </div>
      </div>

      {/* 2. HERO SECTION (Height Reduced & Copy Updated) */}
      <section className="relative w-full h-[90vh] flex flex-col items-center justify-center overflow-hidden border-b border-zinc-900 px-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-80" />
        
        <div className="relative z-10 max-w-4xl">
          <div className="mb-4 inline-block px-3 py-1 border border-red-500/30 bg-red-500/10 text-red-500 text-sm font-bold tracking-widest uppercase">
            Number one home for gaming Device
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 leading-none">
            Equip to <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Eliminate.</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 font-light mb-8 max-w-2xl mx-auto">
            <span className="text-white font-bold">Fast Shipping across Nigeria.</span> Buy, swap, or repair your rig. We keep you in the lobby.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-red-600 text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-red-700 transition">
              Shop Devices
            </button>
            <button className="border border-zinc-700 bg-zinc-900/50 text-white px-8 py-4 font-bold uppercase tracking-wider hover:border-white transition">
              Book a Service
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-32 py-16">

        {/* 3. LATEST DROPS */}
        <section id="inventory">
          <div className="flex justify-between items-end mb-8 border-b border-zinc-900 pb-4">
            <h2 className="text-2xl md:text-3xl font-black uppercase flex items-center gap-3">
              <Zap className="text-red-500" /> Latest Drops
            </h2>
            <Link href="/store" className="text-zinc-500 hover:text-white flex items-center text-sm font-bold uppercase tracking-wider">
              View All <ChevronRight size={16}/>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {latestDrops.map((item: any) => (
              <Link href={`/products/${item.slug}`} key={item._id.toString()} className="bg-zinc-900 border border-zinc-800 p-3 md:p-5 group hover:border-red-500 transition cursor-pointer flex flex-col">
                <div className="aspect-square bg-zinc-950 mb-4 flex items-center justify-center overflow-hidden">
                  <img 
                    src={item.images?.[0]?.url || '/images/placeholder.jpg'} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="flex justify-between items-start mb-1 md:mb-2 gap-2">
                  <h3 className="text-sm md:text-lg font-bold leading-tight group-hover:text-red-500 transition">{item.name}</h3>
                  <span className="text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 bg-zinc-800 text-zinc-300 rounded shrink-0 uppercase">
                    {item.specs?.authenticity?.includes('Used') ? 'UK USED' : 'NEW'}
                  </span>
                </div>
                <div className="mt-auto pt-4 text-lg md:text-2xl font-black text-white">
                  {formatNaira(item.priceKobo)}
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              {page > 1 ? (
                <Link href={`/?page=${page - 1}#inventory`} className="p-3 border border-zinc-800 hover:border-red-500 hover:text-red-500 transition">
                  <ChevronLeft size={20} />
                </Link>
              ) : (
                <div className="p-3 border border-zinc-900 text-zinc-700 cursor-not-allowed"><ChevronLeft size={20} /></div>
              )}
              
              <div className="font-bold text-zinc-400">
                Page <span className="text-white">{page}</span> of {totalPages}
              </div>

              {page < totalPages ? (
                <Link href={`/?page=${page + 1}#inventory`} className="p-3 border border-zinc-800 hover:border-red-500 hover:text-red-500 transition">
                  <ChevronRight size={20} />
                </Link>
              ) : (
                <div className="p-3 border border-zinc-900 text-zinc-700 cursor-not-allowed"><ChevronRight size={20} /></div>
              )}
            </div>
          )}
        </section>

        {/* 4. BRAND TOGGLE SECTION (NEW) */}
        <section id="brands">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 border-b border-zinc-900 pb-4">
            <h2 className="text-2xl md:text-3xl font-black uppercase flex items-center gap-3 w-full md:w-auto">
              <Smartphone className="text-red-500" /> Select Brand
            </h2>
            
            <div className="flex overflow-x-auto gap-2 pb-2 w-full md:w-auto scrollbar-hide">
              {['Apple', 'Samsung', 'Xiaomi', 'Asus', 'RedMagic'].map((brand) => (
                <Link 
                  key={brand} 
                  href={`/?brand=${brand}#brands`}
                  className={`px-5 py-2 text-sm font-bold uppercase tracking-wider border whitespace-nowrap transition ${
                    activeBrand.toLowerCase() === brand.toLowerCase() 
                    ? 'border-red-500 text-red-500 bg-red-500/10' 
                    : 'border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600'
                  }`}
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>

          {brandProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {brandProducts.map((item: any) => (
                <Link href={`/products/${item.slug}`} key={item._id.toString()} className="bg-zinc-900 border border-zinc-800 p-3 md:p-5 group hover:border-red-500 transition cursor-pointer flex flex-col">
                  <div className="aspect-square bg-zinc-950 mb-4 flex items-center justify-center overflow-hidden">
                    <img 
                      src={item.images?.[0]?.url || '/images/placeholder.jpg'} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="flex justify-between items-start mb-1 md:mb-2 gap-2">
                    <h3 className="text-sm md:text-lg font-bold leading-tight group-hover:text-red-500 transition">{item.name}</h3>
                  </div>
                  <div className="mt-auto pt-4 text-lg md:text-2xl font-black text-white">
                    {formatNaira(item.priceKobo)}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="w-full py-16 border border-zinc-900 bg-zinc-950/50 flex flex-col items-center justify-center text-zinc-500 uppercase tracking-widest font-bold">
              No devices currently in stock for {activeBrand}.
            </div>
          )}
        </section>

        {/* 5. INTERACTIVE VERSUS ARENA */}
        <VersusArena />

        {/* 6. BEST DEVICES BY GAME */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black uppercase mb-2">Meta Hardware</h2>
            <p className="text-zinc-400">Curated devices optimized for the top titles.</p>
          </div>
          
          <div className="flex justify-center gap-2 md:gap-4 mb-8 flex-wrap">
            {['CODM', 'PUBG', 'Free Fire', 'Blood Strike'].map((game, i) => (
              <button key={game} className={`px-6 py-3 border font-bold uppercase text-sm ${i === 0 ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-white'}`}>
                {game}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-zinc-950 border border-zinc-900 p-6 flex flex-col items-center text-center group cursor-pointer hover:border-red-500 transition">
                <div className="w-full aspect-video bg-zinc-900 mb-6 flex items-center justify-center text-zinc-800 border border-zinc-800 overflow-hidden">
                  <img src="https://placehold.co/600x400/18181b/ef4444?text=CODM+META" alt="Meta Loadout" className="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-50 group-hover:opacity-100" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-red-500 transition">iPhone 13 Pro Max</h3>
                <p className="text-zinc-400 text-sm mb-4">Stable 90fps. Perfect gyro response. The competitive standard.</p>
                <div className="text-lg font-bold text-white">Starts at ₦ 720,000</div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. COMBO CAROUSEL (Loadouts) */}
        <section>
          <div className="flex items-center gap-3 mb-8 border-b border-zinc-900 pb-4">
            <Flame className="text-red-500" />
            <h2 className="text-3xl font-black uppercase">Tactical Combos</h2>
          </div>
          
          <div className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x">
            {[1, 2, 3, 4].map((combo) => (
              <div key={combo} className="min-w-[320px] md:min-w-[400px] bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 p-6 shrink-0 snap-start group cursor-pointer hover:border-red-500 transition">
                <div className="h-32 bg-zinc-950 mb-4 flex items-center justify-center text-zinc-800 overflow-hidden relative">
                  <div className="absolute inset-0 bg-red-600/5 group-hover:bg-red-600/10 transition z-10" />
                  <img src="https://placehold.co/400x200/18181b/ef4444?text=BUNDLE" alt="Combo bundle" className="object-cover w-full h-full opacity-60" />
                </div>
                <h3 className="text-xl font-bold mb-1 group-hover:text-red-500 transition">The Sweaty Tryhard Pack</h3>
                <p className="text-zinc-500 text-xs mb-4">Poco X6 Pro + BlackShark Cooler + Thumb Sleeves</p>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-zinc-600 line-through text-sm">₦ 430,000</div>
                    <div className="text-2xl font-black text-red-500">₦ 399,000</div>
                  </div>
                  <button className="bg-white text-black p-2 hover:bg-zinc-200"><ChevronRight /></button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
