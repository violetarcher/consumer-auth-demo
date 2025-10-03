import type { Metadata } from 'next';
import React from 'react';
import ClientAuthProvider from '@/components/ClientAuthProvider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

export const metadata: Metadata = {
  title: 'ConsumerAuth - Next.js + Auth0 ACUL',
  description: 'Advanced authentication platform built on Next.js with Auth0 Advanced Customization for Universal Login',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientAuthProvider>
          {children}
          <Toaster />
        </ClientAuthProvider>
      </body>
    </html>
  );
}