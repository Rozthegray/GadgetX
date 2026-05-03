'use server'

import { prisma } from '@/lib/prisma'
import { Product } from '@/models/Product'
import connectToDatabase from '@/lib/mongodb' 
import fs from 'fs' // 🔥 Added this
import path from 'path' // 🔥 Added this

// This helper physically checks your public/products folder to see what extension the image uses
function getRealImageUrl(slug: string) {
  const extensions = ['.png', '.jpg', '.jpeg', '.webp'];
  const publicDir = path.join(process.cwd(), 'public', 'products');

  for (const ext of extensions) {
    if (fs.existsSync(path.join(publicDir, `${slug}${ext}`))) {
      return `/products/${slug}${ext}`;
    }
  }
  
  // If it can't find any real image, fallback to placeholder
  return `https://placehold.co/600x600/18181b/ef4444?text=${slug}`;
}

export async function forceSyncDatabase(rawProducts: any[]) {
  try {
    // Connect to MongoDB
    await connectToDatabase(); 

    for (const item of rawProducts) {
      
      const slug = item.slug; 
      const defaultDescription = `Equip the ${item.name} for maximum performance. Engineered to dominate the lobby.`;

   const mongoProduct = await Product.findOneAndUpdate(
        { slug: slug },
        {
          // 🔥 THE FIX: Tell it to pull the brand and category from the item!
          // (Adding a fallback just in case some items don't have them)
          brand: item.brand || item.n?.split(' ')[0] || "Unknown", 
          name: item.n || item.name,
          slug: slug, 
          priceKobo: item.p || item.priceKobo,
          category: item.category || 'phones',
          
          description: item.description || defaultDescription,
          status: 'published',

          // Using your custom image path!
          images: [{ url: item.i || `https://placehold.co/600x600/18181b/ef4444?text=${slug}` }], 

          specs: { chipset: item.c || item.specs?.chipset || 'Flagship SoC' }
        },
        { upsert: true, returnDocument: 'after' } 
      );

      await prisma.productInventory.upsert({
        where: {
          productId_variantId: {
            productId: mongoProduct._id.toString(),
            variantId: ''
          }
        },
        update: {
          quantityAvailable: item.baseStock || 100 
        },
        create: {
          productId: mongoProduct._id.toString(),
          variantId: '',
          quantityAvailable: item.baseStock || 100
        }
      });
    }

    return { success: true, message: "Databases Synchronized Successfully!" };

  } catch (error: any) {
    console.error("Sync Failed:", error);
    return { success: false, error: error.message || "Database sync crashed." };
  }
}