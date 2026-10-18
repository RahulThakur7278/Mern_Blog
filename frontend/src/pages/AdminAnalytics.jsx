import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // <-- 1. IMPORT PORTAL
import api from '../utils/axios';

// --------------------
// DELETE CONFIRMATION MODAL
// --------------------
const DeleteUserModal = ({ isOpen, userName, onConfirm, onCancel, loading }) => {
  if (!isOpen) return null;

  // 2. WRAP IN createPortal AND TELEPORT TO document.body
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xl animate-fade-in">
      <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-sm animate-scale-in shadow-2xl">
        <div className="w-12 h-12 mx-auto mb-4 bg-rose-50 rounded-full flex items-center justify-center">
          <span className="text-2xl">⚠</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 text-center mb-2">
          Delete User?
        </h3>
        <p className="text-sm text-slate-500 text-center mb-6">
          Are you sure you want to delete "<span className="font-medium text-slate-700">{userName}</span>"? 
          This will also remove all of their posts. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-lg border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 active:scale-[0.98] disabled:opacity-50 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-lg bg-rose-600 text-white font-medium text-sm hover:bg-rose-700 active:scale-[0.98] disabled:opacity-50 transition-all duration-200 min-h-[44px]"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>,
    document.body // <-- 3. TELLS REACT WHERE TO PUT IT
  );
};

// --------------------
// ADMIN ANALYTICS COMPONENT
// --------------------
const AdminAnalytics = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalPosts: 0, totalComments: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/api/admin/dashboard'),
          api.get('/api/admin/users')
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error('Fetch analytics error:', err);
        setError('Could not load analytics data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --------------------
  // DELETE HANDLERS
  // --------------------
  const openDeleteModal = (user) => {
    setDeleteModal({ isOpen: true, user });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, user: null });
  };

  const handleDeleteUser = async () => {
    const userId = deleteModal.user?._id;
    if (!userId) return;

    try {
      setDeletingId(userId);
      
      // Call API to delete
      await api.delete(`/api/admin/users/${userId}`);
      
      // Remove from list and update stats instantly without re-fetching
      setUsers(users.filter((u) => u._id !== userId));
      setStats((prev) => ({ 
        ...prev, 
        totalUsers: prev.totalUsers - 1 
      }));
      
      closeDeleteModal();
    } catch (err) {
      console.error('Delete user error:', err);
      alert(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500">Loading analytics...</div>;
  if (error) return <div className="text-center py-20 text-rose-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 animate-fade-in">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
          Analytics & Users
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Overview of platform activity and registered users
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl">👥</div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Users</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.totalUsers}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-xl">📝</div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Posts</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.totalPosts}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center text-xl">💬</div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Comments</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.totalComments}</h3>
          </div>
        </div>
      </div>

      {/* User List Table */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight mb-4">Registered Users</h2>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-medium">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-center">Total Posts</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${user.role === 'admin' 
                            ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                            : 'bg-slate-100 text-slate-600 border border-slate-200'}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-indigo-600">{user.postCount}</td>
                      <td className="px-6 py-4">
                        {new Date(user.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openDeleteModal(user)}
                          disabled={deletingId === user._id}
                          className="px-4 py-2 text-sm font-medium text-rose-600 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 active:scale-[0.98] disabled:opacity-50 transition-all duration-200 min-h-[36px]"
                        >
                          {deletingId === user._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete User Modal (Now rendered via Portal outside of PageTransition) */}
      <DeleteUserModal
        isOpen={deleteModal.isOpen}
        userName={deleteModal.user?.name || ''}
        onConfirm={handleDeleteUser}
        onCancel={closeDeleteModal}
        loading={deletingId !== null}
      />
    </div>
  );
};

export default AdminAnalytics;