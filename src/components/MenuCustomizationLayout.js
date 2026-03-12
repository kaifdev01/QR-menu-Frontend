'use client';
import { useState, useEffect } from 'react';
import { Upload, X, Palette, Type, Settings, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchWithAuth, buildUrl } from '@/lib/apiConfig';
import API_CONFIG from '@/lib/apiConfig';
import Image from 'next/image';

const FONTS = [
  { id: 'inter', name: 'Inter' },
  { id: 'poppins', name: 'Poppins' },
  { id: 'playfair', name: 'Playfair' },
  { id: 'montserrat', name: 'Montserrat' },
  { id: 'roboto', name: 'Roboto' },
  { id: 'raleway', name: 'Raleway' },
  { id: 'nunito', name: 'Nunito' },
  { id: 'crimson', name: 'Crimson Text' }
];

// Predefined color palettes for restaurants
const COLOR_PALETTES = [
  {
    id: 'elegant-gold',
    name: 'Elegant Gold',
    description: 'Luxury dining experience',
    colors: {
      topBarBgColor: '#1a1a1a',
      topBarSecondaryColor: '#d4af37',
      headingColor: '#1a1a1a',
      bodyTextColor: '#4B5563',
      itemBgColor: '#FFFFFF',
      itemBorderColor: '#E5E7EB',
      accentColor: '#d4af37',
      backgroundColor: '#F9FAFB',
      buttonBgColor: '#1a1a1a',
      buttonTextColor: '#FFFFFF',
      categoryActiveBgColor: '#1a1a1a',
      categoryActiveTextColor: '#d4af37',
      categoryInactiveBgColor: '#F3F4F6',
      categoryInactiveTextColor: '#374151'
    }
  },
  {
    id: 'vibrant-orange',
    name: 'Vibrant Orange',
    description: 'Energetic & appetizing',
    colors: {
      topBarBgColor: '#FF6B35',
      topBarSecondaryColor: '#F7931E',
      headingColor: '#1a1a1a',
      bodyTextColor: '#4B5563',
      itemBgColor: '#FFFFFF',
      itemBorderColor: '#FFE5D9',
      accentColor: '#FF6B35',
      backgroundColor: '#FFF8F3',
      buttonBgColor: '#FF6B35',
      buttonTextColor: '#FFFFFF',
      categoryActiveBgColor: '#FF6B35',
      categoryActiveTextColor: '#FFFFFF',
      categoryInactiveBgColor: '#FFE5D9',
      categoryInactiveTextColor: '#FF6B35'
    }
  },
  {
    id: 'fresh-green',
    name: 'Fresh Green',
    description: 'Healthy & organic',
    colors: {
      topBarBgColor: '#10B981',
      topBarSecondaryColor: '#059669',
      headingColor: '#1a1a1a',
      bodyTextColor: '#4B5563',
      itemBgColor: '#FFFFFF',
      itemBorderColor: '#D1FAE5',
      accentColor: '#10B981',
      backgroundColor: '#F0FDF4',
      buttonBgColor: '#10B981',
      buttonTextColor: '#FFFFFF',
      categoryActiveBgColor: '#10B981',
      categoryActiveTextColor: '#FFFFFF',
      categoryInactiveBgColor: '#D1FAE5',
      categoryInactiveTextColor: '#10B981'
    }
  },
  {
    id: 'deep-red',
    name: 'Deep Red',
    description: 'Bold & appetizing',
    colors: {
      topBarBgColor: '#DC2626',
      topBarSecondaryColor: '#991B1B',
      headingColor: '#1a1a1a',
      bodyTextColor: '#4B5563',
      itemBgColor: '#FFFFFF',
      itemBorderColor: '#FEE2E2',
      accentColor: '#DC2626',
      backgroundColor: '#FEF2F2',
      buttonBgColor: '#DC2626',
      buttonTextColor: '#FFFFFF',
      categoryActiveBgColor: '#DC2626',
      categoryActiveTextColor: '#FFFFFF',
      categoryInactiveBgColor: '#FEE2E2',
      categoryInactiveTextColor: '#DC2626'
    }
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Fresh & professional',
    colors: {
      topBarBgColor: '#0369A1',
      topBarSecondaryColor: '#0284C7',
      headingColor: '#1a1a1a',
      bodyTextColor: '#4B5563',
      itemBgColor: '#FFFFFF',
      itemBorderColor: '#E0F2FE',
      accentColor: '#0284C7',
      backgroundColor: '#F0F9FF',
      buttonBgColor: '#0369A1',
      buttonTextColor: '#FFFFFF',
      categoryActiveBgColor: '#0369A1',
      categoryActiveTextColor: '#FFFFFF',
      categoryInactiveBgColor: '#E0F2FE',
      categoryInactiveTextColor: '#0369A1'
    }
  },
  {
    id: 'purple-luxury',
    name: 'Purple Luxury',
    description: 'Premium & sophisticated',
    colors: {
      topBarBgColor: '#7C3AED',
      topBarSecondaryColor: '#A855F7',
      headingColor: '#1a1a1a',
      bodyTextColor: '#4B5563',
      itemBgColor: '#FFFFFF',
      itemBorderColor: '#EDE9FE',
      accentColor: '#7C3AED',
      backgroundColor: '#FAF5FF',
      buttonBgColor: '#7C3AED',
      buttonTextColor: '#FFFFFF',
      categoryActiveBgColor: '#7C3AED',
      categoryActiveTextColor: '#FFFFFF',
      categoryInactiveBgColor: '#EDE9FE',
      categoryInactiveTextColor: '#7C3AED'
    }
  },
  {
    id: 'warm-brown',
    name: 'Warm Brown',
    description: 'Cozy & welcoming',
    colors: {
      topBarBgColor: '#92400E',
      topBarSecondaryColor: '#B45309',
      headingColor: '#1a1a1a',
      bodyTextColor: '#4B5563',
      itemBgColor: '#FFFFFF',
      itemBorderColor: '#FEF3C7',
      accentColor: '#D97706',
      backgroundColor: '#FFFBEB',
      buttonBgColor: '#92400E',
      buttonTextColor: '#FFFFFF',
      categoryActiveBgColor: '#92400E',
      categoryActiveTextColor: '#FFFFFF',
      categoryInactiveBgColor: '#FEF3C7',
      categoryInactiveTextColor: '#92400E'
    }
  },
  {
    id: 'modern-slate',
    name: 'Modern Slate',
    description: 'Contemporary & clean',
    colors: {
      topBarBgColor: '#1E293B',
      topBarSecondaryColor: '#334155',
      headingColor: '#1E293B',
      bodyTextColor: '#475569',
      itemBgColor: '#FFFFFF',
      itemBorderColor: '#E2E8F0',
      accentColor: '#0F172A',
      backgroundColor: '#F8FAFC',
      buttonBgColor: '#1E293B',
      buttonTextColor: '#FFFFFF',
      categoryActiveBgColor: '#1E293B',
      categoryActiveTextColor: '#FFFFFF',
      categoryInactiveBgColor: '#E2E8F0',
      categoryInactiveTextColor: '#475569'
    }
  },
  {
    id: 'coral-pink',
    name: 'Coral Pink',
    description: 'Trendy & modern',
    colors: {
      topBarBgColor: '#F43F5E',
      topBarSecondaryColor: '#EC4899',
      headingColor: '#1a1a1a',
      bodyTextColor: '#4B5563',
      itemBgColor: '#FFFFFF',
      itemBorderColor: '#FCE7F3',
      accentColor: '#F43F5E',
      backgroundColor: '#FFF1F2',
      buttonBgColor: '#F43F5E',
      buttonTextColor: '#FFFFFF',
      categoryActiveBgColor: '#F43F5E',
      categoryActiveTextColor: '#FFFFFF',
      categoryInactiveBgColor: '#FCE7F3',
      categoryInactiveTextColor: '#F43F5E'
    }
  },
  {
    id: 'teal-mint',
    name: 'Teal Mint',
    description: 'Fresh & modern',
    colors: {
      topBarBgColor: '#0D9488',
      topBarSecondaryColor: '#14B8A6',
      headingColor: '#1a1a1a',
      bodyTextColor: '#4B5563',
      itemBgColor: '#FFFFFF',
      itemBorderColor: '#CCFBF1',
      accentColor: '#0D9488',
      backgroundColor: '#F0FDFA',
      buttonBgColor: '#0D9488',
      buttonTextColor: '#FFFFFF',
      categoryActiveBgColor: '#0D9488',
      categoryActiveTextColor: '#FFFFFF',
      categoryInactiveBgColor: '#CCFBF1',
      categoryInactiveTextColor: '#0D9488'
    }
  }
];

