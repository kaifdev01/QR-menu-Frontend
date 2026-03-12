'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { RefreshCw, MapPin, Phone, Clock } from 'lucide-react';
import { buildUrl } from '@/lib/apiConfig';
import API_CONFIG from '@/lib/apiConfig';
import { getFontFamily } from '@/lib/fontUtils';

const DEFAULT_CUSTOMIZATION = {
  logo: { url: '' },
  theme: {
    topBarBgColor: '#2563EB',
    topBarSecondaryColor: '#9333EA',
    headingColor: '#1F2937',
    bodyTextColor: '#4B5563',
    itemBgColor: '#FFFFFF',
    itemBorderColor: '#E5E7EB',
    accentColor: '#10B981',
    backgroundColor: '#F9FAFB',
    categoryActiveBgColor: '#2563EB',
    categoryActiveTextColor: '#FFFFFF',
    categoryInactiveBgColor: '#F3F4F6',
    categoryInactiveTextColor: '#374151'
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
};

// Map customization format - handle both old and new formats
const mapCustomizationFormat = (customization) => {
  if (!customization) return DEFAULT_CUSTOMIZATION;

  const theme = customization.theme || {};

  // Check if it's the old format (has primaryColor, secondaryColor, etc.)
  if (theme.primaryColor || theme.secondaryColor) {
    return {
      logo: customization.logo || DEFAULT_CUSTOMIZATION.logo,
      theme: {
        topBarBgColor: theme.primaryColor || '#2563EB',
        topBarSecondaryColor: theme.secondaryColor || '#9333EA',
        headingColor: theme.textColor || '#1F2937',
        bodyTextColor: theme.textColor || '#4B5563',
        itemBgColor: '#FFFFFF',
        itemBorderColor: '#E5E7EB',
        accentColor: theme.accentColor || '#10B981',
        backgroundColor: theme.backgroundColor || '#F9FAFB',
        categoryActiveBgColor: theme.primaryColor || '#2563EB',
        categoryActiveTextColor: '#FFFFFF',
        categoryInactiveBgColor: '#F3F4F6',
        categoryInactiveTextColor: '#374151'
      },
      fonts: customization.fonts || DEFAULT_CUSTOMIZATION.fonts,
      branding: customization.branding || DEFAULT_CUSTOMIZATION.branding
    };
  }

  // New format - merge with defaults to ensure all required fields exist
  return {
    logo: customization.logo || DEFAULT_CUSTOMIZATION.logo,
    theme: {
      ...DEFAULT_CUSTOMIZATION.theme,
      ...theme
    },
    fonts: customization.fonts || DEFAULT_CUSTOMIZATION.fonts,
    branding: customization.branding || DEFAULT_CUSTOMIZATION.branding
  };
};

export default function PublicMenuPage() {
  const [menu, setMenu] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [customization, setCustomization] = useState(DEFAULT_CUSTOMIZATION);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const params = useParams();

  useEffect(() => {
    fetchMenu();
  }, [params.uniqueUrl]);

  const fetchMenu = async () => {
    try {
      const timestamp = Date.now();
      const url = buildUrl(API_CONFIG.ENDPOINTS.MENU.PUBLIC(params.uniqueUrl)) + `?_t=${timestamp}`;

      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      const data = await response.json();
      if (data.success) {
        setMenu(data.menu);
        setRestaurant(data.restaurant);

        // Map customization to proper format
        if (data.menu.customization) {
          const mappedCustomization = mapCustomizationFormat(data.menu.customization);
          setCustomization(mappedCustomization);
        } else {
          setCustomization(DEFAULT_CUSTOMIZATION);
        }
      }
    } catch (error) {
      console.error('Failed to load menu:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await fetchMenu();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Menu Not Found</h1>
          <p className="text-gray-600">This menu is not available or has been removed.</p>
        </div>
      </div>
    );
  }

  const groupedItems = menu.items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categories = ['All', ...Object.keys(groupedItems)];
  const displayItems = activeCategory === 'All' ? menu.items : groupedItems[activeCategory] || [];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: customization.theme.backgroundColor }}
    >
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(to right, ${customization.theme.topBarBgColor}, ${customization.theme.topBarSecondaryColor})`,
          color: 'white'
        }}
      >
        <div className="max-w-4xl mx-auto px-6 py-8">
          {customization.branding.showLogo && customization.logo?.url && (
            <div className="mb-6">
              <img
                src={customization.logo.url}
                alt="Logo"
                className="h-16 object-contain"
              />
            </div>
          )}
          <div>
            {customization.branding.showRestaurantName && (
              <h1
                style={{ fontFamily: getFontFamily(customization.fonts.heading) }}
                className="text-3xl font-bold"
              >
                {menu?.restaurantName || 'Restaurant Name'}
              </h1>
            )}
            <p className="opacity-90" style={{ fontFamily: getFontFamily(customization.fonts.body) }}>{menu?.name || 'Menu'}</p>
          </div>
          {customization.branding.showDescription && menu?.description && (
            <p className="opacity-90 mt-3" style={{ fontFamily: getFontFamily(customization.fonts.body) }}>{menu.description}</p>
          )}
          {restaurant && (
            <div className="mt-4 flex flex-wrap gap-6 text-sm opacity-90" style={{ fontFamily: getFontFamily(customization.fonts.body) }}>
              {restaurant.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>{restaurant.location}</span>
                </div>
              )}
              {restaurant.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{restaurant.phone}</span>
                </div>
              )}
              {restaurant.openTime && restaurant.closeTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>{restaurant.openTime} - {restaurant.closeTime}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide items-center">
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
                  fontFamily: getFontFamily(customization.fonts.body)
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
      <div className="max-w-4xl mx-auto px-6 py-8">
        {displayItems.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: customization.theme.bodyTextColor, fontFamily: getFontFamily(customization.fonts.body) }}>No items in this category.</p>
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
                        fontFamily: getFontFamily(customization.fonts.heading)
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
                      style={{
                        color: customization.theme.bodyTextColor,
                        fontFamily: getFontFamily(customization.fonts.body)
                      }}
                    >
                      {item.description}
                    </p>
                  )}
                  <span
                    style={{
                      backgroundColor: customization.theme.categoryActiveBgColor + '20',
                      color: customization.theme.categoryActiveBgColor,
                      fontFamily: getFontFamily(customization.fonts.body)
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
              style={{ color: customization.theme.topBarSecondaryColor, fontFamily: getFontFamily(customization.fonts.body) }}
            >
              {customization.branding.footerText}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <p className="text-sm text-gray-600" style={{ fontFamily: getFontFamily(customization.fonts.body) }}>
            Powered by <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">QR Menu Pro</span>
          </p>
        </div>
      </div>
    </div>
  );
}
