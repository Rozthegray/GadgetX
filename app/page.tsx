'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Zap, Search, ChevronRight, Activity, Filter, Cpu, 
  ShoppingCart, ShieldCheck, Globe, MessageCircle, AlertTriangle,
  Truck, Star, Crosshair, Gamepad2
} from "lucide-react";

import VersusArena from "@/components/VersusArena";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingDB, setSyncingDB] = useState(false);
  
  const [activeBrand, setActiveBrand] = useState('All');
  const [activePrice, setActivePrice] = useState('All');
  
  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  // The massive 78-device array (Keeping your existing inventory logic intact)
  const rawDevices = [
    { n: "Xiaomi 15T Pro (512GB)", p: 82000000, c: "Dimensity 9400+", i: "/Redmagic_nova (2).png" },
    { n: "Xiaomi 15 (512GB)", p: 65500000, c: "Snapdragon 8 Elite", i: "/Redmagic_nova (3).png" },
    { n: "Xiaomi 14 Pro (1TB)", p: 86000000, c: "Snapdragon 8 Gen 3", i: "/poco_f7_ultra_black_1.jpg" },
    { n: "Xiaomi 14 Ultra (512GB)", p: 70000000, c: "Snapdragon 8 Gen 3", i: "/samsung_galaxy_s25_ultra.jpeg" },
    { n: "Xiaomi 14 (512GB)", p: 45000000, c: "Snapdragon 8 Gen 3", i: "/realme_gt_7_price_in_nigeria_1.jpg" },
    { n: "Xiaomi 14T (512GB)", p: 41000000, c: "Dimensity 8300 Ultra", i: "/xiaomi-14t.jpg" },
    { n: "Poco F8 Pro (512GB)", p: 83200000, c: "Snapdragon 8 Elite", i: "/poco_f7_ultra_black_1.jpg" },
    { n: "Poco F6 Pro (512GB)", p: 39500000, c: "Snapdragon 8 Gen 2", i: "/poco_f7_ultra_black_1.jpg" },
    { n: "Poco X7 Pro (256GB)", p: 28000000, c: "Dimensity 8400-Ultra", i: "/poco_f7_ultra_black_1.jpg" },
    { n: "Poco X6 Pro (512GB)", p: 31000000, c: "Dimensity 8300 Ultra", i: "/poco_f7_ultra_black_1.jpg" },
    { n: "Redmi K80 Ultra", p: 80000000, c: "Dimensity 9400+", i: "/redmi-k80-ultra.png" },
    { n: "Samsung S23 Ultra (256GB)", p: 63000000, c: "Snapdragon 8 Gen 2", i: "/samsung_galaxy_s25_ultra.jpeg" },
    { n: "Samsung S23+ (256GB)", p: 45500000, c: "Snapdragon 8 Gen 2", i: "/samsung_galaxy_s25_ultra.jpeg" },
    { n: "Red Magic 8 Pro Plus", p: 70000000, c: "Snapdragon 8 Gen 2", i: "/red-magic-8-pro-plus.jpg" },
    { n: "Red Magic 11 Pro Max", p: 98000000, c: "Ultimate Gaming Flagship", i: "/red-magic-11-pro-max.png" },
    { n: "Red Magic Nova Tablet", p: 100000000, c: "Snap 8 Gen 3 LE", i: "/red-magic-nova-tablet.jpg" },
    { n: "Red Magic Astral", p: 125000000, c: "Gaming Flagship", i: "/red-magic-astral.png" },
    { n: "Asus ROG Phone 9", p: 150000000, c: "Snapdragon 8 Elite", i: "/asus-rog-phone-9.jpg" },
    { n: "Lenovo Y700 Gen 3", p: 50000000, c: "Snap 8 Gen 3", i: "/lenovo-y700-gen3.png" },
];

  const availableImages = [
    "/Redmagic_nova (1).png",
    "/Redmagic_nova (2).png",
    "/Redmagic_nova (3).png",
    "/xiaomi-14-pro.png",
    "/xiaomi-14-ultra.jpeg",
    "/xiaomi-14.png",
    "realme_gt_7_price_in_nigeria_1.jpg",
    "samsung_galaxy_s25_ultra.jpeg",
    "poco_f7_ultra_black_1.jpg"
  ];

  const processed = rawDevices.map((p, index) => {
    let brand = "Other";
    if (p.n.includes("Xiaomi")) brand = "Xiaomi";
    else if (p.n.includes("Poco")) brand = "Poco";
    else if (p.n.includes("Redmi")) brand = "Redmi";
    else if (p.n.includes("Samsung")) brand = "Samsung";
    else if (p.n.includes("ROG")) brand = "ROG";
    else if (p.n.includes("Red Magic")) brand = "Red Magic";
    else if (p.n.includes("Lenovo")) brand = "Lenovo";
    else if (p.n.includes("iQOO")) brand = "iQOO";

    let fpsTarget = "60 FPS Stable";
    const chip = p.c.toLowerCase();
    if (chip.includes("8 gen 2") || chip.includes("8 gen 3") || chip.includes("8 elite") || chip.includes("9400") || chip.includes("8300")) fpsTarget = "120 FPS Capable";
    else if (chip.includes("8 gen 1") || chip.includes("7300") || chip.includes("8100")) fpsTarget = "90 FPS Stable";

    const shortName = p.n.split('(')[0].trim();
    const cleanSlug = shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const dynamicDescription = `Equip the ${p.n} to dominate the lobby. Engineered for competitive gaming with the ${p.c} chipset, ensuring maximum frame rates and zero thermal throttling.`;

    // 🔥 THE FIX: Use YOUR specific image (p.i) first. 
    // If p.i doesn't exist, ONLY THEN pick a random fallback image!
    const finalImage = p.i || availableImages[index % availableImages.length];

    return { 
      id: index, 
      name: p.n, 
      slug: cleanSlug, 
      priceKobo: p.p, 
      brand: brand,
      category: p.n.includes("Tablet") || p.n.includes("Y700") ? "tablets" : "phones",
      description: dynamicDescription, 
      baseStock: 100,          
      status: "published", 
      images: [{ url: finalImage }], // 👈 Now your specific data is safe!
      specs: { chipset: p.c, fps: fpsTarget } 
    };
  });

  // Hero Carousel Data - Using EXACT paths from your local folder screenshot
  const heroSlides = [
    { 
      name: "Red Magic 11 Pro", 
      image: "/Redmagic_nova (3).png", // Kept name as per your file system
      slug: "red-magic-11-pro-max" 
    },
    { 
      name: "Asus ROG Phone 9 Pro", 
      image: "/Redmagic_nova (2).png", 
      slug: "asus-rog-phone-9" 
    },
    { 
      name: "Red Magic Astra", 
      image: "/Redmagic_nova (1).png", 
      slug: "red-magic-astral" 
    }
  ];

  useEffect(() => {
    setProducts(processed);
    setLoading(false);

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Slower transition for a more cinematic feel
    return () => clearInterval(timer);
  }, []);

  const handleForceSync = async () => {
    setSyncingDB(true);
    try {
      const { forceSyncDatabase } = await import('@/actions/sync');
      const res = await forceSyncDatabase(processed);
      alert(res.message);
    } catch (e: any) {
      alert("Sync failed: " + e.message);
    } finally {
      setSyncingDB(false);
    }
  };

  const formatNaira = (kobo: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(kobo / 100);
  };

  const filteredProducts = products.filter(p => {
    if (activeBrand !== 'All' && p.brand !== activeBrand) return false;
    if (activePrice !== 'All') {
      if (activePrice === '200' && p.priceKobo >= 20000000) return false;
      if (activePrice === '300' && (p.priceKobo < 20000000 || p.priceKobo >= 30000000)) return false;
      if (activePrice === '400' && (p.priceKobo < 30000000 || p.priceKobo >= 40000000)) return false;
      if (activePrice === '500' && (p.priceKobo < 40000000 || p.priceKobo >= 50000000)) return false;
      if (activePrice === '600' && (p.priceKobo < 50000000 || p.priceKobo >= 60000000)) return false;
      if (activePrice === '700' && (p.priceKobo < 60000000 || p.priceKobo >= 70000000)) return false;
      if (activePrice === '700+' && p.priceKobo < 70000000) return false;
    }
    return true;
  });

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-red-600 selection:text-white overflow-x-hidden">

      {/* 1. NAVBAR FIRST */}
      <Navbar/>
     
      {/* 2. SYNC BAR SECOND (No overlapping) */}
      <div className="pt-24 px-6 w-full bg-red-950/40 text-white text-center py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest flex flex-col md:flex-row items-center justify-center gap-3 border-b border-red-500/20 backdrop-blur-md z-40 relative">
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} className="text-yellow-500" />
          <span className="text-zinc-300">Admin Mode: Sync database with latest inventory</span>
        </div>
        <button 
          onClick={handleForceSync}
          disabled={syncingDB}
          className="bg-red-600/20 hover:bg-red-600 px-4 py-1.5 rounded text-white transition border border-red-500/50 hover:border-red-400 disabled:opacity-50 font-black"
        >
          {syncingDB ? "SYNCING..." : "FORCE SYNC"}
        </button>
      </div>
 
      {/* ─── NEXT-GEN HERO SECTION ─── */}
      <section className="relative w-full min-h-[85vh] flex items-center border-b border-zinc-900 overflow-hidden bg-[#0a0a0c]">
        {/* Animated Background Grids & Glows */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10 relative">
          
          {/* Left Typography & CTAs (Takes up 7 columns on large screens) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-8">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
              <span className="animate-pulse">🚀</span>
              <span className="text-[10px] md:text-xs font-black text-zinc-300 uppercase tracking-[0.2em]">
                NGlevel up your gaming experience
              </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-[6.5rem] font-black uppercase tracking-tighter leading-[0.9] text-white">
              Dominate <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-300 to-zinc-600">Every Match.</span>
            </h1>
            
            <div className="space-y-4 max-w-lg">
              <p className="text-zinc-400 text-sm md:text-base font-medium leading-relaxed border-l-2 border-red-500 pl-4">
                The ultimate destination for high-performance gear. Built for players who refuse to lose. Zero lag. Zero throttling.
              </p>
              <div className="flex items-center gap-3 text-xs md:text-sm font-black text-white tracking-widest uppercase">
                <span className="bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800">FF</span>
                <span className="text-zinc-600">|</span>
                <span className="bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800">CODM</span>
                <span className="text-zinc-600">|</span>
                <span className="bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800">PUBG</span>
              </div>
            </div>
            
            {/* Exactly matching your CTA style */}
            <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto pt-4">
              <Link href="#inventory" className="group relative inline-flex items-center justify-center font-black uppercase tracking-[0.15em] text-[13px] md:text-sm transition-all">
                <span className="text-red-500 mr-2 group-hover:-translate-x-1 transition-transform">[</span>
                <div className="bg-[#ff3333] hover:bg-[#ff4d4d] text-white px-6 py-3 rounded-sm shadow-[0_0_20px_rgba(255,51,51,0.3)] group-hover:shadow-[0_0_30px_rgba(255,51,51,0.5)] transition-all">
                  Shop Gaming Phones
                </div>
                <span className="text-red-500 ml-2 group-hover:translate-x-1 transition-transform">]</span>
              </Link>

              <a href="https://wa.me/2348146758428" target="_blank" className="group relative inline-flex items-center justify-center font-black uppercase tracking-[0.15em] text-[13px] md:text-sm transition-all text-zinc-300 hover:text-white">
                <span className="text-zinc-600 mr-2 group-hover:-translate-x-1 transition-transform">[</span>
                <div className="border border-zinc-700 hover:border-zinc-400 px-6 py-3 rounded-sm bg-black/50 backdrop-blur-sm transition-all flex items-center gap-2">
                  Order via WhatsApp
                </div>
                <span className="text-zinc-600 ml-2 group-hover:translate-x-1 transition-transform">]</span>
              </a>
            </div>

            {/* Contact / Trust Row */}
            <div className="flex flex-wrap items-center gap-6 mt-4 text-xs font-bold text-zinc-400 tracking-wide">
              <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800/50">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                +2348146758428 <span className="text-red-400 ml-1">TEXT ONLY!</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star size={14} className="fill-yellow-500 text-yellow-500" />
                <span>4.9/5 Gamers Trust Us</span>
              </div>
            </div>
          </div>

          {/* Right Carousel Slider (Takes up 5 columns on large screens) */}
          <div className="lg:col-span-5 relative w-full aspect-[4/5] md:aspect-square flex flex-col items-center justify-center bg-gradient-to-b from-[#111] to-[#0a0a0a] rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden group">
            
            {/* Device Background Aura */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="w-[60%] h-[60%] bg-red-600/20 blur-[80px] rounded-full transition-all duration-1000 group-hover:bg-red-500/30" />
            </div>
            
            {heroSlides.map((slide, index) => (
              <Link 
                href={`/products/${slide.slug}`} 
                key={slide.slug} 
                className={`absolute inset-0 transition-all duration-1000 ease-in-out flex flex-col items-center justify-center p-8 cursor-pointer
                  ${index === currentSlide ? 'opacity-100 scale-100 z-20' : 'opacity-0 scale-95 z-0'}`}
              >
                {/* Device Image with floating animation */}
                <div className={`${index === currentSlide ? 'animate-[bounce_3s_ease-in-out_infinite]' : ''} h-[75%] w-full flex items-center justify-center`}>
                  <img 
                    src={slide.image} 
                    alt={slide.name} 
                    className="max-h-full max-w-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]" 
                  />
                </div>
                
                {/* Device Name Tag */}
                <div className={`mt-6 translate-y-4 transition-all duration-700 delay-300 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0'}`}>
                  <span className="bg-black/80 backdrop-blur-md border border-zinc-700/50 text-white text-xs font-black px-4 py-2 uppercase tracking-widest rounded-full shadow-lg flex items-center gap-2">
                    <Gamepad2 size={14} className="text-red-500"/> {slide.name}
                  </span>
                </div>
              </Link>
            ))}

            {/* Slider Navigation Dots */}
            <div className="absolute bottom-6 flex gap-2 z-30">
              {heroSlides.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentSlide(i)} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-8 bg-[#ff3333] shadow-[0_0_10px_rgba(255,51,51,0.8)]' : 'w-2 bg-zinc-700 hover:bg-zinc-400'}`} 
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
          
        </div>
      </section>

      {/* --- Rest of the Content Remains Untouched Below --- */}
      <div className="max-w-7xl mx-auto px-4 space-y-24 py-12">
        
        {/* ─── INVENTORY SECTION ─── */}
        <section id="inventory">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-zinc-900 pb-6 gap-6 sticky top-[64px] bg-[#09090b]/90 backdrop-blur-xl z-40 pt-4">
            <h2 className="text-2xl md:text-3xl font-black uppercase flex items-center gap-3 w-full md:w-auto text-white drop-shadow-md">
              <Crosshair className="text-red-500" /> Arsenal
            </h2>
            
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
                {['All', 'Xiaomi', 'Poco', 'Redmi', 'Samsung', 'ROG', 'Red Magic', 'Lenovo', 'iQOO'].map((brand) => (
                  <button key={brand} onClick={() => setActiveBrand(brand)} className={`px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-sm transition whitespace-nowrap ${activeBrand === brand ? 'border border-red-500 text-red-500 bg-red-500/10 shadow-[0_0_10px_rgba(220,38,38,0.2)]' : 'border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'}`}>
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black flex items-center gap-1 shrink-0 mr-2"><Filter size={12}/> Budget:</span>
            {[
              { label: 'Any', val: 'All' }, { label: 'Under ₦200k', val: '200' }, { label: '₦200k - ₦300k', val: '300' }, { label: '₦300k - ₦400k', val: '400' }, { label: '₦400k - ₦500k', val: '500' }, { label: '₦500k - ₦600k', val: '600'}, { label: '₦600k - ₦700k', val: '700'}, { label: '₦700k+', val: '700+' },
            ].map((tier) => (
              <button key={tier.val} onClick={() => setActivePrice(tier.val)} className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition whitespace-nowrap shrink-0 ${activePrice === tier.val ? 'bg-zinc-100 text-black shadow-md' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}>
                {tier.label}
              </button>
            ))}
          </div>
          
          {loading ? (
             <div className="w-full py-32 flex justify-center"><Zap className="animate-pulse text-red-500" size={48} /></div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((item: any) => (
                <Link href={`/products/${item.slug}`} key={item.id} className="group relative flex flex-col bg-zinc-950 border border-zinc-800/80 hover:border-red-500/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] hover:-translate-y-1">
                  
                  <div className="w-full aspect-[4/5] bg-zinc-900 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-zinc-700/50 text-zinc-300 text-[9px] md:text-[10px] font-black px-2.5 py-1 uppercase tracking-widest z-20 flex items-center gap-1.5 rounded">
                      <Cpu size={10} className="text-red-500" /> {item.specs?.chipset}
                    </div>
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-red-500 text-white text-[9px] md:text-[10px] font-black px-2.5 py-1 uppercase tracking-widest z-20 flex items-center gap-1.5 rounded shadow-[0_4px_10px_rgba(220,38,38,0.4)]">
                      <Activity size={10} /> {item.specs?.fps}
                    </div>
                    <img src={item.images?.[0]?.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                  </div>

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

        {/* ─── BUDGET COMBOS CAROUSEL ─── */}
        <section className="relative">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
              <ShoppingCart className="text-red-500" size={24} />
            </div>
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">Starter Loadouts</h2>
          </div>
          
          <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 scrollbar-hide snap-x snap-mandatory">
            <ComboCard title="The 120 FPS Starter Kit" desc="Poco X6 Pro + BlackShark Cooler + Sleeves" price="345,000" oldPrice="360,000" tag="Best Value" color="red" />
            <ComboCard title="The Pure Value Kit" desc="Redmi Note 13 Pro + Basic Triggers" price="275,000" oldPrice="285,000" tag="Entry Level" color="blue" />
            <ComboCard title="The Tryhard Pack" desc="Poco F6 Pro + Memo Cooler + Pro Sleeves" price="399,000" oldPrice="420,000" tag="Sweaty Kit" color="orange" />
          </div>
        </section>

      </div>

      {/* ─── PRO FOOTER ─── */}
      <footer className="w-full bg-black border-t border-zinc-900 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="bg-red-600 p-1.5 rounded-md"><Zap size={20} className="text-white fill-white" /></div>
              <span className="font-black text-2xl tracking-tighter uppercase">Gadget<span className="text-red-500">X</span></span>
            </Link>
            <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
              Equipping Nigerian mobile athletes with premium, unthrottled hardware. We don't just sell phones, we sell competitive advantages.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-red-600 hover:border-red-500 transition text-white"><Globe size={18}/></a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-red-600 hover:border-red-500 transition text-white"><MessageCircle size={18}/></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-widest mb-6">Shop</h4>
            <ul className="space-y-4 text-zinc-400 text-sm font-bold uppercase tracking-wide">
              <li><Link href="#" className="hover:text-red-500 transition">Gaming Phones</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition">Gaming Tablets</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition">Coolers & Triggers</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition">Pre-built Combos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-widest mb-6">Services</h4>
            <ul className="space-y-4 text-zinc-400 text-sm font-bold uppercase tracking-wide">
              <li><Link href="/sell" className="hover:text-red-500 transition">Sell Your Device</Link></li>
              <li><Link href="/swap" className="hover:text-red-500 transition">Trade-In / Swap</Link></li>
              <li><Link href="/repair" className="hover:text-red-500 transition">Book a Repair</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition">Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <ShieldCheck size={18} className="text-red-500"/> Buyer Protection
            </h4>
            <ul className="space-y-4 text-zinc-400 text-sm font-bold uppercase tracking-wide">
              <li><span className="text-zinc-600">Return Policy:</span> 7 Days</li>
              <li><span className="text-zinc-600">Warranty:</span> 6 Months</li>
              <li><span className="text-zinc-600">Delivery:</span> 24-48 Hours Nationwide</li>
            </ul>
          </div>

        </div>
        
        <div className="max-w-7xl mx-auto px-4 border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-zinc-600 uppercase tracking-widest">
          <p>© 2026 Deadshot Gadgets. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-zinc-300">Privacy</Link>
            <Link href="#" className="hover:text-zinc-300">Terms</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}

function ComboCard({ title, desc, price, oldPrice, tag, color }: any) {
  return (
    <div className="min-w-[85vw] md:min-w-[450px] bg-zinc-950 border border-zinc-800 hover:border-red-500/50 rounded-2xl p-1 shrink-0 snap-center group cursor-pointer transition-all duration-300">
      <div className="h-40 md:h-48 bg-zinc-900 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative border border-zinc-800/50">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        <img src="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80" alt="Combo" className="object-cover w-full h-full opacity-30 group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute bottom-4 left-4 z-20">
          <div className={`bg-${color}-600 text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest rounded-sm inline-block mb-2`}>{tag}</div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <h3 className="text-xl font-black mb-1 text-white">{title}</h3>
        <p className="text-zinc-400 text-xs mb-4 font-medium">{desc}</p>
        <div className="flex justify-between items-end pt-4 border-t border-zinc-800/50">
          <div>
            <div className="text-zinc-600 line-through text-xs font-bold mb-0.5">₦ {oldPrice}</div>
            <div className="text-2xl font-black text-red-500">₦ {price}</div>
          </div>
          <button className="bg-white text-black px-4 py-2 font-black uppercase text-xs rounded-full hover:bg-zinc-200 transition">View Kit</button>
        </div>
      </div>
    </div>
  )
}