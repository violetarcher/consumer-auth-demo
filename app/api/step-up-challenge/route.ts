import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { ManagementClient } from 'auth0';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number required for step-up challenge' }, { status: 400 });
    }

    // Check if we have M2M credentials
    if (!process.env.AUTH0_M2M_CLIENT_ID || !process.env.AUTH0_M2M_CLIENT_SECRET) {
      return NextResponse.json({
        success: false,
        error: 'Step-up challenge not available in demo mode'
      }, { status: 500 });
    }

    try {
      // Initialize Auth0 Management API client
      const management = new ManagementClient({
        domain: process.env.AUTH0_MANAGEMENT_DOMAIN!,
        clientId: process.env.AUTH0_M2M_CLIENT_ID!,
        clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET!
      });

      // Store the pending phone number in user metadata for the Action to use
      const currentUser = await management.users.get({ id: session.user.sub! });
      const existingMetadata = currentUser.data.user_metadata || {};
      
      await management.users.update(
        { id: session.user.sub! },
        {
          user_metadata: {
            ...existingMetadata,
            pending_phone_number: phoneNumber,
            phone_verification_status: 'challenge_initiated',
            step_up_challenge_started: new Date().toISOString()
          }
        }
      );

      // For step-up MFA, only use acr_values and login_hint without prompt
      // This will trigger MFA enrollment/challenge without forcing password re-entry
      // Our Auth0 route handler detects step-up case and omits prompt parameter
      const challengeUrl = `/api/auth/login?` +
        `acr_values=${encodeURIComponent('http://schemas.openid.net/pape/policies/2007/06/multi-factor')}&` +
        `login_hint=${encodeURIComponent(session.user.email!)}&` +
        `returnTo=${encodeURIComponent('/profile?tab=security')}`;

      console.log('Step-up challenge initiated for:', phoneNumber);
      console.log('Challenge URL:', challengeUrl);

      return NextResponse.json({
        success: true,
        message: 'Step-up challenge initiated',
        challengeUrl,
        redirectRequired: true
      });

    } catch (apiError: unknown) {
      console.error('Auth0 Management API error:', apiError);
      return NextResponse.json({
        success: false,
        error: 'Failed to initiate step-up challenge',
        details: apiError instanceof Error ? apiError.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error('Error initiating step-up challenge:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to initiate step-up challenge', details: errorMessage }, 
      { status: 500 }
    );
  }
}