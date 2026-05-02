import Link from "next/link";
import mongoose from "mongoose";
import { Product } from "@/models/Product"; 
import { 
  Gamepad2, Repeat, Wrench, Zap, Crosshair, 
  Search, Swords, ChevronRight, Flame, ChevronLeft, Smartphone, ShieldAlert, Activity, Filter, Cpu, ShoppingCart
} from "lucide-react";

import VersusArena from "@/components/VersusArena";

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
  const searchParams = await props.searchParams;

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from Vercel Environment Variables.");
    }
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    let totalProducts = await Product.countDocuments();
    
    // Auto-Seed Logic (Kept your exact data and FPS logic intact)
    if (totalProducts !== 32) { 
      await Product.deleteMany({}); 

      const rawProducts = [
        { name: "Xiaomi 15T Pro (512GB)", slug: "xiaomi-15t-pro", priceKobo: 82000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+15T+Pro" }], specs: { authenticity: "New", chipset: "Dimensity 9400+" } },
        { name: "Xiaomi 15 (512GB)", slug: "xiaomi-15-512", priceKobo: 65500000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+15" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Elite" } },
        { name: "Xiaomi 14 Pro (1TB)", slug: "xiaomi-14-pro", priceKobo: 86000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+14+Pro" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 3" } },
        { name: "Xiaomi 14 Ultra (512GB)", slug: "xiaomi-14-ultra", priceKobo: 70000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+14+Ultra" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 3" } },
        { name: "Xiaomi 14 (512GB)", slug: "xiaomi-14", priceKobo: 45000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+14" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 3" } },
        { name: "Xiaomi 14T (512GB)", slug: "xiaomi-14t", priceKobo: 41000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+14T" }], specs: { authenticity: "New", chipset: "Dimensity 8300 Ultra" } },
        { name: "Xiaomi 13 Ultra (512GB)", slug: "xiaomi-13-ultra", priceKobo: 48000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+13+Ultra" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 2" } },
        { name: "Xiaomi 13 Pro (512GB)", slug: "xiaomi-13-pro", priceKobo: 41000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+13+Pro" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 2" } },
        { name: "Xiaomi 13T Pro (512GB)", slug: "xiaomi-13t-pro", priceKobo: 36000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+13T+Pro" }], specs: { authenticity: "New", chipset: "Dimensity 9200+" } },
        { name: "Xiaomi 13T (256GB)", slug: "xiaomi-13t", priceKobo: 29000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+13T" }], specs: { authenticity: "New", chipset: "Dimensity 8200 Ultra" } },
        { name: "Xiaomi 13 Lite 5G (256GB)", slug: "xiaomi-13-lite", priceKobo: 24000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+13+Lite" }], specs: { authenticity: "New", chipset: "Snapdragon 7 Gen 1" } },
        { name: "Xiaomi 12 Pro (256GB)", slug: "xiaomi-12-pro", priceKobo: 26800000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+12+Pro" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 1" } },
        { name: "Poco F8 Pro (512GB)", slug: "poco-f8-pro", priceKobo: 83200000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Poco+F8+Pro" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Elite" } },
        { name: "Poco F6 Pro (512GB)", slug: "poco-f6-pro", priceKobo: 39500000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Poco+F6+Pro" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 2" } },
        { name: "Poco F6 (512GB)", slug: "poco-f6", priceKobo: 31500000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Poco+F6" }], specs: { authenticity: "New", chipset: "Snapdragon 8s Gen 3" } },
        { name: "Poco F5 (256GB)", slug: "poco-f5", priceKobo: 24000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Poco+F5" }], specs: { authenticity: "New", chipset: "Snapdragon 7+ Gen 2" } },
        { name: "Poco X7 Pro (256GB)", slug: "poco-x7-pro", priceKobo: 28000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Poco+X7+Pro" }], specs: { authenticity: "New", chipset: "Dimensity 8400-Ultra" } },
        { name: "Poco X6 Pro (512GB)", slug: "poco-x6-pro", priceKobo: 31000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Poco+X6+Pro" }], specs: { authenticity: "New", chipset: "Dimensity 8300 Ultra" } },
        { name: "Redmi Note 14 Pro (512GB)", slug: "redmi-note-14-pro", priceKobo: 30300000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Redmi+Note+14+Pro" }], specs: { authenticity: "New", chipset: "Dimensity 7300 Ultra" } },
        { name: "Redmi Note 13 Pro (512GB)", slug: "redmi-note-13-pro", priceKobo: 27000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Redmi+Note+13+Pro" }], specs: { authenticity: "New", chipset: "Snapdragon 7s Gen 2" } },
        { name: "Samsung S23 Ultra (256GB)", slug: "samsung-s23-ultra", priceKobo: 63000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Samsung+S23+Ultra" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 2" } },
        { name: "Samsung S22 Ultra (128GB)", slug: "samsung-s22-ultra", priceKobo: 44500000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Samsung+S22+Ultra" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 1" } },
        { name: "Samsung A55 (256GB)", slug: "samsung-a55", priceKobo: 37000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Samsung+A55" }], specs: { authenticity: "New", chipset: "Exynos 1480" } },
        { name: "Honor Magic 6 Pro (1TB)", slug: "honor-magic-6-pro", priceKobo: 68000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Honor+Magic+6+Pro" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 3" } },
        { name: "Oppo Reno 13 Pro (512GB)", slug: "oppo-reno-13-pro", priceKobo: 45000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Oppo+Reno+13+Pro" }], specs: { authenticity: "New", chipset: "Dimensity 8350" } },
        { name: "Vivo V50 (512GB)", slug: "vivo-v50", priceKobo: 43000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Vivo+V50" }], specs: { authenticity: "New", chipset: "Snapdragon 7 Gen 3" } },
        { name: "iQOO Neo 10", slug: "iqoo-neo-10", priceKobo: 52000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=iQOO+Neo+10" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 3" } },
        { name: "iQOO 12", slug: "iqoo-12", priceKobo: 74000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=iQOO+12" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 3" } },
        { name: "Realme GT 5 Pro", slug: "realme-gt-5-pro", priceKobo: 85000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Realme+GT+5+Pro" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 3" } },
        { name: "Red Magic 8 Pro Plus", slug: "red-magic-8-pro-plus", priceKobo: 70000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Red+Magic+8+Pro+Plus" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 2" } },
        { name: "Asus ROG 9", slug: "asus-rog-9", priceKobo: 150000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Asus+ROG+9" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Elite" } },
        { name: "Lenovo Y700 Gen 3", slug: "lenovo-y700-gen-3", priceKobo: 50000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Lenovo+Y700+Gen+3" }], specs: { authenticity: "New", chipset: "Snap 8 Gen 3" } }
      ];

      const processedProducts = rawProducts.map(p => {
        let brand = "Other";
        if (p.name.includes("Xiaomi")) brand = "Xiaomi";
        else if (p.name.includes("Poco")) brand = "Poco";
        else if (p.name.includes("Redmi")) brand = "Redmi";
        else if (p.name.includes("Samsung")) brand = "Samsung";
        else if (p.name.includes("Honor")) brand = "Honor";
        else if (p.name.includes("Oppo")) brand = "Oppo";
        else if (p.name.includes("Vivo") || p.name.includes("iQOO")) brand = "Vivo";
        else if (p.name.includes("Realme")) brand = "Realme";
        else if (p.name.includes("Red Magic")) brand = "RedMagic";
        else if (p.name.includes("ROG") || p.name.includes("Asus")) brand = "Asus";
        else if (p.name.includes("Lenovo")) brand = "Lenovo";

        let category = "phones"; 
        if (p.name.includes("Pad") || p.name.includes("Tab") || p.name.includes("Y700")) category = "tablets";

        let fpsTarget = "60 FPS Stable";
        const chip = p.specs.chipset.toLowerCase();
        if (chip.includes("8 gen 2") || chip.includes("8 gen 3") || chip.includes("8 elite") || chip.includes("9200") || chip.includes("9300") || chip.includes("9400") || chip.includes("8300") || chip.includes("8s gen 3")) {
            fpsTarget = "120 FPS Capable";
        } else if (chip.includes("8 gen 1") || chip.includes("888") || chip.includes("8100") || chip.includes("8200") || chip.includes("7+ gen 2") || chip.includes("7 gen 3") || chip.includes("tensor g4") || chip.includes("8400") || chip.includes("8350")) {
            fpsTarget = "90 FPS Stable";
        } else if (chip.includes("1200") || chip.includes("7s gen 2") || chip.includes("920") || chip.includes("g99") || chip.includes("1380") || chip.includes("1480") || chip.includes("7300") || chip.includes("7 gen 1")) {
            fpsTarget = "60-90 FPS";
        }

        return {
          ...p,
          brand: brand,
          category: category,
          specs: {
            ...p.specs,
            fps: fpsTarget
          },
          description: `Experience incredible mobile gaming performance with the ${p.name}. Powered by the highly capable ${p.specs.chipset} chipset, this device is optimized to give you a massive competitive advantage in CODM, PUBG, and Free Fire.`
        };
      });

      await Product.insertMany(processedProducts);
    }

    // ─── QUERY LOGIC & FILTERS ───
    const page = Number(searchParams.page) || 1;
    const limit = 16;
    const skip = (page - 1) * limit;
    
    const activeBrand = typeof searchParams.brand === 'string' ? searchParams.brand : 'All';
    const activePrice = typeof searchParams.price === 'string' ? searchParams.price : 'All';

    let query: any = { status: 'published' };
    if (activeBrand !== 'All') query.brand = activeBrand;
    
    if (activePrice !== 'All') {
      if (activePrice === '200') query.priceKobo = { $lt: 20000000 };
      else if (activePrice === '300') query.priceKobo = { $gte: 20000000, $lt: 30000000 };
      else if (activePrice === '400') query.priceKobo = { $gte: 30000000, $lt: 40000000 };
      else if (activePrice === '500') query.priceKobo = { $gte: 40000000, $lt: 50000000 };
      else if (activePrice === '600') query.priceKobo = { $gte: 50000000, $lt: 60000000 };
      else if (activePrice === '700') query.priceKobo = { $gte: 60000000, $lt: 70000000 };
      else if (activePrice === '700+') query.priceKobo = { $gte: 70000000 };
    }

    const latestDrops = await Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

    return (
      <main className="min-h-screen bg-black text-zinc-100 font-sans pb-24 selection:bg-red-600 selection:text-white">
        
        {/* 1. TOP UTILITY BAR (Sleeker) */}
        <div className="w-full bg-zinc-950 border-b border-zinc-900/50 py-2 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-[10px] md:text-xs font-bold tracking-widest text-zinc-400 uppercase">
            <div className="flex gap-4 md:gap-6">
              <Link href="/sell" className="hover:text-red-500 transition flex items-center gap-1.5"><Zap size={12} /> Sell Device</Link>
              <Link href="/swap" className="hover:text-red-500 transition flex items-center gap-1.5"><Repeat size={12} /> Swap</Link>
            </div>
            <div className="text-red-500 flex items-center gap-2 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
              Live Inventory: {totalProducts}
            </div>
          </div>
        </div>

        {/* 2. 🔥 UPGRADED HERO SECTION 🔥 */}
        <section className="relative w-full h-[55vh] flex flex-col items-center justify-center border-b border-zinc-900 px-4 text-center overflow-hidden">
          {/* Advanced Gradient Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent z-0" />
          
          <div className="relative z-10 max-w-4xl flex flex-col items-center">
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 border border-red-500/30 bg-red-500/10 text-red-500 text-xs md:text-sm font-black tracking-[0.2em] uppercase rounded-full shadow-[0_0_20px_rgba(220,38,38,0.2)]">
              <Flame size={14} className="animate-pulse" /> Nigeria's #1 Esports Hardware Hub
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4 leading-[0.9]">
              Equip to <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-orange-600 drop-shadow-[0_0_30px_rgba(220,38,38,0.3)]">Eliminate.</span>
            </h1>
            <p className="text-sm md:text-lg text-zinc-400 font-medium mb-8 max-w-xl mx-auto tracking-wide">
              Tournament-ready devices shipped fast. <br className="hidden md:block"/> No lag. No thermal throttling. No excuses.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 space-y-24 py-12">
          
          {/* 3. LATEST DROPS & ADVANCED FILTERS */}
          <section id="inventory">
            {/* Filter Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-zinc-900 pb-6 gap-6 sticky top-[36px] bg-black/80 backdrop-blur-xl z-40 pt-4">
              <h2 className="text-2xl md:text-3xl font-black uppercase flex items-center gap-3 w-full md:w-auto text-white drop-shadow-md">
                <TargetIcon /> Arsenal
              </h2>
              
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
                  {['All', 'Xiaomi', 'Poco', 'Redmi', 'Samsung', 'ROG', 'Red Magic', 'Lenovo'].map((brand) => (
                    <Link key={brand} href={`/?brand=${brand}&price=${activePrice}#inventory`} className={`px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-sm transition ${activeBrand === brand ? 'border border-red-500 text-red-500 bg-red-500/10 shadow-[0_0_10px_rgba(220,38,38,0.2)]' : 'border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'}`}>
                      {brand}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Budget Chips */}
            <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black flex items-center gap-1 shrink-0 mr-2"><Filter size={12}/> Budget:</span>
              {[
                { label: 'Any', val: 'All' }, { label: 'Under ₦200k', val: '200' }, { label: '₦200k - ₦300k', val: '300' }, { label: '₦300k - ₦400k', val: '400' }, { label: '₦400k - ₦500k', val: '500' }, { label: '₦500k - ₦600k', val: '600' }, { label: '₦600k - ₦700k', val: '700' }, { label: '₦700k+', val: '700+' },
              ].map((tier) => (
                <Link key={tier.val} href={`/?brand=${activeBrand}&price=${tier.val}#inventory`} className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition whitespace-nowrap shrink-0 ${activePrice === tier.val ? 'bg-zinc-100 text-black shadow-md' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}>
                  {tier.label}
                </Link>
              ))}
            </div>
            
            {/* 🔥 UPGRADED PRODUCT CARDS 🔥 */}
            {latestDrops.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {latestDrops.map((item: any) => (
                  <Link href={`/products/${item.slug}`} key={item._id.toString()} className="group relative flex flex-col bg-zinc-950 border border-zinc-800/80 hover:border-red-500/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] hover:-translate-y-1">
                    
                    {/* Image Area */}
                    <div className="w-full aspect-square bg-zinc-900/50 flex items-center justify-center p-6 relative">
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-zinc-700/50 text-zinc-300 text-[9px] md:text-[10px] font-black px-2.5 py-1 uppercase tracking-widest z-20 flex items-center gap-1.5 rounded">
                        <Cpu size={10} className="text-red-500" /> {item.specs?.chipset || 'Flagship SoC'}
                      </div>
                      
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-red-500 text-white text-[9px] md:text-[10px] font-black px-2.5 py-1 uppercase tracking-widest z-20 flex items-center gap-1.5 rounded shadow-[0_4px_10px_rgba(220,38,38,0.4)]">
                        <Activity size={10} /> {item.specs?.fps || 'Max FPS'}
                      </div>

                      <img src={item.images?.[0]?.url || '/images/placeholder.jpg'} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-2xl" />
                    </div>

                    {/* Glassmorphic Info Panel */}
                    <div className="p-4 md:p-5 flex flex-col grow bg-gradient-to-b from-transparent to-black/80 backdrop-blur-sm border-t border-zinc-800/50">
                      <h3 className="text-xs md:text-sm font-bold text-zinc-100 mb-2 leading-snug group-hover:text-red-400 transition-colors line-clamp-2">{item.name}</h3>
                      <div className="mt-auto flex items-end justify-between pt-2">
                        <div className="text-base md:text-xl font-black text-white tracking-tight">
                          {formatNaira(item.priceKobo)}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-500 transition-colors">
                          <ChevronRight size={14} className="text-white" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="w-full py-32 bg-zinc-950/50 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-zinc-500 uppercase font-black text-xl tracking-widest">
                <Search size={48} className="mb-4 text-zinc-700" />
                No Loadouts Found.
              </div>
            )}
          </section>

          <VersusArena />

          {/* 5. 🔥 UPGRADED BUDGET COMBOS CAROUSEL 🔥 */}
          <section className="relative">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                <ShoppingCart className="text-red-500" size={24} />
              </div>
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">Starter Loadouts</h2>
            </div>
            
            <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 scrollbar-hide snap-x snap-mandatory">
              
              {/* Combo 1 */}
              <div className="min-w-[85vw] md:min-w-[450px] bg-zinc-950 border border-zinc-800 hover:border-red-500/50 rounded-2xl p-1 shrink-0 snap-center group cursor-pointer transition-all duration-300">
                <div className="h-40 md:h-48 bg-zinc-900 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative border border-zinc-800/50">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <img src="https://placehold.co/800x400/18181b/ef4444?text=120+FPS+KIT" alt="Combo bundle" className="object-cover w-full h-full opacity-50 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute bottom-4 left-4 z-20">
                    <div className="bg-red-600 text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest rounded-sm inline-block mb-2">Best Value</div>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <h3 className="text-xl font-black mb-1 text-white">The 120 FPS Starter Kit</h3>
                  <p className="text-zinc-400 text-xs mb-4 font-medium">Poco X6 Pro + BlackShark Cooler 3 + Carbon Sleeves</p>
                  <div className="flex justify-between items-end pt-4 border-t border-zinc-800/50">
                    <div>
                      <div className="text-zinc-600 line-through text-xs font-bold mb-0.5">₦ 360,000</div>
                      <div className="text-2xl font-black text-red-500">₦ 345,000</div>
                    </div>
                    <button className="bg-white text-black px-4 py-2 font-black uppercase text-xs rounded-full hover:bg-zinc-200 transition">View Kit</button>
                  </div>
                </div>
              </div>

              {/* Combo 2 */}
              <div className="min-w-[85vw] md:min-w-[450px] bg-zinc-950 border border-zinc-800 hover:border-red-500/50 rounded-2xl p-1 shrink-0 snap-center group cursor-pointer transition-all duration-300">
                <div className="h-40 md:h-48 bg-zinc-900 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative border border-zinc-800/50">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <img src="https://placehold.co/800x400/18181b/ef4444?text=PURE+VALUE" alt="Combo bundle" className="object-cover w-full h-full opacity-50 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute bottom-4 left-4 z-20">
                    <div className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest rounded-sm inline-block mb-2">Entry Level</div>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <h3 className="text-xl font-black mb-1 text-white">The Pure Value Kit</h3>
                  <p className="text-zinc-400 text-xs mb-4 font-medium">Redmi Note 13 Pro + Basic Flydigi Triggers</p>
                  <div className="flex justify-between items-end pt-4 border-t border-zinc-800/50">
                    <div>
                      <div className="text-zinc-600 line-through text-xs font-bold mb-0.5">₦ 285,000</div>
                      <div className="text-2xl font-black text-red-500">₦ 275,000</div>
                    </div>
                    <button className="bg-white text-black px-4 py-2 font-black uppercase text-xs rounded-full hover:bg-zinc-200 transition">View Kit</button>
                  </div>
                </div>
              </div>

              {/* Combo 3 */}
              <div className="min-w-[85vw] md:min-w-[450px] bg-zinc-950 border border-zinc-800 hover:border-red-500/50 rounded-2xl p-1 shrink-0 snap-center group cursor-pointer transition-all duration-300">
                <div className="h-40 md:h-48 bg-zinc-900 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative border border-zinc-800/50">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <img src="https://placehold.co/800x400/18181b/ef4444?text=TRYHARD+PACK" alt="Combo bundle" className="object-cover w-full h-full opacity-50 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute bottom-4 left-4 z-20">
                    <div className="bg-orange-600 text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest rounded-sm inline-block mb-2">Sweaty Kit</div>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <h3 className="text-xl font-black mb-1 text-white">The Tryhard Pack</h3>
                  <p className="text-zinc-400 text-xs mb-4 font-medium">Poco F6 Pro + Memo Cooler + Pro Sleeves</p>
                  <div className="flex justify-between items-end pt-4 border-t border-zinc-800/50">
                    <div>
                      <div className="text-zinc-600 line-through text-xs font-bold mb-0.5">₦ 420,000</div>
                      <div className="text-2xl font-black text-red-500">₦ 399,000</div>
                    </div>
                    <button className="bg-white text-black px-4 py-2 font-black uppercase text-xs rounded-full hover:bg-zinc-200 transition">View Kit</button>
                  </div>
                </div>
              </div>

            </div>
          </section>

        </div>
      </main>
    );

  } catch (error: any) {
    return (
      <div className="min-h-screen bg-black text-red-500 p-10 font-mono flex flex-col items-center justify-center">
        <ShieldAlert size={64} className="mb-4 text-red-600 animate-pulse" />
        <h1 className="text-3xl font-black uppercase mb-2">Fatal Server Crash</h1>
        <div className="bg-red-950/30 border border-red-500/50 p-6 rounded text-left max-w-3xl w-full">
          <p className="font-bold text-red-400 mb-2">Exact Error Message:</p>
          <pre className="text-sm text-red-300 overflow-x-auto break-words whitespace-pre-wrap">{error.message}</pre>
        </div>
      </div>
    );
  }
}

// Just a tiny custom icon for the header!
function TargetIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  )
                                                                                                                }
