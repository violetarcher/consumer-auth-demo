import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';

export const GET = handleAuth({
  login: handleLogin((req: NextRequest) => {
    const url = new URL(req.url!);
    
    // Pass through acr_values for step-up authentication
    const acrValues = url.searchParams.get('acr_values');
    const prompt = url.searchParams.get('prompt');
    const maxAge = url.searchParams.get('max_age');

    return {
      authorizationParams: {
        ...(acrValues && { acr_values: acrValues }),
        ...(prompt && { prompt: prompt }),
        ...(maxAge && { max_age: parseInt(maxAge) || undefined })
      }
    };
  })
});