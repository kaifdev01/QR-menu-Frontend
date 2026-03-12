'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { QrCode, Menu, Plus, Edit, Trash2, Eye, Power } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/apiConfig';
import API_CONFIG from '@/lib/apiConfig';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [newMenu, setNewMenu] = useState({ name: '', description: '', restaurantName: '' });
  const [creating, setCreating] = useState(false);
  const [togglingMenu, setTogglingMenu] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
    } else {
      setUser(JSON.parse(userData));
      fetchRestaurantInfo();
      fetchMenus();
    }
  }, [router]);

  const fetchRestaurantInfo = async () => {
    try {
      const response = await fetchWithAuth(API_CONFIG.ENDPOINTS.RESTAURANT.INFO);
      const data = await response.json();
      if (data.success) {
        setRestaurantInfo(data.restaurant);
        setNewMenu(prev => ({ ...prev, restaurantName: data.restaurant.name }));
      }
    } catch (error) {
      console.error('Fetch restaurant info error:', error);
    }
  };

  const fetchMenus = async () => {
    try {
      const response = await fetchWithAuth(API_CONFIG.ENDPOINTS.MENU.LIST);
      const data = await response.json();
      if (data.success) {
        setMenus(data.menus);
      }
    } catch (error) {
      console.error('Fetch menus error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMenu = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await fetchWithAuth(API_CONFIG.ENDPOINTS.MENU.CREATE, {
        method: 'POST',
        body: JSON.stringify(newMenu)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Menu created successfully!');
        setShowCreateModal(false);
        setNewMenu({ name: '', description: '', restaurantName: '' });
        fetchMenus();
      } else {
        toast.error(data.message || 'Failed to create menu');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteMenu = async (menuId) => {
    if (!confirm('Are you sure you want to delete this menu?')) return;

    try {
      const response = await fetchWithAuth(API_CONFIG.ENDPOINTS.MENU.DELETE(menuId), {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Menu deleted successfully');
        fetchMenus();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to delete menu');
    }
  };

  const handleToggleActive = async (menuId, currentStatus) => {
    setTogglingMenu(menuId);
    try {
      const response = await fetchWithAuth(API_CONFIG.ENDPOINTS.MENU.UPDATE(menuId), {
        method: 'PUT',
        body: JSON.stringify({ isActive: !currentStatus })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Menu ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        fetchMenus();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to update menu status');
    } finally {
      setTogglingMenu(null);
    }
  };

  const downloadQRCode = (qrCodeUrl, menuName) => {
    setSelectedQR({ url: qrCodeUrl, name: menuName });
    setShowQRModal(true);
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = selectedQR.url;
    link.download = `${selectedQR.name}-qr-code.png`;
    link.click();
    toast.success('QR Code downloaded!');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600">Manage your QR menus and track performance.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Menu className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{menus.length}</h3>
            <p className="text-sm text-gray-600">Total Menus</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <QrCode className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{menus.reduce((acc, m) => acc + m.itemCount, 0)}</h3>
            <p className="text-sm text-gray-600">Total Items</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">0</h3>
            <p className="text-sm text-gray-600">Total Views</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Power className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{menus.filter(m => m.isActive).length}</h3>
            <p className="text-sm text-gray-600">Active Menus</p>
          </div>
        </div>

        {/* Menus List */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Menus</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Menu
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : menus.length === 0 ? (
            <div className="text-center py-12">
              <Menu className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No menus yet</h3>
              <p className="text-gray-600 mb-4">Create your first menu to get started</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                Create Menu
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menus.map((menu) => (
                <div key={menu.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{menu.name}</h3>
                      <p className="text-sm text-gray-600">{menu.restaurantName}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ml-2 ${menu.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {menu.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{menu.itemCount} items</p>

                  <Link
                    href={`/menu/${menu.uniqueUrl}`}
                    target="_blank"
                    className="w-full flex items-center justify-center gap-1 bg-green-50 text-green-600 px-3 py-2 rounded text-sm font-semibold hover:bg-green-100 transition-all mb-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview Menu
                  </Link>

                  <div className="flex gap-2 mb-2">
                    <Link
                      href={`/dashboard/menu/${menu.id}`}
                      className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm font-semibold hover:bg-blue-100 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => downloadQRCode(menu.qrCodeUrl, menu.name)}
                      className="flex-1 flex items-center justify-center gap-1 bg-purple-50 text-purple-600 px-3 py-2 rounded text-sm font-semibold hover:bg-purple-100 transition-all"
                    >
                      <QrCode className="w-4 h-4" />
                      QR
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(menu.id, menu.isActive)}
                      disabled={togglingMenu === menu.id}
                      className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded text-sm font-semibold transition-all disabled:opacity-50 ${
                        menu.isActive
                          ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      <Power className="w-4 h-4" />
                      {menu.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteMenu(menu.id)}
                      className="flex items-center justify-center bg-red-50 text-red-600 px-3 py-2 rounded hover:bg-red-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Menu Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Menu</h2>
              <form onSubmit={handleCreateMenu} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Menu Name</label>
                  <input
                    type="text"
                    value={newMenu.name}
                    onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
                    placeholder="e.g., Dinner Menu"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Restaurant Name</label>
                  <input
                    type="text"
                    value={newMenu.restaurantName}
                    onChange={(e) => setNewMenu({ ...newMenu, restaurantName: e.target.value })}
                    placeholder="e.g., The Italian Kitchen"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
                  <textarea
                    value={newMenu.description}
                    onChange={(e) => setNewMenu({ ...newMenu, description: e.target.value })}
                    placeholder="Brief description of your menu"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {creating ? 'Creating...' : 'Create Menu'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* QR Code Modal */}
        {showQRModal && selectedQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">QR Code Generated!</h2>
              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                <img src={selectedQR.url} alt="QR Code" className="w-full max-w-xs mx-auto" />
              </div>
              <p className="text-center text-gray-600 mb-4">
                Scan this QR code to view your menu
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowQRModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Close
                </button>
                <button
                  onClick={handleDownloadQR}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  Download QR Code
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
