const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const path = require('path');

// =====================================================
// LOAD ENVIRONMENT VARIABLES
// =====================================================

dotenv.config({
  path: path.join(__dirname, '../.env'),
});

// =====================================================
// MODELS
// =====================================================

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// =====================================================
// CONNECT TO MONGODB
// =====================================================

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in server/.env');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `MongoDB Connected for seeding: ${conn.connection.host}`.cyan
    );
  } catch (error) {
    console.error(
      `MongoDB Connection Error: ${error.message}`.red.bold
    );
    process.exit(1);
  }
};

// =====================================================
// USERS
// =====================================================

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

// =====================================================
// PRODUCTS
// =====================================================

const products = [
  {
    name: 'Apple iPhone 15 Pro Max',
    description:
      'The latest Apple iPhone featuring a titanium design, powerful A17 Pro chip, and advanced camera system.',
    price: 1199,
    category: 'Electronics',
    brand: 'Apple',
    stock: 50,
    ratings: 4.8,
    numReviews: 125,
    featured: true,
    seller: 'Our Store',
    images: [
      {
        public_id: 'shopnest/iphone-15-pro-max',
        url: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800',
      },
    ],
  },

  {
    name: 'Samsung 65" 4K QLED Smart TV',
    description:
      'Experience stunning 4K picture quality with Samsung QLED technology and smart TV features.',
    price: 1499,
    category: 'Electronics',
    brand: 'Samsung',
    stock: 25,
    ratings: 4.6,
    numReviews: 89,
    featured: true,
    seller: 'Our Store',
    images: [
      {
        public_id: 'shopnest/samsung-tv',
        url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
      },
    ],
  },

  {
    name: 'Sony WH-1000XM5 Headphones',
    description:
      'Premium wireless noise-cancelling headphones with exceptional sound quality and comfort.',
    price: 399,
    category: 'Electronics',
    brand: 'Sony',
    stock: 75,
    ratings: 4.9,
    numReviews: 210,
    featured: true,
    seller: 'Our Store',
    images: [
      {
        public_id: 'shopnest/sony-headphones',
        url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
      },
    ],
  },

  {
    name: 'MacBook Pro 16" M3 Max',
    description:
      'Powerful MacBook Pro with M3 Max chip, stunning Liquid Retina XDR display, and exceptional performance.',
    price: 3499,
    category: 'Electronics',
    brand: 'Apple',
    stock: 15,
    ratings: 4.9,
    numReviews: 76,
    featured: true,
    seller: 'Our Store',
    images: [
      {
        public_id: 'shopnest/macbook-pro',
        url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      },
    ],
  },

  {
    name: "Men's Premium Slim-Fit Suit",
    description:
      'Elegant premium slim-fit suit perfect for business meetings, weddings, and formal occasions.',
    price: 299,
    category: 'Clothing',
    brand: 'Premium',
    stock: 40,
    ratings: 4.5,
    numReviews: 54,
    featured: false,
    seller: 'Our Store',
    images: [
      {
        public_id: 'shopnest/mens-suit',
        url: 'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=800',
      },
    ],
  },

  {
    name: "Women's Cashmere Sweater",
    description:
      'Soft and luxurious cashmere sweater designed for warmth, comfort, and timeless style.',
    price: 189,
    category: 'Clothing',
    brand: 'Luxury',
    stock: 60,
    ratings: 4.7,
    numReviews: 92,
    featured: false,
    seller: 'Our Store',
    images: [
      {
        public_id: 'shopnest/womens-sweater',
        url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800',
      },
    ],
  },

  {
    name: 'Nike Air Max 270',
    description:
      'Stylish and comfortable Nike sneakers featuring Air Max cushioning for everyday wear.',
    price: 150,
    category: 'Clothing',
    brand: 'Nike',
    stock: 100,
    ratings: 4.6,
    numReviews: 143,
    featured: true,
    seller: 'Our Store',
    images: [
      {
        public_id: 'shopnest/nike-air-max',
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      },
    ],
  },

  {
    name: 'Atomic Habits by James Clear',
    description:
      'A practical guide to building good habits and breaking bad ones through small behavioral changes.',
    price: 18,
    category: 'Books',
    brand: 'Penguin',
    stock: 200,
    ratings: 4.9,
    numReviews: 560,
    featured: true,
    seller: 'Our Store',
    images: [
      {
        public_id: 'shopnest/atomic-habits',
        url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800',
      },
    ],
  },

  {
    name: 'Dyson V15 Detect Vacuum',
    description:
      'Advanced cordless vacuum cleaner with powerful suction, laser dust detection, and intelligent cleaning.',
    price: 749,
    category: 'Home & Garden',
    brand: 'Dyson',
    stock: 30,
    ratings: 4.8,
    numReviews: 117,
    featured: false,
    seller: 'Our Store',
    images: [
      {
        public_id: 'shopnest/dyson-vacuum',
        url: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800',
      },
    ],
  },

  {
    name: 'Instant Pot Duo 7-in-1',
    description:
      'Versatile electric pressure cooker with seven cooking functions for quick and easy meals.',
    price: 99,
    category: 'Home & Garden',
    brand: 'Instant Pot',
    stock: 80,
    ratings: 4.7,
    numReviews: 185,
    featured: false,
    seller: 'Our Store',
    images: [
      {
        public_id: 'shopnest/instant-pot',
        url: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800',
      },
    ],
  },

  {
    name: 'Yoga Mat Premium Non-Slip',
    description:
      'Premium non-slip yoga mat designed for comfortable workouts, yoga, stretching, and fitness.',
    price: 45,
    category: 'Sports',
    brand: 'Fitness Pro',
    stock: 120,
    ratings: 4.6,
    numReviews: 98,
    featured: false,
    seller: 'Our Store',
    images: [
      {
        public_id: 'shopnest/yoga-mat',
        url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
      },
    ],
  },

  {
    name: 'Hydro Flask 32 oz Water Bottle',
    description:
      'Insulated stainless steel water bottle that keeps drinks cold for hours and is perfect for everyday use.',
    price: 45,
    category: 'Sports',
    brand: 'Hydro Flask',
    stock: 90,
    ratings: 4.8,
    numReviews: 132,
    featured: false,
    seller: 'Our Store',
    images: [
      {
        public_id: 'shopnest/hydro-flask',
        url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
      },
    ],
  },
];

// =====================================================
// IMPORT DATA
// =====================================================

const importData = async () => {
  try {
    await connectDB();

    console.log('\n🗑️ Clearing existing data...'.yellow);

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Existing data cleared.'.green);

    // Create users
    const createdUsers = await User.create(users);

    console.log(
      `✅ ${createdUsers.length} users seeded successfully`.green
    );

    // Create products
    const createdProducts = await Product.insertMany(products);

    console.log(
      `✅ ${createdProducts.length} products seeded successfully`.green
    );

    console.log('\n🌱 Data seeded successfully!'.green.bold);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━'.gray);

    console.log('Admin Login:'.yellow);
    console.log('  Email: admin@shopNest.com'.cyan);
    console.log('  Password: admin123'.cyan);

    console.log('\nUser Login:'.yellow);
    console.log('  Email: john@example.com'.cyan);
    console.log('  Password: user123'.cyan);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━'.gray);

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);

    await mongoose.connection.close().catch(() => {});

    process.exit(1);
  }
};

// =====================================================
// DESTROY DATA
// =====================================================

const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('\n🗑️ All data destroyed successfully!'.red.bold);

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);

    await mongoose.connection.close().catch(() => {});

    process.exit(1);
  }
};

// =====================================================
// RUN SEEDER
// =====================================================

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}