'use client'; 

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Zap, Repeat, Search, ChevronRight, Flame, Smartphone, 
  Activity, Filter, Cpu, ShoppingCart, Menu, X, ShieldCheck, Globe, MessageCircle
} from "lucide-react";

import VersusArena from "@/components/VersusArena";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [activeBrand, setActiveBrand] = useState('All');
  const [activePrice, setActivePrice] = useState('All');

  useEffect(() => {
    const rawProducts = [
      { id: 1, name: "Xiaomi 15T Pro (512GB)", slug: "xiaomi-15t-pro", priceKobo: 82000000, images: [{ url: "https://images.unsplash.com/photo-1598327105666-5b89351cb315?w=600&q=80" }], specs: { chipset: "Dimensity 9400+" } },
      { id: 2, name: "Poco F6 Pro (512GB)", slug: "poco-f6-pro", priceKobo: 39500000, images: [{ url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80" }], specs: { chipset: "Snapdragon 8 Gen 2" } },
      { id: 3, name: "Samsung S24 Ultra (256GB)", slug: "samsung-s24-ultra", priceKobo: 160000000, images: [{ url: "https://images.unsplash.com/photo-1610945265064-3234ea1f10c3?w=600&q=80" }], specs: { chipset: "Snapdragon 8 Gen 3" } },
      { id: 4, name: "Asus ROG Phone 9", slug: "asus-rog-9", priceKobo: 150000000, images: [{ url: "https://images.unsplash.com/photo-1598327105666-5b89351cb315?w=600&q=80" }], specs: { chipset: "Snapdragon 8 Elite" } },
      { id: 5, name: "Red Magic 9 Pro", slug: "red-magic-9-pro", priceKobo: 125000000, images: [{ url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80" }], specs: { chipset: "Snapdragon 8 Gen 3" } },
      { id: 6, name: "Lenovo Y700 Gen 3", slug: "lenovo-y700-gen-3", priceKobo: 50000000, images: [{ url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80" }], specs: { chipset: "Snapdragon 8 Gen 3" } },
      { id: 7, name: "Redmi Note 14 Pro", slug: "redmi-note-14-pro", priceKobo: 30300000, images: [{ url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80" }], specs: { chipset: "Dimensity 7300 Ultra" } },
      { id: 8, name: "iQOO 12", slug: "iqoo-12", priceKobo: 74000000, images: [{ url: "https://images.unsplash.com/photo-1598327105666-5b89351cb315?w=600&q=80" }], specs: { chipset: "Snapdragon 8 Gen 3" } }
    ];

    const processed = rawProducts.map(p => {
      let brand = "Other";
      if (p.name.includes("Xiaomi")) brand = "Xiaomi";
      else if (p.name.includes("Poco")) brand = "Poco";
      else if (p.name.includes("Redmi")) brand = "Redmi";
      else if (p.name.includes("Samsung")) brand = "Samsung";
      else if (p.name.includes("ROG")) brand = "ROG";
      else if (p.name.includes("Red Magic")) brand = "Red Magic";
      else if (p.name.includes("Lenovo")) brand = "Lenovo";
      else if (p.name.includes("iQOO")) brand = "iQOO";

      let fpsTarget = "60 FPS Stable";
      const chip = p.specs.chipset.toLowerCase();
      if (chip.includes("8 gen 2") || chip.includes("8 gen 3") || chip.includes("8 elite") || chip.includes("9400")) fpsTarget = "120 FPS Capable";
      else if (chip.includes("7300")) fpsTarget = "90 FPS Stable";

      return { ...p, brand, specs: { ...p.specs, fps: fpsTarget } };
    });

    setProducts(processed);
    setLoading(false);
  }, []);

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
      if (activePrice === '700+' && p.priceKobo < 70000000) return false;
    }
    return true;
  });

  return (
    <main className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-red-600 selection:text-white">
      
      {/* ─── NAVBAR & SIDEBAR ─── */}
      <nav className="w-full bg-black/90 backdrop-blur-xl border-b border-zinc-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-red-600 p-1.5 rounded-md">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <span className="font-black text-xl tracking-tighter uppercase">Gadget<span className="text-red-500">X</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8 font-bold text-sm tracking-widest uppercase text-zinc-400">
            <Link href="#inventory" className="hover:text-white transition">Shop</Link>
            <Link href="/sell" className="hover:text-white transition">Sell</Link>
            <Link href="/swap" className="hover:text-white transition">Swap</Link>
            <Link href="/repair" className="hover:text-white transition">Repair</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="text-zinc-400 hover:text-white"><Search size={20}/></button>
            <button className="text-zinc-400 hover:text-white relative">
              <ShoppingCart size={20}/>
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">0</span>
            </button>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-end">
          <div className="w-72 h-full bg-zinc-950 border-l border-zinc-900 p-6 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-12">
              <span className="font-black text-xl tracking-tighter uppercase">Menu</span>
              <button onClick={() => setIsSidebarOpen(false)} className="text-zinc-400 hover:text-white"><X size={28}/></button>
            </div>
            
            <div className="flex flex-col gap-6 font-black text-2xl uppercase tracking-widest">
              <Link href="#inventory" onClick={() => setIsSidebarOpen(false)} className="hover:text-red-500">Shop Devices</Link>
              <Link href="/sell" onClick={() => setIsSidebarOpen(false)} className="hover:text-red-500">Sell Device</Link>
              <Link href="/swap" onClick={() => setIsSidebarOpen(false)} className="hover:text-red-500">Swap</Link>
              <Link href="/repair" onClick={() => setIsSidebarOpen(false)} className="hover:text-red-500">Repairs</Link>
            </div>

            <div className="mt-auto border-t border-zinc-900 pt-6">
              <p className="text-zinc-500 text-sm font-bold mb-4 uppercase tracking-widest">Support</p>
              <p className="text-white font-bold">+234 800 GADGETX</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── HERO SECTION ─── */}
      <section className="relative w-full h-[55vh] flex flex-col items-center justify-center border-b border-zinc-900 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/30 via-black to-black" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent z-0" />
        
        <div className="relative z-10 max-w-4xl flex flex-col items-center mt-8">
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
        
        {/* ─── INVENTORY SECTION ─── */}
        <section id="inventory">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-zinc-900 pb-6 gap-6 sticky top-[64px] bg-black/80 backdrop-blur-xl z-40 pt-4">
            <h2 className="text-2xl md:text-3xl font-black uppercase flex items-center gap-3 w-full md:w-auto text-white drop-shadow-md">
              <TargetIcon /> Arsenal
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
              { label: 'Any', val: 'All' }, { label: 'Under ₦200k', val: '200' }, { label: '₦200k - ₦300k', val: '300' }, { label: '₦300k - ₦400k', val: '400' }, { label: '₦400k - ₦500k', val: '500' }, { label: '₦700k+', val: '700+' },
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
                  
                  <div className="w-full aspect-[4/5] bg-zinc-900 flex items-center justify-center p-4 relative overflow-hidden">
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
          <p>© 2026 GadgetX. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-zinc-300">Privacy</Link>
            <Link href="#" className="hover:text-zinc-300">Terms</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}

function TargetIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  )
}

function ComboCard({ title, desc, price, oldPrice, tag, color }: any) {
  return (
    <div className="min-w-[85vw] md:min-w-[450px] bg-zinc-950 border border-zinc-800 hover:border-red-500/50 rounded-2xl p-1 shrink-0 snap-center group cursor-pointer transition-all duration-300">
      <div className="h-40 md:h-48 bg-zinc-900 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative border border-zinc-800/50">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        <img src="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80" alt="Combo" className="object-cover w-full h-full opacity-50 group-hover:scale-105 transition-transform duration-700" />
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
