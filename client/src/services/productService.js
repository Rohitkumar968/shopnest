const DUMMYJSON_BASE = 'https://dummyjson.com';

// Map every DummyJSON category slug → exact ShopNest category name
const CATEGORY_MAP = {
  'smartphones': 'Electronics',
  'laptops': 'Electronics',
  'tablets': 'Electronics',
  'mobile-accessories': 'Electronics',
  'computer-accessories': 'Electronics',
  'cameras': 'Electronics',
  'vehicle': 'Electronics',
  'vehicle-accessories': 'Electronics',
  'mens-shirts': 'Clothing',
  'womens-dresses': 'Clothing',
  'mens-shoes': 'Clothing',
  'womens-shoes': 'Clothing',
  'womens-bags': 'Clothing',
  'womens-jewellery': 'Clothing',
  'mens-watches': 'Clothing',
  'womens-watches': 'Clothing',
  'sunglasses': 'Clothing',
  'tops': 'Clothing',
  'skin-care': 'Beauty',
  'fragrances': 'Beauty',
  'beauty': 'Beauty',
  'furniture': 'Home & Garden',
  'home-decoration': 'Home & Garden',
  'kitchen-accessories': 'Home & Garden',
  'groceries': 'Home & Garden',
  'sports-accessories': 'Sports',
  'motorcycle': 'Sports',
  'books': 'Books',
  'literature': 'Books',
  'history': 'Books',
  'toys': 'Toys',
};

export const SHOPNEST_CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys'];

/** Normalize a DummyJSON category string to exact ShopNest category */
export const normalizeCategory = (raw) => {
  const slug = (raw || '').toLowerCase().trim().replace(/\s+/g, '-');
  return CATEGORY_MAP[slug] || 'Electronics';
};

/** Normalize a single DummyJSON product to ShopNest schema */
export const normalizeDummyProduct = (p) => {
  const category = normalizeCategory(p.category);
  return {
    _id: `dj_${p.id}`,
    name: p.title,
    title: p.title,
    description: p.description,
    price: p.price,
    discountPrice: p.discountPercentage
      ? parseFloat((p.price * (1 - p.discountPercentage / 100)).toFixed(2))
      : 0,
    discountPercentage: p.discountPercentage || 0,
    category,
    brand: p.brand || p.category || 'Generic',
    stock: p.stock ?? 50,
    ratings: p.rating || 0,
    numReviews: p.reviews?.length || 0,
    featured: (p.rating || 0) >= 4.5,
    tags: p.tags || [],
    images: [
      { public_id: `dj_${p.id}_0`, url: p.thumbnail },
      ...(p.images || []).map((url, i) => ({ public_id: `dj_${p.id}_${i + 1}`, url })),
    ],
    reviews: (p.reviews || []).map((r, i) => ({
      _id: `r_${p.id}_${i}`,
      name: r.reviewerName || 'Customer',
      rating: r.rating || 5,
      comment: r.comment || '',
      createdAt: r.date || new Date().toISOString(),
    })),
    seller: 'ShopNest',
    source: 'dummyjson',
  };
};

/** Fetch ALL products from DummyJSON then merge with EXTRA_PRODUCTS */
export const fetchAllDummyProducts = async () => {
  const limit = 100;
  const url = (skip) =>
    `${DUMMYJSON_BASE}/products?limit=${limit}&skip=${skip}&select=id,title,description,price,discountPercentage,rating,stock,brand,category,thumbnail,images,tags,reviews`;
  const res = await fetch(url(0));
  if (!res.ok) throw new Error(`DummyJSON error: ${res.status}`);
  const data = await res.json();
  const products = data.products.map(normalizeDummyProduct);
  if (data.total > limit) {
    const res2 = await fetch(url(limit));
    if (res2.ok) {
      const data2 = await res2.json();
      products.push(...data2.products.map(normalizeDummyProduct));
    }
  }
  // Always append local extra products (Books, Toys, etc.) so they are never missing
  return [...products, ...EXTRA_PRODUCTS];
};

/** Fetch a single product by DummyJSON id */
export const fetchDummyProductById = async (djId) => {
  const numId = djId.replace('dj_', '');
  const res = await fetch(`${DUMMYJSON_BASE}/products/${numId}`);
  if (!res.ok) throw new Error(`DummyJSON error: ${res.status}`);
  const p = await res.json();
  return normalizeDummyProduct(p);
};

// ─── Helper to build a local product ─────────────────────────────────────────
const lp = (id, name, desc, price, discPct, cat, brand, stock, rating, reviews, img, featured = false) => ({
  _id: id,
  name,
  title: name,
  description: desc,
  price,
  discountPrice: discPct ? parseFloat((price * (1 - discPct / 100)).toFixed(2)) : 0,
  discountPercentage: discPct || 0,
  category: cat,
  brand,
  stock,
  ratings: rating,
  numReviews: reviews,
  featured,
  tags: [],
  images: [{ public_id: id, url: img }],
  reviews: [],
  seller: 'ShopNest',
  source: 'local',
});

