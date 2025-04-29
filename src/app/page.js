'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const [email, setEmail] = useState('');
  const { user, logout, loading } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    // You would add actual submission logic here later
    setEmail('');
    alert('Thanks for joining our beta! Check your console for confirmation.');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with Auth State */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Business English Skills</h1>
            
            <div className="flex items-center space-x-4">
              {loading ? (
                <p className="text-sm">Loading...</p>
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/practice" 
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Practice
                  </Link>
                  <span className="text-sm font-medium">
                    {user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/practice" 
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 mr-2"
                  >
                    Practice
                  </Link>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Boost Your Business English Skills
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300">
              Get daily templates, practice exercises, and AI feedback to upgrade your real-world communication.
            </p>
            
            {/* Authentication Status Display */}
            {!loading && user && (
              <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-md">
                <p className="font-medium">Welcome back! You&apos;re signed in as {user.email}</p>
              </div>
            )}
            
            {/* Email Signup Form */}
            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md mb-12">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  required
                  className="flex-grow px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Join the Beta
                </button>
              </form>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="max-w-4xl mx-auto mt-16 md:mt-24">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 dark:text-blue-300 text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-medium mb-2">Receive daily templates via email</h3>
                <p className="text-gray-600 dark:text-gray-300">Get professional email formats, meeting agendas, and more delivered to your inbox.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 dark:text-blue-300 text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-medium mb-2">Practice short exercises</h3>
                <p className="text-gray-600 dark:text-gray-300">Complete bite-sized activities designed to build your business communication skills.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 dark:text-blue-300 text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-medium mb-2">Get instant AI feedback</h3>
                <p className="text-gray-600 dark:text-gray-300">Receive personalized suggestions to improve your business writing and communication.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-6 text-gray-600 dark:text-gray-400 text-sm">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white">Contact</a>
            <span>|</span>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
