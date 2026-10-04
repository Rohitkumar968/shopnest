import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiTrash2, FiSearch, FiShield, FiUser } from 'react-icons/fi';
import api from '../../services/api';
import { PageLoader } from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const { user: currentUser } = useSelector((s) => s.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/users?page=${page}&limit=15`);
      setUsers(res.data.users);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    setUpdatingId(userId);
    try {
      await api.put(`/users/${userId}`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      toast.success(`Role updated to ${newRole}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setTotal((t) => t - 1);
      setDeleteConfirm(null);
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">Users</h2>
          <p className="text-sm text-gray-500 mt-0.5">{total} registered users</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="input-field pl-9 text-sm py-2"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <PageLoader />
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FiUser size={40} className="mx-auto mb-3 opacity-40" />
            <p>No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-dark-bg text-left text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">Email</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium hidden lg:table-cell">Joined</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 md:hidden truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-gray-500">{user.email}</td>
                    <td className="px-5 py-3">
                      <span className={`badge ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-dark-surface dark:text-gray-400'
                      }`}>
                        {user.role === 'admin' ? (
                          <><FiShield size={10} className="mr-1" />Admin</>
                        ) : (
                          <><FiUser size={10} className="mr-1" />User</>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell text-gray-500 text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {user._id !== currentUser?._id ? (
                          <>
                            <button
                              onClick={() => handleRoleToggle(user._id, user.role)}
                              disabled={updatingId === user._id}
                              className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                                user.role === 'admin'
                                  ? 'bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                                  : 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 hover:bg-purple-100'
                              }`}
                            >
                              {updatingId === user._id ? '...' : user.role === 'admin' ? 'Make User' : 'Make Admin'}
                            </button>

                            {user.role !== 'admin' && (
                              <button
                                onClick={() => setDeleteConfirm(user._id)}
                                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <FiTrash2 size={15} />
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 italic">You</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination page={currentPage} pages={pages} onPageChange={setCurrentPage} />

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative card p-6 max-w-sm w-full animate-slide-up">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Delete User?</h3>
            <p className="text-gray-500 text-sm mb-5">
              This will permanently delete the user and all associated data. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1 py-2 text-sm">
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2 text-sm bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
