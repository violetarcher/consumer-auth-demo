'use client';

import { useEffect } from 'react';

export default function PasskeyCallback() {
  useEffect(() => {
    // Extract the access token from the URL fragment
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const state = params.get('state');
    
    if (accessToken && state === 'passkey_enrollment') {
      // Send the token back to the parent window
      if (window.opener) {
        window.opener.postMessage({
          type: 'PASSKEY_AUTH_SUCCESS',
          accessToken: accessToken
        }, window.location.origin);
        window.close();
      }
    } else {
      // Handle error
      const error = params.get('error');
      const errorDescription = params.get('error_description');
      
      if (window.opener) {
        window.opener.postMessage({
          type: 'PASSKEY_AUTH_ERROR',
          error: error || 'Authorization failed',
          description: errorDescription
        }, window.location.origin);
        window.close();
      }
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p>Processing authorization...</p>
      </div>
    </div>
  );
}