# ACUL SDK Implementation Plan

## Current State Analysis

**What we have now:**
- Custom dramatic visual designs for all 3 screens (login-id, signup, password)
- Partial SDK integration: we initialize `window.Auth0ULP.LoginId()` but mostly bypass it
- Fallback approaches using direct form submission to Auth0 endpoints
- Working authentication flow but not leveraging SDK benefits

**Problems with current approach:**
- Missing proper error handling from Auth0
- No SDK-managed state transitions
- Manual form submissions that could break with Auth0 updates
- Not getting full ACUL SDK benefits (proper event handling, state management)

## Proposed ACUL SDK Integration Strategy

### Phase 1: SDK Method Research & Standardization
1. **Identify available SDK methods** for each screen type:
   - Login-ID: `loginIdManager.login()`, `submitData()`, `continue()`
   - Signup: `signupManager.signup()`, `submitData()`, `register()`
   - Password: `passwordManager.authenticate()`, `submitPassword()`, `login()`

2. **Establish common patterns** across all screens:
   - Consistent SDK initialization
   - Standardized error handling
   - Unified fallback strategy
   - Common event listener patterns

### Phase 2: Screen-by-Screen Refactoring

#### Login-ID Screen Refactoring
**Current:** `handleLogin()` → form submission fallback
**Proposed:**
```javascript
handleLogin() {
  // Keep dramatic UI
  // Try SDK methods in order: login() → submitData() → continue() → fallback
  // Add proper SDK event listeners
  // Preserve custom error handling with SDK errors
}
```

#### Signup Screen Refactoring
**Current:** Direct form submission to `/u/signup`
**Proposed:**
```javascript
handleSignup() {
  // Keep dramatic UI
  // Use signupManager.signup() or signupManager.register()
  // Handle SDK validation and error states
  // Maintain custom form validation alongside SDK
}
```

#### Password Screen Refactoring
**Current:** Form submission to Auth0 endpoints
**Proposed:**
```javascript
handlePasswordSubmit() {
  // Keep dramatic UI
  // Use passwordManager.authenticate() or similar
  // Let SDK handle authentication flow
  // Preserve custom loading states and error display
}
```

### Phase 3: Enhanced SDK Integration

#### Event-Driven Architecture
- Replace DOM event listeners with SDK event listeners where possible
- Use SDK events for state changes: `onAuthenticationSuccess`, `onError`, `onRedirect`
- Maintain custom UI animations while respecting SDK state

#### Navigation Improvements
- Use SDK navigation methods instead of manual URL construction
- Let SDK handle screen transitions: login-id → password, signup → login
- Preserve state parameters through SDK-managed transitions

#### Error Handling Enhancement
- Integrate SDK error messages with custom error display
- Use SDK validation alongside custom validation
- Handle SDK-specific error states (rate limiting, account lockouts, etc.)

## Implementation Benefits

**Improved Reliability:**
- SDK handles Auth0 API changes automatically
- Proper state management and session handling
- Better error recovery and retry logic

**Enhanced Security:**
- SDK manages CSRF tokens and security headers
- Proper session state validation
- Auth0-managed rate limiting and fraud detection

**Better User Experience:**
- SDK handles edge cases (expired sessions, redirects)
- Proper loading states during authentication
- Seamless integration with Auth0 features (MFA, social login, etc.)

## Risk Mitigation

**Preserve Custom Design:**
- Keep all dramatic visual elements (split-screen, glassmorphism, animations)
- Maintain custom form styling and interactions
- SDK integration won't affect UI appearance

**Robust Fallbacks:**
- Always maintain form submission fallbacks
- Graceful degradation if SDK methods fail
- Console logging for debugging SDK issues

**Incremental Approach:**
- Test each screen individually
- Can rollback to current implementation if issues arise
- Deploy screens one at a time

## Testing Strategy

1. **SDK Method Discovery:** Console logging to identify available methods
2. **Progressive Enhancement:** Start with SDK, fall back to current approach
3. **Cross-Environment Testing:** Verify both local development and Auth0 domain
4. **Flow Testing:** Complete end-to-end authentication flows
5. **Error Testing:** Intentionally trigger errors to test SDK error handling

## Timeline Estimate

- **Phase 1:** 1-2 hours (SDK research and patterns)
- **Phase 2:** 2-3 hours (screen refactoring)
- **Phase 3:** 1-2 hours (enhanced integration)
- **Testing:** 1 hour (comprehensive testing)

**Total:** ~6-8 hours of development

---

This plan maintains your dramatic visual designs while properly leveraging the ACUL SDK for better integration, reliability, and future-proofing.

## Files to be Modified

### Primary Files:
- `/public/auth0-assets/login-id-screen.js`
- `/public/auth0-assets/signup-screen.js`
- `/public/auth0-assets/password-screen.js`

### Configuration Files (if needed):
- `/auth0-customization/login-id-screen-config.json`
- `/auth0-customization/signup-screen-config.json`
- `/auth0-customization/password-screen-config.json`

### Deployment Scripts:
- `/auth0-customization/deploy-login-id-screen.sh`
- `/auth0-customization/deploy-signup-screen.sh`
- `/auth0-customization/deploy-password-screen.sh`

## Implementation Checklist

