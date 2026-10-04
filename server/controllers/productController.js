const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Get all products with filters, search, pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;

  // Build query
  const query = {};

  // Search
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  // Category filter
  if (req.query.category) query.category = req.query.category;

  // Price filter
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
  }

  // Rating filter
  if (req.query.rating) query.ratings = { $gte: Number(req.query.rating) };

  // Sort
  let sortQuery = {};
  switch (req.query.sort) {
    case 'price_asc': sortQuery = { price: 1 }; break;
    case 'price_desc': sortQuery = { price: -1 }; break;
    case 'newest': sortQuery = { createdAt: -1 }; break;
    case 'rating': sortQuery = { ratings: -1 }; break;
    default: sortQuery = { createdAt: -1 };
  }

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sortQuery)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    success: true,
    products,
    page,
    pages: Math.ceil(total / pageSize),
    total,
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ featured: true }).limit(8);
  res.json({ success: true, products });
});

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  res.json({ success: true, categories });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, product });
});

// @desc    Create product
// @route   POST /api/products
// @access  Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, discountPrice, category, brand, stock, featured } = req.body;

  // Handle images
  let images = [];
  if (req.files && req.files.length > 0) {
    images = req.files.map((file) => ({
      public_id: file.filename,
      url: file.path,
    }));
  } else if (req.body.images) {
    // Handle URL-based images for seeding
    const imgArray = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    images = imgArray.map((url, i) => ({ public_id: `placeholder_${i}`, url }));
  }

  if (images.length === 0) {
    images = [{ public_id: 'placeholder', url: 'https://via.placeholder.com/400' }];
  }

  const product = await Product.create({
    name, description, price, discountPrice, category, brand, stock, featured, images,
  });

  res.status(201).json({ success: true, product });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Build safe update object — never blindly spread req.body
  const { name, description, price, discountPrice, category, brand, stock, featured } = req.body;
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (price !== undefined) updateData.price = price;
  if (discountPrice !== undefined) updateData.discountPrice = discountPrice;
  if (category !== undefined) updateData.category = category;
  if (brand !== undefined) updateData.brand = brand;
  if (stock !== undefined) updateData.stock = stock;
  if (featured !== undefined) updateData.featured = featured === 'true' || featured === true;

  // Handle new image uploads (Cloudinary)
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((file) => ({
      public_id: file.filename,
      url: file.path,
    }));
    updateData.images = [...product.images, ...newImages];
  } else if (req.body.images) {
    // URL-based image update
    const imgArray = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    const newImages = imgArray.map((url, i) => ({ public_id: `placeholder_${Date.now()}_${i}`, url }));
    updateData.images = [...product.images, ...newImages];
  }

  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, product: updatedProduct });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted successfully' });
});

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user already reviewed
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    // Update existing review
    alreadyReviewed.rating = Number(rating);
    alreadyReviewed.comment = comment;
  } else {
    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    });
  }

  product.calculateRatings();
  await product.save();

  res.status(201).json({ success: true, message: 'Review added successfully' });
});

module.exports = {
  getProducts,
  getFeaturedProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
};
