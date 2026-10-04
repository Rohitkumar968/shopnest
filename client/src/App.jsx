import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';

// Public Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// User Pages
import CartPage from './pages/user/CartPage';
import CheckoutPage from './pages/user/CheckoutPage';
import OrderSuccessPage from './pages/user/OrderSuccessPage';
import OrderHistoryPage from './pages/user/OrderHistoryPage';
import OrderDetailPage from './pages/user/OrderDetailPage';
import ProfilePage from './pages/user/ProfilePage';
import WishlistPage from './pages/user/WishlistPage';

// Admin Pages
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: '12px', fontFamily: 'Plus Jakarta Sans, sans-serif' },
          success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Public routes with main layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          {/* Protected user routes */}
          <Route element={<PrivateRoute />}>
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order-success/:id" element={<OrderSuccessPage />} />
            <Route path="orders" element={<OrderHistoryPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="wishlist" element={<WishlistPage />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/:id/edit" element={<AdminProductForm />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
