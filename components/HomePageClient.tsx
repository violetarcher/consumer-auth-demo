'use client';

import { useUser } from '@auth0/nextjs-auth0/client';

export default function HomePageClient() {
  const { user, isLoading, error } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>ConsumerAuth</h1>
      <p>Next.js + Auth0 Advanced Customization for Universal Login</p>
      
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <div style={{ marginTop: '20px' }}>
            <a 
              href="/profile"
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                display: 'inline-block',
                marginRight: '10px'
              }}
            >
              View Profile
            </a>
            <a 
              href="/api/auth/logout"
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                display: 'inline-block'
              }}
            >
              Logout
            </a>
          </div>
        </div>
      ) : (
        <div>
          <p>Please sign in to access your profile.</p>
          <a 
            href="/api/auth/login"
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              display: 'inline-block'
            }}
          >
            Sign In
          </a>
        </div>
      )}
    </div>
  );
}