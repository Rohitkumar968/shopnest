import { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiSave, FiCamera } from 'react-icons/fi';
import { updateProfile, uploadAvatar } from '../../slices/authSlice';
import Spinner from '../../components/common/Spinner';

const makeInitialsAvatar = (name) => {
  const initials = (name || 'U')
    .split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f97316';
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, 32, 33);
    return canvas.toDataURL();
  } catch { return ''; }
};

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((s) => s.auth);
  const fileInputRef = useRef(null);

  // Avatar: use uploaded URL if present, else initials
  const savedAvatarSrc = useMemo(() => {
    const url = (user?.avatar?.url || '').trim();
    return url || makeInitialsAvatar(user?.name);
  }, [user?.avatar?.url, user?.name]);

  // Local preview while uploading
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Reset preview when saved avatar changes (upload confirmed)
  useEffect(() => { setAvatarPreview(null); }, [user?.avatar?.url]);

  const displayAvatar = avatarPreview || savedAvatarSrc;

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type and size (max 5 MB)
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5 MB');
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target.result; // data:image/...;base64,...
      setAvatarPreview(base64);
      setAvatarUploading(true);
      try {
        await dispatch(uploadAvatar(base64)).unwrap();
        // savedAvatarSrc will update from Redux; preview cleared by useEffect above
      } catch {
        setAvatarPreview(null); // revert preview on failure
      } finally {
        setAvatarUploading(false);
        // Reset file input so same file can be re-selected
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || '',
    },
  });

  const [passForm, setPassForm] = useState({ currentPassword: '', password: '', confirmPassword: '' });
  const [passError, setPassError] = useState('');

  // Re-sync form fields only when the logged-in user identity changes
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || '',
        },
      });
    }
  }, [user?._id]);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  const setAddr = (f) => (e) => setForm((p) => ({ ...p, address: { ...p.address, [f]: e.target.value } }));
  const setPass = (f) => (e) => setPassForm((p) => ({ ...p, [f]: e.target.value }));

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile({ name: form.name, email: form.email, phone: form.phone, address: form.address }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassError('');
    if (!passForm.currentPassword) return setPassError('Please enter your current password');
    if (!passForm.password) return setPassError('Please enter a new password');
    if (passForm.password.length < 6) return setPassError('New password must be at least 6 characters');
    if (passForm.password !== passForm.confirmPassword) return setPassError('New passwords do not match');
    const result = await dispatch(updateProfile({
      currentPassword: passForm.currentPassword,
      password: passForm.password,
    }));
    if (!result.error) setPassForm({ currentPassword: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="container-custom py-8 max-w-3xl animate-fade-in">
      <h1 className="section-title mb-6">Profile Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Avatar card */}
        <div className="md:col-span-1">
          <div className="card p-5 text-center">
            {/* Avatar with upload overlay */}
            <div className="relative w-20 h-20 mx-auto mb-3">
              <img
                src={displayAvatar}
                alt={user?.name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-primary-500/20"
              />
              {/* Camera overlay button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity disabled:cursor-wait"
                title="Change profile picture"
              >
                {avatarUploading
                  ? <Spinner size="sm" color="white" />
                  : <FiCamera size={18} className="text-white" />
                }
              </button>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="text-xs text-primary-500 hover:text-primary-600 font-medium mb-3 block w-full disabled:opacity-50"
            >
              {avatarUploading ? 'Uploading...' : 'Change Photo'}
            </button>

            <p className="font-semibold text-gray-900 dark:text-white text-sm">{user?.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
            <span className="badge mt-2 capitalize bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Forms */}
        <div className="md:col-span-3 space-y-5">
          {/* Personal Info + Address */}
          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiUser size={15} className="text-primary-500" /> Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Full Name</label>
                  <input value={form.name} onChange={set('name')} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input type="email" value={form.email} onChange={set('email')} className="input-field pl-9" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Phone</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input value={form.phone} onChange={set('phone')} className="input-field pl-9" placeholder="+91 98765 43210" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiMapPin size={15} className="text-primary-500" /> Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Street</label>
                  <input value={form.address.street} onChange={setAddr('street')} className="input-field" placeholder="123 Main St" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">City</label>
                  <input value={form.address.city} onChange={setAddr('city')} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">State</label>
                  <input value={form.address.state} onChange={setAddr('state')} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">ZIP Code</label>
                  <input value={form.address.zipCode} onChange={setAddr('zipCode')} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Country</label>
                  <input value={form.address.country} onChange={setAddr('country')} className="input-field" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? <Spinner size="sm" color="white" /> : <><FiSave size={16} /> Save Profile</>}
            </button>
          </form>

          {/* Password — separate form */}
          <form onSubmit={handlePasswordSubmit} className="card p-5">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiLock size={15} className="text-primary-500" /> Change Password
            </h2>
            {passError && <p className="text-red-500 text-sm mb-3">{passError}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Current Password</label>
                <input type="password" value={passForm.currentPassword} onChange={setPass('currentPassword')} className="input-field" placeholder="••••••" autoComplete="current-password" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">New Password</label>
                <input type="password" value={passForm.password} onChange={setPass('password')} className="input-field" placeholder="••••••" autoComplete="new-password" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Confirm New</label>
                <input type="password" value={passForm.confirmPassword} onChange={setPass('confirmPassword')} className="input-field" placeholder="••••••" autoComplete="new-password" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary py-2.5">
              {loading ? <Spinner size="sm" color="white" /> : <><FiLock size={15} /> Update Password</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
