'use client';
import { useState } from 'react';
import { X, Upload, Copy, Trash2, Download, Files } from 'lucide-react';
import toast from 'react-hot-toast';
import { downloadSampleCSV, parseCSV } from '@/lib/csvUtils';
import { fetchWithAuth, buildUrl } from '@/lib/apiConfig';
import API_CONFIG from '@/lib/apiConfig';

export default function BulkOperationsModal({ isOpen, onClose, menuId, allMenus, onRefresh }) {
  const [activeTab, setActiveTab] = useState('csv');
  const [uploading, setUploading] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [sourceMenuId, setSourceMenuId] = useState('');
  const [sourceMenuItems, setSourceMenuItems] = useState([]);
  const [loadingSourceMenu, setLoadingSourceMenu] = useState(false);
  const [showDuplicateNameModal, setShowDuplicateNameModal] = useState(false);
  const [duplicateMenuName, setDuplicateMenuName] = useState('');

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const items = await parseCSV(file);
      
      const response = await fetchWithAuth(API_CONFIG.ENDPOINTS.MENU.BULK_ADD(menuId), {
        method: 'POST',
        body: JSON.stringify({ items })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Added ${items.length} items!`);
        onRefresh();
        onClose();
      } else {
        toast.error(data.message || 'Failed to add items');
      }
    } catch (error) {
      toast.error(error.message || 'CSV upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleLoadSourceMenu = async (id) => {
    if (!id) return;
    setLoadingSourceMenu(true);
    setSourceMenuItems([]);
    try {
      const response = await fetchWithAuth(API_CONFIG.ENDPOINTS.MENU.GET(id));
      const data = await response.json();
      if (data.success) {
        const items = data.menu.items || [];
        setSourceMenuItems(items);
        setSelectedItems(new Set());
        if (items.length === 0) {
          toast.error('This menu has no items');
        }
      } else {
        toast.error('Failed to load menu');
      }
    } catch (error) {
      toast.error('Failed to load menu');
    } finally {
      setLoadingSourceMenu(false);
    }
  };

  const handleCopyItems = async () => {
    if (selectedItems.size === 0) {
      toast.error('Select at least one item');
      return;
    }

    setUploading(true);
    try {
      const itemsToCopy = sourceMenuItems.filter(item => selectedItems.has(item._id));
      
      const response = await fetchWithAuth(API_CONFIG.ENDPOINTS.MENU.BULK_ADD(menuId), {
        method: 'POST',
        body: JSON.stringify({ items: itemsToCopy })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Copied ${itemsToCopy.length} items!`);
        onRefresh();
        onClose();
      } else {
        toast.error(data.message || 'Failed to copy items');
      }
    } catch (error) {
      toast.error('Failed to copy items');
    } finally {
      setUploading(false);
    }
  };

  const handleDuplicateMenu = async () => {
    setUploading(true);
    try {
      const response = await fetchWithAuth(API_CONFIG.ENDPOINTS.MENU.DUPLICATE(menuId), {
        method: 'POST',
        body: JSON.stringify({ name: duplicateMenuName || undefined })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Menu duplicated!');
        setShowDuplicateNameModal(false);
        setDuplicateMenuName('');
        onRefresh();
        onClose();
      } else {
        toast.error(data.message || 'Failed to duplicate menu');
      }
    } catch (error) {
      toast.error('Failed to duplicate menu');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Bulk Operations</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('csv')}
            className={`px-4 py-2 font-semibold transition-all ${
              activeTab === 'csv'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            CSV Upload
          </button>
          <button
            onClick={() => setActiveTab('copy')}
            className={`px-4 py-2 font-semibold transition-all ${
              activeTab === 'copy'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Copy Items
          </button>
          <button
            onClick={() => setActiveTab('duplicate')}
            className={`px-4 py-2 font-semibold transition-all ${
              activeTab === 'duplicate'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Duplicate Menu
          </button>
        </div>

        {/* CSV Upload Tab */}
        {activeTab === 'csv' && (
          <div className="space-y-4">
            <p className="text-gray-600">Upload a CSV file with menu items. Download the sample to see the format.</p>
            
            <button
              onClick={downloadSampleCSV}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            >
              <Download className="w-5 h-5" />
              Download Sample CSV
            </button>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <label className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-600 font-semibold">Click to upload CSV</span>
                  <span className="text-sm text-gray-500">or drag and drop</span>
                </div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>CSV Format:</strong> name, description, price, category
              </p>
              <p className="text-sm text-blue-800 mt-2">
                Required columns: name, price, category. Description is optional.
              </p>
            </div>
          </div>
        )}

        {/* Copy Items Tab */}
        {activeTab === 'copy' && (
          <div className="space-y-4">
            {allMenus && allMenus.length > 0 ? (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Select Source Menu</label>
                  <select
                    value={sourceMenuId}
                    onChange={(e) => {
                      setSourceMenuId(e.target.value);
                      if (e.target.value) handleLoadSourceMenu(e.target.value);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option key="empty" value="">Choose a menu...</option>
                    {allMenus.map(menu => (
                      <option key={menu._id || menu.id} value={menu._id || menu.id}>
                        {menu.name}
                      </option>
                    ))}
                  </select>
                </div>

                {loadingSourceMenu && (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                )}

                {sourceMenuItems.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-semibold text-gray-700">
                        Select Items ({selectedItems.size}/{sourceMenuItems.length})
                      </label>
                      <button
                        onClick={() => {
                          if (selectedItems.size === sourceMenuItems.length) {
                            setSelectedItems(new Set());
                          } else {
                            setSelectedItems(new Set(sourceMenuItems.map(item => item._id)));
                          }
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        {selectedItems.size === sourceMenuItems.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                      {sourceMenuItems.map(item => (
                        <label key={item._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
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
                            className="w-4 h-4 rounded"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">${item.price} • {item.category}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {sourceMenuId && sourceMenuItems.length === 0 && !loadingSourceMenu && (
                  <p className="text-gray-600 text-center py-4">No items in this menu</p>
                )}
              </>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-900">
                  <strong>No other menus available.</strong> Create another menu first to copy items from it.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Duplicate Menu Tab */}
        {activeTab === 'duplicate' && (
          <div className="space-y-4">
            <p className="text-gray-600">Create a complete copy of this menu with all items.</p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-900">
                <strong>Note:</strong> The duplicated menu will be named "[Original Name] - Copy" and will be inactive by default.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-6 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-semibold"
          >
            Cancel
          </button>
          {activeTab === 'csv' && (
            <label className="flex-1">
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                disabled={uploading}
                className="hidden"
              />
              <button
                disabled={uploading}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-semibold"
              >
                {uploading ? 'Uploading...' : 'Upload CSV'}
              </button>
            </label>
          )}
          {activeTab === 'copy' && (
            <button
              onClick={handleCopyItems}
              disabled={uploading || selectedItems.size === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-semibold"
            >
              <Copy className="w-5 h-5" />
              Copy {selectedItems.size} Items
            </button>
          )}
          {activeTab === 'duplicate' && (
            <button
              onClick={() => setShowDuplicateNameModal(true)}
              disabled={uploading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-semibold"
            >
              <Files className="w-5 h-5" />
              Duplicate Menu
            </button>
          )}
        </div>
      </div>

      {/* Duplicate Menu Name Modal */}
      {showDuplicateNameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Duplicate Menu</h2>
              <button onClick={() => setShowDuplicateNameModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Menu Name</label>
                <input
                  type="text"
                  value={duplicateMenuName}
                  onChange={(e) => setDuplicateMenuName(e.target.value)}
                  placeholder="e.g., My Menu - Copy"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to use default name</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  All items and images will be copied to the new menu.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDuplicateNameModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDuplicateMenu}
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-semibold"
              >
                {uploading ? 'Duplicating...' : 'Duplicate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
