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

    // Check if we have M2M credentials
    if (!process.env.AUTH0_M2M_CLIENT_ID || !process.env.AUTH0_M2M_CLIENT_SECRET) {
      return NextResponse.json({
        success: false,
        error: 'User metadata updates not available in demo mode'
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

      // Update user metadata with provided fields
      await management.users.update(
        { id: session.user.sub! },
        {
          user_metadata: {
            ...existingMetadata,
            ...body
          }
        }
      );

      console.log('User metadata updated:', body);

      return NextResponse.json({
        success: true,
        message: 'User metadata updated successfully'
      });
    } catch (apiError: any) {
      console.error('Auth0 Management API error:', apiError);
      return NextResponse.json({
        success: false,
        error: 'Failed to update user metadata',
        details: apiError.message
      }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error('Error updating user metadata:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to update user metadata', details: errorMessage }, 
      { status: 500 }
    );
  }
}