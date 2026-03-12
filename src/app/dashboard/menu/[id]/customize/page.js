'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import { ArrowLeft, Palette } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/apiConfig';
import API_CONFIG from '@/lib/apiConfig';
import MenuCustomizationLayout from '@/components/MenuCustomizationLayout';

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

export default function CustomizationPage() {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    } else {
      fetchMenu();
    }
  }, [params.id]);

  const fetchMenu = async () => {
    try {
      const response = await fetchWithAuth(API_CONFIG.ENDPOINTS.MENU.GET(params.id));
      const data = await response.json();
      if (data.success) {
        console.log('Menu fetched:', data.menu);
        setMenu(data.menu);
      } else {
        toast.error('Menu not found');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    fetchMenu();
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
      
      <div className="px-4 py-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/menu/${params.id}`} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Palette className="w-6 h-6 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">Menu Customization</h1>
              </div>
              <p className="text-gray-600">{menu?.name}</p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Customize your menu appearance:</strong> Upload your restaurant logo, choose a template, select colors and fonts to match your brand identity. See the live preview on the right.
            </p>
          </div>
        </div>

        {/* Customization Layout */}
        <div className="max-w-7xl mx-auto">
          {menu && (
            <MenuCustomizationLayout 
              menuId={params.id}
              menu={{
                name: menu.name,
                description: menu.description,
                restaurantName: menu.restaurantName,
                items: menu.items || []
              }}
              initialCustomization={menu.customization || DEFAULT_CUSTOMIZATION}
              onSave={handleSave}
            />
          )}
        </div>
      </div>
    </div>
  );
}
