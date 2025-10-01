/**
 * Auth0 ACUL SDK Browser Bundle
 * This file imports and exposes the Auth0 ACUL SDK classes for browser use
 */

// Import the SDK classes from node_modules
import LoginId from '@auth0/auth0-acul-js/login-id';
import Signup from '@auth0/auth0-acul-js/signup';
import LoginPassword from '@auth0/auth0-acul-js/login-password';

// Expose them on window.Auth0ACUL for our custom screens to use
window.Auth0ACUL = {
  LoginId,
  Signup,
  LoginPassword
};

console.log('✅ Auth0 ACUL SDK loaded and available at window.Auth0ACUL');
