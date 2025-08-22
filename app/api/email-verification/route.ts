import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { ManagementClient } from 'auth0';

export async function POST() {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Check if we have M2M credentials
    if (!process.env.AUTH0_M2M_CLIENT_ID || !process.env.AUTH0_M2M_CLIENT_SECRET) {
      return NextResponse.json({
        success: false,
        error: 'Email verification not available in demo mode'
      }, { status: 500 });
    }

    try {
      // Initialize Auth0 Management API client
      const management = new ManagementClient({
        domain: process.env.AUTH0_ISSUER_BASE_URL!.replace('https://', ''),
        clientId: process.env.AUTH0_M2M_CLIENT_ID!,
        clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET!
      });

      // Send email verification
      await management.jobs.verifyEmail({
        user_id: session.user.sub!
      });

      console.log('Email verification sent to:', session.user.email);

      return NextResponse.json({
        success: true,
        message: 'Email verification link sent successfully'
      });
    } catch (apiError: any) {
      console.error('Auth0 Management API error:', apiError);
      return NextResponse.json({
        success: false,
        error: 'Failed to send email verification',
        details: apiError.message
      }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error('Error sending email verification:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to send email verification', details: errorMessage }, 
      { status: 500 }
    );
  }
}