import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { login } from '../../slices/authSlice';
import Spinner from '../../components/common/Spinner';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="font-display font-bold text-2xl text-gray-900 dark:text-white">
              Shop<span className="text-primary-500">Nest</span>
            </span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h1>
          <p className="text-gray-500 dark:text-gray-400">Sign in to your account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  placeholder="you@example.com"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  required
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? <Spinner size="sm" color="white" /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-dark-border">
            <p className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-500 font-semibold hover:text-primary-600">Create one</Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-xs text-blue-700 dark:text-blue-300">
            <p className="font-semibold mb-1">Demo Credentials:</p>
            <p>User: john@example.com / user123</p>
            <p>Admin: admin@shopNest.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
