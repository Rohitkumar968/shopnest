import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import {
  fetchAllDummyProducts,
  fetchDummyProductById,
  FALLBACK_PRODUCTS,
} from '../services/productService';
import toast from 'react-hot-toast';

// ─── Backend thunks (admin CRUD, orders, reviews) ────────────────────────────

export const createProduct = createAsyncThunk('products/create', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    toast.success('Product created successfully!');
    return res.data.product;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    toast.success('Product updated successfully!');
    return res.data.product;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/products/${id}`);
    toast.success('Product deleted successfully!');
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createReview = createAsyncThunk('products/review', async ({ id, reviewData }, { rejectWithValue }) => {
  try {
    await api.post(`/products/${id}/reviews`, reviewData);
    toast.success('Review submitted!');
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Review failed');
  }
});

// ─── External catalog thunks (DummyJSON + fallback) ──────────────────────────

/**
 * Load the full catalog. Uses cache (allProducts in state) to avoid re-fetching.
 * Falls back to FALLBACK_PRODUCTS if DummyJSON is unavailable.
 */
export const loadCatalog = createAsyncThunk(
  'products/loadCatalog',
  async (_, { getState, rejectWithValue }) => {
    const { allProducts } = getState().products;
    if (allProducts.length > 0) return allProducts; // cache hit
    try {
      return await fetchAllDummyProducts();
    } catch {
      return FALLBACK_PRODUCTS;
    }
  }
);

/**
 * Fetch + filter products for the ProductsPage.
 * Runs client-side against the cached catalog.
 */
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params = {}, { dispatch, getState }) => {
    // Ensure catalog is loaded
    let { allProducts } = getState().products;
    if (allProducts.length === 0) {
      const result = await dispatch(loadCatalog());
      allProducts = result.payload || FALLBACK_PRODUCTS;
    }

    let filtered = [...allProducts];

    // Search (title, description, brand, category)
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    // Category
    if (params.category) {
      filtered = filtered.filter((p) => p.category === params.category);
    }

    // Price range
    if (params.minPrice) {
      filtered = filtered.filter((p) => (p.discountPrice || p.price) >= Number(params.minPrice));
    }
    if (params.maxPrice) {
      filtered = filtered.filter((p) => (p.discountPrice || p.price) <= Number(params.maxPrice));
    }

    // Rating
    if (params.rating) {
      filtered = filtered.filter((p) => (p.ratings || 0) >= Number(params.rating));
    }

    // Featured
    if (params.featured === 'true' || params.featured === true) {
      filtered = filtered.filter((p) => p.featured);
    }

    // Sort
    switch (params.sort) {
      case 'price_asc':
        filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price_desc':
        filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
        break;
      default:
        // newest — keep original order (DummyJSON returns by id)
        break;
    }

    // Pagination
    const pageSize = Number(params.limit) || 20;
    const page = Number(params.page) || 1;
    const total = filtered.length;
    const pages = Math.ceil(total / pageSize);
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    return { products: paginated, page, pages, total };
  }
);

/**
 * Fetch featured products for the HomePage.
 */
export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeatured',
  async (_, { dispatch, getState }) => {
    let { allProducts } = getState().products;
    if (allProducts.length === 0) {
      const result = await dispatch(loadCatalog());
      allProducts = result.payload || FALLBACK_PRODUCTS;
    }
    return allProducts.filter((p) => p.featured).slice(0, 12);
  }
);

/**
 * Fetch a single product by id.
 * Supports both DummyJSON ids (dj_X) and MongoDB ids.
 */
export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id, { getState, rejectWithValue }) => {
    // Try cache first
    const { allProducts } = getState().products;
    const cached = allProducts.find((p) => p._id === id);
    if (cached) return cached;

    // Local / extra product (bk_, ty_, sp_, hg_, bt_, el_, cl_, fb_)
    const LOCAL_PREFIXES = ['bk_', 'ty_', 'sp_', 'hg_', 'bt_', 'el_', 'cl_', 'fb_'];
    if (LOCAL_PREFIXES.some((pfx) => String(id).startsWith(pfx))) {
      const found = FALLBACK_PRODUCTS.find((p) => p._id === id);
      if (found) return found;
      return rejectWithValue('Product not found');
    }

    // DummyJSON product
    if (String(id).startsWith('dj_')) {
      try {
        return await fetchDummyProductById(id);
      } catch {
        return rejectWithValue('Product not found');
      }
    }

    // MongoDB product (admin-created)
    try {
      const res = await api.get(`/products/${id}`);
      return res.data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Product not found');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const productSlice = createSlice({
  name: 'products',
  initialState: {
    allProducts: [],   // full catalog cache
    products: [],      // current page
    featured: [],
    product: null,
    loading: false,
    catalogLoading: false,
    error: null,
    page: 1,
    pages: 1,
    total: 0,
  },
  reducers: {
    clearProduct: (state) => { state.product = null; },
  },
  extraReducers: (builder) => {
    builder
      // loadCatalog
      .addCase(loadCatalog.pending, (state) => { state.catalogLoading = true; })
      .addCase(loadCatalog.fulfilled, (state, action) => {
        state.catalogLoading = false;
        state.allProducts = action.payload;
      })
      .addCase(loadCatalog.rejected, (state) => {
        state.catalogLoading = false;
        state.allProducts = FALLBACK_PRODUCTS;
      })

      // fetchProducts
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.products = FALLBACK_PRODUCTS.slice(0, 20);
        state.total = FALLBACK_PRODUCTS.length;
        state.pages = 1;
      })

      // fetchFeaturedProducts
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featured = action.payload;
      })

      // fetchProductById
      .addCase(fetchProductById.pending, (state) => { state.loading = true; state.product = null; })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Admin CRUD
      .addCase(createProduct.pending, (state) => { state.loading = true; })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.allProducts.unshift(action.payload);
        state.products.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload || 'Failed to create product');
      })
      .addCase(updateProduct.pending, (state) => { state.loading = true; })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const update = (arr) => {
          const idx = arr.findIndex((p) => p._id === action.payload._id);
          if (idx !== -1) arr[idx] = action.payload;
        };
        update(state.products);
        update(state.allProducts);
        state.product = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload || 'Failed to update product');
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
        state.allProducts = state.allProducts.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        toast.error(action.payload || 'Failed to delete product');
      });
  },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;
