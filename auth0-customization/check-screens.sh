#!/bin/bash

# Check all configured screens in Auth0 tenant

set -e

TENANT="archfaktor.us.auth0.com"

if [ -z "$AUTH0_MANAGEMENT_TOKEN" ]; then
    echo "❌ ERROR: Set AUTH0_MANAGEMENT_TOKEN first"
    exit 1
fi

echo "🔍 Checking configured screens in Auth0..."
echo ""

SCREENS=("login-id" "login-password" "signup" "signup-id" "signup-password")

for screen in "${SCREENS[@]}"; do
    echo "📋 Checking: $screen"
    curl -s --request GET \
        "https://${TENANT}/api/v2/prompts/${screen}/screen/${screen}/rendering" \
        --header "Authorization: Bearer ${AUTH0_MANAGEMENT_TOKEN}" \
        | jq '.' || echo "  ❌ Not configured or error"
    echo ""
done
