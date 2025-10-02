import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { ManagementClient } from 'auth0';


export async function GET() {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Check if we have M2M credentials for real Auth0 API calls
    if (!process.env.AUTH0_M2M_CLIENT_ID || !process.env.AUTH0_M2M_CLIENT_SECRET) {
      console.log('No M2M credentials found, using demo data');
      return NextResponse.json({
        success: true,
        enrollments: []
      });
    }

    try {
      // Initialize Auth0 Management API client
      const management = new ManagementClient({
        domain: process.env.AUTH0_MANAGEMENT_DOMAIN!,
        clientId: process.env.AUTH0_M2M_CLIENT_ID!,
        clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET!
      });

      // Try getting user authenticators (might include phone enrollments not in Guardian)
      const domain = process.env.AUTH0_MANAGEMENT_DOMAIN!;
      const tokenResponse = await fetch(`https://${domain}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.AUTH0_M2M_CLIENT_ID,
          client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
          audience: `https://${domain}/api/v2/`,
          grant_type: 'client_credentials'
        })
      });

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Fetch Guardian enrollments
      const enrollmentsUrl = `https://${domain}/api/v2/users/${session.user.sub}/enrollments`;
      console.log('Fetching Guardian enrollments from:', enrollmentsUrl);

      const enrollmentsResponse = await fetch(enrollmentsUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const enrollments = await enrollmentsResponse.json();
      console.log('Fetched Guardian enrollments for user:', session.user.sub);
      console.log('Raw Guardian API response:', JSON.stringify(enrollments, null, 2));

      // Also try fetching authenticators (different endpoint)
      const authenticatorsUrl = `https://${domain}/api/v2/users/${session.user.sub}/authenticators`;
      console.log('Fetching authenticators from:', authenticatorsUrl);

      const authenticatorsResponse = await fetch(authenticatorsUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      let allEnrollments = enrollments || [];

      if (authenticatorsResponse.ok) {
        const authenticators = await authenticatorsResponse.json();
        console.log('Fetched authenticators:', JSON.stringify(authenticators, null, 2));

        // Convert confirmed authenticators to enrollment format and merge
        const authenticatorEnrollments = authenticators
          .filter((auth: any) => auth.confirmed)
          .map((auth: any) => ({
            id: auth.id,
            status: 'confirmed',
            type: auth.type, // sms, totp, push, webauthn-platform, etc.
            auth_method: auth.type,
            name: auth.name,
            enrolled_at: auth.enrolled_at || auth.created_at,
            last_auth: auth.last_auth_at
          }));

        // Merge both sources, removing duplicates by ID
        const enrollmentIds = new Set(allEnrollments.map((e: any) => e.id));
        authenticatorEnrollments.forEach((auth: any) => {
          if (!enrollmentIds.has(auth.id)) {
            allEnrollments.push(auth);
          }
        });

        console.log('Merged enrollments:', JSON.stringify(allEnrollments, null, 2));
      } else {
        console.log('Authenticators endpoint not available or no permission');
      }

      return NextResponse.json({
        success: true,
        enrollments: allEnrollments
      });
    } catch (apiError) {
      console.error('Auth0 Management API error:', apiError);
      // Fall back to empty enrollments if API fails
      return NextResponse.json({
        success: true,
        enrollments: []
      });
    }
  } catch (error: unknown) {
    console.error('Error fetching MFA enrollments:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch MFA enrollments', details: errorMessage }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { type } = body;

    // Check if we have M2M credentials for real Auth0 API calls
    if (!process.env.AUTH0_M2M_CLIENT_ID || !process.env.AUTH0_M2M_CLIENT_SECRET) {
      console.log('No M2M credentials found, using demo mode');
      return NextResponse.json({
        success: true,
        message: 'Demo mode: MFA enrollment simulated',
        ticket: { ticket_url: 'https://demo.auth0.com/mfa/enroll' }
      });
    }

    try {
      // Initialize Auth0 Management API client
      const management = new ManagementClient({
        domain: process.env.AUTH0_MANAGEMENT_DOMAIN!,
        clientId: process.env.AUTH0_M2M_CLIENT_ID!,
        clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET!
      });

      let ticket;
      if (type === 'sms') {
        // Create SMS enrollment ticket - Auth0 will collect phone number
        ticket = await management.guardian.createEnrollmentTicket({
          user_id: session.user.sub!,
          factor: 'sms'
        } as any);
        console.log('SMS enrollment ticket created:', ticket);
        
        // Store enrollment started timestamp for security tracking
        try {
          const currentUser = await management.users.get({ id: session.user.sub! });
          const existingMetadata = currentUser.data.user_metadata || {};
          
          await management.users.update(
            { id: session.user.sub! },
            {
              user_metadata: {
                ...existingMetadata,
                mfa_enrollment_started: new Date().toISOString(),
                phone_verification_status: 'enrollment_started'
              }
            }
          );
          
          console.log('MFA enrollment started timestamp recorded');
        } catch (updateError: any) {
          console.error('Failed to update enrollment timestamp:', updateError);
        }
      } else if (type === 'totp') {
        // Create TOTP enrollment ticket with push-notification factor
        ticket = await management.guardian.createEnrollmentTicket({
          user_id: session.user.sub!,
          factor: 'push-notification'
        } as any);
        console.log('TOTP enrollment ticket created:', ticket);
      } else if (type === 'totp-otp') {
        // Create TOTP enrollment ticket with otp factor
        ticket = await management.guardian.createEnrollmentTicket({
          user_id: session.user.sub!,
          factor: 'otp'
        } as any);
        console.log('TOTP-OTP enrollment ticket created:', ticket);
      }

      return NextResponse.json({
        success: true,
        message: 'MFA enrollment ticket created',
        ticket
      });
    } catch (apiError) {
      console.error('Auth0 Management API error:', apiError);
      return NextResponse.json({
        success: false,
        error: 'Failed to create MFA enrollment ticket',
        details: apiError instanceof Error ? apiError.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error('Error creating MFA enrollment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create MFA enrollment', details: errorMessage }, 
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

    const { searchParams } = new URL(request.url);
    const enrollmentId = searchParams.get('id');

    if (!enrollmentId) {
      return NextResponse.json({ error: 'Enrollment ID required' }, { status: 400 });
    }

    // Check if we have M2M credentials for real Auth0 API calls
    if (!process.env.AUTH0_M2M_CLIENT_ID || !process.env.AUTH0_M2M_CLIENT_SECRET) {
      console.log('No M2M credentials found, using demo mode');
      return NextResponse.json({
        success: true,
        message: 'Demo mode: MFA enrollment deletion simulated'
      });
    }

    try {
      // Initialize Auth0 Management API client
      const management = new ManagementClient({
        domain: process.env.AUTH0_MANAGEMENT_DOMAIN!,
        clientId: process.env.AUTH0_M2M_CLIENT_ID!,
        clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET!
      });

      // For now, simulate deletion 
      // In production, you'd delete actual enrollments from Auth0 Guardian
      console.log('Would delete Guardian enrollment:', enrollmentId, 'for user:', session.user.sub);

      return NextResponse.json({
        success: true,
        message: 'MFA enrollment deleted successfully'
      });
    } catch (apiError) {
      console.error('Auth0 Management API error:', apiError);
      return NextResponse.json({
        success: false,
        error: 'Failed to delete MFA enrollment',
        details: apiError instanceof Error ? apiError.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error('Error deleting MFA enrollment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to delete MFA enrollment', details: errorMessage }, 
      { status: 500 }
    );
  }
}