#!/bin/bash

# Deploy signup-password screen configuration only
# This script ONLY updates the signup-password screen, no tenant settings

set -e

TENANT="archfaktor.us.auth0.com"

echo "🚀 Deploying signup-password screen configuration..."
echo "Tenant: ${TENANT}"
echo

if [ -z "$AUTH0_MANAGEMENT_TOKEN" ]; then
    echo "❌ ERROR: Set AUTH0_MANAGEMENT_TOKEN first"
    echo "Example: export AUTH0_MANAGEMENT_TOKEN='your-token-here'"
    exit 1
fi

echo "📤 Deploying signup-password screen with API routes..."

curl --location --request PATCH "https://${TENANT}/api/v2/prompts/signup-password/screen/signup-password/rendering" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${AUTH0_MANAGEMENT_TOKEN}" \
--data @signup-password-screen-config.json

echo ""
echo "✅ Signup-password screen deployed!"
echo "🎯 Screen now uses: http://localhost:4000/api/auth0-assets/signup-password-screen.js"
