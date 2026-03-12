'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Sparkles, Zap, Shield, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/apiConfig';
import API_CONFIG from '@/lib/apiConfig';

export default function OnboardingPage() {
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('trial');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const plans = [
    {
      id: 'trial',
      name: 'Free Trial',
      price: 0,
      duration: '5 days',
      description: 'Perfect to get started',
      features: [
        '1 Restaurant',
        '1 Menu',
        'Up to 20 items',
        'Basic QR code',
        'Email support',
        'No credit card required'
      ],
      badge: 'Start Free',
      popular: false
    },
    {
      id: 'starter',
      name: 'Starter',
      price: 9.99,
      duration: 'month',
      description: 'For small restaurants',
      features: [
        '1 Restaurant',
        'Unlimited menus',
        'Unlimited items',
        'Custom QR codes',
        'Analytics dashboard',
        'Priority email support',
        'Custom branding'
      ],
      badge: null,
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 29.99,
      duration: 'month',
      description: 'For growing businesses',
      features: [
        '5 Restaurants',
        'Unlimited menus',
        'Unlimited items',
        'Advanced QR codes',
        'Advanced analytics',
        '24/7 Priority support',
        'Custom branding',
        'Multi-language support',
        'API access'
      ],
      badge: 'Most Popular',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99.99,
      duration: 'month',
      description: 'For large chains',
      features: [
        'Unlimited restaurants',
        'Unlimited menus',
        'Unlimited items',
        'White-label solution',
        'Advanced analytics & reports',
        'Dedicated account manager',
        'Custom integrations',
        'Multi-language support',
        'API access',
        'SLA guarantee'
      ],
      badge: null,
      popular: false
    }
  ];

  const handleSelectPlan = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetchWithAuth(API_CONFIG.ENDPOINTS.SUBSCRIPTION.SELECT_PLAN, {
        method: 'POST',
        body: JSON.stringify({ planId: selectedPlan })
      });

      const data = await response.json();

      if (data.success) {
        const updatedUser = { ...user, hasCompletedOnboarding: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success(`${selectedPlan === 'trial' ? 'Free trial started!' : 'Plan selected successfully!'}`);
        setTimeout(() => router.push('/setup'), 1000);
      } else {
        toast.error(data.message || 'Failed to select plan');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <span className="cursor-pointer text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                <Link href="/">QR Menu Pro</Link>
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Welcome, <span className="font-semibold">{user?.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            Special Offer: 5-Day Free Trial
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start with a 5-day free trial. No credit card required. Cancel anytime.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <Zap className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Instant Setup</h3>
            <p className="text-sm text-gray-600">Get started in minutes</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <Shield className="w-8 h-8 text-green-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Secure & Reliable</h3>
            <p className="text-sm text-gray-600">Bank-level security</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Grow Your Business</h3>
            <p className="text-sm text-gray-600">Increase customer engagement</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <Check className="w-8 h-8 text-orange-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">24/7 Support</h3>
            <p className="text-sm text-gray-600">We&apos;re here to help</p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl ${selectedPlan === plan.id
                ? 'ring-4 ring-blue-500 transform scale-105'
                : 'hover:scale-102'
                } ${plan.popular ? 'border-2 border-blue-500' : ''}`}
            >
              {plan.badge && (
                <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-green-500'
                  }`}>
                  {plan.badge}
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/{plan.duration}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className={`w-full py-2 rounded-lg text-center font-semibold transition-all ${selectedPlan === plan.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-gray-100 text-gray-700'
                }`}>
                {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={handleSelectPlan}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : selectedPlan === 'trial' ? 'Start Free Trial' : 'Continue with Selected Plan'}
          </button>
          <p className="mt-4 text-sm text-gray-600">
            {selectedPlan === 'trial'
              ? '✨ 5-day free trial • No credit card required • Cancel anytime'
              : '💳 You can change or cancel your plan anytime from your dashboard'
            }
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Can I change my plan later?</h3>
              <p className="text-gray-600 text-sm">Yes! You can upgrade, downgrade, or cancel your plan anytime from your dashboard.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">What happens after the free trial?</h3>
              <p className="text-gray-600 text-sm">After 5 days, you can choose to continue with a paid plan or your account will be paused.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Do I need a credit card for the trial?</h3>
              <p className="text-gray-600 text-sm">No! Start your free trial without entering any payment information.</p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 mb-4">Trusted by restaurants worldwide</p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-sm">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-sm">Cancel Anytime</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-sm">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