export default function MenuCustomizationLayout({ menuId, menu, initialCustomization, onSave }) {
  const [customization, setCustomization] = useState(initialCustomization || {
    logo: { url: '' },
    theme: COLOR_PALETTES[0].colors,
    fonts: {
      heading: 'inter',
      body: 'inter'
    },
    branding: {
      showLogo: true,
      showRestaurantName: true,
      showDescription: true,
      footerText: ''
    }
  });

  const [menuItems, setMenuItems] = useState(menu?.items || []);
  const [restaurant, setRestaurant] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedPalette, setSelectedPalette] = useState('elegant-gold');

  useEffect(() => {
    if (menu?.items) {
      setMenuItems(menu.items);
    }
    fetchRestaurantInfo();
  }, [menu, menuId]);

  const fetchRestaurantInfo = async () => {
    try {
      const response = await fetchWithAuth(API_CONFIG.ENDPOINTS.RESTAURANT.GET);
      const data = await response.json();
      if (data.success) {
        setRestaurant(data.restaurant);
      }
    } catch (error) {
      console.error('Failed to fetch restaurant info:', error);
    }
  };

  const handlePaletteSelect = (paletteId) => {
    const palette = COLOR_PALETTES.find(p => p.id === paletteId);
    if (palette) {
      setSelectedPalette(paletteId);
      setCustomization({
        ...customization,
        theme: palette.colors
      });
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo must be less than 2MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

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
        setCustomization({
          ...customization,
          logo: {
            url: data.imageUrl,
            uploadedAt: new Date().toISOString()
          }
        });
        toast.success('Logo uploaded successfully!');
      } else {
        toast.error('Upload failed');
      }
    } catch (error) {
      toast.error('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    setCustomization({
      ...customization,
      logo: { url: '' }
    });
    toast.success('Logo removed');
  };

  const handleFontChange = (fontType, value) => {
    setCustomization({
      ...customization,
      fonts: {
        ...customization.fonts,
        [fontType]: value
      }
    });
  };

  const handleBrandingChange = (field, value) => {
    setCustomization({
      ...customization,
      branding: {
        ...customization.branding,
        [field]: value
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetchWithAuth(API_CONFIG.ENDPOINTS.MENU.UPDATE(menuId), {
        method: 'PUT',
        body: JSON.stringify({ customization })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Menu customization saved!');
        onSave && onSave(customization);
      } else {
        toast.error(data.message || 'Failed to save customization');
      }
    } catch (error) {
      toast.error('Failed to save customization');
    } finally {
      setSaving(false);
    }
  };

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categories = ['All', ...Object.keys(groupedItems)];
  const displayItems = activeCategory === 'All' ? menuItems : groupedItems[activeCategory] || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-screen">
      {/* Left Sidebar - Customization Options */}
      <div className="lg:col-span-1">
        <div className="sticky top-20 space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto pr-2">
          {/* Logo Section */}
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">Logo</h3>
            </div>

            {customization.logo?.url ? (
              <div className="relative mb-4">
                <img
                  src={customization.logo.url}
                  alt="Restaurant Logo"
                  className="w-full h-24 object-contain rounded-lg border border-gray-200"
                />
                <button
                  onClick={handleRemoveLogo}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-full h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
                <span className="text-gray-400 text-xs">No logo</span>
              </div>
            )}

            <label className="flex items-center justify-center gap-2 w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-all text-sm">
              <Upload className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600 font-semibold">
                {uploading ? 'Uploading...' : 'Upload Logo'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">Max 2MB (PNG, JPG, GIF)</p>
          </div>

          {/* Color Palettes Section */}
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-blue-600" />
              Color Palettes
            </h3>
            <div className="space-y-3">
              {COLOR_PALETTES.map((palette) => (
                <button
                  key={palette.id}
                  onClick={() => handlePaletteSelect(palette.id)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${selectedPalette === palette.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{palette.name}</p>
                      <p className="text-xs text-gray-600">{palette.description}</p>
                    </div>
                    {selectedPalette === palette.id && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: palette.colors.topBarBgColor }}
                      title="Header"
                    />
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: palette.colors.accentColor }}
                      title="Accent"
                    />
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: palette.colors.backgroundColor }}
                      title="Background"
                    />
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: palette.colors.itemBgColor }}
                      title="Items"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Fonts Section */}
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Type className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">Fonts</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Heading Font</label>
                <p className="text-xs text-gray-600 mb-2">Used for restaurant name and item titles</p>
                <select
                  value={customization.fonts.heading}
                  onChange={(e) => handleFontChange('heading', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {FONTS.map(font => (
                    <option key={font.id} value={font.id}>{font.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Body Font</label>
                <p className="text-xs text-gray-600 mb-2">Used for descriptions and regular text</p>
                <select
                  value={customization.fonts.body}
                  onChange={(e) => handleFontChange('body', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {FONTS.map(font => (
                    <option key={font.id} value={font.id}>{font.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Branding Section */}
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">Branding</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-all">
                <input
                  type="checkbox"
                  checked={customization.branding.showLogo}
                  onChange={(e) => handleBrandingChange('showLogo', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                />
                <span className="text-gray-700 text-sm font-medium">Show Logo</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-all">
                <input
                  type="checkbox"
                  checked={customization.branding.showRestaurantName}
                  onChange={(e) => handleBrandingChange('showRestaurantName', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                />
                <span className="text-gray-700 text-sm font-medium">Show Restaurant Name</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-all">
                <input
                  type="checkbox"
                  checked={customization.branding.showDescription}
                  onChange={(e) => handleBrandingChange('showDescription', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                />
                <span className="text-gray-700 text-sm font-medium">Show Menu Description</span>
              </label>

              <div className="pt-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Footer Text (Optional)</label>
                <textarea
                  value={customization.branding.footerText || ''}
                  onChange={(e) => handleBrandingChange('footerText', e.target.value)}
                  placeholder="e.g., Thank you for your visit! Follow us on social media."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-semibold text-sm"
          >
            {saving ? 'Saving...' : 'Save Customization'}
          </button>
        </div>
      </div>

      {/* Right Side - Live Preview */}
      <div className="lg:col-span-2">
        <div className="sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto rounded-xl shadow-sm border border-gray-200 bg-gray-50">
          {/* Header */}
          <div
            style={{
              background: `linear-gradient(to right, ${customization.theme.topBarBgColor}, ${customization.theme.topBarSecondaryColor})`,
              color: 'white'
            }}
          >
            <div className="px-6 py-8">
              {customization.branding.showLogo && customization.logo?.url && (
                <div className="mb-6">
                  <Image
                    src={customization.logo.url}
                    alt="Logo"
                    width={300}
                    height={300}
                    className="h-16 object-contain"
                  />
                </div>
              )}
              <div>
                {customization.branding.showRestaurantName && (
                  <h1
                    style={{ fontFamily: customization.fonts.heading }}
                    className="text-3xl font-bold"
                  >
                    {menu?.restaurantName || 'Restaurant Name'}
                  </h1>
                )}
                <p className="opacity-90" style={{ fontFamily: customization.fonts.body }}>{menu?.name || 'Menu'}</p>
              </div>
              {customization.branding.showDescription && menu?.description && (
                <p className="opacity-90 mt-3" style={{ fontFamily: customization.fonts.body }}>{menu.description}</p>
              )}
              {restaurant && (
                <div className="mt-4 space-y-2 text-sm opacity-90" style={{ fontFamily: customization.fonts.body }}>
                  {restaurant.location && <p>📍 {restaurant.location}</p>}
                  {restaurant.phone && <p>📞 {restaurant.phone}</p>}
                  {restaurant.openTime && restaurant.closeTime && (
                    <p>🕐 {restaurant.openTime} - {restaurant.closeTime}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
            <div className="px-6">
              <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    style={{
                      backgroundColor: activeCategory === category
                        ? customization.theme.categoryActiveBgColor
                        : customization.theme.categoryInactiveBgColor,
                      color: activeCategory === category
                        ? customization.theme.categoryActiveTextColor
                        : customization.theme.categoryInactiveTextColor,
                      fontFamily: customization.fonts.body
                    }}
                    className="px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div
            className="px-6 py-8"
            style={{ backgroundColor: customization.theme.backgroundColor }}
          >
            {displayItems.length === 0 ? (
              <div className="text-center py-12">
                <p style={{ color: customization.theme.bodyTextColor, fontFamily: customization.fonts.body }}>No items in this category.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {displayItems.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all"
                    style={{
                      backgroundColor: customization.theme.itemBgColor,
                      borderColor: customization.theme.itemBorderColor,
                      borderWidth: '1px'
                    }}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3
                          style={{
                            color: customization.theme.headingColor,
                            fontFamily: customization.fonts.heading
                          }}
                          className="text-lg font-bold"
                        >
                          {item.name}
                        </h3>
                        <span
                          style={{ color: customization.theme.accentColor }}
                          className="text-xl font-bold ml-2"
                        >
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      {item.description && (
                        <p
                          className="text-sm mb-2"
                          style={{ color: customization.theme.bodyTextColor, fontFamily: customization.fonts.body }}
                        >
                          {item.description}
                        </p>
                      )}
                      <span
                        style={{
                          backgroundColor: customization.theme.categoryActiveBgColor + '20',
                          color: customization.theme.categoryActiveBgColor,
                          fontFamily: customization.fonts.body
                        }}
                        className="inline-block px-3 py-1 text-xs font-semibold rounded-full"
                      >
                        {item.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            {customization.branding.footerText && (
              <div
                className="mt-8 pt-6 border-t text-center"
                style={{ borderColor: customization.theme.topBarBgColor }}
              >
                <p
                  className="text-sm"
                  style={{ color: customization.theme.topBarSecondaryColor, fontFamily: customization.fonts.body }}
                >
                  {customization.branding.footerText}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
