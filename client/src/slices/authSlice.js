import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import toast from 'react-hot-toast';
import { clearOrders } from './orderSlice';
import { clearCart } from './cartSlice';

// Load user from localStorage
const userFromStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', data);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  try {
    await api.post('/auth/logout');
  } catch (_err) {
    // ignore server error — always clear locally
  }
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  dispatch(clearOrders());
  dispatch(clearCart());
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/me');
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put('/users/profile', data);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed');
  }
});

export const uploadAvatar = createAsyncThunk('auth/uploadAvatar', async (imageData, { rejectWithValue }) => {
  try {
    const res = await api.put('/users/avatar', { imageData });
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Avatar upload failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: userFromStorage,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(register.pending, pending)
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        toast.success('Account created successfully!');
      })
      .addCase(register.rejected, (state, action) => {
        rejected(state, action);
        toast.error(action.payload);
      })
      .addCase(login.pending, pending)
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        toast.success(`Welcome back, ${action.payload.user.name}!`);
      })
      .addCase(login.rejected, (state, action) => {
        rejected(state, action);
        toast.error(action.payload);
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        toast.success('Logged out successfully');
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateProfile.pending, pending)
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        toast.success('Profile updated successfully!');
      })
      .addCase(updateProfile.rejected, (state, action) => {
        rejected(state, action);
        toast.error(action.payload);
      })
      .addCase(uploadAvatar.pending, pending)
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        toast.success('Profile picture updated!');
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        rejected(state, action);
        toast.error(action.payload);
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
