/**
 * ConsumerAuth - Auth0 Password Screen Custom JavaScript
 * Designed for Auth0 ACUL (Advanced Customizations for Universal Login)
 */

// Initialize custom password screen immediately
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing ConsumerAuth custom password screen...');

  // Check what Auth0 objects are available
  console.log('Available on window:', Object.keys(window).filter(key => key.toLowerCase().includes('auth')));

  function initializeCustomPasswordScreen() {
    console.log('Starting custom password screen initialization...');

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
    welcomeTitle: 'Enter Your Password',
    welcomeDescription: 'Please enter your password to continue'
  };

  // Custom UI components for password screen
    function CustomPasswordScreen(screenApi) {
      this.screenApi = screenApi;
      this.container = null;
    }

    CustomPasswordScreen.prototype.render = function() {
      console.log('Rendering custom password screen');

      // Create main container
      this.container = document.createElement('div');
      this.container.className = 'auth0-login-container';

      // Create the password card
      const card = this.createCard();
      this.container.appendChild(card);

      // Append to body
      document.body.appendChild(this.container);

      // Initialize event listeners
      this.initializeEventListeners();
    };

    CustomPasswordScreen.prototype.createCard = function() {
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
    };

    CustomPasswordScreen.prototype.createHeader = function() {
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

      // Email display (if available from URL params)
      const urlParams = new URLSearchParams(window.location.search);
      const email = urlParams.get('login_hint') || urlParams.get('email');
      if (email) {
        const emailDisplay = document.createElement('p');
        emailDisplay.className = 'auth0-email-display';
        emailDisplay.style.color = 'var(--muted-fg)';
        emailDisplay.style.fontSize = '0.875rem';
        emailDisplay.style.marginTop = '0.5rem';
        emailDisplay.textContent = `Signing in as ${email}`;
        description.appendChild(document.createElement('br'));
        description.appendChild(emailDisplay);
      }

      header.appendChild(brand);
      header.appendChild(title);
      header.appendChild(description);

      return header;
    };

    CustomPasswordScreen.prototype.createFormContainer = function() {
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
      form.id = 'password-form';

      // Password field - this is the main field for password screen
      const passwordGroup = this.createInputGroup('password', 'Password', 'password', 'Enter your password');
      form.appendChild(passwordGroup);

      // Submit button
      const submitButton = document.createElement('button');
      submitButton.type = 'submit';
      submitButton.className = 'auth0-button auth0-button-primary';
      submitButton.id = 'submit-button';
      submitButton.innerHTML = '<span id="submit-text">Sign In</span><div id="submit-spinner" class="auth0-spinner" style="display: none;"></div>';
      form.appendChild(submitButton);

      // Back link
      const backLink = document.createElement('div');
      backLink.style.textAlign = 'center';
      backLink.style.marginTop = '1rem';

      const backButton = document.createElement('a');
      backButton.href = '#';
      backButton.className = 'auth0-link';
      backButton.textContent = '← Back to email';
      backButton.id = 'back-link';

      backLink.appendChild(backButton);
      form.appendChild(backLink);

      // Forgot password link
      const forgotPassword = document.createElement('div');
      forgotPassword.style.textAlign = 'center';
      forgotPassword.style.marginTop = '0.5rem';

      const forgotLink = document.createElement('a');
      forgotLink.href = '#';
      forgotLink.className = 'auth0-link';
      forgotLink.textContent = 'Forgot your password?';
      forgotLink.id = 'forgot-password-link';

      forgotPassword.appendChild(forgotLink);
      form.appendChild(forgotPassword);

      container.appendChild(form);

      return container;
    };

    CustomPasswordScreen.prototype.createInputGroup = function(id, label, type, placeholder) {
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
      input.autofocus = true; // Focus on password field

      group.appendChild(labelEl);
      group.appendChild(input);

      return group;
    };

    CustomPasswordScreen.prototype.createFooter = function() {
      const footer = document.createElement('div');
      footer.className = 'auth0-footer';

      const footerText = document.createElement('p');
      footerText.className = 'auth0-footer-text';
      footerText.innerHTML = 'Powered by Auth0 • <a href="#" class="auth0-footer-link">Privacy Policy</a> • <a href="#" class="auth0-footer-link">Terms of Service</a>';

      footer.appendChild(footerText);
      return footer;
    };

    CustomPasswordScreen.prototype.initializeEventListeners = function() {
      const self = this;
      const form = document.getElementById('password-form');
      const backLink = document.getElementById('back-link');
      const forgotPasswordLink = document.getElementById('forgot-password-link');

      // Form submission
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        self.handlePasswordSubmit();
      });

      // Back to email
      backLink.addEventListener('click', function(e) {
        e.preventDefault();
        self.handleBackToEmail();
      });

      // Forgot password
      forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        self.handleForgotPassword();
      });

      // Input validation
      const passwordInput = document.getElementById('password');
      passwordInput.addEventListener('blur', function() {
        self.validateInput(passwordInput);
      });
      passwordInput.addEventListener('input', function() {
        self.clearInputError(passwordInput);
      });
    };

    CustomPasswordScreen.prototype.handlePasswordSubmit = function() {
      const password = document.getElementById('password').value;

      // Basic validation
      if (!password) {
        this.showError('Please enter your password.');
        return;
      }

      this.setLoadingState(true);
      this.clearErrors();

      console.log('Password screen - submitting password');

      // Submit the password to Auth0
      this.submitPasswordToAuth0(password);
    };

    CustomPasswordScreen.prototype.submitPasswordToAuth0 = function(password) {
      const self = this;

      console.log('Submitting password to Auth0');

      try {
        // Look for existing Auth0 password form in the DOM
        const auth0Form = document.querySelector('form[data-provider="auth0"]') ||
                         document.querySelector('form[action*="usernamepassword/login"]') ||
                         document.querySelector('form[method="post"]');

        if (auth0Form) {
          console.log('Found Auth0 password form, submitting...');

          // Fill the password field
          const passwordField = auth0Form.querySelector('input[name="password"], input[type="password"]');

          if (passwordField) {
            passwordField.value = password;
            auth0Form.submit();
            return;
          }
        }

        // Fallback: Create and submit password form
        this.createAndSubmitPasswordForm(password);

      } catch (error) {
        console.error('Password submission error:', error);
        self.setLoadingState(false);
        self.showError('Authentication failed. Please try again.');
      }
    };

    CustomPasswordScreen.prototype.createAndSubmitPasswordForm = function(password) {
      console.log('Creating password form for Auth0 submission');

      // Create form for password submission
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = window.location.pathname;
      form.style.display = 'none';

      // Add password field
      const passwordInput = document.createElement('input');
      passwordInput.type = 'hidden';
      passwordInput.name = 'password';
      passwordInput.value = password;
      form.appendChild(passwordInput);

      // Add state if present
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('state')) {
        const stateInput = document.createElement('input');
        stateInput.type = 'hidden';
        stateInput.name = 'state';
        stateInput.value = urlParams.get('state');
        form.appendChild(stateInput);
      }

      // Submit the form
      document.body.appendChild(form);
      form.submit();
    };

    CustomPasswordScreen.prototype.handleBackToEmail = function() {
      console.log('Back to email clicked');
      // This should navigate back to the login-id screen
      window.history.back();
    };

    CustomPasswordScreen.prototype.handleForgotPassword = function() {
      console.log('Forgot password clicked');
      // Navigate to password reset screen
      window.location.href = window.location.origin + '/u/reset-password' + window.location.search;
    };

    CustomPasswordScreen.prototype.validateInput = function(input) {
      const value = input.value.trim();

      if (!value) {
        this.showInputError(input, 'This field is required.');
        return false;
      }

      this.clearInputError(input);
      return true;
    };

    CustomPasswordScreen.prototype.showError = function(message) {
      const errorContainer = document.getElementById('error-container');
      errorContainer.innerHTML = '<div class="auth0-error">' + message + '</div>';
      errorContainer.style.display = 'block';
      errorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    CustomPasswordScreen.prototype.clearErrors = function() {
      const errorContainer = document.getElementById('error-container');
      errorContainer.style.display = 'none';
      errorContainer.innerHTML = '';
    };

    CustomPasswordScreen.prototype.showInputError = function(input, message) {
      this.clearInputError(input);
      input.style.borderColor = 'var(--destructive)';

      const errorEl = document.createElement('div');
      errorEl.className = 'auth0-input-error';
      errorEl.style.color = 'var(--destructive)';
      errorEl.style.fontSize = '0.75rem';
      errorEl.style.marginTop = '0.25rem';
      errorEl.textContent = message;

      input.parentNode.appendChild(errorEl);
    };

    CustomPasswordScreen.prototype.clearInputError = function(input) {
      input.style.borderColor = '';
      const errorEl = input.parentNode.querySelector('.auth0-input-error');
      if (errorEl) {
        errorEl.remove();
      }
    };

    CustomPasswordScreen.prototype.setLoadingState = function(loading) {
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
    };

    // Initialize the custom password screen
    console.log('Setting up custom password screen');

    try {
      const customPasswordScreen = new CustomPasswordScreen({});
      customPasswordScreen.render();
      console.log('Custom password screen rendered successfully');
    } catch (error) {
      console.error('Error rendering custom password screen:', error);

      // Fallback: show a simple message
      document.body.innerHTML = '<div style="text-align: center; padding: 2rem; font-family: system-ui;"><h1>ConsumerAuth Password</h1><p>Custom password screen is loading...</p><p><a href="/api/auth/login">Continue with default login</a></p></div>';
    }
  } // End initializeCustomPasswordScreen function

  // Start initialization
  initializeCustomPasswordScreen();
});

// Global error handler
window.addEventListener('error', function(e) {
  console.error('Global error:', e.error);
});