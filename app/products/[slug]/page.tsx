import { notFound } from "next/navigation";
import mongoose from "mongoose";
import Link from "next/link";
import { Product } from "@/models/Product";
import { ChevronRight } from "lucide-react";
import ProductInteractive from "./ProductInteractive";

// Force dynamic rendering so the DB is always checked fresh
export const dynamic = 'force-dynamic';

export default async function ProductDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }

  // Fetch the specific product
  const product = await Product.findOne({ slug: params.slug, status: 'published' }).lean();

  if (!product) {
    notFound();
  }

  // Fetch "Users Also Purchased" (Same Brand, exclude current product)
  const relatedProducts = await Product.find({ 
    brand: product.brand, 
    _id: { $ne: product._id },
    status: 'published'
  })
  .limit(4)
  .lean();

  // MongoDB returns an ObjectId which breaks Next.js Client Components. 
  // We must serialize the IDs to strings before passing them down.
  const serializedProduct = {
    ...product,
    _id: product._id.toString()
  };

  const serializedRelated = relatedProducts.map(p => ({
    ...p,
    _id: p._id.toString()
  }));

  return (
    <main className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-red-600 selection:text-white pb-24">
      
      {/* Top Breadcrumb Navigation */}
      <div className="w-full bg-zinc-950 border-b border-zinc-900 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center text-xs font-bold tracking-widest text-zinc-500 uppercase">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-red-500">{product.brand || "Device"}</span>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-zinc-300 truncate">{product.name}</span>
        </div>
      </div>

      {/* Render the Interactive Client UI */}
      <ProductInteractive 
        product={serializedProduct} 
        relatedProducts={serializedRelated} 
      />

    </main>
  );
}