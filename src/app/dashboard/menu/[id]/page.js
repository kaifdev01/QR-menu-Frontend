'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import { Plus, Edit, Trash2, Upload, X, ArrowLeft, MoreVertical, Palette } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { fetchWithAuth, buildUrl } from '@/lib/apiConfig';
import API_CONFIG from '@/lib/apiConfig';
import BulkOperationsModal from '@/components/BulkOperationsModal';

export default function MenuEditorPage() {
  const [menu, setMenu] = useState(null);
  const [items, setItems] = useState([]);
  const [allMenus, setAllMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Appetizers',
    image: ''
  });
  const router = useRouter();
  const params = useParams();

  const categories = ['Appetizers', 'Main Course', 'Desserts', 'Drinks', 'Other'];

  const getFilteredAndSortedItems = () => {
    let filtered = items;

    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterCategory !== 'All') {
      filtered = filtered.filter(item => item.category === filterCategory);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'price-low') {
        return parseFloat(a.price) - parseFloat(b.price);
      } else if (sortBy === 'price-high') {
        return parseFloat(b.price) - parseFloat(a.price);
      }
      return 0;
    });

    return filtered;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    } else {
      fetchMenu();
      fetchAllMenus();
    }
  }, [params.id]);

  const fetchMenu = async () => {
    try {
      const response = await fetchWithAuth(API_CONFIG.ENDPOINTS.MENU.GET(params.id));
      const data = await response.json();
      if (data.success) {
        setMenu(data.menu);
        setItems(data.menu.items || []);
      } else {
        toast.error('Menu not found');
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllMenus = async () => {
    try {
      const response = await fetchWithAuth(API_CONFIG.ENDPOINTS.MENU.LIST);
      const data = await response.json();
      if (data.success) {
        setAllMenus(data.menus || []);
      }
    } catch (error) {
      console.error('Failed to fetch menus');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildUrl(API_CONFIG.ENDPOINTS.UPLOAD.IMAGE), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setItemForm({ ...itemForm, image: data.imageUrl });
        toast.success('Image uploaded!');
      } else {
        toast.error('Upload failed');
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingItem
        ? API_CONFIG.ENDPOINTS.MENU.UPDATE_ITEM(editingItem._id)
        : API_CONFIG.ENDPOINTS.MENU.ADD_ITEM(params.id);
      
      const response = await fetchWithAuth(url, {
        method: editingItem ? 'PUT' : 'POST',
        body: JSON.stringify(itemForm)
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingItem ? 'Item updated!' : 'Item added!');
        setShowItemModal(false);
        setEditingItem(null);
        setItemForm({ name: '', description: '', price: '', category: 'Appetizers', image: '' });
        fetchMenu();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category,
      image: item.image || ''
    });
    setShowItemModal(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm('Delete this item?')) return;

    try {
      const response = await fetchWithAuth(API_CONFIG.ENDPOINTS.MENU.DELETE_ITEM(itemId), {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Item deleted');
        fetchMenu();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) {
      toast.error('Select items to delete');
      return;
    }

    if (!confirm(`Delete ${selectedItems.size} items?`)) return;

    setLoading(true);
    try {
      const response = await fetchWithAuth(API_CONFIG.ENDPOINTS.MENU.BULK_DELETE, {
        method: 'POST',
        body: JSON.stringify({ itemIds: Array.from(selectedItems) })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Deleted ${selectedItems.size} items`);
        setSelectedItems(new Set());
        fetchMenu();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to delete items');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{menu?.name}</h1>
            <p className="text-gray-600">{menu?.restaurantName}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Menu Items ({getFilteredAndSortedItems().length})</h2>
              <div className="flex gap-2 flex-wrap">
                {selectedItems.size > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-all font-semibold"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete {selectedItems.size}
                  </button>
                )}
                <Link
                  href={`/dashboard/menu/${params.id}/customize`}
                  className="flex items-center gap-2 bg-purple-50 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-100 transition-all font-semibold"
                >
                  <Palette className="w-5 h-5" />
                  Customize
                </Link>
                <button
                  onClick={() => setShowBulkModal(true)}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all font-semibold"
                >
                  <MoreVertical className="w-5 h-5" />
                  Bulk Ops
                </button>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setItemForm({ name: '', description: '', price: '', category: 'Appetizers', image: '' });
                    setShowItemModal(true);
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Add Item
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Sort by Name (A-Z)</option>
                <option value="price-low">Sort by Price (Low to High)</option>
                <option value="price-high">Sort by Price (High to Low)</option>
              </select>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No items yet. Add your first menu item!</p>
              <button
                onClick={() => setShowItemModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                Add Item
              </button>
            </div>
          ) : getFilteredAndSortedItems().length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No items match your search or filters.</p>
            </div>
          ) : filterCategory === 'All' ? (
            <div className="space-y-8">
              {categories.map((category) => {
                const categoryItems = getFilteredAndSortedItems().filter(item => item.category === category);
                if (!categoryItems || categoryItems.length === 0) return null;

                return (
                  <div key={category}>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">{category}</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryItems.map((item) => (
                        <div key={item._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                          )}
                          <div className="flex items-start gap-3 mb-3">
                            <input
                              type="checkbox"
                              checked={selectedItems.has(item._id)}
                              onChange={(e) => {
                                const newSelected = new Set(selectedItems);
                                if (e.target.checked) {
                                  newSelected.add(item._id);
                                } else {
                                  newSelected.delete(item._id);
                                }
                                setSelectedItems(newSelected);
                              }}
                              className="w-4 h-4 rounded cursor-pointer mt-1"
                            />
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                              <p className="text-lg font-bold text-blue-600">${item.price}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditItem(item)}
                              className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm font-semibold hover:bg-blue-100 transition-all"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item._id)}
                              className="flex items-center justify-center bg-red-50 text-red-600 px-3 py-2 rounded hover:bg-red-100 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredAndSortedItems().map((item) => (
                <div key={item._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                  )}
                  <div className="flex items-start gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item._id)}
                      onChange={(e) => {
                        const newSelected = new Set(selectedItems);
                        if (e.target.checked) {
                          newSelected.add(item._id);
                        } else {
                          newSelected.delete(item._id);
                        }
                        setSelectedItems(newSelected);
                      }}
                      className="w-4 h-4 rounded cursor-pointer mt-1"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <p className="text-lg font-bold text-blue-600">${item.price}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm font-semibold hover:bg-blue-100 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item._id)}
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

        <BulkOperationsModal
          isOpen={showBulkModal}
          onClose={() => setShowBulkModal(false)}
          menuId={params.id}
          allMenus={allMenus.filter(m => (m._id || m.id) !== params.id)}
          onRefresh={fetchMenu}
        />

        {showItemModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{editingItem ? 'Edit Item' : 'Add Item'}</h2>
                <button onClick={() => setShowItemModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSaveItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name</label>
                  <input
                    type="text"
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    placeholder="e.g., Margherita Pizza"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={itemForm.description}
                    onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                    placeholder="Brief description"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                    placeholder="9.99"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    value={itemForm.category}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Image</label>
                  {itemForm.image && (
                    <img src={itemForm.image} alt="Preview" className="w-full h-32 object-cover rounded-lg mb-2" />
                  )}
                  <label className="flex items-center justify-center gap-2 w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-all">
                    <Upload className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-600">{uploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowItemModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
