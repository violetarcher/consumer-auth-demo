'use client';

import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Header from '@/components/Header';
import { Shield, Users, Zap, Settings } from 'lucide-react';

function Dashboard() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Dashboard Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {user?.picture && (
                  <img
                    src={user.picture}
                    alt={user.name || 'User'}
                    className="h-12 w-12 rounded-full ring-4 ring-white/30"
                  />
                )}
                <div className="text-white">
                  <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
                  <p className="text-indigo-100">{user?.email}</p>
                </div>
              </div>
              <div className="text-right text-white">
                <p className="text-sm text-indigo-100">Next.js App</p>
                <p className="text-lg font-semibold">Port 4000</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Metrics */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">SSR Pages</h3>
                  <Zap className="h-6 w-6 text-emerald-100" />
                </div>
                <p className="text-3xl font-bold mb-2">847</p>
                <p className="text-emerald-100 text-sm">Pages rendered server-side</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Auth Success</h3>
                  <Shield className="h-6 w-6 text-blue-100" />
                </div>
                <p className="text-3xl font-bold mb-2">99.9%</p>
                <p className="text-blue-100 text-sm">via login.consumerauth.com</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">ACUL Screens</h3>
                  <Users className="h-6 w-6 text-purple-100" />
                </div>
                <p className="text-3xl font-bold mb-2">12</p>
                <p className="text-purple-100 text-sm">Customized login screens</p>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* User Information */}
              <div className="border border-gray-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">User Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-lg text-gray-900">{user?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">User ID</label>
                    <p className="text-lg text-gray-900 font-mono text-sm">{user?.sub}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email Verified</label>
                    <p className="text-lg text-gray-900">
                      {user?.email_verified ? (
                        <span className="text-green-600 font-semibold">✓ Verified</span>
                      ) : (
                        <span className="text-yellow-600 font-semibold">⚠ Pending</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-lg text-gray-900">
                      {user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Next.js Features */}
              <div className="border border-gray-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Next.js Features Active</h3>
                <div className="space-y-4">
                  {[
                    { feature: 'Server-Side Rendering (SSR)', status: 'Active', desc: 'Pages pre-rendered on server' },
                    { feature: 'API Routes', status: 'Active', desc: '/api/auth/[...auth0] configured' },
                    { feature: 'App Router', status: 'Active', desc: 'Next.js 13+ App Directory' },
                    { feature: 'Custom Domain', status: 'Active', desc: 'login.consumerauth.com verified' },
                    { feature: 'TypeScript', status: 'Active', desc: 'Full type safety enabled' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div>
                        <div className="font-medium text-gray-900">{item.feature}</div>
                        <div className="text-sm text-gray-600">{item.desc}</div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Settings, label: 'ACUL Setup', desc: 'Configure custom screens', href: '#' },
                  { icon: Shield, label: 'Auth0 Dashboard', desc: 'Manage authentication', href: '#' },
                  { icon: Users, label: 'User Management', desc: 'View all users', href: '#' },
                  { icon: Zap, label: 'Performance', desc: 'View analytics', href: '#' },
                ].map((action, index) => (
                  <a
                    key={index}
                    href={action.href}
                    className="block p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 group"
                  >
                    <action.icon className="h-8 w-8 text-indigo-600 mb-3 group-hover:scale-110 transition-transform" />
                    <div className="font-semibold text-gray-900">{action.label}</div>
                    <div className="text-sm text-gray-600">{action.desc}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Protect this page - redirect to login if not authenticated
export default withPageAuthRequired(Dashboard);