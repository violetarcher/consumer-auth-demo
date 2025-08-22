/**
 * Handler that will be called during the execution of a Post-Challenge flow.
 * This triggers after MFA challenges (like SMS verification) are completed.
 *
 * @param {Event} event - Details about the user and the context of the MFA challenge.
 * @param {PostChallengeAPI} api - Interface whose methods can be used to change the behavior.
 */
exports.onExecutePostChallenge = async (event, api) => {
  const ManagementClient = require('auth0').ManagementClient;
  
  // Only process SMS challenges
  if (event.challenge_type !== 'otp' && event.challenge_type !== 'sms') {
    return;
  }

  console.log(`Post-Challenge triggered for user ${event.user.email}, challenge type: ${event.challenge_type}`);

  // Check if we have a pending phone number in user_metadata
  const pendingPhone = event.user.user_metadata?.pending_phone_number;
  if (!pendingPhone) {
    console.log('No pending phone number found for user');
    return;
  }

  // Check if phone verification was already completed
  if (event.user.user_metadata?.phone_verification_status === 'verified') {
    console.log('Phone verification already completed for user');
    return;
  }

  console.log(`Completing phone verification for user ${event.user.email} with phone ${pendingPhone}`);

  try {
    // Get M2M token for direct API calls
    const tokenResponse = await fetch(`https://${event.secrets.AUTH0_DOMAIN}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: event.secrets.AUTH0_M2M_CLIENT_ID,
        client_secret: event.secrets.AUTH0_M2M_CLIENT_SECRET,
        audience: `https://${event.secrets.AUTH0_DOMAIN}/api/v2/`,
        grant_type: 'client_credentials'
      })
    });
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Set phone number and mark as verified
    const response = await fetch(`https://${event.secrets.AUTH0_DOMAIN}/api/v2/users/${event.user.user_id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone_number: pendingPhone,
        phone_verified: true
      })
    });

    if (response.ok) {
      console.log(`Phone verification API call successful for ${event.user.email}`);
      
      // Update user_metadata to mark verification as complete
      const existingMetadata = event.user.user_metadata || {};
      
      api.user.setUserMetadata({
        ...existingMetadata,
        phone_verified_via_mfa: true,
        phone_verification_method: 'sms_mfa_enrollment',
        mfa_enrollment_completed: new Date().toISOString(),
        phone_verification_status: 'verified',
        // Remove pending phone number
        pending_phone_number: undefined
      });

      console.log(`Phone verification completed successfully for ${event.user.email}: ${pendingPhone}`);
    } else {
      const errorText = await response.text();
      console.error(`Phone verification failed for ${event.user.email}:`, response.status, errorText);
    }

  } catch (error) {
    console.error(`Error completing phone verification for ${event.user.email}:`, error.message);
  }
};