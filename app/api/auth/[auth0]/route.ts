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
    // Removed login_hint to force Auth0 to show login-id screen

    const authorizationParams: any = {};

    if (isStepUp) {
      // For step-up MFA, set ACR values without prompt to avoid password re-entry
      authorizationParams.acr_values = acrValues;
      // Don't include login_hint for step-up to ensure proper flow
    } else {
      // For regular login, pass through parameters but exclude login_hint
      if (acrValues) authorizationParams.acr_values = acrValues;
      if (prompt) authorizationParams.prompt = prompt;
      // Explicitly NOT setting login_hint to force identifier collection
    }
    
    if (maxAge) {
      authorizationParams.max_age = parseInt(maxAge) || undefined;
    }

    return { authorizationParams };
  })
});