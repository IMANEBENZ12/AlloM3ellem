import React, { useState } from 'react';
import { Search, MapPin, Facebook, Mail, Apple } from 'lucide-react';

export default function HandymanBookingPlatform() {
  const [activeTab, setActiveTab] = useState('home');
  const [showSignup, setShowSignup] = useState(false);
  
  // Services data for promotion cards
  const promotions = [
    { id: 1, title: 'Plumbing Services', discount: '20% OFF', imageUrl: '/api/placeholder/400/320' },
    { id: 2, title: 'Electrical Repairs', discount: '15% OFF', imageUrl: '/api/placeholder/400/320' },
    { id: 3, title: 'Home Cleaning', discount: 'First Hour Free', imageUrl: '/api/placeholder/400/320' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {!showSignup ? (
        // Homepage
        <>
          {/* Navigation Bar */}
          <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <div className="text-blue-600 text-2xl font-bold">
                      <span className="flex items-center">
                        <MapPin className="mr-2" />
                        HandyPro
                      </span>
                    </div>
                  </div>
                  <div className="hidden md:ml-6 md:flex md:space-x-8">
                    <button 
                      onClick={() => setActiveTab('home')}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'home' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                      Home
                    </button>
                    <button 
                      onClick={() => setActiveTab('services')}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'services' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                      All Services
                    </button>
                    <button className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                      Download App
                    </button>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => setShowSignup(true)}
                      className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Log In
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          
          {/* Hero Section */}
          <div className="relative bg-blue-700 overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <div className="relative z-10 pb-8 bg-blue-700 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                <div className="relative pt-6 px-4 sm:px-6 lg:px-8"></div>
                <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                  <div className="sm:text-center lg:text-left">
                    <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                      <span className="block">Your All-In-One</span>
                      <span className="block text-yellow-400">Service Booking Platform</span>
                    </h1>
                    <p className="mt-3 text-base text-blue-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                      Find trusted professionals for all your home maintenance and repair needs in just a few clicks.
                    </p>
                    <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                      <div className="relative rounded-md shadow-sm">
                        <div className="flex">
                          <div className="relative flex-grow focus-within:z-10">
                            <input
                              type="text"
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-3 text-sm border-gray-300 rounded-l-md"
                              placeholder="Current location"
                            />
                          </div>
                          <div className="relative flex-grow focus-within:z-10">
                            <input
                              type="text"
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-3 text-sm border-gray-300 border-l-0"
                              placeholder="Find your service here..."
                            />
                          </div>
                          <button
                            type="button"
                            className="relative inline-flex items-center space-x-2 px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Search className="h-5 w-5" />
                            <span>Search</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
              <img
                className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                src="/api/placeholder/800/600"
                alt="Handyman working"
              />
            </div>
          </div>
          
          {/* Promotions Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
              Today's Special Offers
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {promotions.map((promo) => (
                <div key={promo.id} className="bg-white overflow-hidden shadow-lg rounded-lg transition-transform duration-300 hover:transform hover:scale-105">
                  <div className="relative">
                    <img className="h-48 w-full object-cover" src={promo.imageUrl} alt={promo.title} />
                    <div className="absolute top-0 right-0 bg-yellow-500 text-white px-3 py-1 rounded-bl-lg font-bold">
                      {promo.discount}
                    </div>
                  </div>
                  <div className="px-4 py-4">
                    <h3 className="text-lg font-semibold text-gray-900">{promo.title}</h3>
                    <p className="mt-1 text-gray-600 text-sm">Professional service, available today</p>
                    <div className="mt-4">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        // Sign Up Page
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-xl">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
            </div>
            <form className="mt-8 space-y-6">
              <div className="rounded-md shadow-sm space-y-4">
                <div>
                  <label htmlFor="name" className="sr-only">Name</label>
                  <input id="name" name="name" type="text" required className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Name" />
                </div>
                <div>
                  <label htmlFor="email-address" className="sr-only">Email address</label>
                  <input id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Email address" />
                </div>
                <div>
                  <label htmlFor="phone" className="sr-only">Phone Number</label>
                  <input id="phone" name="phone" type="tel" autoComplete="tel" required className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Phone Number" />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input id="password" name="password" type="password" autoComplete="new-password" required className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Password" />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                  <input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" required className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Confirm Password" />
                </div>
              </div>

              <div>
                <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Sign Up
                </button>
              </div>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div>
                    <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 flex items-center">
                      <Facebook className="h-5 w-5 text-blue-600" />
                    </button>
                  </div>
                  <div>
                    <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 flex items-center">
                      <Mail className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                  <div>
                    <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 flex items-center">
                      <Apple className="h-5 w-5 text-gray-900" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="mt-2 text-sm text-gray-600">
                  Already have an account?{' '}
                  <button 
                    type="button"
                    onClick={() => setShowSignup(false)}
                    className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}