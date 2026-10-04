const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter product name'],
      trim: true,
      maxLength: [200, 'Product name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please enter product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please enter product price'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Please enter product category'],
      enum: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Food', 'Other'],
    },
    brand: { type: String, default: '' },
    stock: {
      type: Number,
      required: [true, 'Please enter product stock'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    reviews: [reviewSchema],
    numReviews: { type: Number, default: 0 },
    ratings: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    seller: { type: String, default: 'Our Store' },
  },
  { timestamps: true }
);

// Calculate average rating
productSchema.methods.calculateRatings = function () {
  if (this.reviews.length === 0) {
    this.ratings = 0;
    this.numReviews = 0;
  } else {
    const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.ratings = (totalRating / this.reviews.length).toFixed(1);
    this.numReviews = this.reviews.length;
  }
};

module.exports = mongoose.model('Product', productSchema);
