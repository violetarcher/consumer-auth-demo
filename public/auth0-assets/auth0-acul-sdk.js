
/**
 * Auth0 ACUL SDK Browser Bundle
 * Auto-generated - Do not edit manually
 */

// Import and re-export the SDK classes
import LoginId from '@auth0/auth0-acul-js/login-id';
import Signup from '@auth0/auth0-acul-js/signup';
import LoginPassword from '@auth0/auth0-acul-js/login-password';

// Expose on window for browser access
window.Auth0ACUL = {
  LoginId,
  Signup,
  LoginPassword
};

console.log('✅ Auth0 ACUL SDK loaded and available at window.Auth0ACUL');
console.log('  - LoginId:', typeof LoginId);
console.log('  - Signup:', typeof Signup);
console.log('  - LoginPassword:', typeof LoginPassword);
