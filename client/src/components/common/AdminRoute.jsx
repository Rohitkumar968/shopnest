import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const { user, loading } = useSelector((state) => state.auth);

  // While auth is initializing, don't redirect yet
  if (loading) return null;

  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
