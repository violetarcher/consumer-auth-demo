#!/usr/bin/env node

/**
 * Build script to bundle Auth0 ACUL SDK for browser use
 * This creates a standalone JS file that can be loaded via <script> tag
 */

const fs = require('fs');
const path = require('path');

// Read the SDK files
const sdkBasePath = path.join(__dirname, '../node_modules/@auth0/auth0-acul-js/dist');
const outputPath = path.join(__dirname, '../public/auth0-assets/auth0-acul-sdk.js');

// Create a wrapper that exposes the SDK globally
const sdkWrapper = `
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
`;

fs.writeFileSync(outputPath, sdkWrapper);
console.log('✅ ACUL SDK bundle created at:', outputPath);
console.log('📝 Note: This file uses ES6 imports and must be loaded as type="module"');
