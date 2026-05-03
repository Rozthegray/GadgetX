'use client'; // 🔥 THE MISSING LINE!

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// We dynamically import the checkout form and force SSR to FALSE.
// This guarantees the Paystack library never touches the Node.js server!
const CheckoutClient = dynamic(() => import('./CheckoutClient'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <Loader2 className="text-red-500 animate-spin mb-4" size={48} />
      <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Securing Connection...</p>
    </div>
  )
});

export default function CheckoutPage() {
  return <CheckoutClient />;
}