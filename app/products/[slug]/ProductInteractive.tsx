'use client'

import { useState } from 'react'
import { addToCart } from '@/actions/cart'
import { ShoppingCart, Zap, Check, ShieldCheck, Repeat, ChevronRight, Loader2, Flame, Cpu, Activity } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation' // 🔥 Added this!

// Dummy user ID for guest sessions until NextAuth is fully integrated
const GUEST_USER_ID = "00000000-0000-0000-0000-000000000000"

const ADD_ONS = [
  { id: 'addon-cooler', name: 'BlackShark Magnetic Cooler 3 Pro', priceKobo: 4500000, priceStr: '₦45,000' },
  { id: 'addon-sleeves', name: 'Sarafox V6 Carbon Thumb Sleeves', priceKobo: 500000, priceStr: '₦5,000' },
  { id: 'addon-triggers', name: 'Flydigi Shadow Stinger Triggers', priceKobo: 2500000, priceStr: '₦25,000' }
]

const formatNaira = (kobo: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(kobo / 100);
}

export default function ProductInteractive({ product, relatedProducts }: { product: any, relatedProducts: any[] }) {
  const router = useRouter() // 🔥 Initialized the router here!
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [isBuying, setIsBuying] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])
  }

  // ─── CART WIRING ───
  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      // 1. Add Main Product
      await addToCart({
        userId: GUEST_USER_ID,
        productId: product._id,
        name: product.name,
        slug: product.slug,
        imageUrl: product.images?.[0]?.url,
        priceKobo: product.priceKobo,
        quantity: 1
      })

      // 2. Add selected Add-ons
      for (const addonId of selectedAddons) {
        const addonData = ADD_ONS.find(a => a.id === addonId)
        if (addonData) {
          await addToCart({
            userId: GUEST_USER_ID,
            productId: addonData.id,
            name: addonData.name,
            slug: addonData.id,
            priceKobo: addonData.priceKobo,
            quantity: 1
          })
        }
      }
      
      setSuccessMsg("Added to Arsenal!")
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (error) {
      console.error(error)
    } finally {
      setIsAdding(false)
    }
  }

  // ─── CHECKOUT WIRING ───
  const handleBuyNow = async () => {
    setIsBuying(true)
    try {
      // 1. Add Main Product to Cart
      await addToCart({
        userId: GUEST_USER_ID,
        productId: product._id,
        name: product.name,
        slug: product.slug,
        imageUrl: product.images?.[0]?.url,
        priceKobo: product.priceKobo,
        quantity: 1
      })

      // 2. Add selected Add-ons to Cart
      for (const addonId of selectedAddons) {
        const addonData = ADD_ONS.find(a => a.id === addonId)
        if (addonData) {
          await addToCart({
            userId: GUEST_USER_ID,
            productId: addonData.id,
            name: addonData.name,
            slug: addonData.id,
            priceKobo: addonData.priceKobo,
            quantity: 1
          })
        }
      }

      // 🔥 THE FIX: Instantly redirect to the Paystack Checkout Page using Next Router!
      router.push("/checkout");
      
    } catch (error) {
      console.error(error)
      setIsBuying(false)
    } 
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-24">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/5] w-full bg-zinc-950 border border-zinc-800 flex items-center justify-center relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] rounded-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent" />
            <img 
              src={product.images?.[0]?.url || '/images/placeholder.jpg'} 
              alt={product.name}
              className="w-full h-full object-cover object-center relative z-10"
            />
          </div>
        </div>

        {/* Right Column: Product Info & Buy Box */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/30 text-xs font-bold uppercase tracking-wider rounded-sm">
              {product.brand || "Hardware"}
            </span>
            <span className="px-3 py-1 bg-zinc-900 text-zinc-300 border border-zinc-800 text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1">
               <ShieldCheck size={14} className="text-green-500"/> {product.specs?.authenticity || "Verified"}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
            {product.name}
          </h1>
          
          <div className="text-5xl font-black text-red-500 mb-6">
            {formatNaira(product.priceKobo)}
          </div>

          <p className="text-lg text-zinc-400 font-medium mb-8 leading-relaxed">
            {product.description || `Equip the ${product.name} to dominate the lobby. Engineered for maximum frame rates and minimal thermal throttling.`}
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <div className="bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl flex items-center gap-3">
              <Cpu className="text-red-500" size={20}/>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Chipset</div>
                <div className="text-sm font-bold text-white">{product.specs?.chipset || 'Flagship SoC'}</div>
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl flex items-center gap-3">
              <Activity className="text-red-500" size={20}/>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Target FPS</div>
                <div className="text-sm font-bold text-white">{product.specs?.fps || '120 FPS Capable'}</div>
              </div>
            </div>
          </div>

          {/* ADD-ONS SECTION */}
          <div className="mb-10">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-900 pb-2">Recommended Loadout Add-ons</h3>
            <div className="space-y-3">
              {ADD_ONS.map(addon => {
                const isSelected = selectedAddons.includes(addon.id)
                return (
                  <div 
                    key={addon.id} 
                    onClick={() => toggleAddon(addon.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-red-500/10 border-red-500/50' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-sm flex items-center justify-center border ${isSelected ? 'bg-red-600 border-red-500' : 'bg-zinc-900 border-zinc-700'}`}>
                        {isSelected && <Check size={14} className="text-white" />}
                      </div>
                      <span className="text-sm font-bold text-zinc-300">{addon.name}</span>
                    </div>
                    <span className="text-sm font-black text-red-400">+{addon.priceStr}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button 
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-1 bg-zinc-900 text-white border border-zinc-700 px-8 py-5 rounded-xl font-black uppercase tracking-widest hover:border-zinc-500 transition flex items-center justify-center gap-3 text-lg"
            >
              {isAdding ? <Loader2 className="animate-spin" size={24}/> : <ShoppingCart size={24} />} 
              {successMsg || "Add to Loadout"}
            </button>
            <button 
              onClick={handleBuyNow}
              disabled={isBuying}
              className="flex-1 bg-red-600 text-white px-8 py-5 rounded-xl font-black uppercase tracking-widest hover:bg-red-500 transition shadow-[0_0_20px_rgba(220,38,38,0.3)] flex items-center justify-center gap-3 text-lg"
            >
              {isBuying ? <Loader2 className="animate-spin" size={24}/> : <Zap size={24} />} 
              Buy Now
            </button>
          </div>

          {/* Guarantees */}
          <div className="space-y-4 text-sm text-zinc-500 font-medium bg-zinc-950 border border-zinc-900 p-6 rounded-xl">
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

      {/* ─── USERS ALSO PURCHASED ─── */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-zinc-900 pt-16">
          <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
            <Flame className="text-red-500" /> Users Also Equipped
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((item: any) => (
              <Link href={`/products/${item.slug}`} key={item._id} className="group relative flex flex-col bg-zinc-950 border border-zinc-800/80 hover:border-red-500/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] hover:-translate-y-1">
                <div className="w-full aspect-[4/5] bg-zinc-900 flex items-center justify-center relative overflow-hidden">
                  <img src={item.images?.[0]?.url || '/placeholder.jpg'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                </div>
                <div className="p-4 md:p-5 flex flex-col grow bg-gradient-to-b from-transparent to-black/80 backdrop-blur-sm border-t border-zinc-800/50">
                  <h3 className="text-xs md:text-sm font-bold text-zinc-100 mb-2 leading-snug">{item.name}</h3>
                  <div className="mt-auto pt-2 text-base md:text-xl font-black text-red-500">
                    {formatNaira(item.priceKobo)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}