#!/usr/bin/env node

/**
 * Bundle Auth0 ACUL SDK for browser use with esbuild
 */

const { build } = require('esbuild');
const fs = require('fs');
const path = require('path');

// First create the entry point
const entryContent = `
import LoginId from '@auth0/auth0-acul-js/login-id';
import Signup from '@auth0/auth0-acul-js/signup';
import LoginPassword from '@auth0/auth0-acul-js/login-password';
import SignupPassword from '@auth0/auth0-acul-js/signup-password';
import Consent from '@auth0/auth0-acul-js/consent';
import CustomizedConsent from '@auth0/auth0-acul-js/customized-consent';

window.Auth0ACUL = {
  LoginId,
  Signup,
  LoginPassword,
  SignupPassword,
  Consent,
  CustomizedConsent
};

console.log('✅ Auth0 ACUL SDK loaded');
console.log('Available:', Object.keys(window.Auth0ACUL));
`;

const entryPath = path.join(__dirname, '../temp-sdk-entry.js');
const outputPath = path.join(__dirname, '../public/auth0-assets/auth0-acul-sdk-bundled.js');

// Write entry file
fs.writeFileSync(entryPath, entryContent);

// Bundle with esbuild
build({
  entryPoints: [entryPath],
  bundle: true,
  format: 'iife',
  globalName: 'Auth0ACULBundle',
  outfile: outputPath,
  platform: 'browser',
  target: 'es2020',
  minify: false,
  sourcemap: false,
}).then(() => {
  // Clean up temp file
  fs.unlinkSync(entryPath);
  console.log('✅ ACUL SDK bundled successfully at:', outputPath);
  console.log('📦 Bundle size:', fs.statSync(outputPath).size, 'bytes');
}).catch((error) => {
  console.error('❌ Bundle failed:', error);
  if (fs.existsSync(entryPath)) {
    fs.unlinkSync(entryPath);
  }
  process.exit(1);
});
