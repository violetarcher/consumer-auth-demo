import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { ManagementClient } from 'auth0';

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { user_metadata, name } = body;

    // Check if we have M2M credentials
    if (!process.env.AUTH0_M2M_CLIENT_ID || !process.env.AUTH0_M2M_CLIENT_SECRET) {
      // Fallback to demo mode if no M2M credentials
      console.log('No M2M credentials found, running in demo mode');
      
      const updatedUser = {
        user_id: session.user.sub,
        user_metadata: user_metadata || {},
        name: name || session.user.name
      };

      return NextResponse.json({
        success: true,
        message: 'User metadata updated successfully (demo mode)',
        user: updatedUser
      });
    }

    // Initialize Auth0 Management API client
    const management = new ManagementClient({
      domain: process.env.AUTH0_MANAGEMENT_DOMAIN!,
      clientId: process.env.AUTH0_M2M_CLIENT_ID!,
      clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET!
    });

    // Update user metadata via Auth0 Management API
    const updatedUser = await management.users.update(
      { id: session.user.sub! },
      {
        user_metadata,
        name,
      }
    );

    console.log('Successfully updated user metadata for:', session.user.sub);

    return NextResponse.json({
      success: true,
      message: 'User metadata updated successfully',
      user: updatedUser
    });
  } catch (error: unknown) {
    console.error('Error updating user metadata:', error);
    
    // Provide more specific error messages
    const errorObj = error as { statusCode?: number };
    if (errorObj.statusCode === 401) {
      return NextResponse.json(
        { error: 'Unauthorized: Check Management API credentials' }, 
        { status: 401 }
      );
    } else if (errorObj.statusCode === 403) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient scopes for user update' }, 
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update user metadata', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}