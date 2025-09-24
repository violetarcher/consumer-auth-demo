#!/bin/bash

# Deploy login-id screen configuration only
# This script ONLY updates the login-id screen, no tenant settings

set -e

TENANT="archfaktor.us.auth0.com"

echo "🚀 Deploying login-id screen configuration..."
echo "Tenant: ${TENANT}"
echo

if [ -z "$AUTH0_MANAGEMENT_TOKEN" ]; then
    echo "❌ ERROR: Set AUTH0_MANAGEMENT_TOKEN first"
    echo "Example: export AUTH0_MANAGEMENT_TOKEN='your-token-here'"
    exit 1
fi

echo "📤 Deploying login-id screen with API routes..."

curl --location --request PATCH "https://${TENANT}/api/v2/prompts/login-id/screen/login-id/rendering" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${AUTH0_MANAGEMENT_TOKEN}" \
--data @login-id-screen-config.json

echo ""
echo "✅ Login-ID screen deployed!"
echo "🎯 Screen now uses: http://localhost:4000/api/auth0-assets/login-id-screen.js"