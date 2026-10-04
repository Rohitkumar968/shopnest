const express = require('express');
const router = express.Router();
const {
  getProducts, getFeaturedProducts, getCategories, getProductById,
  createProduct, updateProduct, deleteProduct, createReview,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Try to load upload middleware (Cloudinary may not be configured in dev)
let uploadMiddleware = (req, res, next) => next(); // default: no-op
try {
  const { upload } = require('../config/cloudinary');
  uploadMiddleware = upload.array('images', 5);
} catch (e) { /* Cloudinary not configured */ }

router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/:id/reviews', protect, createReview);

// Admin routes
router.post('/', protect, adminOnly, uploadMiddleware, createProduct);
router.put('/:id', protect, adminOnly, uploadMiddleware, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
