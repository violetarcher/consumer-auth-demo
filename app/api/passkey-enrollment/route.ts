import { getSession, getAccessToken } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { step, externalToken } = body;

    // Get access token for My Account API
    let accessToken: string;
    
    if (externalToken) {
      // Use the token provided from the popup authorization
      accessToken = externalToken;
      console.log('Using external access token from popup authorization');
    } else {
      // Get the default access token (already has My Account API audience and scope)
      try {
        const { accessToken: userAccessToken } = await getAccessToken();
        
        if (!userAccessToken) {
          return NextResponse.json({ 
            error: 'No access token available'
          }, { status: 401 });
        }
        
        accessToken = userAccessToken;
        console.log('Using default access token for My Account API');
      } catch (tokenError) {
        console.error('Error getting access token:', tokenError);
        return NextResponse.json({ 
          error: 'Failed to get access token',
          details: tokenError instanceof Error ? tokenError.message : 'Unknown error'
        }, { status: 401 });
      }
    }

    if (step === 'initiate') {
      // Step 1: Initiate passkey enrollment using My Account API
      const identity = session.user.sub;
      console.log('Initiating passkey enrollment for user:', session.user.email);
      console.log('Using identity:', identity, 'from sub:', session.user.sub);

      // Use the My Account API with the Management API domain
      const enrollmentResponse = await fetch(`https://${process.env.AUTH0_MANAGEMENT_DOMAIN}/me/v1/authentication-methods`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'passkey',
          identity: identity
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
      console.log('Raw enrollment data:', JSON.stringify(enrollmentData, null, 2));

      return NextResponse.json({
        success: true,
        message: 'Passkey enrollment initiated',
        authSession: enrollmentData.auth_session,
        publicKeyCreationOptions: enrollmentData.authn_params_public_key
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

      const verifyResponse = await fetch(`https://${process.env.AUTH0_MANAGEMENT_DOMAIN}/me/v1/authentication-methods/passkey|new/verify`, {
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