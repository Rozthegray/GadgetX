import Link from "next/link";
import mongoose from "mongoose";
import { Product } from "@/models/Product"; 
import { 
  Gamepad2, Repeat, Wrench, Zap, Crosshair, 
  Search, Swords, ChevronRight, Flame, ChevronLeft, Smartphone, ShieldAlert, BatteryWarning, Activity
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

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }

  // ─── AUTO-SEED LOGIC ───
  let totalProducts = await Product.countDocuments();
  
  if (totalProducts === 0) {
    const initialProducts = [
      { name: "iPhone 13 Pro Max (256GB)", slug: "iphone-13-pro-max-256gb", priceKobo: 72000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=iPhone+13+Pro+Max" }], specs: { authenticity: "UK Used" } },
      { name: "Poco X6 Pro 5G", slug: "poco-x6-pro-5g", priceKobo: 45000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Poco+X6+Pro" }], specs: { authenticity: "New" } },
      { name: "RedMagic 9 Pro Gaming Phone", slug: "redmagic-9-pro", priceKobo: 125000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=RedMagic+9+Pro" }], specs: { authenticity: "New" } },
      { name: "Samsung Galaxy S24 Ultra", slug: "samsung-s24-ultra", priceKobo: 160000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=S24+Ultra" }], specs: { authenticity: "New" } },
      { name: "Xiaomi Pad 6 (Gaming Tablet)", slug: "xiaomi-pad-6", priceKobo: 38000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+Pad+6" }], specs: { authenticity: "New" } },
      { name: "BlackShark Magnetic Cooler 3 Pro", slug: "blackshark-cooler-3", priceKobo: 4500000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=BlackShark+Cooler" }], specs: { authenticity: "New" } },
      { name: "Sarafox V6 Carbon Fiber Thumb Sleeves", slug: "sarafox-v6-sleeves", priceKobo: 500000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Sarafox+Sleeves" }], specs: { authenticity: "New" } },
      { name: "Flydigi Vader 3 Pro Controller", slug: "flydigi-vader-3-pro", priceKobo: 7500000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Flydigi+Vader" }], specs: { authenticity: "New" } }
    ];
    await Product.insertMany(initialProducts);
    totalProducts = initialProducts.length; 
  }

  // ─── PAGE STATES ───
  const page = Number(searchParams.page) || 1;
  const limit = 16;
  const skip = (page - 1) * limit;
  const activeBrand = typeof searchParams.brand === 'string' ? searchParams.brand : 'Apple';
  const activeGame = typeof searchParams.game === 'string' ? searchParams.game : 'CODM';

  const totalPages = Math.ceil(totalProducts / limit);
  
  const latestDrops = await Product.find({ status: 'published' }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
  const brandProducts = await Product.find({ status: 'published', name: { $regex: activeBrand, $options: 'i' } }).limit(8).lean();

  // ─── DYNAMIC, DEEP ANALYTICS META DATABASE ───
  const metaHardware = {
    'CODM': [
      {
        name: 'RedMagic Gaming Tab 3 Pro', type: 'TABLET', price: '₦ 1,350,000',
        image: 'https://placehold.co/600x400/18181b/ef4444?text=RedMagic+Astra+Tab',
        desc: 'The absolute apex predator of Android gaming tablets.',
        fps: '144 FPS (MP) / 120 FPS (BR)',
        battery: 'Massive 10000mAh. Heavy drain at 144Hz.',
        issue: 'Custom UI (GameSpace) can feel clunky.',
        bugStatus: 'Global Whitelist: Fully unlocked by devs.'
      },
      {
        name: 'iPad Pro (M1/M2)', type: 'TABLET', price: '₦ 1,800,000',
        image: 'https://placehold.co/600x400/18181b/ef4444?text=iPad+Pro',
        desc: 'The unquestioned Battle Royale tournament standard.',
        fps: '120 FPS (MP) / 120 FPS (BR)',
        battery: 'Highly efficient Apple Silicon. Low heat.',
        issue: 'Mini-LED blooming in dark environments.',
        bugStatus: 'Stable. No global bugs. iOS is fully optimized.'
      },
      {
        name: 'ROG Phone 9 Pro', type: 'PHONE', price: '₦ 1,600,000',
        image: 'https://placehold.co/600x400/18181b/ef4444?text=ROG+Phone+9',
        desc: 'Hardware beast restricted by missing developer updates.',
        fps: '120 FPS (MP) / 90 FPS (BR)',
        battery: 'Moderate. AeroActive cooler drastically extends life.',
        issue: 'Should natively run 144FPS, but restricted.',
        bugStatus: 'Global Bug: CODM developers have not updated the whitelist for this model yet.'
      },
      {
        name: 'Samsung Galaxy S24 Ultra', type: 'PHONE', price: '₦ 1,600,000',
        image: 'https://placehold.co/600x400/18181b/ef4444?text=S24+Ultra',
        desc: 'Mainstream titan with incredible display clarity.',
        fps: '120 FPS (MP) / 90 FPS (BR)',
        battery: 'Moderate drain. GOS throttles CPU to save battery.',
        issue: 'Requires disabling GOS via ADB for stable frame pacing.',
        bugStatus: 'Global Issue: Samsung aggressive thermal throttling.'
      },
      {
        name: 'Poco X6 Pro', type: 'PHONE', price: '₦ 450,000',
        image: 'https://placehold.co/600x400/18181b/ef4444?text=Poco+X6+Pro',
        desc: 'The undisputed budget 120 FPS king.',
        fps: '120 FPS (MP) / 90 FPS (BR)',
        battery: 'High drain. Will require charging between tournament rounds.',
        issue: '120 FPS setting sometimes disappears from menu.',
        bugStatus: 'Global Bug: Server-side UI glitch temporarily hides 120Hz.'
      }
    ],
    'PUBG': [
      {
        name: 'Samsung Galaxy S24 Ultra', type: 'PHONE', price: '₦ 1,600,000',
        image: 'https://placehold.co/600x400/18181b/ef4444?text=S24+Ultra',
        desc: 'Officially optimized for the massive 120 FPS PUBG update.',
        fps: '120 FPS Locked',
        battery: 'Moderate. Vapor chamber keeps it cool.',
        issue: 'Screen can feel too flat for 4-finger claw users.',
        bugStatus: 'Stable.'
      },
      {
        name: 'iPhone 15 Pro Max', type: 'PHONE', price: '₦ 1,550,000',
        image: 'https://placehold.co/600x400/18181b/ef4444?text=iPhone+15+PM',
        desc: 'Sustains heavy firefights in Erangel final zones.',
        fps: '120 FPS',
        battery: 'Excellent. Titanium chassis dissipates heat well.',
        issue: 'Aggressive auto-dimming during extreme heat.',
        bugStatus: 'Global Issue: iOS thermal protection dims screen natively.'
      },
      {
        name: 'Poco F6 Pro', type: 'PHONE', price: '₦ 650,000',
        image: 'https://placehold.co/600x400/18181b/ef4444?text=Poco+F6+Pro',
        desc: 'Snapdragon 8 Gen 2 dominates without thermal throttling.',
        fps: '120 FPS',
        battery: 'High drain. Gets hot during 120 FPS drop.',
        issue: 'Battery degrades quickly if played while charging.',
        bugStatus: 'Age/Hardware: Battery health drops after 8 months of heavy use.'
      }
    ],
    'Free Fire': [
      {
        name: 'iPhone 13 Pro Max', type: 'PHONE', price: '₦ 720,000',
        image: 'https://placehold.co/600x400/18181b/ef4444?text=iPhone+13+PM',
        desc: 'The classic tournament standard for Free Fire.',
        fps: '120 FPS',
        battery: 'Was legendary, but UK Used models have weak health.',
        issue: 'Lightning port wears out, touch ghosting if dropped.',
        bugStatus: 'Age Factor: Battery degradation is common due to 2021 release date.'
      },
      {
        name: 'Poco X6 Pro 5G', type: 'PHONE', price: '₦ 450,000',
        image: 'https://placehold.co/600x400/18181b/ef4444?text=Poco+X6+Pro',
        desc: 'Absolute overkill for Free Fire. Runs at Max effortlessly.',
        fps: '90-120 FPS',
        battery: 'Excellent. barely drains on FF engine.',
        issue: 'MediaTek chip can run hot in sunny environments.',
        bugStatus: 'Stable.'
      },
      {
        name: 'Xiaomi Pad 6', type: 'TABLET', price: '₦ 380,000',
        image: 'https://placehold.co/600x400/18181b/ef4444?text=Xiaomi+Pad+6',
        desc: 'Tablet FOV advantage makes long-range headshots too easy.',
        fps: '144 FPS',
        battery: 'Solid 8840mAh. Lasts all day.',
        issue: 'Heavy to hold for 4-finger claw without a stand.',
        bugStatus: 'Stable. HyperOS update fixed previous frame drops.'
      }
    ],
    'Blood Strike': [
      {
        name: 'ROG Phone 8 Pro', type: 'PHONE', price: '₦ 1,400,000',
        image: 'https://placehold.co/600x400/18181b/ef4444?text=ROG+Phone+8',
        desc: 'PC-like parkour movement using the 165Hz display.',
        fps: '165 FPS',
        battery: 'Extreme drain at 165Hz. Requires external cooler.',
        issue: 'AirTrigger shoulder buttons sometimes fail to register.',
        bugStatus: 'Global Bug: Software glitch with AirTrigger mapping.'
      },
      {
        name: 'RedMagic 8S Pro', type: 'PHONE', price: '₦ 850,000',
        image: 'https://placehold.co/600x400/18181b/ef4444?text=RedMagic+8S',
        desc: 'Centrifugal fan keeps close-quarters combat stutter-free.',
        fps: '120 FPS',
        battery: 'Moderate. Fan helps preserve battery chemistry.',
        issue: 'Cooling vent accumulates dust and gets loud over time.',
        bugStatus: 'Age Factor: Internal fans require professional cleaning after 1 year.'
      }
    ]
  };

  const currentMeta = metaHardware[activeGame as keyof typeof metaHardware] || metaHardware['CODM'];

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

      {/* 2. HERO SECTION */}
      <section className="relative w-full h-[45vh] flex flex-col items-center justify-center overflow-hidden border-b border-zinc-900 px-4 text-center">
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
                <div className="aspect-square bg-zinc-950 mb-4 flex items-center justify-center overflow-hidden relative">
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
        </section>

        {/* 4. BRAND TOGGLE SECTION */}
        <section id="brands">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 border-b border-zinc-900 pb-4">
            <h2 className="text-2xl md:text-3xl font-black uppercase flex items-center gap-3 w-full md:w-auto">
              <Smartphone className="text-red-500" /> Select Brand
            </h2>
            
            <div className="flex overflow-x-auto gap-2 pb-2 w-full md:w-auto scrollbar-hide">
              {['Apple', 'Samsung', 'Xiaomi', 'Poco', 'RedMagic'].map((brand) => (
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

        {/* 6. DYNAMIC DEEP ANALYTICS META HARDWARE */}
        <section id="meta">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black uppercase mb-2">Esports Technical Reports</h2>
            <p className="text-zinc-400">Deep-dive hardware analysis. Know exactly what you are buying.</p>
          </div>
          
          <div className="flex justify-center gap-2 md:gap-4 mb-8 flex-wrap">
            {Object.keys(metaHardware).map((game) => (
              <Link 
                key={game} 
                href={`/?game=${game}#meta`}
                className={`px-6 py-3 border font-bold uppercase text-sm transition ${
                  activeGame === game 
                  ? 'border-red-500 text-red-500 bg-red-500/10' 
                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-white'
                }`}
              >
                {game}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMeta.map((item) => (
              <div key={item.name} className="bg-zinc-950 border border-zinc-900 flex flex-col group hover:border-red-500 transition relative overflow-hidden">
                
                {/* Visual Badge for TABLET vs PHONE */}
                <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest z-20">
                  {item.type}
                </div>

                <div className="w-full h-48 bg-zinc-900 flex items-center justify-center text-zinc-800 border-b border-zinc-800 relative">
                  <div className="absolute inset-0 bg-red-600/5 group-hover:bg-red-600/10 transition z-10" />
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-60 group-hover:opacity-100" />
                </div>
                
                <div className="p-5 flex flex-col grow">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-red-500 transition">{item.name}</h3>
                  <p className="text-zinc-400 text-xs mb-4 leading-relaxed">{item.desc}</p>
                  
                  {/* Technical Data Grid */}
                  <div className="w-full text-xs space-y-3 border-t border-zinc-800 pt-4 mt-auto">
                    <div className="flex items-start gap-2">
                      <Activity size={14} className="text-green-500 mt-0.5 shrink-0" />
                      <div><span className="text-zinc-500">Target:</span> <span className="font-bold text-white block">{item.fps}</span></div>
                    </div>
                    <div className="flex items-start gap-2">
                      <BatteryWarning size={14} className="text-yellow-500 mt-0.5 shrink-0" />
                      <div><span className="text-zinc-500">Drain:</span> <span className="font-bold text-zinc-300 block">{item.battery}</span></div>
                    </div>
                    <div className="flex items-start gap-2">
                      <ShieldAlert size={14} className="text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-zinc-500">Report:</span> 
                        <span className="font-bold text-zinc-300 block mb-1">{item.issue}</span>
                        <span className={`font-bold block ${item.bugStatus.includes('Bug') || item.bugStatus.includes('Issue') ? 'text-red-400' : item.bugStatus.includes('Age') ? 'text-orange-400' : 'text-green-400'}`}>
                          {item.bugStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-lg font-black text-center text-white py-3 bg-zinc-900 border-t border-zinc-800 w-full">
                  {item.price}
                </div>
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
