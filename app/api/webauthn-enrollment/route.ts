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
      // Create Guardian enrollment ticket for WebAuthn
      console.log('Creating WebAuthn enrollment ticket for user:', session.user.sub);

      const ticketResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/guardian/enrollments/ticket`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: session.user.sub,
          email: session.user.email,
          send_mail: false,
          allow_multiple_enrollments: true
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
      
      // Replace domain if using custom domain
      if (enrollmentUrl && enrollmentUrl.includes('login.consumerauth.com')) {
        enrollmentUrl = enrollmentUrl.replace('login.consumerauth.com', 'archfaktor.us.auth0.com');
      }

      return NextResponse.json({
        success: true,
        message: 'WebAuthn enrollment ticket created',
        enrollmentUrl: enrollmentUrl,
        ticketId: ticketData.ticket_id
      });

    } else {
      return NextResponse.json({
        error: 'Invalid step. Must be "initiate"'
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

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { enrollmentId } = body;

    if (!enrollmentId) {
      return NextResponse.json({ error: 'Enrollment ID is required' }, { status: 400 });
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
          scope: 'delete:users read:users'
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

      console.log('Successfully got Management API access token for WebAuthn removal');
    } catch (tokenError) {
      console.error('Error getting Management API token:', tokenError);
      return NextResponse.json({ 
        error: 'Failed to authenticate with Management API' 
      }, { status: 500 });
    }

    console.log('Removing WebAuthn enrollment:', enrollmentId, 'for user:', session.user.sub);

    // Delete the enrollment
    const deleteUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${session.user.sub}/enrollments/${enrollmentId}`;
    console.log('DELETE request to:', deleteUrl);
    
    const deleteResponse = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Delete response status:', deleteResponse.status);

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text();
      console.error('Failed to delete WebAuthn enrollment:', deleteResponse.status, errorText);
      console.error('Request URL was:', deleteUrl);
      console.error('Request headers included Authorization with token length:', accessToken.length);
      
      return NextResponse.json({
        error: 'Failed to remove WebAuthn enrollment',
        details: errorText,
        status: deleteResponse.status,
        url: deleteUrl.replace(accessToken, '[REDACTED]')
      }, { status: deleteResponse.status });
    }

    console.log('Successfully removed WebAuthn enrollment:', enrollmentId);

    return NextResponse.json({
      success: true,
      message: 'WebAuthn enrollment removed successfully'
    });

  } catch (error: unknown) {
    console.error('Error removing WebAuthn enrollment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to remove WebAuthn enrollment', details: errorMessage }, 
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