/**
 * Handler that will be called during the execution of a PostLogin flow.
 * This action handles phone verification via MFA enrollment.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login flow.
 */
exports.onExecutePostLogin = async (event, api) => {
  // Only run this action for our specific application
  if (event.client.client_id !== event.secrets.TARGET_CLIENT_ID) {
    console.log(`Skipping action for client ${event.client.client_id}`);
    return;
  }

  console.log(`Post-Login action triggered for user ${event.user.email}`);

  // Check if the application is requesting MFA via the `acr_values` parameter.
  const isMfaRequested = event.transaction.acr_values.includes(
    'http://schemas.openid.net/pape/policies/2007/06/multi-factor'
  );

  if (isMfaRequested) {
    console.log(`Step-up MFA requested for user ${event.user.email}`);

    // Get the pending phone number from user metadata
    const pendingPhone = event.user.user_metadata?.pending_phone_number;

    if (pendingPhone) {
      console.log(`Setting phone number ${pendingPhone} in Auth0 profile for ${event.user.email}`);

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

        // Format phone number for Auth0 (must be in E.164 format: +1XXXXXXXXXX)
        let formattedPhone = pendingPhone;
        if (!formattedPhone.startsWith('+')) {
          // Assume US number if no country code
          formattedPhone = `+1${formattedPhone.replace(/\D/g, '')}`;
        }

        console.log(`Formatted phone number: ${formattedPhone}`);

        // Set phone number in Auth0 user profile (not verified yet)
        const response = await fetch(`https://${event.secrets.AUTH0_DOMAIN}/api/v2/users/${event.user.user_id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            phone_number: formattedPhone,
            phone_verified: false // Will be set to true by app after MFA enrollment check
          })
        });

        if (response.ok) {
          console.log(`Phone number set successfully in Auth0 profile for ${event.user.email}: ${formattedPhone}`);
        } else {
          const errorText = await response.text();
          console.error(`Failed to set phone number for ${event.user.email}:`, response.status, errorText);
          console.error(`Request body was:`, JSON.stringify({
            phone_number: formattedPhone,
            phone_verified: false
          }));
        }

      } catch (error) {
        console.error(`Error setting phone number for ${event.user.email}:`, error.message);
      }
    }

    // Enforce SMS-only MFA for phone verification flow
    console.log(`Enforcing SMS-only MFA for user ${event.user.email}`);

    // Get currently enrolled factors
    const enrolledFactors = event.user.enrolledFactors || [];
    const hasEnrolledFactors = enrolledFactors.length > 0;

    // Check if user has SMS enrolled
    const hasSMS = enrolledFactors.some(factor => factor.type === 'phone');

    if (hasEnrolledFactors && hasSMS) {
      // User already has SMS enrolled - challenge with it
      console.log(`User has SMS MFA enrolled, challenging...`);
      api.authentication.challengeWith({ type: 'phone' });
    } else if (hasEnrolledFactors && !hasSMS) {
      // User has other factors but not SMS - challenge first, then enroll SMS
      console.log(`User has other MFA factors, challenging then enrolling SMS...`);
      api.authentication.challengeWithAny(
        enrolledFactors.map(factor => ({ type: factor.type }))
      );

      // After successful challenge, enroll SMS only
      api.authentication.enrollWith({ type: 'phone' });
    } else {
      // No factors enrolled yet - enroll SMS only
      console.log(`No MFA factors enrolled, requiring SMS enrollment...`);
      api.authentication.enrollWith({ type: 'phone' });
    }
  }
};

/**
 * Handler that will be invoked when this action is resuming after an external redirect.
 * If your onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login flow.
 */
exports.onContinuePostLogin = async (event, api) => {
  // This action does not use redirects, so this function is not needed
};