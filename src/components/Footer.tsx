import Link from 'next/link';
import { Zap, Globe, MessageCircle, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-black border-t border-white/5 pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="bg-red-600 p-1.5 rounded-md"><Zap size={20} className="text-white fill-white" /></div>
            <span className="font-black text-2xl tracking-tighter uppercase text-white">Gadget<span className="text-red-500">X</span></span>
          </Link>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Equipping mobile athletes with premium, unthrottled hardware. We don't just sell phones, we sell competitive advantages.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center hover:bg-red-600 hover:border-red-500 transition text-white"><Globe size={18}/></a>
            <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center hover:bg-red-600 hover:border-red-500 transition text-white"><MessageCircle size={18}/></a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold tracking-wider mb-6">Shop</h4>
          <ul className="space-y-4 text-gray-400 text-sm font-medium tracking-wide">
            <li><Link href="/products?category=phones" className="hover:text-white transition">Gaming Phones</Link></li>
            <li><Link href="/products?category=tablets" className="hover:text-white transition">Gaming Tablets</Link></li>
            <li><Link href="/products?category=cooling" className="hover:text-white transition">Coolers & Triggers</Link></li>
            <li><Link href="/products" className="hover:text-white transition">View All Arsenal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold tracking-wider mb-6">Services</h4>
          <ul className="space-y-4 text-gray-400 text-sm font-medium tracking-wide">
            <li><Link href="/sell" className="hover:text-white transition">Sell Your Device</Link></li>
            <li><Link href="/swap" className="hover:text-white transition">Trade-In / Swap</Link></li>
            <li><Link href="/repair" className="hover:text-white transition">Book a Repair</Link></li>
            <li><Link href="#" className="hover:text-white transition">Track Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold tracking-wider mb-6 flex items-center gap-2">
            <ShieldCheck size={18} className="text-red-500"/> Buyer Protection
          </h4>
          <ul className="space-y-4 text-gray-400 text-sm font-medium tracking-wide">
            <li><span className="text-gray-600">Return Policy:</span> 7 Days</li>
            <li><span className="text-gray-600">Warranty:</span> 6 Months</li>
            <li><span className="text-gray-600">Delivery:</span> 24-48 Hours Nationwide</li>
          </ul>
        </div>

      </div>
      
      <div className="max-w-[1400px] mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-gray-600 tracking-widest">
        <p>© 2026 GadgetX. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-gray-400">Privacy Policy</Link>
          <Link href="#" className="hover:text-gray-400">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}