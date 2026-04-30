// ─────────────────────────────────────────────
// MongoDB bootstrap
// Runs once on first container start.
// ─────────────────────────────────────────────

db = db.getSiblingDB('store_products');

// Core collection
db.createCollection('products');

// Indexes that matter at scale:
// 1. slug — used in every PDP URL lookup
db.products.createIndex({ slug: 1 }, { unique: true });

// 2. category + price — powers filtered listing pages
db.products.createIndex({ category: 1, price: 1 });

// 3. Full-text on name + description — powers search bar
db.products.createIndex(
  { name: 'text', description: 'text' },
  { weights: { name: 10, description: 1 }, name: 'product_text_search' }
);

// 4. TTL on draft products (auto-expire unpublished drafts after 30 days)
db.products.createIndex(
  { draftExpiresAt: 1 },
  { expireAfterSeconds: 0, partialFilterExpression: { status: 'draft' } }
);

print('MongoDB: store_products database and indexes created.');