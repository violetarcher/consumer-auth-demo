'use client';

import React, { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

export function UserDropdown() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          opacity: isOpen ? 0.8 : 1
        }}
      >
        {user.picture && (
          <img
            src={user.picture}
            alt={user.name || 'User'}
            style={{
              height: '32px',
              width: '32px',
              borderRadius: '50%'
            }}
          />
        )}
        <span style={{ fontSize: '14px', fontWeight: '600' }}>
          {user.name}
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            marginTop: '8px',
            width: '224px',
            background: 'white',
            borderRadius: '6px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
            paddingTop: '4px',
            paddingBottom: '4px',
            zIndex: 50
          }}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderBottom: '1px solid #f3f4f6'
          }}>
            {user.picture && (
              <img
                src={user.picture}
                alt={user.name || 'User'}
                style={{
                  height: '32px',
                  width: '32px',
                  borderRadius: '50%'
                }}
              />
            )}
            <div>
              {user.name && <p style={{ fontSize: '14px', fontWeight: '500', margin: 0 }}>{user.name}</p>}
              {user.email && (
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                  {user.email}
                </p>
              )}
            </div>
          </div>

          <a 
            href="/profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 16px',
              fontSize: '14px',
              color: '#374151',
              textDecoration: 'none'
            }}
            onClick={() => setIsOpen(false)}
          >
            <span style={{ marginRight: '8px' }}>👤</span>
            Profile
          </a>

          <button 
            disabled
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '8px 16px',
              fontSize: '14px',
              color: '#9ca3af',
              background: 'transparent',
              border: 'none',
              cursor: 'not-allowed'
            }}
          >
            <span style={{ marginRight: '8px' }}>⚙️</span>
            Settings
          </button>

          <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

          <a
            href="/api/auth/logout"
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '8px 16px',
              fontSize: '14px',
              color: '#dc2626',
              textDecoration: 'none'
            }}
            onClick={() => setIsOpen(false)}
          >
            <span style={{ marginRight: '8px' }}>🚪</span>
            Sign Out
          </a>
        </div>
      )}
    </div>
  );
}