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

    // Get user's access token for My Account API calls
    // The My Account API requires the authenticated user's access token, not M2M credentials
    const { accessToken } = await getAccessToken();

    if (!accessToken) {
      console.error('Failed to get user access token for My Account API');
      return NextResponse.json({ 
        error: 'Failed to authenticate user for My Account API' 
      }, { status: 500 });
    }

    console.log('Using user access token for My Account API');

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