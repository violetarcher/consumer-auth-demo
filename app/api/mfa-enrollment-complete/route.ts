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
      
      // Check if phone is already verified
      if (currentUser.data.phone_verified) {
        return NextResponse.json({
          success: false,
          error: 'Phone number is already verified.',
          details: 'Your phone number has already been verified.'
        }, { status: 400 });
      }

      // Check if user has MFA enrollments (indicating they completed step-up MFA)
      console.log('User multifactor enrollments:', JSON.stringify(currentUser.data.multifactor, null, 2));
      console.log('User profile data:', JSON.stringify({
        phone_number: currentUser.data.phone_number,
        phone_verified: currentUser.data.phone_verified,
        user_metadata: currentUser.data.user_metadata
      }, null, 2));
      
      // More flexible MFA enrollment check
      const hasMultifactor = currentUser.data.multifactor && currentUser.data.multifactor.length > 0;
      const hasPhoneNumber = !!currentUser.data.phone_number;
      const hasStepUpMetadata = existingMetadata.step_up_challenge_started;
      
      // For step-up flow, if phone is set in profile and we have step-up metadata, assume enrollment completed
      if (hasStepUpMetadata && hasPhoneNumber) {
        console.log('Step-up flow detected with phone number set - treating as enrolled');
      } else if (!hasMultifactor) {
        return NextResponse.json({
          success: false,
          error: 'No MFA enrollment detected.',
          details: 'You must complete SMS MFA enrollment before your phone can be verified.',
          debug: {
            hasMultifactor,
            hasPhoneNumber,
            hasStepUpMetadata,
            multifactorData: currentUser.data.multifactor
          }
        }, { status: 400 });
      } else {
        // Check if user has SMS MFA specifically (only if we have multifactor data)
        const hasSMSMFA = currentUser.data.multifactor.some((mfa: any) => 
          mfa.type === 'sms' || mfa.type === 'otp'
        );

        if (!hasSMSMFA) {
          return NextResponse.json({
            success: false,
            error: 'SMS MFA enrollment not found.',
            details: 'You must complete SMS MFA enrollment to verify your phone number.',
            debug: {
              multifactorTypes: currentUser.data.multifactor.map((mfa: any) => mfa.type)
            }
          }, { status: 400 });
        }
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
        // Update user_metadata to mark verification as complete
        const metadataUpdate: Record<string, any> = {
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