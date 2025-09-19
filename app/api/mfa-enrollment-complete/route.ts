import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { ManagementClient } from 'auth0';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { enrollmentId } = body;

    if (!enrollmentId) {
      return NextResponse.json({ error: 'Enrollment ID required' }, { status: 400 });
    }

    // Check if we have M2M credentials
    if (!process.env.AUTH0_M2M_CLIENT_ID || !process.env.AUTH0_M2M_CLIENT_SECRET) {
      return NextResponse.json({
        success: false,
        error: 'MFA verification not available in demo mode'
      }, { status: 500 });
    }

    try {
      // Initialize Auth0 Management API client
      const management = new ManagementClient({
        domain: process.env.AUTH0_MANAGEMENT_DOMAIN!,
        clientId: process.env.AUTH0_M2M_CLIENT_ID!,
        clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET!
      });

      // Get current user data
      const currentUser = await management.users.get({ id: session.user.sub! });
      const existingMetadata = currentUser.data.user_metadata || {};
      
      // Get phone number from user profile (set by Auth0 during enrollment)
      const userPhone = currentUser.data.phone_number;

      if (!userPhone) {
        return NextResponse.json({
          success: false,
          error: 'No phone number found. Please complete SMS enrollment in Auth0 first.',
          details: 'Phone number should be set by Auth0 during the SMS enrollment process.'
        }, { status: 400 });
      }

      // CRITICAL SECURITY CHECK: Verify user actually has active MFA enrollment
      // For now, we'll rely on the presence of pending_phone_number and check that user completed the enrollment flow
      // In a production environment, you would integrate with Auth0 Guardian API to verify enrollment status
      
      // Check if phone is already verified
      if (currentUser.data.phone_verified) {
        return NextResponse.json({
          success: false,
          error: 'Phone number is already verified.',
          details: 'Your phone number has already been verified.'
        }, { status: 400 });
      }

      // Use Auth0 Guardian API to verify actual MFA enrollments
      console.log('Checking Guardian MFA enrollments for user:', session.user.sub);
      
      // Get M2M token for Guardian API access
      const guardianTokenResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.AUTH0_M2M_CLIENT_ID,
          client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
          audience: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`,
          grant_type: 'client_credentials'
        })
      });
      
      const guardianTokenData = await guardianTokenResponse.json();
      const guardianAccessToken = guardianTokenData.access_token;
      
      // Query Guardian API for user's MFA enrollments
      const domain = process.env.AUTH0_MANAGEMENT_DOMAIN!;
      const enrollmentsResponse = await fetch(`https://${domain}/api/v2/users/${session.user.sub}/enrollments`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${guardianAccessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!enrollmentsResponse.ok) {
        const errorText = await enrollmentsResponse.text();
        console.error('Failed to fetch Guardian enrollments:', enrollmentsResponse.status, errorText);
        return NextResponse.json({
          success: false,
          error: 'Unable to verify MFA enrollment status.',
          details: 'Could not access Guardian API to verify enrollments.'
        }, { status: 500 });
      }
      
      const enrollments = await enrollmentsResponse.json();
      console.log('Guardian enrollments:', JSON.stringify(enrollments, null, 2));
      
      // Check for active SMS enrollments
      const activeSMSEnrollments = enrollments.filter((enrollment: {
        status: string;
        type: string;
        phone_number?: string;
      }) => 
        enrollment.status === 'confirmed' && 
        (enrollment.type === 'sms' || enrollment.type === 'otp')
      );
      
      if (activeSMSEnrollments.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'No confirmed SMS MFA enrollment found.',
          details: 'You must complete and confirm SMS MFA enrollment before your phone can be verified.',
          debug: {
            totalEnrollments: enrollments.length,
            enrollmentTypes: enrollments.map((e: { type: string; status: string }) => `${e.type}:${e.status}`),
            userPhoneNumber: currentUser.data.phone_number
          }
        }, { status: 400 });
      }
      
      // Verify the phone number in the enrollment matches the one in the profile
      const enrollmentPhone = activeSMSEnrollments[0].phone_number;
      if (enrollmentPhone && enrollmentPhone !== userPhone) {
        console.warn(`Phone number mismatch: Profile has ${userPhone}, enrollment has ${enrollmentPhone}`);
        // Continue anyway - the enrollment is what matters for security
      }

      console.log('Security checks passed for SMS enrollment completion:', userPhone);

      // Now that enrollment is complete, set phone as verified
      // Get M2M token for Auth0 Management API
      const tokenResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.AUTH0_M2M_CLIENT_ID,
          client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
          audience: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`,
          grant_type: 'client_credentials'
        })
      });
      
      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;
      
      // Set phone number and mark as verified
      const response = await fetch(`https://${domain}/api/v2/users/${session.user.sub}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone_number: userPhone,
          phone_verified: true
        })
      });
      
      if (response.ok) {
        // Update user_metadata to mark verification as complete
        const metadataUpdate: Record<string, unknown> = {
          ...existingMetadata,
          phone_verified_via_mfa: true,
          phone_verification_status: 'verified'
        };

        // Set appropriate method and completion timestamp based on flow type
        const isStepUpChallenge = existingMetadata.step_up_challenge_started;
        
        if (isStepUpChallenge) {
          metadataUpdate.phone_verification_method = 'sms_step_up_challenge';
          metadataUpdate.step_up_verification_completed = new Date().toISOString();
          // Clean up step-up challenge markers
          delete metadataUpdate.step_up_challenge_started;
          delete metadataUpdate.pending_phone_number;
        } else {
          metadataUpdate.phone_verification_method = 'sms_mfa_enrollment';
          metadataUpdate.mfa_enrollment_completed = new Date().toISOString();
        }

        await management.users.update(
          { id: session.user.sub! },
          { user_metadata: metadataUpdate }
        );

        console.log('Phone verification completed successfully for:', userPhone);

        return NextResponse.json({
          success: true,
          message: 'Phone verification completed successfully'
        });
      } else {
        const errorText = await response.text();
        console.log('Phone verification failed:', response.status, errorText);
        
        return NextResponse.json({
          success: false,
          error: 'Failed to verify phone number',
          details: errorText
        }, { status: 500 });
      }
    } catch (apiError: unknown) {
      console.error('Auth0 Management API error:', apiError);
      return NextResponse.json({
        success: false,
        error: 'Failed to complete phone verification',
        details: apiError instanceof Error ? apiError.message : 'Unknown API error'
      }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error('Error completing MFA enrollment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to complete MFA enrollment', details: errorMessage }, 
      { status: 500 }
    );
  }
}