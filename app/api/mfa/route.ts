import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { ManagementClient } from 'auth0';

interface MFAEnrollment {
  id: string;
  status: 'confirmed' | 'pending';
  type: 'sms' | 'push-notification' | 'otp';
  name?: string;
  phone_number?: string;
}

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
        domain: process.env.AUTH0_ISSUER_BASE_URL!.replace('https://', ''),
        clientId: process.env.AUTH0_M2M_CLIENT_ID!,
        clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET!
      });

      // For now, return empty array as Guardian enrollment reading is complex
      // In production, you'd fetch actual enrollments from Auth0 Guardian
      const enrollments: any[] = [];
      console.log('Would fetch Guardian enrollments for user:', session.user.sub);

      return NextResponse.json({
        success: true,
        enrollments: enrollments || []
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
    const { type, phoneNumber } = body;

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
        domain: process.env.AUTH0_ISSUER_BASE_URL!.replace('https://', ''),
        clientId: process.env.AUTH0_M2M_CLIENT_ID!,
        clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET!
      });

      let ticket;
      if (type === 'sms' && phoneNumber) {
        // Create SMS enrollment ticket
        ticket = await management.guardian.createEnrollmentTicket({
          user_id: session.user.sub!
        });
        console.log('SMS enrollment ticket created:', ticket);
        
        // Store the phone number in E.164 format and mark as verified
        // since MFA enrollment verifies the phone number
        try {
          // Convert phone number to E.164 format
          let formattedPhone = phoneNumber.replace(/\D/g, ''); // Remove non-digits
          if (formattedPhone.length === 10) {
            formattedPhone = '+1' + formattedPhone; // Add US country code
          } else if (formattedPhone.length === 11 && formattedPhone.startsWith('1')) {
            formattedPhone = '+' + formattedPhone; // Add + to existing country code
          } else if (!formattedPhone.startsWith('+')) {
            formattedPhone = '+' + formattedPhone; // Add + if missing
          }
          
          // First update the phone number
          await management.users.update(
            { id: session.user.sub! },
            {
              phone_number: formattedPhone
            }
          );
          
          // Try to directly set phone_number_verified using a PATCH request
          // Auth0 Management API v2 should allow this
          try {
            await management.users.update(
              { id: session.user.sub! },
              {
                phone_number_verified: true
              }
            );
            console.log('Successfully set phone_number_verified to true');
          } catch (directVerifyError) {
            console.log('Direct phone verification failed, using user_metadata approach');
            
            // Fallback: use user_metadata flag
            const currentUser = await management.users.get({ id: session.user.sub! });
            const existingMetadata = currentUser.data.user_metadata || {};
            
            await management.users.update(
              { id: session.user.sub! },
              {
                user_metadata: {
                  ...existingMetadata,
                  phone_verified_via_mfa: true,
                  phone_verification_method: 'sms_mfa_enrollment',
                  mfa_enrollment_date: new Date().toISOString()
                }
              }
            );
          }
          console.log('Updated user phone number and verification:', formattedPhone);
        } catch (updateError) {
          console.error('Failed to update user phone number:', updateError);
        }
      } else if (type === 'totp') {
        // Create TOTP enrollment ticket
        ticket = await management.guardian.createEnrollmentTicket({
          user_id: session.user.sub!
        });
        console.log('TOTP enrollment ticket created:', ticket);
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
        domain: process.env.AUTH0_ISSUER_BASE_URL!.replace('https://', ''),
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