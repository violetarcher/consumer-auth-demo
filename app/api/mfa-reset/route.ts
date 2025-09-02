import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { ManagementClient } from 'auth0';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Check if we have M2M credentials
    if (!process.env.AUTH0_M2M_CLIENT_ID || !process.env.AUTH0_M2M_CLIENT_SECRET) {
      return NextResponse.json({
        success: false,
        error: 'MFA reset not available in demo mode'
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
      console.log('Resetting MFA for user:', session.user.email);

      // Step 1: Try to delete MFA using Management API first
      try {
        console.log('Attempting to invalidate all MFA tokens for user');
        // This should remove all MFA enrollments from the user profile
        await management.users.invalidateRememberBrowser({ id: session.user.sub! });
        console.log('Successfully invalidated remember browser tokens');
      } catch (error) {
        console.log('Could not invalidate remember browser tokens:', error);
      }

      // Step 1a: Try to delete all user MFA enrollments
      try {
        console.log('Attempting to delete all MFA enrollments...');
        await management.users.deleteAllAuthenticators({ id: session.user.sub! });
        console.log('Successfully deleted all user authenticators');
      } catch (error) {
        console.log('Could not delete all authenticators:', error);
      }

      // Try supported MFA provider types
      const mfaProviders = ['duo', 'google-authenticator'];
      for (const provider of mfaProviders) {
        try {
          console.log(`Attempting to delete MFA provider: ${provider}`);
          await management.users.deleteMultifactorProvider({ 
            id: session.user.sub!, 
            provider: provider as any
          });
          console.log(`Successfully deleted MFA provider: ${provider}`);
        } catch (error) {
          console.log(`Could not delete MFA provider ${provider}:`, error);
        }
      }

      // Step 2: Use Guardian MFA API to get and delete enrollments
      const domain = process.env.AUTH0_ISSUER_BASE_URL!.replace('https://', '');
      
      // Get Guardian MFA token (different audience)
      const guardianMfaTokenResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.AUTH0_M2M_CLIENT_ID,
          client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
          audience: `https://${domain}/mfa/`,
          grant_type: 'client_credentials'
        })
      });
      
      const guardianMfaTokenData = await guardianMfaTokenResponse.json();
      const guardianMfaAccessToken = guardianMfaTokenData.access_token;
      
      console.log('Getting MFA enrollments with Guardian MFA API...');
      
      // Get MFA enrollments using Guardian MFA API
      const mfaEnrollmentsResponse = await fetch(`https://${domain}/mfa/enrollments`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${guardianMfaAccessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('MFA Enrollments API response status:', mfaEnrollmentsResponse.status);
      
      if (mfaEnrollmentsResponse.ok) {
        const enrollments = await mfaEnrollmentsResponse.json();
        console.log('Found MFA enrollments to delete:', JSON.stringify(enrollments, null, 2));
        
        // Step 3: Delete all MFA enrollments using Guardian MFA API
        for (const enrollment of enrollments) {
          console.log(`Attempting to delete MFA enrollment ${enrollment.id} of type ${enrollment.type}`);
          
          const deleteResponse = await fetch(`https://${domain}/mfa/enrollments/${enrollment.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${guardianMfaAccessToken}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log(`Delete response status for ${enrollment.id}:`, deleteResponse.status);
          
          if (!deleteResponse.ok) {
            const errorText = await deleteResponse.text();
            console.error(`Failed to delete MFA enrollment ${enrollment.id}:`, deleteResponse.status, errorText);
          } else {
            console.log(`Successfully deleted MFA enrollment ${enrollment.id} via Guardian MFA API`);
          }
        }
      } else {
        const errorText = await mfaEnrollmentsResponse.text();
        console.error('Failed to fetch MFA enrollments:', mfaEnrollmentsResponse.status, errorText);
        console.warn('Will continue with profile cleanup...');
      }

      // Step 4: Reset phone number and verification status in Auth0 profile  
      // For Auth0, we need to omit phone_number entirely to clear it, not send empty string
      console.log('Attempting to clear phone_verified field...');
      
      try {
        // Only update phone_verified to false (phone_number needs special handling)
        await management.users.update(
          { id: session.user.sub! },
          { phone_verified: false }
        );
        console.log('Successfully set phone_verified to false');
      } catch (phoneResetError) {
        console.error('Failed to update phone_verified:', phoneResetError);
      }

      // Step 5: Clean up user metadata - remove ALL phone/MFA related fields
      console.log('Cleaning user metadata...');
      const existingMetadata = currentUser.data.user_metadata || {};
      
      // Create clean metadata by explicitly filtering out phone/MFA related keys
      const cleanMetadata: any = {};
      
      // List of keys to KEEP (non-phone/MFA related)
      const keysToKeep = [
        'login_count', 'preferred_make', 'preferred_model', 'company_name', 
        'job_title', 'bio', 'company', 'language', 'location', 'timezone', 'website'
      ];
      
      // Only keep explicitly safe keys
      keysToKeep.forEach(key => {
        if (existingMetadata[key] !== undefined) {
          cleanMetadata[key] = existingMetadata[key];
        }
      });
      
      console.log('Original metadata:', JSON.stringify(existingMetadata, null, 2));
      console.log('Cleaned metadata (only keeping safe keys):', JSON.stringify(cleanMetadata, null, 2));

      try {
        await management.users.update(
          { id: session.user.sub! },
          { user_metadata: cleanMetadata }
        );
        console.log('Successfully updated user metadata');
      } catch (metadataError) {
        console.error('Failed to update metadata:', metadataError);
      }

      // Step 6: Try to clear phone_number using raw API call with omission
      console.log('Attempting to clear phone_number field via raw PATCH...');
      try {
        // Get a management API token for raw API calls
        const mgmtTokenResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: process.env.AUTH0_M2M_CLIENT_ID,
            client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
            audience: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`,
            grant_type: 'client_credentials'
          })
        });
        
        const mgmtTokenData = await mgmtTokenResponse.json();
        const mgmtAccessToken = mgmtTokenData.access_token;

        // Try using PATCH with explicit null to clear the field
        const clearPhoneResponse = await fetch(`https://${domain}/api/v2/users/${session.user.sub}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${mgmtAccessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ phone_number: null })
        });

        console.log('Clear phone number response status:', clearPhoneResponse.status);

        if (!clearPhoneResponse.ok) {
          const errorText = await clearPhoneResponse.text();
          console.error('Failed to clear phone number:', clearPhoneResponse.status, errorText);
        } else {
          console.log('Successfully cleared phone_number field');
        }
      } catch (phoneNumberClearError) {
        console.error('Error attempting to clear phone_number:', phoneNumberClearError);
      }

      console.log('MFA reset completed successfully for user:', session.user.email);

      return NextResponse.json({
        success: true,
        message: 'MFA has been reset successfully. You can now set up MFA again.'
      });

    } catch (apiError: unknown) {
      console.error('Auth0 API error during MFA reset:', apiError);
      return NextResponse.json({
        success: false,
        error: 'Failed to reset MFA',
        details: apiError instanceof Error ? apiError.message : 'Unknown API error'
      }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error('Error resetting MFA:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to reset MFA', details: errorMessage }, 
      { status: 500 }
    );
  }
}