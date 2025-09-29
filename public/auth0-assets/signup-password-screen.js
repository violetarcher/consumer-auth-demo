/**
 * ConsumerAuth - Auth0 Signup-Password Screen Custom JavaScript
 * Designed for Auth0 ACUL (Advanced Customizations for Universal Login)
 * Based on Auth0 ACUL SDK implementation patterns
 */

// Initialize custom signup password screen immediately
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing ConsumerAuth custom signup-password screen...');

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

  async function initializeCustomSignupPassword() {
    console.log('Starting custom signup-password initialization...');

    // Debug: Log URL and parameters
    console.log('Current URL:', window.location.href);
    console.log('URL Parameters:', new URLSearchParams(window.location.search).toString());
    console.log('Pathname:', window.location.pathname);

    // Wait for Auth0 SDK
    const auth0SDK = await waitForAuth0SDK();

    // Get email from URL parameters if available
    const urlParams = new URLSearchParams(window.location.search);
    const loginHint = urlParams.get('login_hint') || '';

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
      welcomeTitle: 'Create Your Password',
      welcomeDescription: loginHint ? `Create a password for ${loginHint}` : 'Create a secure password for your account'
    };

    // Auth0 ACUL SDK Integration
    class ConsumerAuthSignupPasswordScreen {
      constructor() {
        this.auth0SDK = auth0SDK;
        this.signupPasswordManager = null;
        this.container = null;
        this.email = loginHint;

        // Try to initialize Signup Password manager if SDK is available
        if (this.auth0SDK) {
          try {
            // For Auth0 ACUL SDK
            if (typeof window.Auth0ULP !== 'undefined' && window.Auth0ULP.SignupPassword) {
              console.log('Initializing Auth0 ACUL SignupPassword manager...');
              this.signupPasswordManager = new window.Auth0ULP.SignupPassword();
            }
          } catch (error) {
            console.warn('Failed to initialize Auth0 SignupPassword manager:', error);
          }
        }
      }

      render() {
        console.log('Rendering ConsumerAuth signup-password screen');

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
        form.id = 'signup-password-form';

        // Email field (read-only, showing the email from previous screen)
        if (this.email) {
          const emailGroup = this.createInputGroup('email', 'Email', 'email', this.email);
          const emailInput = emailGroup.querySelector('input');
          emailInput.value = this.email;
          emailInput.readOnly = true;
          emailInput.style.backgroundColor = 'var(--secondary)';
          emailInput.style.color = 'var(--muted-fg)';
          form.appendChild(emailGroup);
        }

        // Password field
        const passwordGroup = this.createInputGroup('password', 'Password', 'password', 'Create a secure password');
        form.appendChild(passwordGroup);

        // Confirm password field
        const confirmPasswordGroup = this.createInputGroup('confirm-password', 'Confirm Password', 'password', 'Confirm your password');
        form.appendChild(confirmPasswordGroup);

        // Password requirements
        const requirements = document.createElement('div');
        requirements.className = 'auth0-password-requirements';
        requirements.style.fontSize = '0.75rem';
        requirements.style.color = 'var(--muted-fg)';
        requirements.style.marginTop = '0.5rem';
        requirements.innerHTML = `
          <p style="margin: 0 0 0.25rem 0;">Password must contain:</p>
          <ul style="margin: 0; padding-left: 1rem;">
            <li>At least 8 characters</li>
            <li>At least one uppercase letter</li>
            <li>At least one lowercase letter</li>
            <li>At least one number</li>
          </ul>
        `;
        form.appendChild(requirements);

        // Submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'auth0-button auth0-button-primary';
        submitButton.id = 'submit-button';
        submitButton.style.marginTop = '1.5rem';
        submitButton.innerHTML = '<span id="submit-text">Create Account</span><div id="submit-spinner" class="auth0-spinner" style="display: none;"></div>';
        form.appendChild(submitButton);

        container.appendChild(form);

        // Back to signup link
        const backToSignup = document.createElement('div');
        backToSignup.style.textAlign = 'center';
        backToSignup.style.marginTop = '1.5rem';
        backToSignup.style.paddingTop = '1.5rem';
        backToSignup.style.borderTop = '1px solid var(--border)';

        const backText = document.createElement('p');
        backText.style.color = 'var(--muted-fg)';
        backText.style.fontSize = '0.875rem';
        backText.style.margin = '0 0 0.5rem 0';
        backText.textContent = 'Want to use a different email?';

        const backLink = document.createElement('a');
        backLink.href = '#';
        backLink.className = 'auth0-link';
        backLink.textContent = 'Go back';
        backLink.id = 'back-to-signup-link';
        backLink.style.fontWeight = '500';

        backToSignup.appendChild(backText);
        backToSignup.appendChild(backLink);
        container.appendChild(backToSignup);

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
        const form = document.getElementById('signup-password-form');
        const backToSignupLink = document.getElementById('back-to-signup-link');

        // Form submission
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          self.handleSignup();
        });

        // Back to signup
        backToSignupLink.addEventListener('click', function(e) {
          e.preventDefault();
          self.handleBackToSignup();
        });

        // Password validation on typing
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');

        passwordInput.addEventListener('input', function() {
          self.clearInputError(passwordInput);
          self.validatePasswordMatch();
        });

        confirmPasswordInput.addEventListener('input', function() {
          self.clearInputError(confirmPasswordInput);
          self.validatePasswordMatch();
        });

        // Input validation
        const inputs = document.querySelectorAll('.auth0-input');
        inputs.forEach(function(input) {
          input.addEventListener('blur', function() {
            if (!input.readOnly) {
              self.validateInput(input);
            }
          });
          input.addEventListener('input', function() {
            if (!input.readOnly) {
              self.clearInputError(input);
            }
          });
        });
      }

      handleSignup() {
        const email = this.email || document.getElementById('email')?.value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Basic validation
        if (!email) {
          this.showError('Email is required.');
          return;
        }

        if (!password) {
          this.showError('Password is required.');
          return;
        }

        if (!confirmPassword) {
          this.showError('Please confirm your password.');
          return;
        }

        if (password !== confirmPassword) {
          this.showError('Passwords do not match.');
          return;
        }

        if (!this.isValidPassword(password)) {
          this.showError('Password does not meet requirements.');
          return;
        }

        this.setLoadingState(true);
        this.clearErrors();

        console.log('Signup-Password screen - submitting signup:', { email });

        // Use Auth0 ACUL SDK if available
        if (this.signupPasswordManager && this.signupPasswordManager.signup) {
          console.log('Using Auth0 ACUL SDK signup method');
          try {
            this.signupPasswordManager.signup({
              email: email,
              password: password
            });
          } catch (error) {
            console.error('Auth0 ACUL SDK signup failed:', error);
            this.setLoadingState(false);
            this.showError('Signup failed. Please try again.');
          }
        } else {
          // Fallback to manual form submission
          console.log('No ACUL SDK available, using form submission fallback');
          this.submitSignupForm(email, password);
        }
      }

      submitSignupForm(email, password) {
        console.log('Submitting signup form with email and password');

        // Create form for signup submission
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/u/signup/password';

        // Email input
        const emailInput = document.createElement('input');
        emailInput.type = 'hidden';
        emailInput.name = 'email';
        emailInput.value = email;

        // Password input
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

        form.appendChild(emailInput);
        form.appendChild(passwordInput);
        document.body.appendChild(form);
        form.submit();
      }

      handleBackToSignup() {
        console.log('Back to signup clicked');

        const urlParams = new URLSearchParams(window.location.search);
        const state = urlParams.get('state');

        if (state) {
          const signupUrl = `${window.location.origin}/u/signup?state=${state}`;
          window.location.href = signupUrl;
        }
      }

      validatePasswordMatch() {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (confirmPassword && password !== confirmPassword) {
          this.showInputError(document.getElementById('confirm-password'), 'Passwords do not match.');
        } else {
          this.clearInputError(document.getElementById('confirm-password'));
        }
      }

      validateInput(input) {
        const value = input.value.trim();

        if (!value && input.required) {
          this.showInputError(input, 'This field is required.');
          return false;
        }

        if (input.type === 'password' && !this.isValidPassword(value)) {
          this.showInputError(input, 'Password does not meet requirements.');
          return false;
        }

        this.clearInputError(input);
        return true;
      }

      isValidPassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const hasLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);

        return hasLength && hasUppercase && hasLowercase && hasNumber;
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

    // Initialize the custom signup password screen
    try {
      const customSignupPassword = new ConsumerAuthSignupPasswordScreen();
      customSignupPassword.render();
      console.log('✅ ConsumerAuth signup-password screen rendered successfully');
    } catch (error) {
      console.error('❌ Error rendering custom signup password screen:', error);

      // Fallback: show a simple message
      document.body.innerHTML = '<div style="text-align: center; padding: 2rem; font-family: system-ui;"><h1>ConsumerAuth Signup</h1><p>Custom signup password screen is loading...</p><p><a href="/api/auth/login">Go to login</a></p></div>';
    }
  }

  // Start initialization
  initializeCustomSignupPassword();
});

// Global error handler
window.addEventListener('error', function(e) {
  console.error('Global error:', e.error);
});