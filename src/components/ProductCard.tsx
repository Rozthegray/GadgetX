'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ProductCard({ item }: { item: any }) {
  const formatNaira = (kobo: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(kobo / 100);
  };

  // Check if the item is on sale by comparing original price to current price
  const isOnSale = item.compareAtPriceKobo && item.compareAtPriceKobo > item.priceKobo;

  return (
    <Link href={`/products/${item.slug}`} className="group flex flex-col gap-4 cursor-pointer">
      
      {/* Image Container with high-end framing & smooth glow on hover */}
      <div className="relative aspect-[4/5] w-full bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 group-hover:border-white/20 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.03)]">
        
        {/* Floating Tags Container */}
        <div className="absolute top-4 left-4 z-20 flex flex-col items-start gap-2">
          {isOnSale && (
            <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
              Sale
            </span>
          )}
          {item.specs?.chipset && (
            <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
              {item.specs.chipset}
            </span>
          )}
        </div>

        {/* The Image (Premium cubic-bezier zoom) */}
        <img 
          src={item.images?.[0]?.url || '/images/placeholder.jpg'} 
          alt={item.name} 
          onError={(e) => {
            // Instant fallback if the real image is missing
            e.currentTarget.src = `https://placehold.co/600x800/111111/333333?text=${item.name.split(' ')[0]}`;
          }}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" 
        />

        {/* Interactive Hover Overlay (Slides up from the bottom) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
           <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[13px] font-bold py-3 rounded-xl flex items-center justify-center gap-2 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-2xl">
              View Device <ArrowRight size={16} />
           </div>
        </div>
      </div>

      {/* Ultra-clean typography below the image */}
      <div className="flex flex-col gap-1 px-1">
        {/* Brand Name */}
        {item.brand && (
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            {item.brand}
          </span>
        )}
        
        {/* Product Name (truncated to 1 line so cards stay perfectly aligned) */}
        <h3 className="text-[15px] font-medium text-zinc-200 group-hover:text-white transition-colors leading-snug line-clamp-1">
          {item.name}
        </h3>
        
        {/* Pricing Layout */}
        <div className="flex items-end gap-2 mt-0.5">
          <p className="text-[16px] font-semibold text-white tracking-tight">
            {formatNaira(item.priceKobo)}
          </p>
          {isOnSale && (
            <p className="text-[12px] font-medium text-zinc-500 line-through pb-0.5">
              {formatNaira(item.compareAtPriceKobo)}
            </p>
          )}
        </div>
      </div>
      
    </Link>
  );
}