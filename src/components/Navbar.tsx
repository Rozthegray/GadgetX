'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, ShoppingBag, Menu, X, ChevronRight } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handle transparent to solid transition on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Sleek, Premium Navbar */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-zinc-950/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex justify-between items-center">
          
          {/* Mobile Menu Trigger */}
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-white hover:text-gray-300 transition">
            <Menu size={24} strokeWidth={1.5} />
          </button>

          {/* Logo */}
          <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-1.5">
            GADGET<span className="text-red-500">X</span>
          </Link>

          {/* Desktop Links (Apple-style minimalism) */}
          <div className="hidden md:flex items-center gap-10 text-[13px] font-medium tracking-wide text-gray-300">
            <Link href="/phones" className="hover:text-white transition">Phones</Link>
            <Link href="/tablets" className="hover:text-white transition">Tablets</Link>
            <Link href="/cooling" className="hover:text-white transition">Cooling</Link>
            <Link href="/accessories" className="hover:text-white transition">Accessories</Link>
            <Link href="/support" className="hover:text-white transition">Support</Link>
          </div>

          {/* Utility Icons */}
          <div className="flex items-center gap-6 text-white">
            <button className="hover:text-gray-300 transition"><Search size={20} strokeWidth={1.5} /></button>
            <button className="hover:text-gray-300 transition relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {/* Optional Cart Badge */}
              {/* <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">2</span> */}
            </button>
          </div>
        </div>
      </nav>

      {/* Ultra-Modern Full-Screen Sidebar */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div 
          className={`absolute top-0 left-0 w-[80%] max-w-[400px] h-full bg-zinc-950 border-r border-white/10 p-8 flex flex-col transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <button onClick={() => setIsSidebarOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition">
            <X size={28} strokeWidth={1.5} />
          </button>
          
          <div className="mt-12 flex flex-col gap-8">
            {['Phones', 'Tablets', 'Cooling', 'Accessories'].map((item) => (
              <Link 
                key={item} 
                href={`/${item.toLowerCase()}`} 
                onClick={() => setIsSidebarOpen(false)} 
                className="text-2xl font-semibold text-gray-200 hover:text-white flex items-center justify-between group"
              >
                {item}
                <ChevronRight size={20} className="text-gray-600 group-hover:text-white transition-colors" />
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-8 border-t border-white/10">
            <Link href="/account" className="text-sm font-medium text-gray-400 hover:text-white mb-4 block">Account Settings</Link>
            <Link href="/support" className="text-sm font-medium text-gray-400 hover:text-white block">Contact Support</Link>
          </div>
        </div>
      </div>
    </>
  );
}