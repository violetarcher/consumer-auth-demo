'use client';

import { useState } from 'react';

export default function DebugLogin() {
  const [debugInfo, setDebugInfo] = useState<string>('');

  const handleLoginDebug = async () => {
    // Capture the actual login URL that would be generated
    const loginUrl = '/api/auth/login';

    // First, let's see what URL is actually being hit
    setDebugInfo(`Initiating login to: ${loginUrl}\n`);

    // Create a temporary form to capture the redirect
    const form = document.createElement('form');
    form.method = 'GET';
    form.action = loginUrl;
    form.style.display = 'none';
    document.body.appendChild(form);

    // Add an event listener to capture the redirect
    window.addEventListener('beforeunload', (e) => {
      console.log('Redirecting to Auth0...');
    });

    // Instead of submitting, let's manually navigate and log
    window.location.href = loginUrl;
  };

  const handleDirectAuth0 = () => {
    // Let's try going directly to Auth0 with minimal parameters
    const auth0Url = `https://login.consumerauth.com/authorize?` +
      `client_id=951zLrqjtb6QpKTTX8tDHPUe5JUq12Sq&` +
      `redirect_uri=${encodeURIComponent('http://localhost:4000/api/auth/callback')}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent('openid profile email')}&` +
      `state=test-state&` +
      `nonce=test-nonce`;

    setDebugInfo(`Direct Auth0 URL: ${auth0Url}\n`);
    console.log('Direct Auth0 URL:', auth0Url);

    window.location.href = auth0Url;
  };

  const handleForceIdentifierFirst = () => {
    // Try with explicit screen_hint
    const auth0Url = `https://login.consumerauth.com/authorize?` +
      `client_id=951zLrqjtb6QpKTTX8tDHPUe5JUq12Sq&` +
      `redirect_uri=${encodeURIComponent('http://localhost:4000/api/auth/callback')}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent('openid profile email')}&` +
      `state=test-state&` +
      `nonce=test-nonce&` +
      `screen_hint=login-id&` +
      `prompt=login`;

    setDebugInfo(`Forced identifier-first URL: ${auth0Url}\n`);
    console.log('Forced identifier-first URL:', auth0Url);

    window.location.href = auth0Url;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Auth0 Login Debug</h1>

          <div className="space-y-4">
            <button
              onClick={handleLoginDebug}
              className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
            >
              Test Normal Login (via Next.js)
            </button>

            <button
              onClick={handleDirectAuth0}
              className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600"
            >
              Test Direct Auth0 (Minimal Params)
            </button>

            <button
              onClick={handleForceIdentifierFirst}
              className="w-full bg-purple-500 text-white p-3 rounded hover:bg-purple-600"
            >
              Force Identifier-First (With screen_hint)
            </button>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Debug Steps:</h3>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Open browser Developer Tools (F12)</li>
                <li>Go to Network tab</li>
                <li>Check "Preserve log"</li>
                <li>Click one of the buttons above</li>
                <li>Check the network requests to see the Auth0 URL</li>
                <li>Look for any parameters that might cause screen skipping</li>
              </ol>
            </div>

            {debugInfo && (
              <div className="mt-4 p-3 bg-gray-100 rounded">
                <h4 className="font-semibold">Debug Info:</h4>
                <pre className="text-xs whitespace-pre-wrap">{debugInfo}</pre>
              </div>
            )}
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <p><strong>Expected behavior:</strong></p>
            <p>• All three buttons should show the login-id screen first</p>
            <p>• If any go to password screen, we can see the exact URL that causes it</p>
          </div>

          <div className="mt-4">
            <a href="/" className="text-blue-500 hover:underline">← Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
}