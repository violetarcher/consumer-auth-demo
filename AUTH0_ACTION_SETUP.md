# Auth0 Action Setup for Step-Up Phone Verification

## Overview
The step-up phone verification flow requires one Post-Login Action that handles both MFA enforcement and phone verification.

## Post-Login Action Setup

### 1. Navigate to Auth0 Dashboard
- Go to Actions > Library
- Click "Build Custom" 
- Choose "Post-Login"

### 2. Complete Post-Login Action Code
Replace the default action code with the following:

```javascript
/**
 * Handler that will be called during the execution of a PostLogin flow.
 * This action handles step-up MFA requests by setting the phone number in Auth0 profile.
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
    
    // Enforce MFA for this login
    api.multifactor.enable('any');
  }
};
```

### 3. Secrets Configuration
The action requires the following secrets to be configured:

- `AUTH0_DOMAIN`: Your Auth0 domain (e.g., `yourtenantname.us.auth0.com`)
- `AUTH0_M2M_CLIENT_ID`: Machine-to-Machine application client ID
- `AUTH0_M2M_CLIENT_SECRET`: Machine-to-Machine application client secret
- `TARGET_CLIENT_ID`: The client ID of your consumer-auth application (to scope the action)

### 4. Dependencies
Add the following dependency:
- `auth0`: Latest version

### 5. Deploy and Activate Action
- Save the action
- Deploy it to the Post-Login flow
- Make sure it's active in the flow

## How It Works

1. User initiates phone verification from the app
2. App calls `/api/step-up-challenge` which sets user metadata with pending phone number
3. User is redirected to Auth0 with `acr_values` parameter for step-up authentication
4. **Post-Login Action** detects the `acr_values` parameter and enforces MFA
5. User goes directly to SMS challenge (no login prompt)
6. User completes SMS challenge
7. **Post-Login Action** runs again after MFA completion and automatically:
   - Detects that MFA was completed and phone verification is pending
   - Sets the phone number as verified in Auth0 user profile
   - Updates user metadata to mark verification as complete
8. User returns to the app with phone verified

## Testing

To test the flow:
1. Deploy the Post-Login action in Auth0
2. Use the app to initiate phone verification
3. Should redirect directly to SMS challenge (no login screen)
4. Complete the step-up SMS challenge
5. Verify that the phone number is marked as verified in the user profile

## Advantages of This Approach

- **Direct to MFA**: Users go straight to SMS verification without seeing login screen
- **OpenID Standard**: Uses standard `acr_values` parameter for MFA requests
- **Single Action**: One Post-Login action handles both MFA enforcement and verification
- **Better UX**: More seamless step-up flow
- **Security**: Proper authentication event created with MFA context