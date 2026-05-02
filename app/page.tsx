import Link from "next/link";
import mongoose from "mongoose";
import { Product } from "@/models/Product"; 
import { 
  Gamepad2, Repeat, Wrench, Zap, Crosshair, 
  Search, Swords, ChevronRight, Flame, ChevronLeft, Smartphone, ShieldAlert, BatteryWarning, Activity, Filter
} from "lucide-react";

import VersusArena from "@/components/VersusArena";

const formatNaira = (kobo: number) => {
  return new Intl.NumberFormat('en-NG', { 
    style: 'currency', 
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(kobo / 100);
};

export default async function HomePage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }

  // ─── AUTO-SEED LOGIC (MASSIVE 80+ DEVICE INVENTORY) ───
  let totalProducts = await Product.countDocuments();
  
  if (totalProducts < 80) { // Re-seed if missing devices
    await Product.deleteMany({}); // Clear old small seed

    const initialProducts = [
      { name: "Xiaomi 15T Pro (512GB)", slug: "xiaomi-15t-pro", priceKobo: 82000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+15T+Pro" }], specs: { authenticity: "New", chipset: "Dimensity 9400+", details: "Dimensity 9400+ | 144Hz | 5500mAh" } },
      { name: "Xiaomi 15 (512GB)", slug: "xiaomi-15-512", priceKobo: 65500000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+15" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Elite", details: "Snapdragon 8 Elite | 120Hz | 5240mAh" } },
      { name: "Xiaomi 14 Pro (1TB)", slug: "xiaomi-14-pro", priceKobo: 86000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+14+Pro" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 3", details: "Snapdragon 8 Gen 3 | 4880mAh" } },
      { name: "Xiaomi 14 Ultra (512GB)", slug: "xiaomi-14-ultra", priceKobo: 70000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+14+Ultra" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 3", details: "Snapdragon 8 Gen 3 | 5000mAh" } },
      { name: "Xiaomi 14 (512GB)", slug: "xiaomi-14", priceKobo: 45000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+14" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 3", details: "Snapdragon 8 Gen 3 | 4610mAh" } },
      { name: "Xiaomi 14T (512GB)", slug: "xiaomi-14t", priceKobo: 41000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+14T" }], specs: { authenticity: "New", chipset: "Dimensity 8300 Ultra", details: "Dimensity 8300 Ultra | 5000mAh" } },
      { name: "Xiaomi 13 Ultra (512GB)", slug: "xiaomi-13-ultra", priceKobo: 48000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+13+Ultra" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 2", details: "Snapdragon 8 Gen 2 | 5000mAh" } },
      { name: "Xiaomi 13 Pro (512GB)", slug: "xiaomi-13-pro", priceKobo: 41000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+13+Pro" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 2", details: "Snapdragon 8 Gen 2 | 4820mAh" } },
      { name: "Xiaomi 13T Pro (512GB)", slug: "xiaomi-13t-pro", priceKobo: 36000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+13T+Pro" }], specs: { authenticity: "New", chipset: "Dimensity 9200+", details: "Dimensity 9200+ | 5000mAh" } },
      { name: "Xiaomi 13T (256GB)", slug: "xiaomi-13t", priceKobo: 29000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+13T" }], specs: { authenticity: "New", chipset: "Dimensity 8200 Ultra", details: "Dimensity 8200 Ultra | 5000mAh" } },
      { name: "Xiaomi 13 Lite 5G (256GB)", slug: "xiaomi-13-lite", priceKobo: 24000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+13+Lite" }], specs: { authenticity: "New", chipset: "Snapdragon 7 Gen 1", details: "Snapdragon 7 Gen 1 | 4500mAh" } },
      { name: "Xiaomi 12 Pro (256GB)", slug: "xiaomi-12-pro", priceKobo: 26800000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+12+Pro" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 1", details: "Snapdragon 8 Gen 1 | 4600mAh" } },
      { name: "Xiaomi 12 (256GB)", slug: "xiaomi-12", priceKobo: 26000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+12" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 1", details: "Snapdragon 8 Gen 1 | 4500mAh" } },
      { name: "Xiaomi 11T Pro (256GB)", slug: "xiaomi-11t-pro", priceKobo: 21000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+11T+Pro" }], specs: { authenticity: "New", chipset: "Snapdragon 888", details: "Snapdragon 888 | 5000mAh" } },
      { name: "Xiaomi 11T (256GB)", slug: "xiaomi-11t", priceKobo: 19000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+11T" }], specs: { authenticity: "New", chipset: "Dimensity 1200", details: "Dimensity 1200 | 5000mAh" } },
      { name: "Xiaomi 11i (256GB)", slug: "xiaomi-11i", priceKobo: 17000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+11i" }], specs: { authenticity: "New", chipset: "Dimensity 920", details: "Dimensity 920 | 5160mAh" } },
      { name: "Xiaomi 11 Lite (128GB)", slug: "xiaomi-11-lite", priceKobo: 15000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+11+Lite" }], specs: { authenticity: "New", chipset: "Snapdragon 732G", details: "Snapdragon 732G | 4250mAh" } },
      { name: "Xiaomi 10T Lite (128GB)", slug: "xiaomi-10t-lite", priceKobo: 14800000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Xiaomi+10T+Lite" }], specs: { authenticity: "New", chipset: "Snapdragon 750G", details: "Snapdragon 750G | 4820mAh" } },
      { name: "Poco F8 Pro (512GB)", slug: "poco-f8-pro", priceKobo: 83200000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Poco+F8+Pro" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Elite", details: "Snapdragon 8 Elite | 6210mAh" } },
      { name: "Poco F6 Pro (512GB)", slug: "poco-f6-pro", priceKobo: 39500000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Poco+F6+Pro" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 2", details: "Snapdragon 8 Gen 2 | 5000mAh" } },
      { name: "Poco F6 (512GB)", slug: "poco-f6", priceKobo: 31500000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Poco+F6" }], specs: { authenticity: "New", chipset: "Snapdragon 8s Gen 3", details: "Snapdragon 8s Gen 3 | 5000mAh" } },
      { name: "Poco F5 (256GB)", slug: "poco-f5", priceKobo: 24000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Poco+F5" }], specs: { authenticity: "New", chipset: "Snapdragon 7+ Gen 2", details: "Snapdragon 7+ Gen 2 | 5000mAh" } },
      { name: "Poco X7 Pro (256GB)", slug: "poco-x7-pro", priceKobo: 28000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Poco+X7+Pro" }], specs: { authenticity: "New", chipset: "Dimensity 8400-Ultra", details: "Dimensity 8400-Ultra | 6000mAh" } },
      { name: "Poco X7 (256GB)", slug: "poco-x7", priceKobo: 28000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Poco+X7" }], specs: { authenticity: "New", chipset: "Dimensity 7300-Ultra", details: "Dimensity 7300-Ultra | 5500mAh" } },
      { name: "Poco X6 Pro (512GB)", slug: "poco-x6-pro", priceKobo: 31000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Poco+X6+Pro" }], specs: { authenticity: "New", chipset: "Dimensity 8300 Ultra", details: "Dimensity 8300 Ultra | 5000mAh" } },
      { name: "Poco X6 (128GB)", slug: "poco-x6", priceKobo: 18600000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Poco+X6" }], specs: { authenticity: "New", chipset: "Snapdragon 7s Gen 2", details: "Snapdragon 7s Gen 2 | 5100mAh" } },
      { name: "Poco X5 (256GB)", slug: "poco-x5", priceKobo: 20000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Poco+X5" }], specs: { authenticity: "New", chipset: "Snapdragon 695", details: "Snapdragon 695 | 5000mAh" } },
      { name: "Poco X4 GT (256GB)", slug: "poco-x4-gt", priceKobo: 21500000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Poco+X4+GT" }], specs: { authenticity: "New", chipset: "Dimensity 8100", details: "Dimensity 8100 | 5080mAh" } },
      { name: "Poco X4 Pro (256GB)", slug: "poco-x4-pro", priceKobo: 17000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Poco+X4+Pro" }], specs: { authenticity: "New", chipset: "Snapdragon 695", details: "Snapdragon 695 | 5000mAh" } },
      { name: "Poco M8 (512GB)", slug: "poco-m8", priceKobo: 30000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Poco+M8" }], specs: { authenticity: "New", chipset: "Helio G99", details: "Helio G99 | 5160mAh" } },
      { name: "Redmi Note 14 Pro (512GB)", slug: "redmi-note-14-pro", priceKobo: 30300000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Redmi+Note+14+Pro" }], specs: { authenticity: "New", chipset: "Dimensity 7300 Ultra", details: "Dimensity 7300 Ultra | 5500mAh" } },
      { name: "Redmi Note 13 Pro (512GB)", slug: "redmi-note-13-pro", priceKobo: 27000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Redmi+Note+13+Pro" }], specs: { authenticity: "New", chipset: "Snapdragon 7s Gen 2", details: "Snapdragon 7s Gen 2 | 5100mAh" } },
      { name: "Redmi Note 11 Pro+ (256GB)", slug: "redmi-note-11-pro-plus", priceKobo: 20000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Redmi+Note+11+Pro%2B" }], specs: { authenticity: "New", chipset: "Dimensity 920", details: "Dimensity 920 | 4500mAh" } },
      { name: "Redmi Note 11 Pro (128GB)", slug: "redmi-note-11-pro", priceKobo: 15500000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Redmi+Note+11+Pro" }], specs: { authenticity: "New", chipset: "Helio G96", details: "Helio G96 | 5000mAh" } },
      { name: "Redmi 15 (256GB)", slug: "redmi-15", priceKobo: 25000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Redmi+15" }], specs: { authenticity: "New", chipset: "Snapdragon 4 Gen 2", details: "Snapdragon 4 Gen 2 | 5000mAh" } },
      { name: "Samsung S23 Ultra (256GB)", slug: "samsung-s23-ultra", priceKobo: 63000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Samsung+S23+Ultra" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 2", details: "Snapdragon 8 Gen 2 | 5000mAh" } },
      { name: "Samsung S23+ (256GB)", slug: "samsung-s23-plus", priceKobo: 45500000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Samsung+S23%2B" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 2", details: "Snapdragon 8 Gen 2 | 4700mAh" } },
      { name: "Samsung S23 (256GB)", slug: "samsung-s23", priceKobo: 42000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Samsung+S23" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 2", details: "Snapdragon 8 Gen 2 | 3900mAh" } },
      { name: "Samsung S22 Ultra (128GB)", slug: "samsung-s22-ultra", priceKobo: 44500000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Samsung+S22+Ultra" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 1", details: "Snapdragon 8 Gen 1 | 5000mAh" } },
      { name: "Samsung S22+ (256GB)", slug: "samsung-s22-plus", priceKobo: 31500000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Samsung+S22%2B" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 1", details: "Snapdragon 8 Gen 1 | 4500mAh" } },
      { name: "Samsung S22 (256GB)", slug: "samsung-s22", priceKobo: 29000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Samsung+S22" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 1", details: "Snapdragon 8 Gen 1 | 3700mAh" } },
      { name: "Samsung A55 (256GB)", slug: "samsung-a55", priceKobo: 37000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Samsung+A55" }], specs: { authenticity: "New", chipset: "Exynos 1480", details: "Exynos 1480 | 5000mAh" } },
      { name: "Samsung A35 (256GB)", slug: "samsung-a35", priceKobo: 27000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Samsung+A35" }], specs: { authenticity: "New", chipset: "Exynos 1380", details: "Exynos 1380 | 5000mAh" } },
      { name: "Pixel 9 Pro XL (256GB)", slug: "pixel-9-pro-xl", priceKobo: 79000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Pixel+9+Pro+XL" }], specs: { authenticity: "New", chipset: "Tensor G4", details: "Tensor G4 | 5060mAh" } },
      { name: "Honor Magic 6 Pro (1TB)", slug: "honor-magic-6-pro", priceKobo: 68000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Honor+Magic+6+Pro" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 3", details: "Snapdragon 8 Gen 3 | 5600mAh" } },
      { name: "Oppo Reno 13 Pro (512GB)", slug: "oppo-reno-13-pro", priceKobo: 45000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Oppo+Reno+13+Pro" }], specs: { authenticity: "New", chipset: "Dimensity 8350", details: "Dimensity 8350 | 5900mAh" } },
      { name: "Vivo V50 (512GB)", slug: "vivo-v50", priceKobo: 43000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Vivo+V50" }], specs: { authenticity: "New", chipset: "Snapdragon 7 Gen 3", details: "Snapdragon 7 Gen 3 | 5500mAh" } },
      { name: "iQOO 10", slug: "iqoo-10", priceKobo: 33000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=iQOO+10" }], specs: { authenticity: "New", chipset: "Snap 8+ Gen 1", details: "Snap 8+ Gen 1 | 4700mAh" } },
      { name: "iQOO Neo 10", slug: "iqoo-neo-10", priceKobo: 52000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=iQOO+Neo+10" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 3", details: "Snapdragon 8 Gen 3 | 5160mAh" } },
      { name: "iQOO 12", slug: "iqoo-12", priceKobo: 74000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=iQOO+12" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 3", details: "Snapdragon 8 Gen 3 | 5000mAh" } },
      { name: "Realme GT 5 Pro", slug: "realme-gt-5-pro", priceKobo: 85000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Realme+GT+5+Pro" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 3", details: "Snapdragon 8 Gen 3 | 5400mAh" } },
      { name: "Redmi Turbo 5", slug: "redmi-turbo-5", priceKobo: 55000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Redmi+Turbo+5" }], specs: { authenticity: "New", chipset: "Snapdragon 8-series", details: "Snapdragon 8-series | High Fast Charge" } },
      { name: "Red Magic 8 Pro Plus", slug: "red-magic-8-pro-plus", priceKobo: 70000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Red+Magic+8+Pro+Plus" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Gen 2", details: "Snapdragon 8 Gen 2 | 5000mAh" } },
      { name: "Asus ROG 9", slug: "asus-rog-9", priceKobo: 150000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Asus+ROG+9" }], specs: { authenticity: "New", chipset: "Snapdragon 8 Elite", details: "Snapdragon 8 Elite | 165Hz OLED | 5800mAh" } },
      { name: "Lenovo Y700 Gen 3", slug: "lenovo-y700-gen-3", priceKobo: 50000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Lenovo+Y700+Gen+3" }], specs: { authenticity: "New", chipset: "Snap 8 Gen 3", details: "Gaming Tablet : 8.8' 165Hz | Snap 8 Gen 3" } },
      { name: "Lenovo Y700 Gen 2", slug: "lenovo-y700-gen-2", priceKobo: 48000000, status: "published", images: [{ url: "https://placehold.co/600x600/18181b/ef4444?text=Lenovo+Y700+Gen+2" }], specs: { authenticity: "New", chipset: "Snap 8+ Gen 1", details: "Gaming Tablet : 8.8' 144Hz | Snap 8+ Gen 1" } }
    ];
    await Product.insertMany(initialProducts);
  }

  // ─── QUERY LOGIC & FILTERS ───
  const page = Number(searchParams.page) || 1;
  const limit = 16;
  const skip = (page - 1) * limit;
  
  const activeBrand = typeof searchParams.brand === 'string' ? searchParams.brand : 'All';
  const activePrice = typeof searchParams.price === 'string' ? searchParams.price : 'All';
  const activeGame = typeof searchParams.game === 'string' ? searchParams.game : 'CODM';

  // Build the MongoDB Filter Object dynamically
  let query: any = { status: 'published' };
  
  if (activeBrand !== 'All') {
    query.name = { $regex: activeBrand, $options: 'i' };
  }
  
  if (activePrice !== 'All') {
    if (activePrice === '200') query.priceKobo = { $lt: 20000000 };
    else if (activePrice === '300') query.priceKobo = { $gte: 20000000, $lt: 30000000 };
    else if (activePrice === '400') query.priceKobo = { $gte: 30000000, $lt: 40000000 };
    else if (activePrice === '500') query.priceKobo = { $gte: 40000000, $lt: 50000000 };
    else if (activePrice === '600') query.priceKobo = { $gte: 50000000, $lt: 60000000 };
    else if (activePrice === '700') query.priceKobo = { $gte: 60000000, $lt: 70000000 };
    else if (activePrice === '700+') query.priceKobo = { $gte: 70000000 };
  }

  const latestDrops = await Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

  return (
    <main className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-red-600 selection:text-white pb-24">
      
      {/* 1. TOP UTILITY BAR */}
      <div className="w-full bg-zinc-950 border-b border-zinc-900 py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-xs font-bold tracking-widest text-zinc-400 uppercase">
          <div className="flex gap-6">
            <Link href="/sell" className="hover:text-red-500 transition flex items-center gap-1"><Zap size={14} /> Sell</Link>
            <Link href="/swap" className="hover:text-red-500 transition flex items-center gap-1"><Repeat size={14} /> Swap</Link>
          </div>
          <div className="text-red-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Live Inventory: {totalProducts}+ Devices
          </div>
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <section className="relative w-full h-[45vh] flex flex-col items-center justify-center overflow-hidden border-b border-zinc-900 px-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-80" />
        
        <div className="relative z-10 max-w-4xl">
          <div className="mb-4 inline-block px-3 py-1 border border-red-500/30 bg-red-500/10 text-red-500 text-sm font-bold tracking-widest uppercase">
            Number one home for gaming Device
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 leading-none">
            Equip to <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Eliminate.</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 font-light mb-8 max-w-2xl mx-auto">
            <span className="text-white font-bold">Fast Shipping across Nigeria.</span>
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-32 py-16">

        {/* 3. LATEST DROPS & ADVANCED FILTERS */}
        <section id="inventory">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-zinc-900 pb-4 gap-4">
            <h2 className="text-2xl md:text-3xl font-black uppercase flex items-center gap-3 w-full md:w-auto">
              <Zap className="text-red-500" /> GadgetX Arsenal
            </h2>
            
            {/* BRAND FILTER */}
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-1"><Smartphone size={12}/> Brand</span>
              <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                {['All', 'Xiaomi', 'Poco', 'Redmi', 'Samsung', 'ROG', 'Red Magic', 'Lenovo'].map((brand) => (
                  <Link 
                    key={brand} href={`/?brand=${brand}&price=${activePrice}#inventory`}
                    className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider border whitespace-nowrap transition ${
                      activeBrand === brand ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-zinc-800 text-zinc-500 hover:text-white'
                    }`}
                  >
                    {brand}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* PRICE FILTER */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-1 shrink-0"><Filter size={12}/> Budget:</span>
            {[
              { label: 'Any', val: 'All' },
              { label: 'Under ₦200k', val: '200' },
              { label: '₦200k - ₦300k', val: '300' },
              { label: '₦300k - ₦400k', val: '400' },
              { label: '₦400k - ₦500k', val: '500' },
              { label: '₦500k - ₦600k', val: '600' },
              { label: '₦600k - ₦700k', val: '700' },
              { label: '₦700k+', val: '700+' },
            ].map((tier) => (
              <Link 
                key={tier.val} href={`/?brand=${activeBrand}&price=${tier.val}#inventory`}
                className={`px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full transition whitespace-nowrap shrink-0 ${
                  activePrice === tier.val ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                {tier.label}
              </Link>
            ))}
          </div>
          
          {latestDrops.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {latestDrops.map((item: any) => (
                <Link href={`/products/${item.slug}`} key={item._id.toString()} className="bg-zinc-900 border border-zinc-800 p-3 md:p-5 group hover:border-red-500 transition cursor-pointer flex flex-col relative overflow-hidden">
                  
                  {/* CHIPSET BADGE */}
                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur border border-zinc-800 text-red-500 text-[9px] md:text-[10px] font-black px-2 py-1 uppercase tracking-widest z-20 flex items-center gap-1">
                    <Cpu size={10} /> {item.specs?.chipset || 'Flagship SoC'}
                  </div>

                  <div className="w-full aspect-square bg-zinc-950 mb-4 flex items-center justify-center overflow-hidden relative">
                    <img src={item.images?.[0]?.url || '/images/placeholder.jpg'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500 opacity-80 group-hover:opacity-100" />
                  </div>
                  
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h3 className="text-xs md:text-sm font-bold leading-tight text-zinc-300 group-hover:text-white transition">{item.name}</h3>
                  </div>
                  
                  <div className="mt-auto pt-3 text-sm md:text-xl font-black text-red-500">
                    {formatNaira(item.priceKobo)}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="w-full py-24 border border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-600 uppercase font-black text-xl">
              No devices found in this price range.
            </div>
          )}
        </section>

        {/* 4. INTERACTIVE VERSUS ARENA */}
        <VersusArena />

      </div>
    </main>
  );
      }
