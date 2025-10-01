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
      // For step-up MFA, pass through login_hint to leverage existing session
      // This allows Auth0 to use the active session without prompting for password
      authorizationParams.acr_values = acrValues;
      if (loginHint) {
        authorizationParams.login_hint = loginHint;
      }
    } else {
      // For regular login, pass through parameters but exclude login_hint
      if (acrValues) authorizationParams.acr_values = acrValues;
      if (prompt) authorizationParams.prompt = prompt;
      // Explicitly NOT setting login_hint to force identifier collection

      if (maxAge) {
        authorizationParams.max_age = parseInt(maxAge) || undefined;
      }
    }

    return { authorizationParams };
  })
});