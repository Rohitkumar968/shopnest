import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import toast from 'react-hot-toast';

export const createOrder = createAsyncThunk('orders/create', async (orderData, { rejectWithValue }) => {
  try {
    const res = await api.post('/orders', orderData);
    toast.success('Order placed successfully!');
    return res.data.order;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Order failed');
  }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMine', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/orders/myorders');
    return res.data.orders;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchOrderById = createAsyncThunk('orders/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/orders/${id}`);
    return res.data.order;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchAllOrders = createAsyncThunk('orders/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/orders?${query}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/orders/${id}/status`, { status });
    toast.success('Order status updated!');
    return res.data.order;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchAnalytics = createAsyncThunk('orders/analytics', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/orders/analytics');
    return res.data.analytics;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    order: null,
    analytics: null,
    loading: false,
    error: null,
    total: 0,
    pages: 1,
  },
  reducers: {
    clearOrder: (state) => { state.order = null; },
    clearOrders: (state) => { state.orders = []; state.order = null; },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(createOrder.pending, pending)
      .addCase(createOrder.fulfilled, (state, action) => { state.loading = false; state.order = action.payload; })
      .addCase(createOrder.rejected, (state, action) => { rejected(state, action); toast.error(action.payload); })
      .addCase(fetchMyOrders.pending, pending)
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; })
      .addCase(fetchMyOrders.rejected, rejected)
      .addCase(fetchOrderById.pending, pending)
      .addCase(fetchOrderById.fulfilled, (state, action) => { state.loading = false; state.order = action.payload; })
      .addCase(fetchOrderById.rejected, rejected)
      .addCase(fetchAllOrders.pending, pending)
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
      })
      .addCase(fetchAllOrders.rejected, rejected)
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.orders.findIndex((o) => o._id === action.payload._id);
        if (idx !== -1) state.orders[idx] = action.payload;
        if (state.order?._id === action.payload._id) state.order = action.payload;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        toast.error(action.payload || 'Failed to update order status');
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => { state.analytics = action.payload; });
  },
});

export const { clearOrder, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
