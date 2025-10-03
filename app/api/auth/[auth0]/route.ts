import { handleAuth, handleLogin, handleCallback } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ManagementClient } from 'auth0';

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
    const screenHint = url.searchParams.get('screen_hint');

    const authorizationParams: any = {};

    if (isStepUp) {
      // For step-up MFA, pass through login_hint to leverage existing session
      // This allows Auth0 to use the active session without prompting for password
      authorizationParams.acr_values = acrValues;
      if (loginHint) {
        authorizationParams.login_hint = loginHint;
      }
    } else {
      // For regular login/signup, pass through parameters
      if (acrValues) authorizationParams.acr_values = acrValues;
      if (prompt) authorizationParams.prompt = prompt;
      if (loginHint) authorizationParams.login_hint = loginHint;
      if (screenHint) authorizationParams.screen_hint = screenHint;

      if (maxAge) {
        authorizationParams.max_age = parseInt(maxAge) || undefined;
      }
    }

    return { authorizationParams };
  }),

  signup: handleLogin((req) => {
    const url = new URL(req.url!);
    const loginHint = url.searchParams.get('login_hint');

    const authorizationParams: any = {
      screen_hint: 'signup'
    };

    if (loginHint) {
      authorizationParams.login_hint = loginHint;
    }

    return {
      authorizationParams,
      returnTo: '/profile'
    };
  }),

  callback: handleCallback({
    async afterCallback(_req, session) {
      console.log('=== Auth0 Callback - Processing signup data ===');

      try {
        const cookieStore = await cookies();
        const signupDataCookie = cookieStore.get('signup_data');

        if (signupDataCookie && session?.user) {
          console.log('Found signup data cookie, updating user metadata...');
          const signupData = JSON.parse(signupDataCookie.value);

          // Check if we have M2M credentials
          if (process.env.AUTH0_M2M_CLIENT_ID && process.env.AUTH0_M2M_CLIENT_SECRET) {
            try {
              const management = new ManagementClient({
                domain: process.env.AUTH0_MANAGEMENT_DOMAIN!,
                clientId: process.env.AUTH0_M2M_CLIENT_ID!,
                clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET!
              });

              // Update user metadata with signup data
              await management.users.update(
                { id: session.user.sub! },
                {
                  user_metadata: {
                    first_name: signupData.firstName,
                    last_name: signupData.lastName,
                    phone_number: signupData.phoneNumber,
                    zip_code: signupData.zipCode,
                    birthdate: signupData.birthdate,
                    loyalty_program_member: signupData.loyaltyProgram,
                    signup_source: 'homepage_modal',
                    signup_timestamp: signupData.timestamp
                  },
                  // Also set name if not already set
                  name: `${signupData.firstName} ${signupData.lastName}`
                }
              );

              console.log('User metadata updated successfully for:', session.user.sub);

              // Clear the signup data cookie
              cookieStore.delete('signup_data');
            } catch (error) {
              console.error('Error updating user metadata:', error);
              // Don't fail the login if metadata update fails
            }
          }
        }
      } catch (error) {
        console.error('Error in callback processing:', error);
        // Don't fail the login if there's an error
      }

      return session;
    }
  })
});