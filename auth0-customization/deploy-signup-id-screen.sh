#!/bin/bash

# Deploy signup-id screen configuration only
# This script ONLY updates the signup-id screen, no tenant settings

set -e

TENANT="archfaktor.us.auth0.com"

echo "🚀 Deploying signup-id screen configuration..."
echo "Tenant: ${TENANT}"
echo

if [ -z "$AUTH0_MANAGEMENT_TOKEN" ]; then
    echo "❌ ERROR: Set AUTH0_MANAGEMENT_TOKEN first"
    echo "Example: export AUTH0_MANAGEMENT_TOKEN='your-token-here'"
    exit 1
fi

echo "📤 Deploying signup-id screen with API routes..."

curl --location --request PATCH "https://${TENANT}/api/v2/prompts/signup/screen/signup/rendering" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${AUTH0_MANAGEMENT_TOKEN}" \
--data @signup-screen-config.json

echo ""
echo "✅ Signup screen deployed!"
echo "🎯 Screen now uses: http://localhost:4000/api/auth0-assets/signup-screen.js"