/**
 * ConsumerAuth - Auth0 Signup-ID Screen Custom JavaScript
 * Designed for Auth0 ACUL (Advanced Customizations for Universal Login)
 * Based on Auth0 ACUL SDK implementation patterns
 */

// Initialize custom signup screen immediately
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing ConsumerAuth custom signup-id screen...');

  // Wait for Auth0 ACUL SDK to be available
  function waitForAuth0SDK() {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 20;

      function checkSDK() {
        attempts++;
        console.log(`Attempt ${attempts}: Checking for Auth0 ACUL SDK...`);

        // Check for Auth0 ACUL SDK
        if (typeof window.Auth0ULP !== 'undefined') {
          console.log('✅ Auth0 ACUL SDK found');
          resolve(window.Auth0ULP);
          return;
        }

        // Check for legacy SDK
        if (typeof window.auth0 !== 'undefined') {
          console.log('✅ Legacy Auth0 SDK found');
          resolve(window.auth0);
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

  async function initializeCustomSignup() {
    console.log('Starting custom signup-id initialization...');

    // Debug: Log URL and parameters
    console.log('Current URL:', window.location.href);
    console.log('URL Parameters:', new URLSearchParams(window.location.search).toString());
    console.log('Pathname:', window.location.pathname);

    // Wait for Auth0 SDK
    const auth0SDK = await waitForAuth0SDK();

    // Custom branding configuration
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

    // Auth0 ACUL SDK Integration
    class ConsumerAuthSignupIdScreen {
      constructor() {
        this.auth0SDK = auth0SDK;
        this.signupIdManager = null;
        this.container = null;

        // Try to initialize Signup ID manager if SDK is available
        if (this.auth0SDK) {
          try {
            // For Auth0 ACUL SDK
            if (typeof window.Auth0ULP !== 'undefined' && window.Auth0ULP.SignupId) {
              console.log('Initializing Auth0 ACUL SignupId manager...');
              this.signupIdManager = new window.Auth0ULP.SignupId();
            }
          } catch (error) {
            console.warn('Failed to initialize Auth0 SignupId manager:', error);
          }
        }
      }

      render() {
        console.log('Rendering ConsumerAuth signup-id screen');

        // Create main container
        this.container = document.createElement('div');
        this.container.className = 'auth0-login-container';

        // Create the signup card
        const card = this.createCard();
        this.container.appendChild(card);

        // Append to body
        document.body.appendChild(this.container);

        // Initialize event listeners
        this.initializeEventListeners();
      }

      createCard() {
        const card = document.createElement('div');
        card.className = 'auth0-card';

        // Create header
        const header = this.createHeader();
        card.appendChild(header);

        // Create form container
        const formContainer = this.createFormContainer();
        card.appendChild(formContainer);

        // Create footer
        const footer = this.createFooter();
        card.appendChild(footer);

        return card;
      }

      createHeader() {
        const header = document.createElement('div');
        header.className = 'auth0-header';

        // Brand section
        const brand = document.createElement('div');
        brand.className = 'auth0-brand';

        const brandIcon = document.createElement('div');
        brandIcon.className = 'auth0-brand-icon';
        brandIcon.innerHTML = brandingConfig.logoIcon;

        const brandName = document.createElement('span');
        brandName.className = 'auth0-brand-name';
        brandName.textContent = brandingConfig.companyName;

        brand.appendChild(brandIcon);
        brand.appendChild(brandName);

        // Title and description
        const title = document.createElement('h1');
        title.className = 'auth0-title';
        title.textContent = brandingConfig.welcomeTitle;

        const description = document.createElement('p');
        description.className = 'auth0-description';
        description.textContent = brandingConfig.welcomeDescription;

        header.appendChild(brand);
        header.appendChild(title);
        header.appendChild(description);

        return header;
      }

      createFormContainer() {
        const container = document.createElement('div');
        container.className = 'auth0-form-container';

        // Error message container
        const errorContainer = document.createElement('div');
        errorContainer.id = 'error-container';
        errorContainer.style.display = 'none';
        container.appendChild(errorContainer);

        // Main form
        const form = document.createElement('form');
        form.className = 'auth0-form';
        form.id = 'signup-form';

        // Email field - this is the only field for signup-id screen
        const emailGroup = this.createInputGroup('username', 'Email', 'email', 'Enter your email address');
        form.appendChild(emailGroup);

        // Submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'auth0-button auth0-button-primary';
        submitButton.id = 'submit-button';
        submitButton.innerHTML = '<span id="submit-text">Continue</span><div id="submit-spinner" class="auth0-spinner" style="display: none;"></div>';
        form.appendChild(submitButton);

        container.appendChild(form);

        // Back to login link
        const backToLogin = document.createElement('div');
        backToLogin.style.textAlign = 'center';
        backToLogin.style.marginTop = '1.5rem';
        backToLogin.style.paddingTop = '1.5rem';
        backToLogin.style.borderTop = '1px solid var(--border)';

        const backText = document.createElement('p');
        backText.style.color = 'var(--muted-fg)';
        backText.style.fontSize = '0.875rem';
        backText.style.margin = '0 0 0.5rem 0';
        backText.textContent = 'Already have an account?';

        const backLink = document.createElement('a');
        backLink.href = '#';
        backLink.className = 'auth0-link';
        backLink.textContent = 'Sign in';
        backLink.id = 'back-to-login-link';
        backLink.style.fontWeight = '500';

        backToLogin.appendChild(backText);
        backToLogin.appendChild(backLink);
        container.appendChild(backToLogin);

        return container;
      }

      createInputGroup(id, label, type, placeholder) {
        const group = document.createElement('div');
        group.className = 'auth0-input-group';

        const labelEl = document.createElement('label');
        labelEl.className = 'auth0-label';
        labelEl.setAttribute('for', id);
        labelEl.textContent = label;

        const input = document.createElement('input');
        input.className = 'auth0-input';
        input.id = id;
        input.name = id;
        input.type = type;
        input.placeholder = placeholder;
        input.required = true;

        group.appendChild(labelEl);
        group.appendChild(input);

        return group;
      }

      createFooter() {
        const footer = document.createElement('div');
        footer.className = 'auth0-footer';

        const footerText = document.createElement('p');
        footerText.className = 'auth0-footer-text';
        footerText.innerHTML = 'Powered by Auth0 • <a href="#" class="auth0-footer-link">Privacy Policy</a> • <a href="#" class="auth0-footer-link">Terms of Service</a>';

        footer.appendChild(footerText);
        return footer;
      }

      initializeEventListeners() {
        const self = this;
        const form = document.getElementById('signup-form');
        const backToLoginLink = document.getElementById('back-to-login-link');

        // Form submission
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          self.handleSignup();
        });

        // Back to login
        backToLoginLink.addEventListener('click', function(e) {
          e.preventDefault();
          self.handleBackToLogin();
        });

        // Input validation
        const inputs = document.querySelectorAll('.auth0-input');
        inputs.forEach(function(input) {
          input.addEventListener('blur', function() {
            self.validateInput(input);
          });
          input.addEventListener('input', function() {
            self.clearInputError(input);
          });
        });
      }

      handleSignup() {
        const username = document.getElementById('username').value;

        // Basic validation
        if (!username) {
          this.showError('Please enter your email address.');
          return;
        }

        if (!this.isValidEmail(username)) {
          this.showError('Please enter a valid email address.');
          return;
        }

        this.setLoadingState(true);
        this.clearErrors();

        console.log('Signup-ID screen - submitting username:', { username });

        // Use Auth0 ACUL SDK if available
        if (this.signupIdManager && this.signupIdManager.signup) {
          console.log('Using Auth0 ACUL SDK signup method');
          try {
            this.signupIdManager.signup({ username: username });
          } catch (error) {
            console.error('Auth0 ACUL SDK signup failed:', error);
            this.setLoadingState(false);
            this.showError('Signup failed. Please try again.');
          }
        } else {
          // Fallback to manual navigation
          console.log('No ACUL SDK available, using navigation fallback');
          this.navigateToSignupPasswordScreen(username);
        }
      }

      navigateToSignupPasswordScreen(username) {
        console.log('Navigating to signup-password screen with username:', username);

        // When running on Auth0's domain, use proper form submission instead of navigation
        if (window.location.hostname.includes('auth0.com') || window.location.hostname.includes('consumerauth.com')) {
          console.log('Running on Auth0 domain, submitting form with identifier');

          // Submit the identifier to Auth0's signup endpoint
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = '/u/signup/identifier';

          const usernameInput = document.createElement('input');
          usernameInput.type = 'hidden';
          usernameInput.name = 'username';
          usernameInput.value = username;

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

          form.appendChild(usernameInput);
          document.body.appendChild(form);
          form.submit();
        } else {
          // Local testing fallback
          console.log('Running locally, using navigation fallback');
          const urlParams = new URLSearchParams(window.location.search);
          const state = urlParams.get('state');

          if (state) {
            const signupPasswordUrl = `${window.location.origin}/u/signup-password?state=${state}&login_hint=${encodeURIComponent(username)}`;
            console.log('Navigating to:', signupPasswordUrl);
            window.location.href = signupPasswordUrl;
          } else {
            console.error('No state parameter found, cannot proceed');
            this.setLoadingState(false);
            this.showError('Unable to proceed. Please refresh and try again.');
          }
        }
      }

      handleBackToLogin() {
        console.log('Back to login clicked');

        const urlParams = new URLSearchParams(window.location.search);
        const state = urlParams.get('state');

        if (state) {
          const loginUrl = `${window.location.origin}/u/login-id?state=${state}`;
          window.location.href = loginUrl;
        }
      }

      validateInput(input) {
        const value = input.value.trim();

        if (!value) {
          this.showInputError(input, 'This field is required.');
          return false;
        }

        if (input.type === 'email' && !this.isValidEmail(value)) {
          this.showInputError(input, 'Please enter a valid email address.');
          return false;
        }

        this.clearInputError(input);
        return true;
      }

      isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      }

      showError(message) {
        const errorContainer = document.getElementById('error-container');
        errorContainer.innerHTML = '<div class="auth0-error">' + message + '</div>';
        errorContainer.style.display = 'block';
        errorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      clearErrors() {
        const errorContainer = document.getElementById('error-container');
        errorContainer.style.display = 'none';
        errorContainer.innerHTML = '';
      }

      showInputError(input, message) {
        this.clearInputError(input);
        input.style.borderColor = 'var(--destructive)';

        const errorEl = document.createElement('div');
        errorEl.className = 'auth0-input-error';
        errorEl.style.color = 'var(--destructive)';
        errorEl.style.fontSize = '0.75rem';
        errorEl.style.marginTop = '0.25rem';
        errorEl.textContent = message;

        input.parentNode.appendChild(errorEl);
      }

      clearInputError(input) {
        input.style.borderColor = '';
        const errorEl = input.parentNode.querySelector('.auth0-input-error');
        if (errorEl) {
          errorEl.remove();
        }
      }

      setLoadingState(loading) {
        const submitButton = document.getElementById('submit-button');
        const submitText = document.getElementById('submit-text');
        const submitSpinner = document.getElementById('submit-spinner');

        if (loading) {
          submitButton.disabled = true;
          submitText.style.display = 'none';
          submitSpinner.style.display = 'inline-block';
        } else {
          submitButton.disabled = false;
          submitText.style.display = 'inline';
          submitSpinner.style.display = 'none';
        }
      }
    }

    // Initialize the custom signup screen
    try {
      const customSignup = new ConsumerAuthSignupIdScreen();
      customSignup.render();
      console.log('✅ ConsumerAuth signup-id screen rendered successfully');
    } catch (error) {
      console.error('❌ Error rendering custom signup screen:', error);

      // Fallback: show a simple message
      document.body.innerHTML = '<div style="text-align: center; padding: 2rem; font-family: system-ui;"><h1>ConsumerAuth Signup</h1><p>Custom signup screen is loading...</p><p><a href="/api/auth/login">Continue with default signup</a></p></div>';
    }
  }

  // Start initialization
  initializeCustomSignup();
});

// Global error handler
window.addEventListener('error', function(e) {
  console.error('Global error:', e.error);
});