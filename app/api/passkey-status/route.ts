import { getSession, getAccessToken } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get the default access token (already has My Account API audience and scope)
    let accessToken: string;
    
    try {
      const { accessToken: userAccessToken } = await getAccessToken();
      
      if (!userAccessToken) {
        return NextResponse.json({
          hasPasskeys: false,
          passkeys: [],
          error: 'No access token available'
        });
      }
      
      accessToken = userAccessToken;
      console.log('Successfully got default access token for status check');
    } catch (tokenError) {
      console.error('Error getting access token:', tokenError);
      return NextResponse.json({ 
        error: 'Failed to get access token',
        hasPasskeys: false,
        passkeys: []
      }, { status: 500 });
    }

    console.log('Checking passkey status for user:', session.user.email);

    // Get user's authentication methods from My Account API
    const methodsResponse = await fetch(`https://${process.env.AUTH0_MANAGEMENT_DOMAIN}/me/v1/authentication-methods`, {
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