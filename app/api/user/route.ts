import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { ManagementClient } from 'auth0';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Check if we have M2M credentials
    if (!process.env.AUTH0_M2M_CLIENT_ID || !process.env.AUTH0_M2M_CLIENT_SECRET) {
      // Fallback to session user data if no M2M credentials
      console.log('No M2M credentials found, using session data:', session.user);
      
      return NextResponse.json({
        success: true,
        user: session.user
      });
    }

    // Initialize Auth0 Management API client
    const management = new ManagementClient({
      domain: process.env.AUTH0_ISSUER_BASE_URL!.replace('https://', ''),
      clientId: process.env.AUTH0_M2M_CLIENT_ID!,
      clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET!
    });

    // Fetch fresh user data from Auth0
    const user = await management.users.get({ id: session.user.sub! });
    
    console.log('User phone data:', {
      phone_number: user.data.phone_number,
      phone_number_verified: user.data.phone_number_verified,
      user_metadata_phone: user.data.user_metadata?.phone_number,
      phone_verified_via_mfa: user.data.user_metadata?.phone_verified_via_mfa,
      full_user_metadata: user.data.user_metadata
    });

    return NextResponse.json({
      success: true,
      user: user.data
    });
  } catch (error: unknown) {
    console.error('Error fetching user data:', error);
    
    // Provide more specific error messages
    const errorObj = error as { statusCode?: number };
    if (errorObj.statusCode === 401) {
      return NextResponse.json(
        { error: 'Unauthorized: Check Management API credentials' }, 
        { status: 401 }
      );
    } else if (errorObj.statusCode === 403) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient scopes for user read' }, 
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch user data', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}