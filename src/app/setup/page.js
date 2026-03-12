'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Store, MapPin, Clock, Phone, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchWithAuth } from '@/lib/apiConfig';
import API_CONFIG from '@/lib/apiConfig';

export default function RestaurantSetupPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: '',
    location: '',
    phone: '',
    openTime: '09:00',
    closeTime: '22:00'
  });
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetchWithAuth(API_CONFIG.ENDPOINTS.RESTAURANT.SETUP, {
        method: 'POST',
        body: JSON.stringify(restaurantInfo)
      });

      const data = await response.json();

      if (data.success) {
        const updatedUser = { ...user, restaurantSetup: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Restaurant setup complete!');
        router.push('/dashboard');
      } else {
        toast.error(data.message || 'Setup failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                <Check className="w-6 h-6" />
              </div>
              <span className="ml-2 text-sm font-semibold text-gray-700">Plan Selected</span>
            </div>
            <div className="w-16 h-1 bg-blue-600"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <span className="ml-2 text-sm font-semibold text-gray-700">Restaurant Info</span>
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold">
                3
              </div>
              <span className="ml-2 text-sm font-semibold text-gray-500">Dashboard</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Tell Us About Your Restaurant
            </h1>
            <p className="text-gray-600">
              This information will be displayed on your digital menu
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Store className="w-4 h-4" />
                Restaurant Name
              </label>
              <input
                type="text"
                value={restaurantInfo.name}
                onChange={(e) => setRestaurantInfo({ ...restaurantInfo, name: e.target.value })}
                placeholder="e.g., The Italian Kitchen"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4" />
                Location / Address
              </label>
              <input
                type="text"
                value={restaurantInfo.location}
                onChange={(e) => setRestaurantInfo({ ...restaurantInfo, location: e.target.value })}
                placeholder="e.g., 123 Main Street, New York"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <input
                type="tel"
                value={restaurantInfo.phone}
                onChange={(e) => setRestaurantInfo({ ...restaurantInfo, phone: e.target.value })}
                placeholder="e.g., (555) 123-4567"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Clock className="w-4 h-4" />
                  Opening Time
                </label>
                <input
                  type="time"
                  value={restaurantInfo.openTime}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, openTime: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Clock className="w-4 h-4" />
                  Closing Time
                </label>
                <input
                  type="time"
                  value={restaurantInfo.closeTime}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, closeTime: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 text-lg"
            >
              {loading ? 'Setting up...' : 'Complete Setup & Go to Dashboard'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> You can update this information anytime from your dashboard settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
