// src/models/Product.ts
// ─────────────────────────────────────────────
// Mongoose model for the Product Catalog.
// ─────────────────────────────────────────────

import mongoose, { Schema, model, models, type InferSchemaType } from 'mongoose'

// ─── Sub-schemas ─────────────────────────────

const VariantSchema = new Schema(
  {
    variantId:  { type: String, required: true },
    name:       { type: String, required: true },  // e.g. "256GB / Phantom Black"
    sku:        { type: String, required: true },
    priceKobo:  { type: Number, required: true, min: 0 },
    stock:      { type: Number, required: true, min: 0, default: 0 },
    attributes: { type: Map, of: String },          // { color: "black", storage: "256gb" }
  },
  { _id: false }
)

const ImageSchema = new Schema(
  {
    url:    { type: String, required: true },
    alt:    { type: String, default: '' },
    width:  { type: Number },
    height: { type: Number },
  },
  { _id: false }
)

const ReviewSummarySchema = new Schema(
  {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count:   { type: Number, default: 0, min: 0 },
  },
  { _id: false }
)

// ─── Main schema ─────────────────────────────

const ProductSchema = new Schema(
  {
    slug: {
      type:     String,
      required: true,
      unique:   true,
      lowercase: true,
      trim:     true,
    },

    name:        { type: String, required: true, trim: true },
    description: { type: String, required: true },
    brand:       { type: String, required: true, trim: true },

    category: {
      type:     String,
      required: true,
      enum:     [
        'phones',
        'tablets', // <-- ADDED THIS
        'laptops',
        'accessories',
        'keyboards',
        'mice',
        'monitors',
        'cooling',
        'storage',
        'audio',
        'other',
      ],
      index: true,
    },
    
    subCategory: { type: String, index: true }, // <-- ADDED THIS for UI filtering

    status: {
      type:    String,
      enum:    ['draft', 'published', 'archived'],
      default: 'draft',
      index:   true,
    },

    // Base price in kobo. Variants override this per-SKU.
    priceKobo:          { type: Number, required: true, min: 0 },
    compareAtPriceKobo: { type: Number, min: 0 },   // for "was / now" display

    images:   { type: [ImageSchema],   default: [] },
    variants: { type: [VariantSchema], default: [] },
    tags:     { type: [String],        default: [], index: true },

    // Totally free-form — different per category.
    specs: { type: Schema.Types.Mixed, default: {} },

    reviewSummary: { type: ReviewSummarySchema, default: () => ({}) },

    draftExpiresAt: { type: Date },

    // SEO
    metaTitle:       { type: String },
    metaDescription: { type: String },
  },
  {
    timestamps: true,   
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
)

// ─── Indexes ──
ProductSchema.index({ category: 1, priceKobo: 1 })
ProductSchema.index({ brand: 1, status: 1 })

// ─── Virtuals ────────────────────────────────

ProductSchema.virtual('isOnSale').get(function () {
  return (
    this.compareAtPriceKobo != null &&
    this.compareAtPriceKobo > this.priceKobo
  )
})

ProductSchema.virtual('discountPercent').get(function () {
  if (!this.compareAtPriceKobo || this.compareAtPriceKobo <= this.priceKobo) return 0
  return Math.round(
    ((this.compareAtPriceKobo - this.priceKobo) / this.compareAtPriceKobo) * 100
  )
})

// ─── Types ───────────────────────────────────

export type ProductDocument = InferSchemaType<typeof ProductSchema> & {
  _id: mongoose.Types.ObjectId
  isOnSale: boolean
  discountPercent: number
}

export type LeanProduct = Omit<ProductDocument, keyof mongoose.Document> & {
  _id: string
}

// ─── Model ──

export const Product =
  (models.Product as mongoose.Model<ProductDocument>) ??
  model<ProductDocument>('Product', ProductSchema)