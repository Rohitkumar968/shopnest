const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    orderItems: [
      {
        product: { type: String, required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],

    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      enum: ['stripe', 'cod'],
      required: true,
    },

    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },

    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    taxPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,

    orderStatus: {
      type: String,
      enum: [
        'Processing',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
      ],
      default: 'Processing',
    },

    // Actual delivery date
    deliveredAt: Date,

    // Expected delivery date
    estimatedDeliveryDate: {
      type: Date,
      default: function () {
        const date = new Date();
        date.setDate(date.getDate() + 5);
        return date;
      },
    },

    trackingNumber: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);