import Link from "next/link";
import mongoose from "mongoose";
import { Product } from "@/models/Product"; 
import { 
  Gamepad2, Repeat, Wrench, Zap, Crosshair, 
  Search, Swords, ChevronRight, Flame, ChevronLeft, Smartphone, ShieldAlert, BatteryWarning, Activity, Filter, Cpu
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
    // 1. SAFELY CONNECT TO DB
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from Vercel Environment Variables.");
    }
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    // 2. AUTO-SEED LOGIC 
    let totalProducts = await Product.countDocuments();
    
    if (totalProducts < 40) { 
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

      // 🔥 ENUM FIX: Changed "Smartphone" to "phone" and "Tablet" to "tablet" 
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

        // *** CHANGED THIS LINE TO MATCH STANDARD DATABASE ENUMS ***
        let category = "phone"; 
        if (p.name.includes("Pad") || p.name.includes("Tab") || p.name.includes("Y700")) category = "tablet";

        return {
          ...p,
          brand: brand,
          category: category,
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
    
    if (activeBrand !== 'All') {
      query.brand = activeBrand;
    }
    
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
      <main className="min-h-screen bg-black text-zinc-100 font-sans pb-24">
        
        {/* 1. TOP UTILITY BAR */}
        <div className="w-full bg-zinc-950 border-b border-zinc-900 py-2">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-xs font-bold tracking-widest text-zinc-400 uppercase">
            <div className="flex gap-6">
              <Link href="/sell" className="hover:text-red-500 transition flex items-center gap-1"><Zap size={14} /> Sell</Link>
              <Link href="/swap" className="hover:text-red-500 transition flex items-center gap-1"><Repeat size={14} /> Swap</Link>
            </div>
            <div className="text-red-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Live Inventory: {totalProducts}+ Devices
            </div>
          </div>
        </div>

        {/* 2. HERO SECTION */}
        <section className="relative w-full h-[45vh] flex flex-col items-center justify-center border-b border-zinc-900 px-4 text-center">
          <div className="relative z-10 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 leading-none">
              Equip to <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Eliminate.</span>
            </h1>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 space-y-32 py-16">
          {/* 3. LATEST DROPS */}
          <section id="inventory">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-zinc-900 pb-4 gap-4">
              <h2 className="text-2xl md:text-3xl font-black uppercase flex items-center gap-3 w-full md:w-auto">
                <Zap className="text-red-500" /> GadgetX Arsenal
              </h2>
              
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-1"><Smartphone size={12}/> Brand</span>
                <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                  {['All', 'Xiaomi', 'Poco', 'Redmi', 'Samsung', 'ROG', 'Red Magic', 'Lenovo'].map((brand) => (
                    <Link key={brand} href={`/?brand=${brand}&price=${activePrice}#inventory`} className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider border whitespace-nowrap transition ${activeBrand === brand ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-zinc-800 text-zinc-500 hover:text-white'}`}>
                      {brand}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
              <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-1 shrink-0"><Filter size={12}/> Budget:</span>
              {[
                { label: 'Any', val: 'All' }, { label: 'Under ₦200k', val: '200' }, { label: '₦200k - ₦300k', val: '300' }, { label: '₦300k - ₦400k', val: '400' }, { label: '₦400k - ₦500k', val: '500' }, { label: '₦500k - ₦600k', val: '600' }, { label: '₦600k - ₦700k', val: '700' }, { label: '₦700k+', val: '700+' },
              ].map((tier) => (
                <Link key={tier.val} href={`/?brand=${activeBrand}&price=${tier.val}#inventory`} className={`px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full transition whitespace-nowrap shrink-0 ${activePrice === tier.val ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}>
                  {tier.label}
                </Link>
              ))}
            </div>
            
            {latestDrops.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {latestDrops.map((item: any) => (
                  <Link href={`/products/${item.slug}`} key={item._id.toString()} className="bg-zinc-900 border border-zinc-800 p-3 md:p-5 group hover:border-red-500 transition flex flex-col relative overflow-hidden">
                    <div className="absolute top-2 left-2 bg-black/80 backdrop-blur border border-zinc-800 text-red-500 text-[9px] md:text-[10px] font-black px-2 py-1 uppercase tracking-widest z-20 flex items-center gap-1">
                      <Cpu size={10} /> {item.specs?.chipset || 'Flagship SoC'}
                    </div>
                    <div className="w-full aspect-square bg-zinc-950 mb-4 flex items-center justify-center overflow-hidden">
                      <img src={item.images?.[0]?.url || '/images/placeholder.jpg'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500 opacity-80 group-hover:opacity-100" />
                    </div>
                    <h3 className="text-xs md:text-sm font-bold text-zinc-300 mb-1">{item.name}</h3>
                    <div className="mt-auto pt-3 text-sm md:text-xl font-black text-red-500">{formatNaira(item.priceKobo)}</div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="w-full py-24 border border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-600 uppercase font-black text-xl">
                No devices found in this price range.
              </div>
            )}
          </section>

          <VersusArena />
        </div>
      </main>
    );

  } catch (error: any) {
    return (
      <div className="min-h-screen bg-black text-red-500 p-10 font-mono flex flex-col items-center justify-center">
        <ShieldAlert size={64} className="mb-4 text-red-600 animate-pulse" />
        <h1 className="text-3xl font-black uppercase mb-2">Fatal Server Crash</h1>
        <p className="text-white text-xl mb-6">The database injection failed.</p>
        <div className="bg-red-950/30 border border-red-500/50 p-6 rounded text-left max-w-3xl w-full">
          <p className="font-bold text-red-400 mb-2">Exact Error Message:</p>
          <pre className="text-sm text-red-300 overflow-x-auto break-words whitespace-pre-wrap">{error.message}</pre>
        </div>
      </div>
    );
  }
         }
