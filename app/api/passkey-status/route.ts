import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // For My Account API, we need to get a token with the specific /me/ audience
    // Since the default audience is Management API, we need to request a new token
    const myAccountAudience = `${process.env.AUTH0_ISSUER_BASE_URL}/me/`;
    let accessToken: string;
    
    try {
      // Get an access token specifically for the My Account API audience
      const tokenResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.AUTH0_M2M_CLIENT_ID,
          client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
          audience: myAccountAudience,
          grant_type: 'client_credentials',
          scope: 'create:me:authentication_methods'
        })
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Failed to get My Account API token:', tokenResponse.status, errorText);
        return NextResponse.json({ 
          error: 'Failed to get My Account API access token',
          details: errorText,
          hasPasskeys: false,
          passkeys: []
        }, { status: 500 });
      }

      const tokenData = await tokenResponse.json();
      accessToken = tokenData.access_token;

      console.log('Successfully got My Account API access token for status check');
    } catch (tokenError) {
      console.error('Error getting My Account API token:', tokenError);
      return NextResponse.json({ 
        error: 'Failed to authenticate with My Account API',
        hasPasskeys: false,
        passkeys: []
      }, { status: 500 });
    }

    console.log('Checking passkey status for user:', session.user.email);

    // Get user's authentication methods from My Account API
    const methodsResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/me/v1/authentication-methods`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('My Account API methods response status:', methodsResponse.status);

    if (!methodsResponse.ok) {
      const errorText = await methodsResponse.text();
      console.error('Failed to get authentication methods:', methodsResponse.status, errorText);
      
      // Return default state if API call fails
      return NextResponse.json({
        hasPasskeys: false,
        passkeys: [],
        error: 'Unable to check passkey status'
      });
    }

    const methodsData = await methodsResponse.json();
    console.log('User authentication methods retrieved');

    // Filter for passkey methods
    const passkeys = methodsData.filter((method: { type: string }) => method.type === 'passkey');
    const hasPasskeys = passkeys.length > 0;

    return NextResponse.json({
      hasPasskeys,
      passkeys,
      totalMethods: methodsData.length
    });

  } catch (error: unknown) {
    console.error('Error checking passkey status:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Failed to check passkey status', 
        details: errorMessage,
        hasPasskeys: false,
        passkeys: []
      }, 
      { status: 500 }
    );
  }
}