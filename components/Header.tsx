'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

export default function Header() {
  const { user, isLoading } = useUser();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                🛒
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ConsumerAuth
              </span>
            </Link>
          </div>

          <nav className="flex items-center space-x-6">
            {isLoading ? (
              <div className="text-gray-600">Loading...</div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                {user.picture && (
                  <img
                    src={user.picture}
                    alt={user.name || 'User'}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <span className="text-sm font-semibold text-gray-900">
                  {user.name}
                </span>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Profile
                </Link>
                <a
                  href="/api/auth/logout"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Sign Out
                </a>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <a
                  href="/api/auth/login"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Sign In
                </a>
                <a
                  href="/api/auth/login"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Get Started
                </a>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}