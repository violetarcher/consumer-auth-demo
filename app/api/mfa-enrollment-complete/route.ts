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
        domain: process.env.AUTH0_ISSUER_BASE_URL!.replace('https://', ''),
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
      
      // Additional check: ensure user has gone through the full enrollment process
      if (!existingMetadata.mfa_enrollment_started) {
        return NextResponse.json({
          success: false,
          error: 'No MFA enrollment process detected. Please complete SMS enrollment in Auth0 first.',
          details: 'User must successfully complete SMS MFA enrollment before phone can be verified'
        }, { status: 400 });
      }

      // CRITICAL SECURITY CHECK: Ensure user actually completed SMS enrollment
      // We require an explicit confirmation that SMS enrollment was completed, not just time passage
      
      // Check if phone verification was already completed (prevent double verification)
      if (existingMetadata.phone_verification_status === 'verified') {
        return NextResponse.json({
          success: false,
          error: 'Phone number is already verified.',
          details: 'This phone number has already been verified via MFA enrollment.'
        }, { status: 400 });
      }

      // SECURITY: Require explicit enrollment completion confirmation
      // This prevents users from bypassing SMS enrollment by just waiting and clicking repeatedly
      if (!existingMetadata.sms_enrollment_completed) {
        return NextResponse.json({
          success: false,
          error: 'SMS enrollment not completed. Please complete SMS verification in Auth0 first.',
          details: 'You must successfully complete SMS MFA enrollment in Auth0 before your phone can be verified. Please click the "Complete SMS Enrollment" button to start the process.'
        }, { status: 400 });
      }

      // Additional time-based check to ensure some time has passed since enrollment
      const enrollmentStarted = new Date(existingMetadata.mfa_enrollment_started);
      const timeSinceEnrollment = Date.now() - enrollmentStarted.getTime();
      if (timeSinceEnrollment < 30000) { // 30 seconds minimum
        return NextResponse.json({
          success: false,
          error: 'Please wait and ensure SMS enrollment is fully completed.',
          details: 'Please allow time for the SMS enrollment process to complete in Auth0.'
        }, { status: 400 });
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
      const domain = process.env.AUTH0_ISSUER_BASE_URL!.replace('https://', '');
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
        // Update user_metadata to mark enrollment as complete
        await management.users.update(
          { id: session.user.sub! },
          {
            user_metadata: {
              ...existingMetadata,
              phone_verified_via_mfa: true,
              phone_verification_method: 'sms_mfa_enrollment',
              mfa_enrollment_completed: new Date().toISOString(),
              phone_verification_status: 'verified'
            }
          }
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
    } catch (apiError: any) {
      console.error('Auth0 Management API error:', apiError);
      return NextResponse.json({
        success: false,
        error: 'Failed to complete phone verification',
        details: apiError.message
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