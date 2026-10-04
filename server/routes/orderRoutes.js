const express = require('express');
const router = express.Router();
const {
  createOrder, getMyOrders, getOrderById, updateOrderToPaid,
  getAllOrders, updateOrderStatus, getAnalytics,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/analytics', protect, adminOnly, getAnalytics);
router.get('/', protect, adminOnly, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
