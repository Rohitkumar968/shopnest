import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const cartFromStorage = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : [];

const saveCart = (items) => localStorage.setItem('cart', JSON.stringify(items));

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: cartFromStorage,
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
    paymentMethod: localStorage.getItem('paymentMethod') || 'stripe',
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find((i) => i.product === item.product);
      if (existing) {
        if (existing.quantity < item.stock) {
          existing.quantity += 1;
          toast.success('Cart updated');
        } else {
          toast.error('Maximum stock reached');
          return;
        }
      } else {
        state.items.push({ ...item, quantity: 1 });
        toast.success('Added to cart!');
      }
      saveCart(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.product !== action.payload);
      saveCart(state.items);
      toast.success('Removed from cart');
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.product === productId);
      if (item) {
        item.quantity = quantity;
        saveCart(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', action.payload);
    },
  },
});

export const {
  addToCart, removeFromCart, updateQuantity, clearCart, saveShippingAddress, savePaymentMethod,
} = cartSlice.actions;

export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);

export default cartSlice.reducer;
