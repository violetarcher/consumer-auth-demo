import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phoneNumber, zipCode, birthdate, loyaltyProgram } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, email' },
        { status: 400 }
      );
    }

    // Store signup data in a secure cookie for later retrieval
    const signupData = {
      firstName,
      lastName,
      email,
      phoneNumber: phoneNumber || '',
      zipCode: zipCode || '',
      birthdate: birthdate || '',
      loyaltyProgram: loyaltyProgram !== undefined ? loyaltyProgram : false,
      timestamp: new Date().toISOString()
    };

    // Set cookie with signup data (expires in 15 minutes)
    const cookieStore = await cookies();
    cookieStore.set('signup_data', JSON.stringify(signupData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15, // 15 minutes
      path: '/'
    });

    console.log('Signup data stored in cookie:', signupData);

    return NextResponse.json({
      success: true,
      message: 'Signup data stored successfully'
    });
  } catch (error: unknown) {
    console.error('Error storing signup data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to store signup data', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const signupDataCookie = cookieStore.get('signup_data');

    if (!signupDataCookie) {
      return NextResponse.json(
        { error: 'No signup data found' },
        { status: 404 }
      );
    }

    const signupData = JSON.parse(signupDataCookie.value);

    return NextResponse.json({
      success: true,
      data: signupData
    });
  } catch (error: unknown) {
    console.error('Error retrieving signup data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to retrieve signup data', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('signup_data');

    return NextResponse.json({
      success: true,
      message: 'Signup data cleared'
    });
  } catch (error: unknown) {
    console.error('Error deleting signup data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to delete signup data', details: errorMessage },
      { status: 500 }
    );
  }
}
