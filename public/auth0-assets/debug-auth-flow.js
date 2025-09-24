// Debug Auth0 Login Flow
// This script helps debug what's happening with the Auth0 login flow

console.log('🔍 Auth0 Login Flow Debug');
console.log('Current URL:', window.location.href);
console.log('Referrer:', document.referrer);

// Check URL parameters
const urlParams = new URLSearchParams(window.location.search);
console.log('URL Parameters:');
for (let [key, value] of urlParams.entries()) {
  console.log(`  ${key}: ${value}`);
}

// Check for Auth0 specific parameters
const authParams = [
  'client_id', 'redirect_uri', 'response_type', 'scope',
  'state', 'nonce', 'login_hint', 'prompt', 'max_age',
  'screen_hint', 'connection', 'acr_values'
];

console.log('Auth0 Parameters:');
authParams.forEach(param => {
  if (urlParams.has(param)) {
    console.log(`  ✅ ${param}: ${urlParams.get(param)}`);
  }
});

// Check if we're on the right screen
const pathname = window.location.pathname;
console.log('Current screen path:', pathname);

if (pathname.includes('login-password') || pathname.includes('password')) {
  console.warn('🚨 ON PASSWORD SCREEN - Login-ID screen was skipped!');
  console.log('This suggests:');
  console.log('  1. Login-ID screen is not enabled in Auth0 Dashboard');
  console.log('  2. Auth0 tenant is not configured for identifier-first flow');
  console.log('  3. There might be a login_hint or other parameter causing the skip');
}

if (pathname.includes('login-id') || pathname.includes('identifier')) {
  console.log('✅ ON LOGIN-ID SCREEN - This is correct!');
}

// Check for Auth0 configuration
if (typeof Auth0 !== 'undefined') {
  console.log('Auth0 SDK available:', typeof Auth0);
} else {
  console.log('Auth0 SDK not loaded');
}

// Check localStorage for any Auth0 state
console.log('localStorage Auth0 entries:');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && key.includes('auth0')) {
    console.log(`  ${key}: ${localStorage.getItem(key)?.substring(0, 100)}...`);
  }
}

// Check sessionStorage too
console.log('sessionStorage Auth0 entries:');
for (let i = 0; i < sessionStorage.length; i++) {
  const key = sessionStorage.key(i);
  if (key && key.includes('auth0')) {
    console.log(`  ${key}: ${sessionStorage.getItem(key)?.substring(0, 100)}...`);
  }
}