const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Check stock only for real MongoDB products.
  // DummyJSON/local products use IDs like:
  // dj_80, bk_1, ty_1, sp_1, etc.
  for (const item of orderItems) {
    const productId = String(item.product);

    // Real MongoDB ObjectId = 24 hexadecimal characters
    const isMongoProduct = /^[a-fA-F0-9]{24}$/.test(productId);

    // External/local catalog product
    if (!isMongoProduct) {
      continue;
    }

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.name}`);
    }

    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    product.stock -= item.quantity;
    await product.save();
  }

  // Create order
  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.json({
    success: true,
    orders,
  });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Ensure user owns the order (or is admin)
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({
    success: true,
    order,
  });
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.email_address,
  };

  order.orderStatus = 'Processing';

  const updatedOrder = await order.save();

  res.json({
    success: true,
    order: updatedOrder,
  });
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const query = {};

  if (req.query.status) {
    query.orderStatus = req.query.status;
  }

  const total = await Order.countDocuments(query);

  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1));

  res.json({
    success: true,
    orders,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const newStatus = req.body.status;

  order.orderStatus = newStatus;

  // COD order is considered paid when successfully delivered
  if (newStatus === 'Delivered') {
    order.isPaid = true;
    order.paidAt = new Date();
    order.deliveredAt = new Date();
  }

  // Cancelled order should not count as revenue
  if (newStatus === 'Cancelled') {
    order.isPaid = false;
    order.paidAt = undefined;
    order.deliveredAt = undefined;
  }

  const updatedOrder = await order.save();

  res.json({
    success: true,
    order: updatedOrder,
  });
});

// @desc    Get admin dashboard analytics
// @route   GET /api/orders/analytics
// @access  Admin
const getAnalytics = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();

  const totalRevenue = await Order.aggregate([
    {
      $match: {
        isPaid: true,
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: '$totalPrice',
        },
      },
    },
  ]);

  const ordersByStatus = await Order.aggregate([
    {
      $group: {
        _id: '$orderStatus',
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  // Last 7 days revenue
  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  );

  const revenueByDay = await Order.aggregate([
    {
      $match: {
        isPaid: true,
        createdAt: {
          $gte: sevenDaysAgo,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt',
          },
        },
        revenue: {
          $sum: '$totalPrice',
        },
        orders: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  res.json({
    success: true,
    analytics: {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      ordersByStatus,
      revenueByDay,
    },
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getAllOrders,
  updateOrderStatus,
  getAnalytics,
};