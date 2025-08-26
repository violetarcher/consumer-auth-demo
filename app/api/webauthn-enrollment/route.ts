import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { step } = body;

    // Get Management API access token using M2M credentials
    let accessToken: string;
    
    try {
      const tokenResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.AUTH0_M2M_CLIENT_ID,
          client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
          audience: process.env.AUTH0_AUDIENCE,
          grant_type: 'client_credentials',
          scope: 'create:guardian_enrollment_tickets read:guardian_enrollments'
        })
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Failed to get Management API token:', tokenResponse.status, errorText);
        return NextResponse.json({ 
          error: 'Failed to get Management API access token',
          details: errorText
        }, { status: 500 });
      }

      const tokenData = await tokenResponse.json();
      accessToken = tokenData.access_token;

      console.log('Successfully got Management API access token');
    } catch (tokenError) {
      console.error('Error getting Management API token:', tokenError);
      return NextResponse.json({ 
        error: 'Failed to authenticate with Management API' 
      }, { status: 500 });
    }

    if (step === 'initiate') {
      // Step 1: Check if user has existing MFA factors and if session has MFA claim
      console.log('Checking MFA enrollment eligibility for user:', session.user.sub);

      // Check if user's session includes MFA claim (indicating they've passed MFA recently)
      const hasMFAClaim = session.user['http://schemas.openid.net/pape/policies/2007/06/multi-factor'];
      
      // Get user's existing enrollments
      const enrollmentsResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${session.user.sub}/enrollments`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!enrollmentsResponse.ok) {
        const errorText = await enrollmentsResponse.text();
        console.error('Failed to get user enrollments:', enrollmentsResponse.status, errorText);
        return NextResponse.json({
          error: 'Failed to check existing MFA factors',
          details: errorText
        }, { status: enrollmentsResponse.status });
      }

      const enrollments = await enrollmentsResponse.json();
      console.log('User has existing MFA enrollments:', enrollments.length);

      if (enrollments.length === 0) {
        // User has no existing MFA factors, use regular enrollment ticket
        const ticketResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/guardian/enrollments/ticket`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: session.user.sub,
            email: session.user.email,
            send_mail: false
          })
        });

        if (!ticketResponse.ok) {
          const errorText = await ticketResponse.text();
          console.error('Guardian enrollment ticket creation failed:', ticketResponse.status, errorText);
          return NextResponse.json({
            error: 'Failed to create WebAuthn enrollment ticket',
            details: errorText
          }, { status: ticketResponse.status });
        }

        const ticketData = await ticketResponse.json();
        let enrollmentUrl = ticketData.ticket_url;
        if (enrollmentUrl && enrollmentUrl.includes('login.consumerauth.com')) {
          enrollmentUrl = enrollmentUrl.replace('login.consumerauth.com', 'archfaktor.us.auth0.com');
        }

        return NextResponse.json({
          success: true,
          message: 'WebAuthn enrollment ticket created for new user',
          enrollmentUrl: enrollmentUrl,
          ticketId: ticketData.ticket_id
        });
      }

      // User has existing MFA factors - check if they have recent MFA claim
      if (!hasMFAClaim) {
        // User needs to complete step-up MFA first
        return NextResponse.json({
          success: false,
          message: 'MFA verification required before enrolling additional factors',
          requiresStepUp: true,
          stepUpMessage: 'Please complete MFA verification first to enroll additional factors.'
        }, { status: 403 });
      }

      // User has MFA claim - they can enroll additional factors
      // For now, direct them to complete step-up which will give them the right session state
      return NextResponse.json({
        success: false,
        message: 'Additional MFA enrollment not yet implemented via API',
        requiresManualEnrollment: true,
        manualMessage: 'Please contact support to enable additional WebAuthn factors.'
      }, { status: 501 });

    } else if (step === 'verify') {
      // This step may not be needed for Guardian enrollment tickets
      // Guardian handles the enrollment process end-to-end
      return NextResponse.json({
        success: true,
        message: 'WebAuthn enrollment completed via Guardian'
      });

    } else {
      return NextResponse.json({
        error: 'Invalid step. Must be "initiate" or "verify"'
      }, { status: 400 });
    }

  } catch (error: unknown) {
    console.error('Error in WebAuthn enrollment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to process WebAuthn enrollment', details: errorMessage }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get Management API access token using M2M credentials
    let accessToken: string;
    
    try {
      const tokenResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.AUTH0_M2M_CLIENT_ID,
          client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
          audience: process.env.AUTH0_AUDIENCE,
          grant_type: 'client_credentials',
          scope: 'read:guardian_enrollments'
        })
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Failed to get Management API token:', tokenResponse.status, errorText);
        return NextResponse.json({ 
          error: 'Failed to get Management API access token',
          details: errorText,
          hasWebAuthn: false,
          methods: []
        }, { status: 500 });
      }

      const tokenData = await tokenResponse.json();
      accessToken = tokenData.access_token;

      console.log('Successfully got Management API access token for WebAuthn status');
    } catch (tokenError) {
      console.error('Error getting Management API token:', tokenError);
      return NextResponse.json({ 
        error: 'Failed to authenticate with Management API',
        hasWebAuthn: false,
        methods: []
      }, { status: 500 });
    }

    console.log('Checking WebAuthn status for user:', session.user.sub);

    // Get user's Guardian enrollments
    const enrollmentsResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${session.user.sub}/enrollments`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Guardian enrollments response status:', enrollmentsResponse.status);

    if (!enrollmentsResponse.ok) {
      const errorText = await enrollmentsResponse.text();
      console.error('Failed to get Guardian enrollments:', enrollmentsResponse.status, errorText);
      
      return NextResponse.json({
        hasWebAuthn: false,
        methods: [],
        error: 'Unable to check WebAuthn status'
      });
    }

    const enrollmentsData = await enrollmentsResponse.json();
    console.log('User Guardian enrollments retrieved');

    // Filter for WebAuthn enrollments
    const webauthnMethods = enrollmentsData.filter((enrollment: { type: string }) => 
      enrollment.type === 'webauthn-platform' || enrollment.type === 'webauthn-roaming'
    );
    const hasWebAuthn = webauthnMethods.length > 0;

    return NextResponse.json({
      hasWebAuthn,
      methods: webauthnMethods,
      totalMethods: enrollmentsData.length
    });

  } catch (error: unknown) {
    console.error('Error checking WebAuthn status:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Failed to check WebAuthn status', 
        details: errorMessage,
        hasWebAuthn: false,
        methods: []
      }, 
      { status: 500 }
    );
  }
}