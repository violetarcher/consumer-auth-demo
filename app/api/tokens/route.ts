import { getAccessToken, getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get access token
    const { accessToken } = await getAccessToken();
    
    // Debug ID token specifically
    console.log('ID Token details:', {
      hasIdToken: !!session.idToken,
      idTokenType: typeof session.idToken,
      idTokenLength: session.idToken ? session.idToken.length : 0,
      idTokenPreview: session.idToken ? session.idToken.substring(0, 50) + '...' : 'null'
    });
    
    return NextResponse.json({
      accessToken: accessToken || null,
      idToken: session.idToken || null,
      user: session.user
    });
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return NextResponse.json({ error: 'Failed to fetch tokens' }, { status: 500 });
  }
}