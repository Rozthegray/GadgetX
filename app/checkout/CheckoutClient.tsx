'use client';

import { useState, useEffect } from 'react';
import { processCheckout, preFlightStockCheck } from '@/actions/checkout';
import { getCart, removeFromCart } from '@/actions/cart';
import { usePaystackPayment } from 'react-paystack';
import { Trash2, ShieldCheck, MapPin, Truck, CreditCard, Loader2, ChevronLeft, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const GUEST_USER_ID = "00000000-0000-0000-0000-000000000000";

export default function CheckoutPage() {
  const router = useRouter();
  
  // 🔥 THE FIX: This prevents Paystack from crashing the server render!
  const [mounted, setMounted] = useState(false);
  
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: ''
  });

  useEffect(() => {
    setMounted(true); // Tell Next.js we are safely in the browser now
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const cartData = await getCart(GUEST_USER_ID);
      setCart(cartData);
    } catch (e) {
      console.error("Failed to load cart", e);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    setLoading(true);
    await removeFromCart(GUEST_USER_ID, productId);
    await loadCart();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const config = {
    reference: (new Date()).getTime().toString(),
    email: form.email || 'guest@gadgetx.com',
    amount: cart ? cart.totalKobo : 0, 
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY || 'pk_test_dummy_key',
  };

  const initializePayment = usePaystackPayment(config);

  const handlePaymentInitiation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || cart.items.length === 0) return alert("Your cart is empty!");
    
    setIsProcessing(true); // Show loader on the Pay button

    try {
      // 1. Map the cart items for the checker
      const checkItems = cart.items.map((item: any) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity
      }));

      // 2. Perform the Pre-Flight Stock Check
      const stockCheck = await preFlightStockCheck(checkItems);

      if (!stockCheck.success) {
        setIsProcessing(false);
        alert(stockCheck.error);
        
        // If out of stock, force reload the cart to reflect the new 0 stock
        if (stockCheck.outOfStock) {
           await loadCart(); 
        }
        return; // STOP the process. Do not open Paystack!
      }

      // 3. If stock is good, trigger Paystack!
      initializePayment({
        onSuccess: (reference: any) => handlePostPaymentSuccess(reference),
        onClose: () => {
          setIsProcessing(false);
          alert("Payment cancelled. Your items are still in the cart.");
        }
      });

    } catch (error) {
      setIsProcessing(false);
      alert("Failed to verify inventory. Please try again.");
    }
  };

  const handlePostPaymentSuccess = async (reference: any) => {
    setIsProcessing(true);
    try {
      const checkoutItems = cart.items.map((item: any) => ({
        productId: item.productId,
        name: item.name,
        slug: item.slug,
        priceKobo: item.priceKobo,
        quantity: item.quantity,
        imageUrl: item.imageUrl
      }));

      const res = await processCheckout({
        idempotencyKey: crypto.randomUUID(),
        userId: GUEST_USER_ID,
        shippingAddressId: crypto.randomUUID(),
        items: checkoutItems,
        currency: 'NGN'
      });

      if (res.success) {
        // 🔥 THE FIX: Removed setCart(null) to stop the Paystack crash!
        // We use window.location to safely eject the user from the checkout hook environment.
        window.location.href = `/checkout/success?orderId=${res.orderId}`;
      } else {
        alert("Order processing failed: " + res.error);
      }
    } catch (error) {
      console.error(error);
      alert("A critical error occurred processing your order.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatNaira = (kobo: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(kobo / 100);
  };

  // 🔥 THE FIX: Do not render anything until the browser is ready
  if (!mounted) return null;

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="text-red-500 animate-spin" size={64}/></div>;
  }

  const shippingKobo = 500000; 
  const grandTotalKobo = cart ? cart.totalKobo + shippingKobo : 0;

  return (
    <main className="min-h-screen bg-black text-zinc-100 font-sans pb-24">
      
      <nav className="w-full bg-zinc-950 border-b border-zinc-900 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-zinc-400 hover:text-white transition flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            <ChevronLeft size={16} /> Continue Shopping
          </Link>
          <div className="flex items-center gap-2 text-green-500 text-sm font-bold uppercase tracking-widest">
            <Lock size={16} /> Secure Checkout
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-12">Checkout <span className="text-red-500">Arsenal</span></h1>

        {(!cart || !cart.items || cart.items.length === 0) ? (
          <div className="w-full py-24 bg-zinc-950 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center">
            <p className="text-zinc-500 font-black uppercase text-xl mb-4">Your Loadout is Empty</p>
            <Link href="/" className="bg-red-600 text-white px-8 py-3 rounded-full font-bold uppercase hover:bg-red-500 transition">Return to Shop</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2 border-b border-zinc-900 pb-4">
                  <MapPin className="text-red-500" /> Delivery Details
                </h2>
                
                <form id="checkout-form" onSubmit={handlePaymentInitiation} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-xs font-bold text-zinc-500 uppercase">First Name</label><input required name="firstName" onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition" /></div>
                  <div className="space-y-1"><label className="text-xs font-bold text-zinc-500 uppercase">Last Name</label><input required name="lastName" onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition" /></div>
                  <div className="space-y-1 md:col-span-2"><label className="text-xs font-bold text-zinc-500 uppercase">Email</label><input required type="email" name="email" onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition" /></div>
                  <div className="space-y-1 md:col-span-2"><label className="text-xs font-bold text-zinc-500 uppercase">Phone</label><input required type="tel" name="phone" onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition" /></div>
                  <div className="space-y-1 md:col-span-2"><label className="text-xs font-bold text-zinc-500 uppercase">Address</label><input required name="address" onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition" /></div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">State</label>
                    <select required name="state" onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition appearance-none">
                      <option value="">Select State...</option><option value="Lagos">Lagos</option><option value="Abuja">Abuja</option><option value="Rivers">Rivers</option>
                    </select>
                  </div>
                  <div className="space-y-1"><label className="text-xs font-bold text-zinc-500 uppercase">City</label><input required name="city" onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition" /></div>
                </form>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2 border-b border-zinc-900 pb-4">
                  <CreditCard className="text-red-500" /> Payment Method
                </h2>
                <div className="p-4 border border-zinc-800 bg-zinc-900 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-red-500 border-4 border-zinc-950 shadow-[0_0_0_1px_rgba(220,38,38,1)]" />
                    <span className="font-bold text-white">Paystack (Card, Transfer, USSD)</span>
                  </div>
                  <ShieldCheck className="text-green-500" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8 sticky top-24">
                <h2 className="text-xl font-black uppercase mb-6 border-b border-zinc-900 pb-4">Order Breakdown</h2>
                
                <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
                  {cart.items.map((item: any) => (
                    <div key={item.productId} className="flex gap-4 items-center bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
                      <div className="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden shrink-0">
                        <img src={item.imageUrl || '/images/placeholder.jpg'} className="w-full h-full object-cover" />
                      </div>
                      <div className="grow">
                        <h4 className="text-sm font-bold text-white leading-tight line-clamp-1">{item.name}</h4>
                        <div className="text-red-400 font-black text-sm mt-1">{formatNaira(item.priceKobo)}</div>
                      </div>
                      <button onClick={() => handleRemove(item.productId)} className="p-2 text-zinc-500 hover:text-red-500 transition bg-zinc-900 rounded-lg border border-zinc-800">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-900 pt-6 space-y-3 mb-6">
                  <div className="flex justify-between text-zinc-400 text-sm font-bold uppercase"><span>Subtotal</span><span className="text-white">{formatNaira(cart.totalKobo)}</span></div>
                  <div className="flex justify-between text-zinc-400 text-sm font-bold uppercase"><span className="flex items-center gap-1"><Truck size={14}/> Nationwide Delivery</span><span className="text-white">{formatNaira(shippingKobo)}</span></div>
                </div>

                <div className="flex justify-between items-end border-t border-zinc-900 pt-6 mb-8">
                  <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Total to Pay</span>
                  <span className="text-3xl font-black text-red-500">{formatNaira(grandTotalKobo)}</span>
                </div>

                <button type="submit" form="checkout-form" disabled={isProcessing} className="w-full bg-red-600 text-white py-5 rounded-xl font-black uppercase tracking-widest hover:bg-red-500 transition shadow-[0_0_20px_rgba(220,38,38,0.3)] flex items-center justify-center gap-2">
                  {isProcessing ? <Loader2 className="animate-spin" size={24}/> : <ShieldCheck size={24}/>}
                  {isProcessing ? "Processing..." : "Pay Securely via Paystack"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}