import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { register } from '../../slices/authSlice';
import Spinner from '../../components/common/Spinner';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    dispatch(register({ name: form.name, email: form.email, password: form.password }));
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

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
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400">Join ShopNest today</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" value={form.name} onChange={set('name')} required placeholder="John Doe" className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="email" value={form.email} onChange={set('email')} required placeholder="you@example.com" className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  required
                  placeholder="Min. 6 characters"
                  className="input-field pl-10 pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} required placeholder="Repeat your password" className="input-field pl-10" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? <Spinner size="sm" color="white" /> : 'Create Account'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-100 dark:border-dark-border">
            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 font-semibold hover:text-primary-600">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
