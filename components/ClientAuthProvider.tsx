'use client';

import React, { ReactNode } from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function ClientAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  );
}