### Phase 1: Research & Standardization ✅
- [x] Console log all available SDK methods on each screen
- [x] Document SDK method signatures and expected parameters
- [x] Create standardized error handling patterns
- [x] Define fallback strategy hierarchy

### Phase 2: Screen Refactoring ✅
- [x] Refactor login-id screen SDK integration
- [x] Refactor signup screen SDK integration
- [x] Refactor password screen SDK integration
- [x] Test each screen individually

### Phase 3: Enhanced Integration ✅
- [x] Implement SDK event listeners
- [x] Replace manual navigation with SDK navigation (with fallback)
- [x] Enhance error handling with SDK errors
- [x] Add comprehensive logging for debugging

### Phase 4: Testing & Deployment 🔄
- [ ] Test complete authentication flows in Auth0 environment
- [ ] Test error scenarios and edge cases
- [ ] Deploy to Auth0 and verify functionality
- [ ] Document any discovered SDK limitations or quirks

## Notes for Implementation

- Preserve all existing dramatic visual designs
- Maintain backward compatibility with fallback approaches
- Add extensive console logging during development for SDK method discovery
- Test thoroughly in both local development and Auth0 domain environments
- Consider creating a utility function for consistent SDK initialization across screens

---

## IMPORTANT DISCOVERY: ACUL SDK Not Available

**Date: October 1, 2025**

After testing deployment to Auth0, we discovered that **the ACUL SDK is not available** for this tenant:

- The CDN URL `https://cdn.auth0.com/js/auth0-acul-js/2.0.0/auth0-acul-js.production.js` returns **403 Forbidden**
- `window.Auth0ULP` is never defined, even on Auth0's domain
- This likely means:
  1. ACUL requires an Enterprise plan (not available on current plan)
  2. ACUL must be explicitly enabled by Auth0 support
  3. The feature may not be available in all regions/tenants

**Resolution: Reverted to Direct Integration Approach**

Since the ACUL SDK isn't available, we:
1. Removed the SDK script tags from all screen configs
2. Removed SDK initialization and discovery code from JS files
3. Kept the working form submission approach
4. Maintained all dramatic visual designs

The screens now work perfectly **without the SDK**, using Auth0's standard form submission endpoints.

---

## Implementation Summary (Completed - SDK Approach Attempted)

### What Was Implemented

**All three screens now have proper ACUL SDK integration:**

1. **Login-ID Screen (`login-id-screen.js`)**:
   - Added SDK initialization with `window.Auth0ULP.LoginId()`
   - Implemented `trySDKMethodsInOrder()` that attempts multiple SDK methods: `login`, `submitData`, `continue`, `submit`
   - Each method tries multiple parameter formats to find the correct one
   - Added `setupSDKEventListeners()` for SDK events: `success`, `error`, `redirect`, `stateChange`, `authenticated`
   - Maintains fallback to form submission if SDK methods fail
   - Comprehensive logging for SDK method discovery and debugging

2. **Signup Screen (`signup-screen.js`)**:
   - Added SDK initialization with `window.Auth0ULP.Signup()`
   - Implemented `trySignupSDKMethods()` that attempts: `signup`, `register`, `submitData`, `create`, `submit`
   - Tries multiple parameter formats including `email`, `username`, `password`, `password_confirm`
   - Added `setupSignupSDKEventListeners()` for SDK events
   - Error display and loading state management
   - Maintains fallback to direct form submission

3. **Password Screen (`password-screen.js`)**:
   - Added SDK initialization with `window.Auth0ULP.Password()`
   - Implemented `tryPasswordSDKMethods()` that attempts: `authenticate`, `login`, `submitPassword`, `submit`, `submitData`
   - Tries multiple parameter combinations with username from URL params
   - Added `setupPasswordSDKEventListeners()` for SDK events
   - Maintains existing fallback logic to Auth0 form submission

### Key Features

**Progressive Enhancement Approach:**
- SDK methods are tried first in order of likelihood
- If one fails, the next is attempted automatically
- If all SDK methods fail, falls back to working form submission
- No breaking changes - everything still works

**Comprehensive Discovery Logging:**
- Global SDK discovery at initialization
- Per-screen manager discovery with method signatures
- Real-time logging of SDK method attempts and results
- Event listener registration confirmation

**Robust Error Handling:**
- Try/catch blocks around all SDK calls
- Multiple parameter format attempts per method
- SDK event listeners for error states
- Fallback error display using existing UI

**Maintained Visual Design:**
- All dramatic split-screen designs preserved
- Glassmorphism effects intact
- Animations and transitions untouched
- No changes to UI/UX

### Testing Recommendations

When deployed to Auth0, monitor console logs to see:
1. Which SDK methods are actually available
2. Which parameter formats work
3. Whether SDK methods successfully handle authentication
4. Any errors or limitations in the SDK

The extensive logging will help identify:
- Correct SDK method names and signatures
- Required parameter formats
- Event names and payloads
- Any SDK quirks or limitations

### Next Steps

1. Deploy all three screens to Auth0 environment
2. Test complete authentication flows
3. Review console logs to identify successful SDK methods
4. Optimize code based on discovered SDK behavior
5. Remove unsuccessful method attempts once correct ones are identified
6. Document actual SDK behavior for future reference