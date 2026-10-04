const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected for seeding'.cyan);
};

const users = [
  {
    name: 'Admin User',
    email: 'admin@shopNest.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    role: 'user',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'user123',
    role: 'user',
  },
];

const products = [
  {
    name: 'Apple iPhone 15 Pro Max',
    description: 'The most powerful iPhone ever with A17 Pro chip, titanium design, and a 48MP main camera system. Features USB 3 speeds, Action Button, and up to 29-hour video playback.',
    price: 1199.99,
    discountPrice: 1099.99,
    category: 'Electronics',
    brand: 'Apple',
    stock: 50,
    featured: true,
    ratings: 4.8,
    numReviews: 245,
    images: [{ public_id: 'iphone15', url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600' }],
  },
  {
    name: 'Samsung 65" 4K QLED Smart TV',
    description: 'Experience stunning 4K QLED picture quality with Quantum Dot technology, delivering over a billion shades of color. Smart TV with built-in streaming apps.',
    price: 1299.99,
    discountPrice: 999.99,
    category: 'Electronics',
    brand: 'Samsung',
    stock: 20,
    featured: true,
    ratings: 4.6,
    numReviews: 182,
    images: [{ public_id: 'samsung_tv', url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600' }],
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling with two processors and eight microphones. 30-hour battery life with quick charge. Exceptional call quality.',
    price: 399.99,
    discountPrice: 329.99,
    category: 'Electronics',
    brand: 'Sony',
    stock: 75,
    featured: true,
    ratings: 4.9,
    numReviews: 421,
    images: [{ public_id: 'sony_headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600' }],
  },
  {
    name: 'MacBook Pro 16" M3 Max',
    description: 'Supercharged by M3 Max chip with up to 40-core GPU. Up to 128GB unified memory. 22-hour battery life. Liquid Retina XDR display.',
    price: 3499.99,
    discountPrice: 3299.99,
    category: 'Electronics',
    brand: 'Apple',
    stock: 15,
    featured: true,
    ratings: 4.9,
    numReviews: 89,
    images: [{ public_id: 'macbook', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600' }],
  },
  {
    name: "Men's Premium Slim-Fit Suit",
    description: "Elegant slim-fit suit crafted from premium wool blend. Perfect for business meetings, formal events, and special occasions. Available in multiple sizes.",
    price: 299.99,
    discountPrice: 249.99,
    category: 'Clothing',
    brand: 'StyleCraft',
    stock: 40,
    featured: true,
    ratings: 4.5,
    numReviews: 67,
    images: [{ public_id: 'suit', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600' }],
  },
  {
    name: "Women's Cashmere Sweater",
    description: 'Luxuriously soft 100% pure cashmere sweater. Timeless design with ribbed cuffs and hem. Perfect for layering in any season.',
    price: 189.99,
    discountPrice: 149.99,
    category: 'Clothing',
    brand: 'LuxeWear',
    stock: 60,
    featured: false,
    ratings: 4.7,
    numReviews: 134,
    images: [{ public_id: 'sweater', url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600' }],
  },
  {
    name: 'Nike Air Max 270',
    description: 'The Nike Air Max 270 delivers visible cushioning under every step. Originally designed for all-day wear, the large Air unit provides unreal comfort.',
    price: 149.99,
    discountPrice: 129.99,
    category: 'Clothing',
    brand: 'Nike',
    stock: 100,
    featured: true,
    ratings: 4.6,
    numReviews: 312,
    images: [{ public_id: 'nike', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600' }],
  },
  {
    name: 'Atomic Habits by James Clear',
    description: 'No.1 New York Times bestseller. Learn how tiny changes can lead to remarkable results. A revolutionary approach to building good habits and breaking bad ones.',
    price: 27.99,
    discountPrice: 22.99,
    category: 'Books',
    brand: 'Avery',
    stock: 200,
    featured: false,
    ratings: 4.8,
    numReviews: 892,
    images: [{ public_id: 'atomic_habits', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600' }],
  },
  {
    name: 'Dyson V15 Detect Vacuum',
    description: 'Laser reveals microscopic dust. Powerful suction with up to 60 minutes run time. Automatically adapts suction and reports scientifically on what it has vacuumed.',
    price: 749.99,
    discountPrice: 649.99,
    category: 'Home & Garden',
    brand: 'Dyson',
    stock: 30,
    featured: true,
    ratings: 4.7,
    numReviews: 156,
    images: [{ public_id: 'dyson', url: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600' }],
  },
  {
    name: 'Instant Pot Duo 7-in-1',
    description: 'The most trusted multi-use pressure cooker. 7 appliances in 1: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer.',
    price: 99.99,
    discountPrice: 79.99,
    category: 'Home & Garden',
    brand: 'Instant Pot',
    stock: 85,
    featured: false,
    ratings: 4.8,
    numReviews: 2341,
    images: [{ public_id: 'instant_pot', url: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600' }],
  },
  {
    name: 'Yoga Mat Premium Non-Slip',
    description: 'Professional grade yoga mat with superior grip and cushioning. Eco-friendly natural rubber with alignment lines. Perfect for all yoga styles and fitness routines.',
    price: 79.99,
    discountPrice: 64.99,
    category: 'Sports',
    brand: 'ZenFit',
    stock: 120,
    featured: false,
    ratings: 4.6,
    numReviews: 445,
    images: [{ public_id: 'yoga_mat', url: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600' }],
  },
  {
    name: 'Hydro Flask 32 oz Water Bottle',
    description: 'TempShield double-wall vacuum insulation keeps beverages cold up to 24 hours and hot up to 12 hours. BPA-free and phthalate-free stainless steel.',
    price: 49.99,
    discountPrice: 44.99,
    category: 'Sports',
    brand: 'Hydro Flask',
    stock: 200,
    featured: false,
    ratings: 4.9,
    numReviews: 678,
    images: [{ public_id: 'hydroflask', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600' }],
  },
];

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Create users
    const createdUsers = await User.insertMany(users);
    console.log(`✅ ${createdUsers.length} users seeded`.green);

    // Create products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} products seeded`.green);

    console.log('\n🌱 Data seeded successfully!'.green.bold);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━'.gray);
    console.log('Admin Login:'.yellow);
    console.log('  Email: admin@shopNest.com'.cyan);
    console.log('  Password: admin123'.cyan);
    console.log('User Login:'.yellow);
    console.log('  Email: john@example.com'.cyan);
    console.log('  Password: user123'.cyan);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━'.gray);

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Data destroyed!'.red.bold);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}