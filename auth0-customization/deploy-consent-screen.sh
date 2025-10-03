#!/bin/bash

# Deploy customized-consent screen configuration only
# This script ONLY updates the customized-consent screen, no tenant settings

set -e

TENANT="archfaktor.us.auth0.com"

echo "🚀 Deploying customized-consent screen configuration..."
echo "Tenant: ${TENANT}"
echo

if [ -z "$AUTH0_MANAGEMENT_TOKEN" ]; then
    echo "❌ ERROR: Set AUTH0_MANAGEMENT_TOKEN first"
    echo "Example: export AUTH0_MANAGEMENT_TOKEN='your-token-here'"
    exit 1
fi

echo "📤 Deploying consent screen with API routes..."

curl --location --request PATCH "https://${TENANT}/api/v2/prompts/consent/screen/consent/rendering" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${AUTH0_MANAGEMENT_TOKEN}" \
--data @consent-screen-config.json

echo ""
echo "✅ Consent screen deployed!"
echo "🎯 Screen now uses: http://localhost:4000/api/auth0-assets/consent-screen.js"
