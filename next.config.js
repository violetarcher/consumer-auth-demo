/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Image domains for Auth0 profile pictures and other external images
  images: {
    domains: [
      'images.unsplash.com',
      's.gravatar.com',
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com',
      'avatars.githubusercontent.com',
      'pbs.twimg.com'
    ],
  },

  // Environment variables to expose to the browser
  env: {
    CUSTOM_DOMAIN: 'login.consumerauth.com',
    APP_PORT: '4000',
  },

  // Headers for CORS and security
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { 
            key: 'Access-Control-Allow-Origin', 
            value: process.env.NODE_ENV === 'production' 
              ? 'https://login.consumerauth.com' 
              : 'http://localhost:4000'
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { 
            key: 'Access-Control-Allow-Headers', 
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
          },
        ]
      },
      {
        // Security headers for all pages
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },

  // Redirects for SEO and UX
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/api/auth/login',
        permanent: false,
      },
      {
        source: '/logout',
        destination: '/api/auth/logout',
        permanent: false,
      }
    ];
  },

  // Experimental features for better performance
  experimental: {
    // Enable if using React Server Components
    serverComponentsExternalPackages: ['@auth0/nextjs-auth0'],
  },

  // Webpack configuration for better bundling
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Custom webpack configurations if needed
    if (!isServer) {
      // Don't resolve 'fs' module on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    return config;
  },

  // Output configuration for static export (if needed)
  // trailingSlash: true,
  // output: 'export',
};

module.exports = nextConfig;