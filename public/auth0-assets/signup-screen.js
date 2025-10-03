/**
 * ConsumerAuth - Auth0 Signup Screen Simple Version
 * Basic signup form without ACUL SDK complexity
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing ConsumerAuth signup...');

  // Wait for Auth0 ACUL SDK to be available
  function waitForAuth0SDK() {
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 20;

      function checkSDK() {
        attempts++;
        console.log(`Attempt ${attempts}: Checking for Auth0 ACUL SDK...`);

        // Check for Auth0 ACUL SDK
        if (typeof window.Auth0ACUL !== 'undefined') {
          console.log('✅ Auth0 ACUL SDK found');
          console.log('=== GLOBAL ACUL SDK DISCOVERY ===');
          console.log('window.Auth0ACUL object:', window.Auth0ACUL);
          console.log('Available screen constructors:');

          for (const prop in window.Auth0ACUL) {
            const value = window.Auth0ACUL[prop];
            const type = typeof value;
            console.log(`  ${prop}: ${type}`, type === 'function' ? '(constructor)' : '(property)');
          }

          console.log('=== END GLOBAL SDK DISCOVERY ===');
          resolve(window.Auth0ACUL);
          return;
        }

        if (attempts >= maxAttempts) {
          console.warn('⚠️ Auth0 SDK not found, proceeding without SDK');
          resolve(null);
          return;
        }

        setTimeout(checkSDK, 200);
      }

      checkSDK();
    });
  }

  async function initializeSignup() {
    console.log('Starting signup initialization...');

    // Wait for Auth0 SDK
    const auth0SDK = await waitForAuth0SDK();

    // Simple branding configuration
    const brandingConfig = {
      companyName: 'ConsumerAuth',
      logoIcon: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m7.5 4.27 9 5.15"></path>
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
          <path d="m3.3 7 8.7 5 8.7-5"></path>
          <path d="M12 22V12"></path>
        </svg>
      `,
      primaryColor: '#020817',
      welcomeTitle: 'Create Your Account',
      welcomeDescription: 'Enter your email address to get started'
    };

    // Signup screen class with ACUL SDK integration
    class SignupScreen {
      constructor(auth0SDK) {
        this.auth0SDK = auth0SDK;
        this.signupManager = null;
        this.container = null;

        // Try to initialize Signup manager if SDK is available
        if (this.auth0SDK) {
          try {
            // For Auth0 ACUL SDK
            if (typeof window.Auth0ACUL !== 'undefined' && window.Auth0ACUL.Signup) {
              console.log('Initializing Auth0 ACUL Signup manager...');
              this.signupManager = new window.Auth0ACUL.Signup();

              // SDK Method Discovery
              console.log('=== ACUL SIGNUP SDK METHOD DISCOVERY ===');
              console.log('Signup manager instance:', this.signupManager);
              console.log('Available methods and properties:');

              for (const prop in this.signupManager) {
                const value = this.signupManager[prop];
                const type = typeof value;
                console.log(`  ${prop}: ${type}`, type === 'function' ? '(method)' : '(property)');

                if (type === 'function') {
                  try {
                    console.log(`    Function signature: ${value.toString().split('{')[0]}}`);
                  } catch (e) {
                    console.log(`    Function signature: [unavailable]`);
                  }
                }
              }

              // Check for expected methods
              const expectedMethods = ['signup', 'register', 'submitData', 'create', 'submit'];
              console.log('Checking for expected methods:');
              expectedMethods.forEach(method => {
                const exists = typeof this.signupManager[method] === 'function';
                console.log(`  ${method}: ${exists ? '✅ Available' : '❌ Not found'}`);
              });

              console.log('=== END SIGNUP SDK DISCOVERY ===');

              // Check for initial errors from transaction
              if (this.signupManager.transaction?.errors && this.signupManager.transaction.errors.length > 0) {
                console.log('⚠️ ACUL SDK errors detected:', this.signupManager.transaction.errors);
              }

              // Set up SDK event listeners (moved from trySignupSDKMethods)
              this.setupSignupSDKEventListeners();
            }
          } catch (error) {
            console.warn('Failed to initialize Auth0 Signup manager:', error);
          }
        }
      }

      render() {
        console.log('Rendering dramatic ConsumerAuth signup screen');

        // Clear existing content and set body styles
        document.body.innerHTML = '';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.fontFamily = 'Inter, system-ui, -apple-system, sans-serif';
        document.body.style.overflow = 'hidden';

        // Create main split-screen container with different gradient
        this.container = document.createElement('div');
        this.container.style.cssText = `
          display: flex;
          height: 100vh;
          width: 100vw;
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 50%, #ff9ff3 100%);
          position: relative;
        `;

        // Create left panel (brand/visual)
        const leftPanel = this.createLeftPanel();
        this.container.appendChild(leftPanel);

        // Create right panel (form)
        const rightPanel = this.createRightPanel();
        this.container.appendChild(rightPanel);

        // Add floating particles
        this.addFloatingParticles();

        // Append to body
        document.body.appendChild(this.container);

        // Initialize event listeners
        this.initializeEventListeners();

        // Add entrance animation
        this.playEntranceAnimation();
      }

      createLeftPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
          flex: 1;
          background: linear-gradient(45deg, #2d1b69 0%, #11998e 50%, #38ef7d 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
        `;

        // Brand section with animated elements
        const brandContainer = document.createElement('div');
        brandContainer.style.cssText = `
          text-align: center;
          z-index: 2;
          transform: translateY(-20px);
        `;

        // Large animated logo with different color scheme
        const logoContainer = document.createElement('div');
        logoContainer.style.cssText = `
          width: 120px;
          height: 120px;
          margin: 0 auto 2rem;
          background: linear-gradient(45deg, #38ef7d, #11998e, #2d1b69);
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: float 3s ease-in-out infinite;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        `;

        const logo = document.createElement('div');
        logo.innerHTML = brandingConfig.logoIcon;
        logo.style.cssText = `
          color: white;
          transform: scale(3);
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
        `;
        logoContainer.appendChild(logo);

        // Animated title with signup theme
        const title = document.createElement('h1');
        title.textContent = 'Join ' + brandingConfig.companyName;
        title.style.cssText = `
          color: white;
          font-size: 2.8rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          background: linear-gradient(45deg, #38ef7d, #11998e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: pulse 2s ease-in-out infinite;
        `;

        // Signup-specific subtitle
        const subtitle = document.createElement('p');
        subtitle.textContent = 'Create • Innovate • Succeed';
        subtitle.style.cssText = `
          color: rgba(255,255,255,0.9);
          font-size: 1.2rem;
          font-weight: 300;
          margin: 0;
          letter-spacing: 2px;
        `;

        brandContainer.appendChild(logoContainer);
        brandContainer.appendChild(title);
        brandContainer.appendChild(subtitle);
        panel.appendChild(brandContainer);

        // Add geometric shapes for visual interest
        this.addGeometricShapes(panel);

        return panel;
      }

      createRightPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
          flex: 1;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 3rem;
          position: relative;
        `;

        // Glassmorphism form container
        const formContainer = document.createElement('div');
        formContainer.style.cssText = `
          background: rgba(255,255,255,0.25);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 24px;
          padding: 3rem;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          transform: translateX(20px);
          opacity: 0;
          animation: slideInRight 0.8s ease-out 0.3s forwards;
        `;

        // Form header
        const header = document.createElement('div');
        header.style.cssText = 'text-align: center; margin-bottom: 2rem;';

        const welcomeTitle = document.createElement('h2');
        welcomeTitle.textContent = 'Create Your Account';
        welcomeTitle.style.cssText = `
          color: #1a1a2e;
          font-size: 2rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
        `;

        const welcomeDesc = document.createElement('p');
        welcomeDesc.textContent = 'Join thousands of users today';
        welcomeDesc.style.cssText = `
          color: #64748b;
          font-size: 1rem;
          margin: 0;
        `;

        header.appendChild(welcomeTitle);
        header.appendChild(welcomeDesc);

        // Form
        const form = this.createModernForm();

        formContainer.appendChild(header);
        formContainer.appendChild(form);
        panel.appendChild(formContainer);

        return panel;
      }

      createHeader() {
        const header = document.createElement('div');
        header.style.cssText = 'text-align: center; margin-bottom: 2rem;';

        // Brand section
        const brand = document.createElement('div');
        brand.style.cssText = 'display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 1.5rem;';

        const brandIcon = document.createElement('div');
        brandIcon.innerHTML = brandingConfig.logoIcon;
        brandIcon.style.color = brandingConfig.primaryColor;

        const brandName = document.createElement('span');
        brandName.textContent = brandingConfig.companyName;
        brandName.style.cssText = 'font-size: 1.25rem; font-weight: 600; color: #0f172a;';

        brand.appendChild(brandIcon);
        brand.appendChild(brandName);

        // Title and description
        const title = document.createElement('h1');
        title.textContent = brandingConfig.welcomeTitle;
        title.style.cssText = 'font-size: 1.5rem; font-weight: 600; color: #0f172a; margin: 0 0 0.5rem 0;';

        const description = document.createElement('p');
        description.textContent = brandingConfig.welcomeDescription;
        description.style.cssText = 'color: #64748b; margin: 0;';

        header.appendChild(brand);
        header.appendChild(title);
        header.appendChild(description);

        return header;
      }

      createFormContainer() {
        const container = document.createElement('div');

        // Error message container
        const errorContainer = document.createElement('div');
        errorContainer.id = 'error-container';
        errorContainer.style.display = 'none';
        container.appendChild(errorContainer);

        // Main form
        const form = document.createElement('form');
        form.id = 'signup-form';

        // Email field
        const emailGroup = this.createInputGroup('username', 'Email', 'email', 'Enter your email address');
        form.appendChild(emailGroup);

        // Password field
        const passwordGroup = this.createInputGroup('password', 'Password', 'password', 'Create a password');
        form.appendChild(passwordGroup);

        // Confirm password field
        const confirmPasswordGroup = this.createInputGroup('password_confirm', 'Confirm Password', 'password', 'Confirm your password');
        form.appendChild(confirmPasswordGroup);

        // Submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.id = 'submit-button';
        submitButton.textContent = 'Continue';
        submitButton.style.cssText = `
          width: 100%;
          background-color: ${brandingConfig.primaryColor};
          color: white;
          border: none;
          border-radius: 6px;
          padding: 0.75rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          margin-top: 1rem;
        `;
        form.appendChild(submitButton);

        // Back to login link
        const backToLogin = document.createElement('div');
        backToLogin.style.cssText = 'text-align: center; margin-top: 1rem;';

        const backLink = document.createElement('a');
        backLink.href = '#';
        backLink.textContent = 'Already have an account? Sign in';
        backLink.id = 'back-to-login';
        backLink.style.cssText = 'color: #64748b; text-decoration: none; font-size: 0.875rem;';

        backToLogin.appendChild(backLink);
        form.appendChild(backToLogin);

        container.appendChild(form);
        return container;
      }

      createInputGroup(id, label, type, placeholder) {
        const group = document.createElement('div');
        group.style.cssText = 'margin-bottom: 1rem;';

        const labelEl = document.createElement('label');
        labelEl.setAttribute('for', id);
        labelEl.textContent = label;
        labelEl.style.cssText = 'display: block; margin-bottom: 0.5rem; font-weight: 500; color: #0f172a;';

        const input = document.createElement('input');
        input.id = id;
        input.name = id;
        input.type = type;
        input.placeholder = placeholder;
        input.required = true;
        input.style.cssText = `
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 1rem;
          box-sizing: border-box;
        `;

        group.appendChild(labelEl);
        group.appendChild(input);

        return group;
      }

      initializeEventListeners() {
        const form = document.getElementById('signup-form');
        const backToLoginLink = document.getElementById('back-to-login');

        // Form submission
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleSignup();
        });

        // Back to login
        backToLoginLink.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleBackToLogin();
        });
      }

      handleSignup() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        console.log('Signup - submitting signup form');

        // Validate password
        const validationErrors = this.validatePassword(password);
        if (!username) {
          this.showError('Please enter your email address.');
          return;
        }

        if (validationErrors.length > 0) {
          this.showError(validationErrors.join('. '));
          return;
        }

        this.setLoadingState(true);

        // Progressive SDK Enhancement: Try SDK methods first
        if (this.signupManager) {
          this.trySignupSDKMethods(username, password);
        } else {
          // Fallback to manual form submission
          console.log('No ACUL SDK available, using form submission fallback');
          this.submitSignupForm(username, password);
        }
      }

      validatePassword(password) {
        const errors = [];

        if (!password) {
          errors.push('Password cannot be empty');
          return errors;
        }

        if (password.length < 8) {
          errors.push('Password must be at least 8 characters long');
        }

        if (!/[a-z]/.test(password)) {
          errors.push('Password must contain at least one lowercase letter (a-z)');
        }

        if (!/[A-Z]/.test(password)) {
          errors.push('Password must contain at least one uppercase letter (A-Z)');
        }

        if (!/[0-9]/.test(password)) {
          errors.push('Password must contain at least one number (0-9)');
        }

        return errors;
      }

      trySignupSDKMethods(username, password) {
        const methods = ['signup', 'register', 'submitData', 'create', 'submit'];

        console.log('=== ATTEMPTING SIGNUP SDK METHODS ===');

        for (const method of methods) {
          if (typeof this.signupManager[method] === 'function') {
            console.log(`Attempting SDK method: ${method}`);
            try {
              // Try different parameter formats
              const attempts = [
                { email: username, password: password },
                { username: username, password: password },
                { identifier: username, password: password }
              ];

              for (const params of attempts) {
                try {
                  console.log(`  Trying with params:`, params);
                  const result = this.signupManager[method](params);
                  console.log(`  Result:`, result);

                  // If successful, setup event listeners
                  console.log(`✅ SDK method ${method} succeeded`);
                  this.setupSignupSDKEventListeners();
                  return;
                } catch (innerError) {
                  console.log(`  Failed with params:`, innerError.message);
                }
              }
            } catch (error) {
              console.log(`❌ SDK method ${method} failed:`, error.message);
            }
          }
        }

        console.log('=== ALL SDK METHODS FAILED ===');
        console.log('Falling back to form submission');
        this.submitSignupForm(username, password);
      }

      setupSignupSDKEventListeners() {
        console.log('Setting up signup SDK event listeners');

        if (this.signupManager && typeof this.signupManager.on === 'function') {
          const events = ['success', 'error', 'redirect', 'stateChange'];

          events.forEach(event => {
            try {
              this.signupManager.on(event, (data) => {
                console.log(`Signup SDK Event: ${event}`, data);

                if (event === 'error') {
                  this.setLoadingState(false);
                  const errorMessage = data?.message || data?.description || data?.error_description || 'Signup failed. Please try again.';
                  this.showError(errorMessage);
                }
              });
              console.log(`✅ Listener registered for: ${event}`);
            } catch (error) {
              console.log(`❌ Could not register listener for: ${event}`);
            }
          });
        }
      }

      submitSignupForm(username, password) {
        // Submit complete signup form to Auth0
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/u/signup';

        const usernameInput = document.createElement('input');
        usernameInput.type = 'hidden';
        usernameInput.name = 'username';
        usernameInput.value = username;

        const emailInput = document.createElement('input');
        emailInput.type = 'hidden';
        emailInput.name = 'email';
        emailInput.value = username;

        const passwordInput = document.createElement('input');
        passwordInput.type = 'hidden';
        passwordInput.name = 'password';
        passwordInput.value = password;

        // Add state parameter
        const urlParams = new URLSearchParams(window.location.search);
        const state = urlParams.get('state');
        if (state) {
          const stateInput = document.createElement('input');
          stateInput.type = 'hidden';
          stateInput.name = 'state';
          stateInput.value = state;
          form.appendChild(stateInput);
        }

        // Add action parameter
        const actionInput = document.createElement('input');
        actionInput.type = 'hidden';
        actionInput.name = 'action';
        actionInput.value = 'default';
        form.appendChild(actionInput);

        form.appendChild(usernameInput);
        form.appendChild(emailInput);
        form.appendChild(passwordInput);

        document.body.appendChild(form);
        form.submit();
      }

      handleBackToLogin() {
        console.log('Back to login clicked from signup');
        const urlParams = new URLSearchParams(window.location.search);
        const state = urlParams.get('state');

        // Navigate back to the correct login identifier screen
        if (state) {
          const loginUrl = `${window.location.origin}/u/login/identifier?state=${state}`;
          console.log('Navigating back to login identifier:', loginUrl);
          window.location.href = loginUrl;
        } else {
          console.log('No state parameter, navigating to login identifier without state');
          window.location.href = `${window.location.origin}/u/login/identifier`;
        }
      }

      createModernForm() {
        const form = document.createElement('form');
        form.id = 'signup-form';
        form.style.cssText = 'width: 100%;';

        // Error container
        const errorContainer = document.createElement('div');
        errorContainer.id = 'error-container';
        errorContainer.style.display = 'none';
        form.appendChild(errorContainer);

        // Modern email input
        const emailGroup = document.createElement('div');
        emailGroup.style.cssText = 'margin-bottom: 1.5rem; position: relative;';

        const emailInput = document.createElement('input');
        emailInput.id = 'username';
        emailInput.name = 'username';
        emailInput.type = 'email';
        emailInput.placeholder = 'Enter your email address';
        emailInput.required = true;
        emailInput.style.cssText = `
          width: 100%;
          padding: 1.25rem 1.5rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 16px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          color: #1a1a2e;
          font-size: 1rem;
          font-weight: 500;
          box-sizing: border-box;
          transition: all 0.3s ease;
          outline: none;
        `;

        this.addInputFocusEffects(emailInput, '#38ef7d');
        emailGroup.appendChild(emailInput);

        // Modern password input with toggle visibility
        const passwordGroup = document.createElement('div');
        passwordGroup.style.cssText = 'margin-bottom: 1rem; position: relative;';

        const passwordInput = document.createElement('input');
        passwordInput.id = 'password';
        passwordInput.name = 'password';
        passwordInput.type = 'password';
        passwordInput.placeholder = 'Create a strong password';
        passwordInput.required = true;
        passwordInput.autocomplete = 'new-password';
        passwordInput.style.cssText = `
          width: 100%;
          padding: 1.25rem 3.5rem 1.25rem 1.5rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 16px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          color: #1a1a2e;
          font-size: 1rem;
          font-weight: 500;
          box-sizing: border-box;
          transition: all 0.3s ease;
          outline: none;
        `;

        // Toggle password visibility button
        const toggleButton = document.createElement('button');
        toggleButton.type = 'button';
        toggleButton.innerHTML = `
          <svg class="eye-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <svg class="eye-off-icon" style="display: none;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        `;
        toggleButton.style.cssText = `
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s ease;
        `;

        toggleButton.addEventListener('click', () => {
          const eyeIcon = toggleButton.querySelector('.eye-icon');
          const eyeOffIcon = toggleButton.querySelector('.eye-off-icon');

          if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.style.display = 'none';
            eyeOffIcon.style.display = 'block';
          } else {
            passwordInput.type = 'password';
            eyeIcon.style.display = 'block';
            eyeOffIcon.style.display = 'none';
          }
        });

        toggleButton.addEventListener('mouseenter', () => {
          toggleButton.style.color = '#1a1a2e';
        });

        toggleButton.addEventListener('mouseleave', () => {
          toggleButton.style.color = '#64748b';
        });

        this.addInputFocusEffects(passwordInput, '#11998e');
        passwordGroup.appendChild(passwordInput);
        passwordGroup.appendChild(toggleButton);

        // Password requirements hint
        const requirementsHint = document.createElement('div');
        requirementsHint.style.cssText = `
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 1.5rem;
          padding: 0.75rem;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
        `;
        requirementsHint.innerHTML = `
          <div style="font-weight: 600; margin-bottom: 0.5rem;">Password must contain:</div>
          <ul style="margin: 0; padding-left: 1.5rem; line-height: 1.6;">
            <li>At least 8 characters</li>
            <li>Lowercase letter (a-z)</li>
            <li>Uppercase letter (A-Z)</li>
            <li>Number (0-9)</li>
          </ul>
        `;

        // Modern submit button with signup theme
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.id = 'submit-button';
        submitButton.innerHTML = '<span id="submit-text">Create Account</span><div id="submit-spinner" style="display: none;">⏳</div>';
        submitButton.style.cssText = `
          width: 100%;
          padding: 1.25rem;
          background: linear-gradient(45deg, #ff6b6b, #ee5a24);
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 2rem;
          box-shadow: 0 8px 32px rgba(255, 107, 107, 0.3);
        `;

        submitButton.addEventListener('mouseenter', () => {
          submitButton.style.transform = 'translateY(-2px)';
          submitButton.style.boxShadow = '0 12px 40px rgba(255, 107, 107, 0.4)';
        });

        submitButton.addEventListener('mouseleave', () => {
          submitButton.style.transform = 'translateY(0)';
          submitButton.style.boxShadow = '0 8px 32px rgba(255, 107, 107, 0.3)';
        });

        // Back to login link
        const backContainer = document.createElement('div');
        backContainer.style.cssText = 'text-align: center; margin-top: 1rem;';

        const backText = document.createElement('span');
        backText.textContent = 'Already have an account? ';
        backText.style.cssText = 'color: #64748b; font-size: 0.9rem;';

        const backLink = document.createElement('a');
        backLink.href = '#';
        backLink.id = 'back-to-login';
        backLink.textContent = 'Sign in';
        backLink.style.cssText = `
          color: #ff6b6b;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        `;

        backLink.addEventListener('mouseenter', () => {
          backLink.style.color = '#ee5a24';
          backLink.style.textDecoration = 'underline';
        });

        backLink.addEventListener('mouseleave', () => {
          backLink.style.color = '#ff6b6b';
          backLink.style.textDecoration = 'none';
        });

        backContainer.appendChild(backText);
        backContainer.appendChild(backLink);

        form.appendChild(emailGroup);
        form.appendChild(passwordGroup);
        form.appendChild(requirementsHint);
        form.appendChild(submitButton);
        form.appendChild(backContainer);

        return form;
      }

      addInputFocusEffects(input, focusColor) {
        input.addEventListener('focus', () => {
          input.style.borderColor = focusColor;
          input.style.background = 'rgba(255,255,255,0.2)';
          input.style.transform = 'scale(1.02)';
        });

        input.addEventListener('blur', () => {
          input.style.borderColor = 'rgba(255,255,255,0.3)';
          input.style.background = 'rgba(255,255,255,0.1)';
          input.style.transform = 'scale(1)';
        });
      }

      addGeometricShapes(container) {
        // Add floating geometric shapes for visual interest with signup theme
        for (let i = 0; i < 6; i++) {
          const shape = document.createElement('div');
          const size = Math.random() * 120 + 60;
          const shapeType = Math.random();

          let borderRadius;
          if (shapeType < 0.33) {
            borderRadius = '50%'; // Circle
          } else if (shapeType < 0.66) {
            borderRadius = '20px'; // Rounded square
          } else {
            borderRadius = '50% 20% 50% 20%'; // Organic shape
          }

          shape.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: linear-gradient(45deg, rgba(56,239,125,0.1), rgba(17,153,142,0.1), rgba(45,27,105,0.1));
            border-radius: ${borderRadius};
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: floatShape ${4 + Math.random() * 3}s ease-in-out infinite;
            animation-delay: ${Math.random() * 3}s;
            z-index: 1;
          `;

          container.appendChild(shape);
        }
      }

      addFloatingParticles() {
        // Add CSS animations for signup screen
        const style = document.createElement('style');
        style.textContent = `
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.9; }
          }

          @keyframes slideInRight {
            from {
              transform: translateX(20px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes floatShape {
            0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
            25% { transform: translateY(-15px) rotate(90deg) scale(1.1); }
            50% { transform: translateY(-5px) rotate(180deg) scale(0.9); }
            75% { transform: translateY(-20px) rotate(270deg) scale(1.05); }
          }
        `;
        document.head.appendChild(style);
      }

      playEntranceAnimation() {
        // Add entrance animation to the main container
        this.container.style.opacity = '0';
        this.container.style.transform = 'scale(0.95)';
        this.container.style.transition = 'all 0.8s ease-out';

        setTimeout(() => {
          this.container.style.opacity = '1';
          this.container.style.transform = 'scale(1)';
        }, 100);
      }

      showError(message) {
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
          errorContainer.innerHTML = '<div style="color: #dc2626; padding: 1rem; background: rgba(220, 38, 38, 0.1); border-radius: 8px; margin-bottom: 1rem;">' + message + '</div>';
          errorContainer.style.display = 'block';
          errorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          alert(message);
        }
      }

      clearErrors() {
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
          errorContainer.style.display = 'none';
          errorContainer.innerHTML = '';
        }
      }

      setLoadingState(loading) {
        const submitButton = document.getElementById('submit-button');
        if (submitButton) {
          if (loading) {
            submitButton.disabled = true;
            submitButton.innerHTML = '⏳ Creating Account...';
          } else {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Create Account';
          }
        }
      }
    }

    // Initialize the signup screen with SDK
    try {
      const signup = new SignupScreen(auth0SDK);
      signup.render();
      console.log('✅ ConsumerAuth signup screen rendered successfully');
    } catch (error) {
      console.error('❌ Error rendering signup screen:', error);
      document.body.innerHTML = '<div style="text-align: center; padding: 2rem;"><h1>Loading...</h1></div>';
    }
  }

  // Start initialization
  initializeSignup();
});

// Global error handler
window.addEventListener('error', function(e) {
  console.error('Simple signup global error:', e.error);
});