const BOOK_IMG = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format';
const BOOK_IMG2 = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format';
const BOOK_IMG3 = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format';
const BOOK_IMG4 = 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&auto=format';
const BOOK_IMG5 = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format';

const TOY_IMG  = 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&auto=format';
const TOY_IMG2 = 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format';
const TOY_IMG3 = 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format';
const TOY_IMG4 = 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format';
const TOY_IMG5 = 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?w=600&auto=format';

// ─── Extra local products (Books × 15, Toys × 15, plus other categories) ─────
export const EXTRA_PRODUCTS = [
  // ── BOOKS ──────────────────────────────────────────────────────────────────
  lp('bk_1','Atomic Habits','Build good habits and break bad ones with James Clear\'s proven framework.',299,0,'Books','Avery',300,4.9,890,BOOK_IMG3,true),
  lp('bk_2','The Psychology of Money','Timeless lessons on wealth, greed, and happiness by Morgan Housel.',249,0,'Books','Harriman House',200,4.8,430,BOOK_IMG2,true),
  lp('bk_3','JavaScript: The Good Parts','A deep dive into the best features of JavaScript by Douglas Crockford.',399,10,'Books','O\'Reilly',150,4.6,320,BOOK_IMG,false),
  lp('bk_4','You Don\'t Know JS','A series exploring the core mechanisms of JavaScript in depth.',449,0,'Books','O\'Reilly',120,4.7,280,BOOK_IMG4,false),
  lp('bk_5','Clean Code','A handbook of agile software craftsmanship by Robert C. Martin.',499,15,'Books','Prentice Hall',180,4.7,510,BOOK_IMG5,true),
  lp('bk_6','The Pragmatic Programmer','Your journey to mastery — classic software engineering guide.',549,0,'Books','Addison-Wesley',100,4.8,390,BOOK_IMG,false),
  lp('bk_7','React: Up & Running','Building web applications with React and modern JavaScript.',399,10,'Books','O\'Reilly',90,4.5,210,BOOK_IMG2,false),
  lp('bk_8','Node.js Design Patterns','Master best practices for building Node.js applications at scale.',499,0,'Books','Packt',80,4.6,175,BOOK_IMG3,false),
  lp('bk_9','Python Crash Course','A hands-on, project-based introduction to programming with Python.',349,0,'Books','No Starch Press',250,4.8,620,BOOK_IMG4,true),
  lp('bk_10','Learning SQL','Master SQL fundamentals for data management and analysis.',299,10,'Books','O\'Reilly',130,4.4,190,BOOK_IMG5,false),
  lp('bk_11','The Lean Startup','How today\'s entrepreneurs use continuous innovation to create businesses.',279,0,'Books','Crown Business',160,4.5,340,BOOK_IMG,false),
  lp('bk_12','Deep Work','Rules for focused success in a distracted world by Cal Newport.',259,0,'Books','Grand Central',140,4.6,290,BOOK_IMG2,false),
  lp('bk_13','Web Development with Node & Express','Leverage the power of Node.js and Express for web development.',449,12,'Books','O\'Reilly',70,4.5,155,BOOK_IMG3,false),
  lp('bk_14','The Alchemist','A magical story about following your dreams by Paulo Coelho.',199,0,'Books','HarperOne',400,4.7,980,BOOK_IMG4,true),
  lp('bk_15','Zero to One','Notes on startups, or how to build the future by Peter Thiel.',299,0,'Books','Crown Business',120,4.5,410,BOOK_IMG5,false),

  // ── TOYS ───────────────────────────────────────────────────────────────────
  lp('ty_1','LEGO Creator 3-in-1 Set','Build three different models with this versatile LEGO Creator set. Ages 8+.',3999,20,'Toys','LEGO',90,4.9,320,TOY_IMG2,true),
  lp('ty_2','Remote Control Monster Truck','1:10 scale RC monster truck with 4WD and 30 km/h top speed.',5999,15,'Toys','TurboRC',45,4.7,142,TOY_IMG,false),
  lp('ty_3','Wooden Building Blocks Set','100-piece premium wooden building blocks for creative play. Ages 2+.',1499,0,'Toys','WoodPlay',120,4.8,230,TOY_IMG3,true),
  lp('ty_4','Educational Robot Kit','Build and program your own robot. STEM learning for kids ages 8+.',4999,10,'Toys','RoboKids',35,4.6,98,TOY_IMG4,false),
  lp('ty_5','Soft Plush Teddy Bear','Super soft 40 cm teddy bear, perfect gift for kids of all ages.',799,0,'Toys','CuddleCo',200,4.8,415,TOY_IMG5,true),
  lp('ty_6','1000-Piece Jigsaw Puzzle','Stunning landscape jigsaw puzzle for family fun. Ages 12+.',999,10,'Toys','PuzzleMaster',80,4.5,167,TOY_IMG2,false),
  lp('ty_7','Superhero Action Figure Set','Set of 6 detailed superhero action figures with accessories.',1299,0,'Toys','HeroWorld',110,4.6,203,TOY_IMG3,false),
  lp('ty_8','Classic Board Game Collection','3-in-1 board game set: Chess, Checkers, and Ludo.',1199,15,'Toys','GameZone',95,4.7,289,TOY_IMG4,false),
  lp('ty_9','Kids Art & Drawing Kit','48-piece drawing kit with crayons, markers, and sketch pads.',899,0,'Toys','ArtKids',150,4.5,178,TOY_IMG5,false),
  lp('ty_10','Musical Keyboard for Kids','Mini 37-key electronic keyboard with built-in songs and rhythms.',2499,10,'Toys','MusicJoy',60,4.6,134,TOY_IMG,false),
  lp('ty_11','Magnetic Tiles Building Set','80-piece magnetic tiles for creative 3D construction. Ages 3+.',3499,0,'Toys','MagBuild',75,4.8,256,TOY_IMG2,true),
  lp('ty_12','Foam Dart Blaster','Safe foam dart blaster with 20 darts. Outdoor fun for ages 6+.',1599,20,'Toys','BlastFun',85,4.4,112,TOY_IMG3,false),
  lp('ty_13','Play-Doh Mega Set','30-piece Play-Doh set with tools and molds for creative play.',1299,0,'Toys','Play-Doh',130,4.7,345,TOY_IMG4,false),
  lp('ty_14','Toy Kitchen Playset','Realistic toy kitchen with accessories for imaginative play. Ages 3+.',4499,15,'Toys','PlayHome',40,4.6,89,TOY_IMG5,false),
  lp('ty_15','Dinosaur Figure Collection','Set of 12 realistic dinosaur figures with educational booklet.',1099,0,'Toys','DinoWorld',100,4.8,198,TOY_IMG,true),

  // ── SPORTS (extra) ─────────────────────────────────────────────────────────
  lp('sp_1','Adjustable Dumbbell Set','Space-saving adjustable dumbbells 5–52.5 lbs for home gym.',27999,14,'Sports','PowerFit',25,4.7,78,
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format',false),
  lp('sp_2','Yoga Mat Premium Non-Slip','6mm thick non-slip yoga mat with carrying strap.',3599,0,'Sports','FitPro',120,4.6,98,
    'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format',false),

  // ── HOME & GARDEN (extra) ──────────────────────────────────────────────────
  lp('hg_1','Smart Robot Vacuum Cleaner','Auto-mapping robot vacuum with app control and 2500Pa suction.',23999,17,'Home & Garden','CleanBot',35,4.6,95,
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format',true),
  lp('hg_2','Scented Soy Candle Set','Set of 4 hand-poured soy candles in lavender, vanilla, cedar, citrus.',3199,0,'Home & Garden','AromaHome',120,4.6,88,
    'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&auto=format',false),

  // ── BEAUTY (extra) ─────────────────────────────────────────────────────────
  lp('bt_1','Vitamin C Brightening Serum','Potent 20% Vitamin C serum that brightens skin and reduces dark spots.',2799,0,'Beauty','GlowLab',150,4.4,210,
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format',false),
  lp('bt_2','Matte Lipstick Collection','Set of 6 long-lasting matte lipsticks in bold wearable shades.',2399,17,'Beauty','ColorPop',200,4.3,175,
    'https://images.unsplash.com/photo-1586495777744-4e6232bf2f9b?w=600&auto=format',false),

  // ── ELECTRONICS (extra) ────────────────────────────────────────────────────
  lp('el_1','Wireless Bluetooth Earbuds','ANC earbuds with 24-hour battery life and premium sound.',6399,25,'Electronics','SoundPro',80,4.5,120,
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format',true),

  // ── CLOTHING (extra) ───────────────────────────────────────────────────────
  lp('cl_1','Classic Denim Jacket','Timeless slim-fit denim jacket for casual outings.',7199,0,'Clothing','UrbanStyle',60,4.3,85,
    'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&auto=format',false),
];

/** Full fallback catalog used when DummyJSON is unreachable */
export const FALLBACK_PRODUCTS = EXTRA_PRODUCTS;

export { SHOPNEST_CATEGORIES as default };
