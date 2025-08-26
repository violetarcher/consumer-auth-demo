import { getSession, getAccessToken } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { step } = body;

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
          details: errorText
        }, { status: 500 });
      }

      const tokenData = await tokenResponse.json();
      accessToken = tokenData.access_token;

      console.log('Successfully got My Account API access token');
    } catch (tokenError) {
      console.error('Error getting My Account API token:', tokenError);
      return NextResponse.json({ 
        error: 'Failed to authenticate with My Account API' 
      }, { status: 500 });
    }

    if (step === 'initiate') {
      // Step 1: Initiate passkey enrollment using My Account API
      console.log('Initiating passkey enrollment for user:', session.user.email);

      const enrollmentResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/me/v1/authentication-methods`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'passkey',
          // Use the default database connection name - adjust as needed  
          connection: process.env.AUTH0_DATABASE_CONNECTION || 'Username-Password-Authentication',
          identity: session.user.sub
        })
      });

      console.log('My Account API enrollment response status:', enrollmentResponse.status);

      if (!enrollmentResponse.ok) {
        const errorText = await enrollmentResponse.text();
        console.error('My Account API passkey enrollment failed:', enrollmentResponse.status, errorText);
        return NextResponse.json({
          error: 'Failed to initiate passkey enrollment via My Account API',
          details: errorText
        }, { status: enrollmentResponse.status });
      }

      const enrollmentData = await enrollmentResponse.json();
      console.log('Passkey enrollment initiated successfully via My Account API');

      return NextResponse.json({
        success: true,
        message: 'Passkey enrollment initiated',
        authSession: enrollmentData.auth_session,
        publicKeyCreationOptions: enrollmentData.public_key_creation_options
      });

    } else if (step === 'verify') {
      // Step 2: Verify passkey enrollment using My Account API
      const { authSession, credential } = body;

      if (!authSession || !credential) {
        return NextResponse.json({
          error: 'Missing required fields: authSession and credential'
        }, { status: 400 });
      }

      console.log('Verifying passkey enrollment for user:', session.user.email);

      const verifyResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/me/v1/authentication-methods/passkey|new/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          auth_session: authSession,
          credential: credential
        })
      });

      console.log('My Account API verification response status:', verifyResponse.status);

      if (!verifyResponse.ok) {
        const errorText = await verifyResponse.text();
        console.error('My Account API passkey verification failed:', verifyResponse.status, errorText);
        return NextResponse.json({
          error: 'Failed to verify passkey enrollment via My Account API',
          details: errorText
        }, { status: verifyResponse.status });
      }

      const verificationData = await verifyResponse.json();
      console.log('Passkey enrollment verified successfully via My Account API');

      return NextResponse.json({
        success: true,
        message: 'Passkey enrolled successfully',
        ...verificationData
      });

    } else {
      return NextResponse.json({
        error: 'Invalid step. Must be "initiate" or "verify"'
      }, { status: 400 });
    }

  } catch (error: unknown) {
    console.error('Error in passkey enrollment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to process passkey enrollment', details: errorMessage }, 
      { status: 500 }
    );
  }
}