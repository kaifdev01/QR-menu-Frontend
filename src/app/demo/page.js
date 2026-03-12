'use client';
import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function DemoPage() {
  const [selectedCategory, setSelectedCategory] = useState('Pizza');
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('Pizza');
  const [itemImage, setItemImage] = useState('');

  const menuData = {
    Pizza: [
      { name: 'Margherita Pizza', price: '$12', desc: 'Fresh mozzarella, tomato sauce, basil', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
      { name: 'Pepperoni Pizza', price: '$14', desc: 'Pepperoni, mozzarella, tomato sauce', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400' },
      { name: 'Veggie Supreme', price: '$13', desc: 'Bell peppers, mushrooms, olives, onions', image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400' },
      { name: 'BBQ Chicken Pizza', price: '$15', desc: 'Grilled chicken, BBQ sauce, red onions', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
      { name: 'Hawaiian Pizza', price: '$13', desc: 'Ham, pineapple, mozzarella cheese', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400' },
      { name: 'Meat Lovers Pizza', price: '$16', desc: 'Pepperoni, sausage, bacon, ham', image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400' },
      { name: 'Four Cheese Pizza', price: '$14', desc: 'Mozzarella, parmesan, gorgonzola, ricotta', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
      { name: 'Buffalo Chicken Pizza', price: '$15', desc: 'Spicy buffalo chicken, ranch drizzle', image: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=400' }
    ],
    Burgers: [
      { name: 'Classic Beef Burger', price: '$10', desc: 'Beef patty, lettuce, tomato, cheese', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
      { name: 'Chicken Burger', price: '$9', desc: 'Grilled chicken, mayo, lettuce', image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400' },
      { name: 'Veggie Burger', price: '$8', desc: 'Plant-based patty, avocado, sprouts', image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400' },
      { name: 'Double Cheese Burger', price: '$12', desc: 'Double beef, double cheese, special sauce', image: 'https://images.unsplash.com/photo-1551615593-ef5fe247e8f7?w=400' },
      { name: 'Bacon Burger', price: '$11', desc: 'Beef patty, crispy bacon, cheddar', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400' },
      { name: 'Mushroom Swiss Burger', price: '$11', desc: 'Sautéed mushrooms, swiss cheese', image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400' },
      { name: 'BBQ Burger', price: '$12', desc: 'BBQ sauce, onion rings, cheddar', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400' },
      { name: 'Spicy Jalapeño Burger', price: '$11', desc: 'Jalapeños, pepper jack cheese, chipotle mayo', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400' },
      { name: 'Fish Burger', price: '$10', desc: 'Crispy fish fillet, tartar sauce', image: 'https://images.unsplash.com/photo-1585238341710-4a8e9e1f1e5e?w=400' }
    ],
    Drinks: [
      { name: 'Cold Coffee', price: '$5', desc: 'Iced coffee with milk and sugar', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400' },
      { name: 'Fresh Orange Juice', price: '$4', desc: 'Freshly squeezed orange juice', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400' },
      { name: 'Mango Smoothie', price: '$6', desc: 'Fresh mango blended with yogurt', image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400' },
      { name: 'Lemonade', price: '$3', desc: 'Fresh lemon, mint, sparkling water', image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9d?w=400' },
      { name: 'Cappuccino', price: '$5', desc: 'Espresso with steamed milk foam', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400' },
      { name: 'Green Tea', price: '$3', desc: 'Organic green tea leaves', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400' },
      { name: 'Strawberry Milkshake', price: '$6', desc: 'Fresh strawberries, vanilla ice cream', image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400' },
      { name: 'Mojito', price: '$5', desc: 'Mint, lime, soda water', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400' },
      { name: 'Hot Chocolate', price: '$4', desc: 'Rich chocolate with whipped cream', image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400' },
      { name: 'Iced Tea', price: '$3', desc: 'Refreshing iced tea with lemon', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400' }
    ],
    Desserts: [
      { name: 'Chocolate Cake', price: '$7', desc: 'Rich chocolate cake with ganache', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400' },
      { name: 'Cheesecake', price: '$8', desc: 'Creamy New York style cheesecake', image: 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=400' },
      { name: 'Ice Cream Sundae', price: '$6', desc: 'Vanilla ice cream, chocolate sauce, nuts', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400' },
      { name: 'Tiramisu', price: '$9', desc: 'Italian coffee-flavored dessert', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400' },
      { name: 'Apple Pie', price: '$7', desc: 'Classic apple pie with cinnamon', image: 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400' },
      { name: 'Brownie', price: '$6', desc: 'Fudgy chocolate brownie', image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400' },
      { name: 'Panna Cotta', price: '$8', desc: 'Italian cream dessert with berry sauce', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400' },
      { name: 'Crème Brûlée', price: '$9', desc: 'Vanilla custard with caramelized sugar', image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400' }
    ]
  };

  const categories = Object.keys(menuData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 text-center">
        <p className="text-sm md:text-base">
          🎉 This is a live demo menu - <Link href="/" className="underline font-semibold">Start Your Own QR Menu</Link>
        </p>
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white drop-shadow-2xl">
              Experience the Future
              <br />
              <span className="text-yellow-300">of Digital Menus</span>
            </h1>
            <p className="text-2xl md:text-3xl text-white mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              Browse our interactive demo menu and see how your customers will experience your restaurant
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-white cursor-pointer text-purple-600 px-10 py-5 rounded-full text-xl font-bold hover:shadow-2xl transition-all transform hover:scale-110">
                Explore Demo Menu
              </button>
              <button className="cursor-pointer border-3 border-white text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-white hover:text-purple-600 transition-all">
                Create Your Own
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Menu Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Restaurant Header */}
          <div className="text-center mb-12">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2"> Bistro</h2>
              <p className="text-gray-600">Authentic Italian & American Cuisine</p>
              <div className="flex justify-center items-center gap-4 mt-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Downtown
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Open 10AM - 10PM
                </span>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center overflow-x-auto gap-3 mb-8 pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {menuData[selectedCategory].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex">
                  <div className="w-32 h-32 relative flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                      <span className="text-xl font-bold text-blue-600">{item.price}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA at bottom of menu */}
          <div className="mt-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">Love This Menu Experience?</h3>
            <p className="text-lg mb-6 opacity-90">Create your own professional QR menu in minutes</p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all">
              Start Your Own QR Menu
            </button>
          </div>
        </div>
      </section>

      {/* QR Scan Simulation Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">Get your QR menu live in 4 simple steps</p>
          </div>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left side - QR Code with Phone Mockup */}
            <div className="relative">
              <div className="bg-white p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-2xl">
                  <Image
                    src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=http://localhost:3000/demo"
                    alt="QR Code Demo"
                    width={400}
                    height={400}
                    className="w-full h-auto rounded-xl"
                  />
                </div>
                <div className="text-center mt-6">
                  <p className="text-gray-900 font-bold text-xl mb-2">Scan with your phone</p>
                  <p className="text-gray-600">Try it now to see the magic!</p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200 rounded-full opacity-50 blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-200 rounded-full opacity-50 blur-2xl"></div>
            </div>

            {/* Right side - Steps with Icons */}
            <div className="space-y-8">
              <div className="flex items-start group">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl flex-shrink-0 mr-6 shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Print the QR Code</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">Download your unique QR code and print it in any size. Perfect for table tents, posters, or stickers.</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl flex-shrink-0 mr-6 shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Place on Tables</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">Display the QR code on tables, counters, or walls where customers can easily see and scan it.</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl flex-shrink-0 mr-6 shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Customers Scan</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">Customers simply point their phone camera at the code. No app download required!</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl flex-shrink-0 mr-6 shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Menu Opens Instantly</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">Your beautiful digital menu appears on their phone in seconds. Fast, easy, and contactless!</p>
                </div>
              </div>

              <div className="pt-4">
                <button className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:shadow-2xl transition-all transform hover:scale-105">
                  Create Your Own Menu →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Phone Mockup Preview Section */}


      {/* Dashboard Preview Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Manage Your Menu Easily
            </h2>
            <p className="text-xl text-gray-600">Simple dashboard to control everything</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Add Menu Items</h3>
              <p className="text-gray-600 mb-4">Quickly add new dishes with name, price, description, and images.</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Item Name:</span>
                    <span className="font-semibold">Margherita Pizza</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold">$12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-semibold">Pizza</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all">
              <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Manage Categories</h3>
              <p className="text-gray-600 mb-4">Organize your menu into categories like Pizza, Burgers, Drinks.</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white rounded">
                    <span className="font-semibold">🍕 Pizza</span>
                    <span className="text-sm text-gray-500">8 items</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded">
                    <span className="font-semibold">🍔 Burgers</span>
                    <span className="text-sm text-gray-500">9 items</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded">
                    <span className="font-semibold">🥤 Drinks</span>
                    <span className="text-sm text-gray-500">10 items</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all">
              <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Generate QR Code</h3>
              <p className="text-gray-600 mb-4">Download your QR code instantly and start using it right away.</p>
              <div className="bg-gray-50 p-4 rounded-lg flex justify-center">
                <Image
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=demo"
                  alt="QR Code"
                  width={150}
                  height={150}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Menu Editor Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Try It Yourself
            </h2>
            <p className="text-xl text-gray-600">Add a menu item and see instant preview</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left - Form */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Add Menu Item</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name</label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g., Margherita Pizza"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
                  <input
                    type="text"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    placeholder="e.g., $12"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>Pizza</option>
                    <option>Burgers</option>
                    <option>Drinks</option>
                    <option>Desserts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Image</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setItemImage(reader.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                    >
                      <svg className="w-6 h-6 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-600">{itemImage ? 'Change Image' : 'Click to upload image'}</span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG, or GIF (Max 5MB)</p>
                </div>
                <div className="pt-4">
                  <p className="text-sm text-gray-600 mb-4">✨ See your changes in real-time on the right →</p>
                  <button className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                    Add to Menu
                  </button>
                </div>
              </div>
            </div>

            {/* Right - Preview */}
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Live Preview</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                {itemName || itemPrice || itemImage ? (
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="flex">
                      <div className="w-32 h-32 relative flex-shrink-0">
                        {itemImage ? (
                          <img
                            src={itemImage}
                            alt={itemName || 'Menu Item'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center">
                            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-xl font-bold text-gray-900">
                            {itemName || 'Your Item Name'}
                          </h4>
                          <span className="text-xl font-bold text-blue-600">
                            {itemPrice || '$0'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Category: {itemCategory}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    <p className="text-gray-500">Start typing to see preview</p>
                  </div>
                )}
              </div>
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>💡 Pro Tip:</strong> This is how easy it is to manage your menu!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Create Your QR Menu in Minutes
          </h2>
          <p className="text-2xl text-white mb-12 opacity-90">
            Start your free trial and create your digital menu today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="cursor-pointer bg-white text-purple-600 px-10 py-5 rounded-full text-xl font-bold hover:shadow-2xl transition-all transform hover:scale-110">
              Start Free Trial
            </button>
            <button className="cursor-pointer border-3 border-white text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-white hover:text-purple-600 transition-all">
              Create My QR Menu
            </button>
          </div>
          <p className="mt-8 text-white text-lg opacity-75">
            ✓ No credit card required  ✓ Setup in 5 minutes  ✓ Cancel anytime
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
