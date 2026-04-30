import mongoose from 'mongoose';
import 'dotenv/config';
import { Product } from '../models/Product'; 

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/storefront?authSource=admin';

const getImage = (name: string) => `https://placehold.co/800x800/18181b/ef4444?text=${encodeURIComponent(name)}`;

// 58 Products - Massive Inventory Drop
const rawProducts = [
  // ── REDMAGIC (10) ──
  { brand: 'RedMagic', name: 'RedMagic 11 Pro', priceKobo: 155000000, category: 'phones', subCategory: 'Gaming Phones', baseStock: 5, colors: ['Obsidian Black', 'Transparent Silver', 'Cyclone'], tags: ['snapdragon 8 gen 5', 'active-cooling'] },
  { brand: 'RedMagic', name: 'RedMagic 11', priceKobo: 135000000, category: 'phones', subCategory: 'Gaming Phones', baseStock: 8, colors: ['Obsidian Black', 'Mecha Silver'], tags: ['snapdragon 8 gen 5'] },
  { brand: 'RedMagic', name: 'RedMagic 10 Pro Max', priceKobo: 130000000, category: 'phones', subCategory: 'Gaming Phones', baseStock: 3, colors: ['Dark Knight', 'Deuterium Transparent'], tags: ['snapdragon 8 elite'] },
  { brand: 'RedMagic', name: 'RedMagic 10 Pro', priceKobo: 120000000, category: 'phones', subCategory: 'Gaming Phones', baseStock: 12, colors: ['Dark Knight', 'Dayfall'], tags: ['snapdragon 8 elite'] },
  { brand: 'RedMagic', name: 'RedMagic 9S Pro', priceKobo: 105000000, category: 'phones', subCategory: 'Gaming Phones', baseStock: 7, colors: ['Sleet', 'Snowfall', 'Cyclone'], tags: ['snapdragon 8 gen 3 leading'] },
  { brand: 'RedMagic', name: 'RedMagic 9 Pro', priceKobo: 95000000, category: 'phones', subCategory: 'Gaming Phones', baseStock: 15, colors: ['Sleet', 'Cyclone'], tags: ['snapdragon 8 gen 3', 'flat-back'] },
  { brand: 'RedMagic', name: 'RedMagic 8S Pro', priceKobo: 78000000, category: 'phones', subCategory: 'Gaming Phones', baseStock: 6, colors: ['Midnight', 'Platinum', 'Aurora'], tags: ['snapdragon 8 gen 2'] },
  { brand: 'RedMagic', name: 'RedMagic 8 Pro (UK Used)', priceKobo: 62000000, category: 'phones', subCategory: 'Gaming Phones', baseStock: 4, colors: ['Matte', 'Void'], tags: ['snapdragon 8 gen 2', 'used'] },
  { brand: 'RedMagic', name: 'RedMagic 7S Pro (UK Used)', priceKobo: 48000000, category: 'phones', subCategory: 'Gaming Phones', baseStock: 9, colors: ['Supernova', 'Mercury'], tags: ['snapdragon 8+ gen 1', 'used'] },
  { brand: 'RedMagic', name: 'RedMagic 7 (UK Used)', priceKobo: 39000000, category: 'phones', subCategory: 'Gaming Phones', baseStock: 11, colors: ['Obsidian', 'Pulsar'], tags: ['snapdragon 8 gen 1', 'used'] },

  // ── VIVO iQOO (8) ──
  { brand: 'Vivo', name: 'iQOO 15 Pro', priceKobo: 145000000, category: 'phones', subCategory: 'Flagship Phones', baseStock: 4, colors: ['BMW M Motorsport', 'Track Black'], tags: ['snapdragon 8 gen 5', 'esports'] },
  { brand: 'Vivo', name: 'iQOO 15', priceKobo: 110000000, category: 'phones', subCategory: 'Flagship Phones', baseStock: 10, colors: ['Track Black', 'Legend White'], tags: ['snapdragon 8 gen 4'] },
  { brand: 'Vivo', name: 'iQOO 14', priceKobo: 98000000, category: 'phones', subCategory: 'Flagship Phones', baseStock: 8, colors: ['Isle of Man', 'Legend Edition'], tags: ['snapdragon 8 gen 3'] },
  { brand: 'Vivo', name: 'iQOO 12', priceKobo: 82000000, category: 'phones', subCategory: 'Flagship Phones', baseStock: 12, colors: ['Alpha', 'Legend'], tags: ['snapdragon 8 gen 3'] },
  { brand: 'Vivo', name: 'iQOO 11 (UK Used)', priceKobo: 52000000, category: 'phones', subCategory: 'Flagship Phones', baseStock: 5, colors: ['Alpha Black', 'Mint Green'], tags: ['snapdragon 8 gen 2', 'used'] },
  { brand: 'Vivo', name: 'iQOO Neo 9 Pro', priceKobo: 68000000, category: 'phones', subCategory: 'Gaming Phones', baseStock: 14, colors: ['Fighting Black', 'Nautical Blue'], tags: ['dimensity 9300'] },
  { brand: 'Vivo', name: 'iQOO Neo 9', priceKobo: 45000000, category: 'phones', subCategory: 'Gaming Phones', baseStock: 25, colors: ['Fighting Black', 'Red/White Soul'], tags: ['dimensity 9300', 'budget'] },
  { brand: 'Vivo', name: 'iQOO Z12', priceKobo: 32000000, category: 'phones', subCategory: 'Budget Gaming', baseStock: 30, colors: ['Moonlight White', 'Shadow Black'], tags: ['snapdragon 7 gen 3'] },

  // ── APPLE (8) ──
  { brand: 'Apple', name: 'iPhone 17 Pro Max', priceKobo: 220000000, category: 'phones', subCategory: 'Flagship Phones', baseStock: 0, colors: ['Titanium Black', 'Titanium Silver'], tags: ['apple', 'a19 pro', 'pre-order'] },
  { brand: 'Apple', name: 'iPhone 17 Pro', priceKobo: 195000000, category: 'phones', subCategory: 'Flagship Phones', baseStock: 0, colors: ['Titanium Black', 'Titanium Desert'], tags: ['apple', 'a19 pro', 'pre-order'] },
  { brand: 'Apple', name: 'iPhone 16 Pro Max', priceKobo: 185000000, category: 'phones', subCategory: 'Flagship Phones', baseStock: 5, colors: ['Natural Titanium', 'Black Titanium'], tags: ['apple', 'a18 pro'] },
  { brand: 'Apple', name: 'iPhone 15 Pro Max', priceKobo: 145000000, category: 'phones', subCategory: 'Flagship Phones', baseStock: 10, colors: ['Blue Titanium', 'White Titanium'], tags: ['apple', 'a17 pro'] },
  { brand: 'Apple', name: 'iPhone 14 Pro Max (UK Used)', priceKobo: 95000000, category: 'phones', subCategory: 'Flagship Phones', baseStock: 18, colors: ['Deep Purple', 'Space Black'], tags: ['apple', 'a16 bionic', 'used'] },
  { brand: 'Apple', name: 'iPhone 13 Pro Max (UK Used)', priceKobo: 72000000, category: 'phones', subCategory: 'Flagship Phones', baseStock: 22, colors: ['Sierra Blue', 'Graphite'], tags: ['apple', 'a15 bionic', 'used', 'codm-meta'] },
  { brand: 'Apple', name: 'iPad Pro M4 (13-inch)', priceKobo: 190000000, category: 'tablets', subCategory: 'Flagship Tablets', baseStock: 4, colors: ['Space Black', 'Silver'], tags: ['apple', 'm4', 'oled'] },
  { brand: 'Apple', name: 'iPad Mini 7', priceKobo: 85000000, category: 'tablets', subCategory: 'Portable Gaming Devices', baseStock: 15, colors: ['Starlight', 'Purple', 'Space Grey'], tags: ['apple', 'a17 pro', 'portable'] },

  // ── SAMSUNG (6) ──
  { brand: 'Samsung', name: 'Galaxy S24 Ultra', priceKobo: 145000000, category: 'phones', subCategory: 'Flagship Phones', baseStock: 8, colors: ['Titanium Grey', 'Titanium Black', 'Titanium Violet'], tags: ['samsung', 'snapdragon 8 gen 3'] },
  { brand: 'Samsung', name: 'Galaxy S24+', priceKobo: 115000000, category: 'phones', subCategory: 'Flagship Phones', baseStock: 12, colors: ['Onyx Black', 'Marble Grey'], tags: ['samsung', 'exynos 2400'] },
  { brand: 'Samsung', name: 'Galaxy S23 Ultra (UK Used)', priceKobo: 98000000, category: 'phones', subCategory: 'Flagship Phones', baseStock: 9, colors: ['Phantom Black', 'Green'], tags: ['samsung', 'snapdragon 8 gen 2', 'used'] },
  { brand: 'Samsung', name: 'Galaxy S22 Ultra (UK Used)', priceKobo: 65000000, category: 'phones', subCategory: 'Flagship Phones', baseStock: 14, colors: ['Burgundy', 'Phantom Black'], tags: ['samsung', 'snapdragon 8 gen 1', 'used'] },
  { brand: 'Samsung', name: 'Galaxy Tab S10 Ultra', priceKobo: 175000000, category: 'tablets', subCategory: 'Flagship Tablets', baseStock: 3, colors: ['Moonstone Grey'], tags: ['samsung', 'dimensity 9300+'] },
  { brand: 'Samsung', name: 'Galaxy Tab S9+', priceKobo: 125000000, category: 'tablets', subCategory: 'Flagship Tablets', baseStock: 6, colors: ['Beige', 'Graphite'], tags: ['samsung', 'snapdragon 8 gen 2'] },

  // ── POCO / XIAOMI / BLACK SHARK (8) ──
  { brand: 'Poco', name: 'Poco F6 Pro', priceKobo: 68000000, category: 'phones', subCategory: 'Gaming Phones', baseStock: 15, colors: ['Black', 'White'], tags: ['poco', 'snapdragon 8 gen 2'] },
  { brand: 'Poco', name: 'Poco X6 Pro', priceKobo: 38000000, category: 'phones', subCategory: 'Gaming Phones', baseStock: 40, colors: ['Yellow', 'Black', 'Grey'], tags: ['poco', 'dimensity 8300-ultra', 'budget'] },
  { brand: 'Poco', name: 'Poco F5 (UK Used)', priceKobo: 29000000, category: 'phones', subCategory: 'Gaming Phones', baseStock: 12, colors: ['Carbon Black', 'Snow White'], tags: ['poco', 'snapdragon 7+ gen 2', 'used'] },
  { brand: 'Poco', name: 'Poco X5 Pro (UK Used)', priceKobo: 21000000, category: 'phones', subCategory: 'Budget Gaming', baseStock: 20, colors: ['Yellow', 'Blue'], tags: ['poco', 'snapdragon 778g', 'used'] },
  { brand: 'Black Shark', name: 'Black Shark 6 Pro', priceKobo: 85000000, category: 'phones', subCategory: 'Gaming Phones', baseStock: 6, colors: ['Meteorite Black', 'Ceramic White'], tags: ['blackshark', 'snapdragon 8 gen 2'] },
  { brand: 'Black Shark', name: 'Black Shark 5 Pro (UK Used)', priceKobo: 45000000, category: 'phones', subCategory: 'Gaming Phones', baseStock: 8, colors: ['Stellar Black', 'Nebula White'], tags: ['blackshark', 'snapdragon 8 gen 1', 'used'] },
  { brand: 'Xiaomi', name: 'Xiaomi 14 Pro', priceKobo: 125000000, category: 'phones', subCategory: 'Flagship Phones', baseStock: 5, colors: ['Black', 'White', 'Jade Green'], tags: ['xiaomi', 'snapdragon 8 gen 3'] },
  { brand: 'Xiaomi', name: 'Xiaomi 13T Pro', priceKobo: 75000000, category: 'phones', subCategory: 'Flagship Phones', baseStock: 9, colors: ['Alpine Blue', 'Meadow Green', 'Black'], tags: ['xiaomi', 'dimensity 9200+'] },

  // ── ONEPLUS & PIXEL (6) ──
  { brand: 'OnePlus', name: 'OnePlus 13', priceKobo: 135000000, category: 'phones', subCategory: 'Flagship Phones', baseStock: 5, colors: ['Silvery White', 'Obsidian Black'], tags: ['oneplus', 'snapdragon 8 elite'] },
  { brand: 'OnePlus', name: 'OnePlus Ace 5', priceKobo: 55000000, category: 'phones', subCategory: 'Gaming Phones', baseStock: 14, colors: ['Titanium Grey', 'Blue'], tags: ['oneplus', 'snapdragon 8 gen 3'] },
  { brand: 'OnePlus', name: 'OnePlus Ace 3 Pro', priceKobo: 48000000, category: 'phones', subCategory: 'Gaming Phones', baseStock: 18, colors: ['Green Field', 'Titanium'], tags: ['oneplus', 'snapdragon 8 gen 3'] },
  { brand: 'Google', name: 'Pixel 9 Pro XL', priceKobo: 155000000, category: 'phones', subCategory: 'Flagship Phones', baseStock: 4, colors: ['Obsidian', 'Porcelain', 'Rose Quartz'], tags: ['pixel', 'tensor g4'] },
  { brand: 'Google', name: 'Pixel 8 Pro (UK Used)', priceKobo: 85000000, category: 'phones', subCategory: 'Flagship Phones', baseStock: 7, colors: ['Bay', 'Obsidian'], tags: ['pixel', 'tensor g3', 'used'] },
  { brand: 'Google', name: 'Pixel 7 Pro (UK Used)', priceKobo: 52000000, category: 'phones', subCategory: 'Flagship Phones', baseStock: 11, colors: ['Hazel', 'Snow'], tags: ['pixel', 'tensor g2', 'used'] },

  // ── GAMING TABLETS (4) ──
  { brand: 'Lenovo', name: 'Legion Y700 (2025)', priceKobo: 65000000, category: 'tablets', subCategory: 'Portable Gaming Devices', baseStock: 20, colors: ['Storm Grey'], tags: ['lenovo', '8-inch', 'snapdragon 8 gen 4'] },
  { brand: 'Lenovo', name: 'Legion Y700 (2024)', priceKobo: 52000000, category: 'tablets', subCategory: 'Portable Gaming Devices', baseStock: 15, colors: ['Storm Grey'], tags: ['lenovo', '8-inch', 'snapdragon 8+ gen 1'] },
  { brand: 'RedMagic', name: 'Nova Tablet', priceKobo: 85000000, category: 'tablets', subCategory: 'Portable Gaming Devices', baseStock: 7, colors: ['Midnight Black'], tags: ['redmagic', 'active-cooling'] },
  { brand: 'Lenovo', name: 'Legion Y900', priceKobo: 95000000, category: 'tablets', subCategory: 'Flagship Tablets', baseStock: 4, colors: ['Grey'], tags: ['lenovo', '14-inch', 'dimensity 9000'] },

  // ── ACCESSORIES (8) ──
  { brand: 'Black Shark', name: 'Magnetic Cooler 4 Pro', priceKobo: 4500000, category: 'cooling', subCategory: 'Coolers', baseStock: 100, colors: ['Black', 'White'], tags: ['cooler', 'magsafe', 'rgb'] },
  { brand: 'RedMagic', name: 'Cooler 5 Pro', priceKobo: 5200000, category: 'cooling', subCategory: 'Coolers', baseStock: 85, colors: ['Transparent Black'], tags: ['cooler', 'magsafe', 'ai-temp-control'] },
  { brand: 'Flydigi', name: 'Vader 3 Pro', priceKobo: 6500000, category: 'accessories', subCategory: 'Controllers', baseStock: 40, colors: ['Black', 'Assassin Creed Edition'], tags: ['controller', 'hall-effect'] },
  { brand: 'GameSir', name: 'G8 Galileo', priceKobo: 7500000, category: 'accessories', subCategory: 'Mobile Controllers', baseStock: 35, colors: ['Grey'], tags: ['controller', 'type-c', 'hall-effect'] },
  { brand: 'Generic', name: 'Carbon Fiber Thumb Sleeves', priceKobo: 500000, category: 'accessories', subCategory: 'Finger Sleeves', baseStock: 500, colors: ['Black/Red', 'Silver'], tags: ['sleeves', 'aim'] },
  { brand: 'Razer', name: 'Hammerhead True Wireless', priceKobo: 12500000, category: 'audio', subCategory: 'Audio', baseStock: 25, colors: ['Classic Black'], tags: ['audio', 'low-latency'] },
  { brand: 'RedMagic', name: 'Shadow Blade Gamepad 2', priceKobo: 8500000, category: 'accessories', subCategory: 'Controllers', baseStock: 20, colors: ['Transparent'], tags: ['controller', 'type-c'] },
  { brand: 'Black Shark', name: 'FunCooler 3 Pro', priceKobo: 3500000, category: 'cooling', subCategory: 'Coolers', baseStock: 60, colors: ['Black'], tags: ['cooler', 'clip-on'] }
];

