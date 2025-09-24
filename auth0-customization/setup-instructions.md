# Auth0 Universal Login Advanced Customization Setup

This directory contains files for customizing your Auth0 Universal Login experience to match your ConsumerAuth branding.

## Files Included

1. **login-template.html** - Complete custom HTML template for Universal Login
2. **login-styles.css** - Custom CSS styles that can be applied to the default template
3. **setup-instructions.md** - This file with implementation steps

## Setup Instructions

### Option 1: Custom HTML Template (Recommended for Full Control)

1. **Access Auth0 Dashboard**
   - Go to [Auth0 Dashboard](https://manage.auth0.com)
   - Navigate to **Branding** > **Universal Login**

2. **Enable Advanced Options**
   - Toggle **Customize Login Page** to ON
   - Select **HTML** tab

3. **Upload Custom Template**
   - Copy the contents of `login-template.html`
   - Paste into the HTML editor
   - Click **Save Changes**

4. **Configure Settings**
   - Ensure your Auth0 application has the correct:
     - Allowed Callback URLs: `http://localhost:4000/api/auth/callback`
     - Allowed Logout URLs: `http://localhost:4000`
     - Allowed Web Origins: `http://localhost:4000`

### Option 2: CSS-Only Customization (Simpler Setup)

1. **Access Auth0 Dashboard**
   - Go to **Branding** > **Universal Login**
   - Keep **Customize Login Page** OFF (uses default template)

2. **Add Custom CSS**
   - Click on **Advanced Options**
   - In the **CSS** tab, copy contents of `login-styles.css`
   - Paste into the CSS editor
   - Click **Save Changes**

### Option 3: Branding Settings (Basic Customization)

1. **Logo and Colors**
   - Go to **Branding** > **Universal Login**
   - Upload your logo
   - Set primary color to: `#020817` (matches your app theme)
   - Set page background to: `#ffffff`

2. **Custom Domain (Optional but Recommended)**
   - Go to **Branding** > **Custom Domains**
   - Set up custom domain like `auth.consumerauth.com`
   - This removes Auth0 branding from the URL

## Key Features of This Customization

### Visual Design
- ✅ Matches ConsumerAuth application styling
- ✅ Custom color scheme using CSS variables
- ✅ Modern card-based layout with shadows
- ✅ Responsive design for mobile devices
- ✅ Custom branding header with icon
- ✅ Smooth animations and transitions

### Functionality
- ✅ Support for social connections
- ✅ Email/password authentication
- ✅ Sign up and forgot password flows
- ✅ Additional signup fields (full name)
- ✅ Form validation with custom messages
- ✅ Error handling and user feedback
- ✅ Remember me functionality

### Accessibility
- ✅ Proper focus states
- ✅ WCAG compliant color contrast
- ✅ Keyboard navigation support
- ✅ Screen reader friendly markup

## Testing Your Customization

1. **Test Authentication Flow**
   - Go to your application: `http://localhost:4000`
   - Click "Sign In" to test the custom login
   - Try both login and signup flows

2. **Test Different Scenarios**
   - Invalid credentials (error handling)
   - Password reset flow
   - Social login (if configured)
   - Mobile responsive design

## Customization for Different Industries

The template uses CSS variables making it easy to rebrand:

### For Banking/Finance
```css
:root {
  --primary-color: hsl(210, 100%, 25%); /* Navy blue */
  --primary-hover: hsl(210, 100%, 20%);
}
```

### For Insurance
```css
:root {
  --primary-color: hsl(200, 100%, 30%); /* Trust blue */
  --primary-hover: hsl(200, 100%, 25%);
}
```

### For Healthcare
```css
:root {
  --primary-color: hsl(160, 100%, 25%); /* Medical green */
  --primary-hover: hsl(160, 100%, 20%);
}
```

## Advanced Customizations

### Adding Custom JavaScript
You can add custom JavaScript to handle:
- Analytics tracking
- Custom validation
- Integration with third-party services
- Custom user flows

### Multi-language Support
Add language dictionary customizations:
```javascript
languageDictionary: {
  title: "Welcome to ConsumerAuth",
  signUpTerms: "By signing up, you agree to our terms and privacy policy.",
  // Add more translations
}
```

### Custom Fields
Add additional signup fields:
```javascript
additionalSignUpFields: [
  {
    name: "company",
    placeholder: "Company Name",
    validator: function(company) {
      return {
        valid: company.length >= 2,
        hint: "Company name required"
      };
    }
  }
]
```

## Troubleshooting

### Common Issues

1. **Styles Not Applying**
   - Clear browser cache
   - Check CSS syntax
   - Verify Auth0 dashboard saved changes

2. **Login Not Working**
   - Verify callback URLs match your application
   - Check browser console for JavaScript errors
   - Ensure Auth0 application settings are correct

3. **Mobile Layout Issues**
   - Test responsive breakpoints
   - Check viewport meta tag
   - Verify CSS media queries

### Support Resources
- [Auth0 Universal Login Docs](https://auth0.com/docs/customize/login-pages)
- [Auth0 Lock Configuration](https://auth0.com/docs/libraries/lock/v11/configuration)
- [Auth0 Community Forum](https://community.auth0.com/)

## Next Steps

1. Implement the customization using one of the options above
2. Test thoroughly across different browsers and devices
3. Consider setting up a custom domain for full white-labeling
4. Add additional branding elements as needed
5. Monitor user experience and iterate based on feedback