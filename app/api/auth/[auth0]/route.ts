import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';

export const GET = handleAuth({
  login: handleLogin((req) => {
    const url = new URL(req.url!);
    
    // Check if this is a step-up MFA request
    const acrValues = url.searchParams.get('acr_values');
    const isStepUp = acrValues && acrValues.includes('multi-factor');
    
    // Get other parameters
    const prompt = url.searchParams.get('prompt');
    const maxAge = url.searchParams.get('max_age');
    const loginHint = url.searchParams.get('login_hint');

    const authorizationParams: any = {};
    
    if (isStepUp) {
      // For step-up MFA, set ACR values without prompt to avoid password re-entry
      authorizationParams.acr_values = acrValues;
      // Don't include prompt for step-up to avoid forcing login screen
      if (loginHint) {
        authorizationParams.login_hint = loginHint;
      }
    } else {
      // For regular login, pass through all parameters
      if (acrValues) authorizationParams.acr_values = acrValues;
      if (prompt) authorizationParams.prompt = prompt;
      if (loginHint) authorizationParams.login_hint = loginHint;
    }
    
    if (maxAge) {
      authorizationParams.max_age = parseInt(maxAge) || undefined;
    }

    return { authorizationParams };
  })
});