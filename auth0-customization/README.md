# Auth0 Advanced Customizations (ACUL)

This folder contains the working Auth0 Advanced Customizations for Universal Login configuration.

## 🚀 Current Setup

### **Files in Use:**
- `login-id-screen-config.json` - Login-ID screen configuration
- `password-screen-config.json` - Password screen configuration
- `styles.css` - Custom CSS for both screens
- `deploy-login-id-screen.sh` - Deploy login-id screen
- `deploy-password-screen.sh` - Deploy password screen

### **Asset Sources:**
The actual JavaScript files are served from Next.js API routes:
- Login-ID JS: `/app/api/auth0-assets/login-id-screen.js/route.ts`
- Password JS: `/app/api/auth0-assets/password-screen.js/route.ts`
- CSS: `/app/api/auth0-assets/styles.css/route.ts`

## 🛠 Deployment

### **Deploy Screen Configurations:**
```bash
# Get management token
export AUTH0_MANAGEMENT_TOKEN='your-token'

# Deploy login-id screen
./deploy-login-id-screen.sh

# Deploy password screen
./deploy-password-screen.sh
```

### **Get Management Token:**
```bash
curl -X POST https://archfaktor.us.auth0.com/oauth/token \
  -H 'Content-Type: application/json' \
  -d '{
    "client_id": "vGTWydFtqolN2tKmEgrhC2ReYsQrQOGP",
    "client_secret": "-tjSp8fNi8UX_8x0FNv0rA7GcI_s53LQ3mTw9sNSdnvbLSWXZZlYQ-Hhh297L4vv",
    "audience": "https://archfaktor.us.auth0.com/api/v2/",
    "grant_type": "client_credentials"
  }' | jq -r '.access_token'
```

## ✅ Working Features

- **Custom branding**: ConsumerAuth styling and logos
- **Login-ID screen**: Email collection with proper form submission
- **Password screen**: Password entry with Auth0 integration
- **CORS handling**: API routes handle preflight requests
- **Responsive design**: Mobile and desktop optimized
- **Auth0 ACUL SDK**: Integration with fallback navigation

## 🎯 Production URLs

When ready for production, update the URLs in the JSON configs to use your production domain instead of `localhost:4000`.