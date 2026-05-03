'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, ArrowRight, ShieldCheck } from 'lucide-react'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 md:p-12 max-w-lg w-full text-center shadow-[0_0_50px_rgba(220,38,38,0.15)] relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-900" />

      <div className="w-24 h-24 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
        <CheckCircle className="text-red-500 w-12 h-12" />
      </div>
      
      <h1 className="text-3xl md:text-4xl font-black uppercase text-white mb-4 tracking-tight">Arsenal Secured</h1>
      
      <p className="text-zinc-400 font-medium mb-8 leading-relaxed">
        Payment verified. Your loadout is currently being processed and prepared for rapid deployment.
      </p>

      {orderId && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-8 flex flex-col items-center justify-center gap-2">
          <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest flex items-center gap-1">
            <ShieldCheck size={12} className="text-green-500" /> Transaction Reference
          </div>
          <span className="text-white font-mono text-xs md:text-sm break-all">{orderId}</span>
        </div>
      )}

      <Link 
        href="/" 
        className="bg-red-600 text-white w-full py-5 rounded-xl font-black uppercase tracking-widest hover:bg-red-500 transition shadow-[0_0_20px_rgba(220,38,38,0.3)] flex items-center justify-center gap-2"
      >
        Return to HQ <ArrowRight size={20} />
      </Link>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* We wrap it in Suspense because useSearchParams reads the URL at runtime */}
      <Suspense fallback={<div className="text-red-500 font-black uppercase animate-pulse">Verifying...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  )
}