/**
 * ConsumerAuth - Auth0 Login-ID Screen Custom JavaScript
 * Designed for Auth0 ACUL (Advanced Customizations for Universal Login)
 * Based on Auth0 ACUL SDK implementation patterns
 */

// Initialize custom login screen immediately
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing ConsumerAuth custom login...');

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

  async function initializeCustomLogin() {
    console.log('Starting custom login initialization...');

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
      welcomeTitle: 'Welcome Back',
      welcomeDescription: 'Enter your email address to continue'
    };

    // Auth0 ACUL SDK Integration
    class ConsumerAuthLoginIdScreen {
      constructor() {
        this.auth0SDK = auth0SDK;
        this.loginIdManager = null;
        this.container = null;

        // Try to initialize Login ID manager if SDK is available
        if (this.auth0SDK) {
          try {
            // For Auth0 ACUL SDK
            if (typeof window.Auth0ULP !== 'undefined' && window.Auth0ULP.LoginId) {
              console.log('Initializing Auth0 ACUL LoginId manager...');
              this.loginIdManager = new window.Auth0ULP.LoginId();
            }
          } catch (error) {
            console.warn('Failed to initialize Auth0 LoginId manager:', error);
          }
        }
      }

      render() {
        console.log('Rendering ConsumerAuth login-id screen with dramatic design');

        // Clear existing content and set body styles
        document.body.innerHTML = '';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.fontFamily = 'Inter, system-ui, -apple-system, sans-serif';
        document.body.style.overflow = 'hidden';

        // Create main split-screen container
        this.container = document.createElement('div');
        this.container.style.cssText = `
          display: flex;
          height: 100vh;
          width: 100vw;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          background: linear-gradient(45deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
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

        // Large animated logo
        const logoContainer = document.createElement('div');
        logoContainer.style.cssText = `
          width: 120px;
          height: 120px;
          margin: 0 auto 2rem;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
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

        // Animated title
        const title = document.createElement('h1');
        title.textContent = brandingConfig.companyName;
        title.style.cssText = `
          color: white;
          font-size: 3rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: pulse 2s ease-in-out infinite;
        `;

        // Subtitle
        const subtitle = document.createElement('p');
        subtitle.textContent = 'Secure • Fast • Reliable';
        subtitle.style.cssText = `
          color: rgba(255,255,255,0.8);
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
          max-width: 400px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          transform: translateX(20px);
          opacity: 0;
          animation: slideInRight 0.8s ease-out 0.3s forwards;
        `;

        // Form header
        const header = document.createElement('div');
        header.style.cssText = 'text-align: center; margin-bottom: 2rem;';

        const welcomeTitle = document.createElement('h2');
        welcomeTitle.textContent = brandingConfig.welcomeTitle;
        welcomeTitle.style.cssText = `
          color: #1a1a2e;
          font-size: 2rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
        `;

        const welcomeDesc = document.createElement('p');
        welcomeDesc.textContent = brandingConfig.welcomeDescription;
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
        form.id = 'login-form';

        // Email/Username field - this is the only field for login-id screen
        const emailGroup = this.createInputGroup('username', 'Email', 'email', 'Enter your email address');
        form.appendChild(emailGroup);

        // Submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'auth0-button auth0-button-primary';
        submitButton.id = 'submit-button';
        submitButton.innerHTML = '<span id="submit-text">Continue</span><div id="submit-spinner" class="auth0-spinner" style="display: none;"></div>';
        form.appendChild(submitButton);

        // Forgot password link
        const forgotPassword = document.createElement('div');
        forgotPassword.style.textAlign = 'center';
        forgotPassword.style.marginTop = '1rem';

        const forgotLink = document.createElement('a');
        forgotLink.href = '#';
        forgotLink.className = 'auth0-link';
        forgotLink.textContent = 'Forgot your password?';
        forgotLink.id = 'forgot-password-link';

        forgotPassword.appendChild(forgotLink);
        form.appendChild(forgotPassword);

        // Signup link
        const signupSection = document.createElement('div');
        signupSection.style.textAlign = 'center';
        signupSection.style.marginTop = '1.5rem';
        signupSection.style.paddingTop = '1.5rem';
        signupSection.style.borderTop = '1px solid var(--border)';

        const signupText = document.createElement('p');
        signupText.style.color = 'var(--muted-fg)';
        signupText.style.fontSize = '0.875rem';
        signupText.style.margin = '0 0 0.5rem 0';
        signupText.textContent = "Don't have an account?";

        const signupLink = document.createElement('a');
        signupLink.href = '#';
        signupLink.className = 'auth0-link';
        signupLink.textContent = 'Sign up';
        signupLink.id = 'signup-link';
        signupLink.style.fontWeight = '500';

        signupSection.appendChild(signupText);
        signupSection.appendChild(signupLink);
        form.appendChild(signupSection);

        container.appendChild(form);

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
        const form = document.getElementById('login-form');
        const signupLink = document.getElementById('signup-link');

        // Form submission
        if (form) {
          form.addEventListener('submit', function(e) {
            e.preventDefault();
            self.handleLogin();
          });
        }

        // Signup link
        if (signupLink) {
          signupLink.addEventListener('click', function(e) {
            e.preventDefault();
            self.handleSignup();
          });
        }

        // Input validation for the new modern form
        const usernameInput = document.getElementById('username');
        if (usernameInput) {
          usernameInput.addEventListener('input', function() {
            // Clear any previous errors when user starts typing
            const errorContainer = document.getElementById('error-container');
            if (errorContainer) {
              errorContainer.style.display = 'none';
            }
          });
        }
      }

      handleLogin() {
        const username = document.getElementById('username').value;

        // Basic validation
        if (!username) {
          this.showError('Please enter your email address.');
          return;
        }

        this.setLoadingState(true);
        this.clearErrors();

        console.log('Login-ID screen - submitting username:', { username });

        // Use Auth0 ACUL SDK if available
        if (this.loginIdManager && this.loginIdManager.login) {
          console.log('Using Auth0 ACUL SDK login method');
          try {
            this.loginIdManager.login({ username: username });
          } catch (error) {
            console.error('Auth0 ACUL SDK login failed:', error);
            this.setLoadingState(false);
            this.showError('Login failed. Please try again.');
          }
        } else {
          // Fallback to manual navigation
          console.log('No ACUL SDK available, using navigation fallback');
          this.navigateToPasswordScreen(username);
        }
      }

      navigateToPasswordScreen(username) {
        console.log('Navigating to password screen with username:', username);

        // When running on Auth0's domain, use proper form submission instead of navigation
        if (window.location.hostname.includes('auth0.com') || window.location.hostname.includes('consumerauth.com')) {
          console.log('Running on Auth0 domain, submitting form with identifier');

          // Submit the identifier to Auth0's endpoint
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = '/u/login/identifier';

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
            const passwordUrl = `${window.location.origin}/u/login/password?state=${state}&login_hint=${encodeURIComponent(username)}`;
            console.log('Navigating to:', passwordUrl);
            window.location.href = passwordUrl;
          } else {
            console.error('No state parameter found, cannot proceed');
            this.setLoadingState(false);
            this.showError('Unable to proceed. Please refresh and try again.');
          }
        }
      }

      handleForgotPassword() {
        console.log('Forgot password clicked');
        // Navigate to password reset screen
        const urlParams = new URLSearchParams(window.location.search);
        const state = urlParams.get('state');

        if (state) {
          const resetUrl = `${window.location.origin}/u/reset-password?state=${state}`;
          window.location.href = resetUrl;
        }
      }

      handleSignup() {
        console.log('Signup clicked');

        // When running on Auth0's domain, navigate to signup-id screen
        if (window.location.hostname.includes('auth0.com') || window.location.hostname.includes('consumerauth.com')) {
          console.log('Running on Auth0 domain, navigating to signup-id screen');

          const urlParams = new URLSearchParams(window.location.search);
          const state = urlParams.get('state');

          if (state) {
            const signupUrl = `${window.location.origin}/u/signup?state=${state}`;
            console.log('Navigating to signup:', signupUrl);
            window.location.href = signupUrl;
          } else {
            console.error('No state parameter found for signup navigation');
            this.showError('Unable to proceed with signup. Please refresh and try again.');
          }
        } else {
          // Local testing fallback
          console.log('Running locally, using signup fallback');
          const urlParams = new URLSearchParams(window.location.search);
          const state = urlParams.get('state');

          if (state) {
            const signupUrl = `${window.location.origin}/u/signup?state=${state}`;
            console.log('Navigating to:', signupUrl);
            window.location.href = signupUrl;
          } else {
            console.error('No state parameter found for signup');
            this.showError('Unable to proceed with signup. Please refresh and try again.');
          }
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

      createModernForm() {
        const form = document.createElement('form');
        form.id = 'login-form';
        form.style.cssText = 'width: 100%;';

        // Error container
        const errorContainer = document.createElement('div');
        errorContainer.id = 'error-container';
        errorContainer.style.display = 'none';
        form.appendChild(errorContainer);

        // Modern email input
        const inputGroup = document.createElement('div');
        inputGroup.style.cssText = 'margin-bottom: 2rem; position: relative;';

        const input = document.createElement('input');
        input.id = 'username';
        input.name = 'username';
        input.type = 'email';
        input.placeholder = 'Enter your email address';
        input.required = true;
        input.style.cssText = `
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

        // Add focus effects
        input.addEventListener('focus', () => {
          input.style.borderColor = '#4ecdc4';
          input.style.background = 'rgba(255,255,255,0.2)';
          input.style.transform = 'scale(1.02)';
        });

        input.addEventListener('blur', () => {
          input.style.borderColor = 'rgba(255,255,255,0.3)';
          input.style.background = 'rgba(255,255,255,0.1)';
          input.style.transform = 'scale(1)';
        });

        inputGroup.appendChild(input);

        // Modern submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.id = 'submit-button';
        submitButton.innerHTML = '<span id="submit-text">Continue</span><div id="submit-spinner" style="display: none;">⏳</div>';
        submitButton.style.cssText = `
          width: 100%;
          padding: 1.25rem;
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 2rem;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
        `;

        submitButton.addEventListener('mouseenter', () => {
          submitButton.style.transform = 'translateY(-2px)';
          submitButton.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4)';
        });

        submitButton.addEventListener('mouseleave', () => {
          submitButton.style.transform = 'translateY(0)';
          submitButton.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.3)';
        });

        // Signup link
        const signupContainer = document.createElement('div');
        signupContainer.style.cssText = 'text-align: center; margin-top: 1rem;';

        const signupText = document.createElement('span');
        signupText.textContent = "Don't have an account? ";
        signupText.style.cssText = 'color: #64748b; font-size: 0.9rem;';

        const signupLink = document.createElement('a');
        signupLink.href = '#';
        signupLink.id = 'signup-link';
        signupLink.textContent = 'Sign up';
        signupLink.style.cssText = `
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        `;

        signupLink.addEventListener('mouseenter', () => {
          signupLink.style.color = '#764ba2';
          signupLink.style.textDecoration = 'underline';
        });

        signupLink.addEventListener('mouseleave', () => {
          signupLink.style.color = '#667eea';
          signupLink.style.textDecoration = 'none';
        });

        signupContainer.appendChild(signupText);
        signupContainer.appendChild(signupLink);

        form.appendChild(inputGroup);
        form.appendChild(submitButton);
        form.appendChild(signupContainer);

        return form;
      }

      addGeometricShapes(container) {
        // Add floating geometric shapes for visual interest
        for (let i = 0; i < 5; i++) {
          const shape = document.createElement('div');
          const size = Math.random() * 100 + 50;
          const isCircle = Math.random() > 0.5;

          shape.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: linear-gradient(45deg, rgba(255,107,107,0.1), rgba(78,205,196,0.1));
            border-radius: ${isCircle ? '50%' : '20px'};
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: floatShape ${3 + Math.random() * 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
            z-index: 1;
          `;

          container.appendChild(shape);
        }
      }

      addFloatingParticles() {
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
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
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(120deg); }
            66% { transform: translateY(5px) rotate(240deg); }
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
    }

    // Initialize the custom login screen
    try {
      const customLogin = new ConsumerAuthLoginIdScreen();
      customLogin.render();
      console.log('✅ ConsumerAuth login-id screen rendered successfully');
    } catch (error) {
      console.error('❌ Error rendering custom login screen:', error);

      // Fallback: show a simple message
      document.body.innerHTML = '<div style="text-align: center; padding: 2rem; font-family: system-ui;"><h1>ConsumerAuth Login</h1><p>Custom login screen is loading...</p><p><a href="/api/auth/login">Continue with default login</a></p></div>';
    }
  }

  // Start initialization
  initializeCustomLogin();
});

// Global error handler
window.addEventListener('error', function(e) {
  console.error('Global error:', e.error);
});