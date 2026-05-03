'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SortDropdown({ activeSort }: { activeSort?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Safely update the URL parameters without losing the search/category filters
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="relative">
      <SlidersHorizontal size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      <select
        name="sort"
        defaultValue={activeSort ?? 'newest'}
        onChange={handleSortChange}
        className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-8 text-sm text-white focus:outline-none focus:border-white/30 transition-colors appearance-none cursor-pointer"
      >
        <option value="newest" className="bg-zinc-900">Newest</option>
        <option value="price_asc" className="bg-zinc-900">Price: Low to High</option>
        <option value="price_desc" className="bg-zinc-900">Price: High to Low</option>
        <option value="rating" className="bg-zinc-900">Top Rated</option>
      </select>
    </div>
  );
}