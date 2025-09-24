import { NextRequest, NextResponse } from 'next/server';

// Temporary redirect to fix the Auth0 path confusion
export async function GET() {
  return NextResponse.redirect('http://localhost:4000/api/auth0-assets/login-id-screen.js');
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}