// Map into the exact format your ProductSchema expects
const products = rawProducts.map(item => {
  const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  // Transform colors into your strict VariantSchema
  const variants = item.colors.map((color, index) => ({
    variantId: `${slug}-v${index + 1}`,
    name: `${item.name} - ${color}`,
    sku: `${slug}-${color.replace(/\s+/g, '-').toLowerCase()}`,
    priceKobo: item.priceKobo,
    stock: Math.floor(item.baseStock / item.colors.length) || 0, // Split stock evenly among variants
    attributes: new Map([['color', color]])
  }));

  return {
    slug,
    name: item.name,
    brand: item.brand,
    description: `Experience uncompromising performance with the ${item.name}. Built to dominate the meta.`,
    category: item.category,
    subCategory: item.subCategory, 
    priceKobo: item.priceKobo,
    status: item.baseStock === 0 ? 'draft' : 'published',
    images: [{ url: getImage(item.name), alt: item.name }], // Strict ImageSchema compliance
    variants: variants, // Plugs into your strict variant system
    tags: item.tags,
    specs: { 
      deviceType: item.category,
      authenticity: item.name.includes('Used') ? 'Certified UK Used' : 'Brand New Sealed' 
    }
  };
});

async function runSeeder() {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected successfully.');

    console.log('🧹 Purging existing inventory...');
    await Product.deleteMany({});

    console.log(`🌱 Dropping ${products.length} meta devices into the database...`);
    const inserted = await Product.insertMany(products);
    
    console.log(`✅ Successfully seeded ${inserted.length} items!`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
    process.exit(0);
  }
}

runSeeder();