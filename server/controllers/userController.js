const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { cloudinary } = require('../config/cloudinary');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone || user.phone;
  if (req.body.address) {
    user.address = { ...user.address.toObject(), ...req.body.address };
  }

  if (req.body.password) {
    if (!req.body.currentPassword) {
      res.status(400);
      throw new Error('Current password is required to set a new password');
    }
    const isMatch = await user.comparePassword(req.body.currentPassword);
    if (!isMatch) {
      res.status(400);
      throw new Error('Current password is incorrect');
    }
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      phone: updatedUser.phone,
      address: updatedUser.address,
    },
  });
});

// @desc    Upload / update avatar
// @route   PUT /api/users/avatar
// @access  Private
const uploadAvatar = asyncHandler(async (req, res) => {
  const { imageData } = req.body; // base64 data URI from frontend

  if (!imageData) {
    res.status(400);
    throw new Error('No image data provided');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Delete old avatar from Cloudinary if it exists
  if (user.avatar?.public_id) {
    await cloudinary.uploader.destroy(user.avatar.public_id).catch(() => {});
  }

  // Upload new avatar to Cloudinary
  // Note: transformation omitted from upload params — Cloudinary SDK v1 signature
  // only covers folder+timestamp+api_key. Apply transforms via delivery URL if needed.
  const result = await cloudinary.uploader.upload(imageData, {
    folder: 'ecommerce/avatars',
    width: 200,
    height: 200,
    crop: 'fill',
    gravity: 'face',
  });

  user.avatar = {
    public_id: result.public_id,
    url: result.secure_url,
  };

  await user.save();

  // Return updated user (same shape as updateProfile)
  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      address: user.address,
    },
  });
});

// @desc    Toggle wishlist item (works for ALL product ID types: MongoDB ObjectId, dj_, bk_, ty_, etc.)
// @route   POST /api/users/wishlist/:productId
// @access  Private
const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = String(req.params.productId);

  // Use string comparison — wishlist is now [String]
  const index = user.wishlist.findIndex((id) => String(id) === productId);
  if (index === -1) {
    user.wishlist.push(productId);
  } else {
    user.wishlist.splice(index, 1);
  }

  await user.save();

  res.json({
    success: true,
    wishlist: user.wishlist,
    added: index === -1, // true = added, false = removed
  });
});

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const total = await User.countDocuments();
  const users = await User.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1));

  res.json({ success: true, users, total, page, pages: Math.ceil(total / limit) });
});

// @desc    Get user by ID (admin)
// @route   GET /api/users/:id
// @access  Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ success: true, user });
});

// @desc    Update user role (admin)
// @route   PUT /api/users/:id
// @access  Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true, runValidators: true }
  );
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ success: true, user });
});

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user.role === 'admin') {
    res.status(400);
    throw new Error('Cannot delete an admin user');
  }
  await user.deleteOne();
  res.json({ success: true, message: 'User deleted successfully' });
});

module.exports = { updateProfile, uploadAvatar, toggleWishlist, getAllUsers, getUserById, updateUserRole, deleteUser };
