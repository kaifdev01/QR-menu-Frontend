'use client';
import { useState } from 'react';
import { Upload, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchWithAuth, buildUrl } from '@/lib/apiConfig';
import API_CONFIG from '@/lib/apiConfig';
import { getFontFamily } from '@/lib/fontUtils';
import Image from 'next/image';

const TEMPLATES = [
  { id: 'modern', name: 'Modern', description: 'Clean and contemporary' },
  { id: 'classic', name: 'Classic', description: 'Traditional and elegant' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and focused' },
  { id: 'elegant', name: 'Elegant', description: 'Sophisticated design' },
  { id: 'vibrant', name: 'Vibrant', description: 'Bold and colorful' }
];

const FONTS = [
  { id: 'inter', name: 'Inter', category: 'Sans-serif' },
  { id: 'poppins', name: 'Poppins', category: 'Sans-serif' },
  { id: 'playfair', name: 'Playfair', category: 'Serif' },
  { id: 'montserrat', name: 'Montserrat', category: 'Sans-serif' },
  { id: 'roboto', name: 'Roboto', category: 'Sans-serif' },
  { id: 'lora', name: 'Lora', category: 'Serif' },
  { id: 'opensans', name: 'Open Sans', category: 'Sans-serif' },
  { id: 'merriweather', name: 'Merriweather', category: 'Serif' },
  { id: 'raleway', name: 'Raleway', category: 'Sans-serif' },
  { id: 'nunito', name: 'Nunito', category: 'Sans-serif' },
  { id: 'crimson', name: 'Crimson Text', category: 'Serif' }
];

export default function MenuCustomization({ menuId, initialCustomization, onSave }) {
  const [customization, setCustomization] = useState(initialCustomization || {
    logo: { url: '' },
    theme: {
      template: 'modern',
      primaryColor: '#2563EB',
      secondaryColor: '#9333EA',
      accentColor: '#10B981',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937'
    },
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

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo must be less than 2MB');
      return;
    }

    // Validate file type
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

  const handleColorChange = (colorType, value) => {
    setCustomization({
      ...customization,
      theme: {
        ...customization.theme,
        [colorType]: value
      }
    });
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

  return (
    <div className="space-y-6">
      {/* Logo Upload */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Restaurant Logo</h3>

        <div className="flex items-center gap-6">
          {customization.logo?.url ? (
            <div className="relative">
              <Image
                src={customization.logo.url}
                alt="Restaurant Logo"
                width={300}
                height={300}
                className="w-32 h-32 object-contain rounded-lg border border-gray-200"
              />
              <button
                onClick={handleRemoveLogo}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No logo</span>
            </div>
          )}

          <div className="flex-1">
            <label className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-all">
              <Upload className="w-5 h-5 text-gray-600" />
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
            <p className="text-xs text-gray-500 mt-2">Max 2MB. PNG, JPG, or GIF</p>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Menu Template</h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {TEMPLATES.map(template => (
            <button
              key={template.id}
              onClick={() => setCustomization({
                ...customization,
                theme: { ...customization.theme, template: template.id }
              })}
              className={`p-3 rounded-lg border-2 transition-all text-center ${customization.theme.template === template.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <p className="font-semibold text-sm text-gray-900">{template.name}</p>
              <p className="text-xs text-gray-600">{template.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Color Customization */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Theme Colors</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Color */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customization.theme.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={customization.theme.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Secondary Color */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Secondary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customization.theme.secondaryColor}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={customization.theme.secondaryColor}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Accent Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customization.theme.accentColor}
                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={customization.theme.accentColor}
                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Background Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customization.theme.backgroundColor}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={customization.theme.backgroundColor}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Text Color */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Text Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customization.theme.textColor}
                onChange={(e) => handleColorChange('textColor', e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={customization.theme.textColor}
                onChange={(e) => handleColorChange('textColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Font Selection */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Fonts</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Heading Font */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Heading Font</label>
            <select
              value={customization.fonts.heading}
              onChange={(e) => handleFontChange('heading', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {FONTS.map(font => (
                <option key={font.id} value={font.id}>
                  {font.name} ({font.category})
                </option>
              ))}
            </select>
          </div>

          {/* Body Font */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Body Font</label>
            <select
              value={customization.fonts.body}
              onChange={(e) => handleFontChange('body', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {FONTS.map(font => (
                <option key={font.id} value={font.id}>
                  {font.name} ({font.category})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Branding Options */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Branding Options</h3>

        <div className="space-y-4">
          {/* Show Logo */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={customization.branding.showLogo}
              onChange={(e) => handleBrandingChange('showLogo', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-gray-700 font-medium">Show Logo on Menu</span>
          </label>

          {/* Show Restaurant Name */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={customization.branding.showRestaurantName}
              onChange={(e) => handleBrandingChange('showRestaurantName', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-gray-700 font-medium">Show Restaurant Name</span>
          </label>

          {/* Show Description */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={customization.branding.showDescription}
              onChange={(e) => handleBrandingChange('showDescription', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-gray-700 font-medium">Show Menu Description</span>
          </label>

          {/* Footer Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Footer Text (Optional)</label>
            <textarea
              value={customization.branding.footerText || ''}
              onChange={(e) => handleBrandingChange('footerText', e.target.value)}
              placeholder="e.g., Thank you for your visit! Follow us on social media."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Preview & Save */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-semibold"
        >
          <Eye className="w-5 h-5" />
          {showPreview ? 'Hide Preview' : 'Preview'}
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-semibold"
        >
          {saving ? 'Saving...' : 'Save Customization'}
        </button>
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Preview</h3>
          <div
            style={{
              backgroundColor: customization.theme.backgroundColor,
              color: customization.theme.textColor,
              fontFamily: getFontFamily(customization.fonts.body)
            }}
            className="rounded-lg p-6 border border-gray-200"
          >
            {customization.branding.showLogo && customization.logo?.url && (
              <img
                src={customization.logo.url}
                alt="Logo"
                className="w-20 h-20 object-contain mb-4"
              />
            )}

            {customization.branding.showRestaurantName && (
              <h1
                style={{ color: customization.theme.primaryColor, fontFamily: getFontFamily(customization.fonts.heading) }}
                className="text-3xl font-bold mb-2"
              >
                Restaurant Name
              </h1>
            )}

            {customization.branding.showDescription && (
              <p className="text-gray-600 mb-4">Menu Description goes here</p>
            )}

            <div className="space-y-3 mt-6">
              <div
                style={{ backgroundColor: customization.theme.primaryColor }}
                className="h-2 rounded"
              />
              <div className="space-y-2">
                <p style={{ color: customization.theme.primaryColor }} className="font-semibold">Sample Item</p>
                <p className="text-sm">Item description would appear here</p>
                <p style={{ color: customization.theme.accentColor }} className="font-bold">$9.99</p>
              </div>
            </div>

            {customization.branding.footerText && (
              <p className="text-sm text-center mt-6 pt-4 border-t border-gray-300">
                {customization.branding.footerText}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
