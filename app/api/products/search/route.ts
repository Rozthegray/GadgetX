import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Product } from '@/models/Product'; 

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Fast, case-insensitive regex search against the database
    const products = await Product.find({
      name: { $regex: query, $options: 'i' },
      status: 'published'
    })
      .select('name') // Only return the name to keep the payload lightning fast
      .limit(5)
      .lean();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}