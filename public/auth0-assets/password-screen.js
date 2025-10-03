/**
 * ConsumerAuth - Auth0 Password Screen Custom JavaScript
 * Designed for Auth0 ACUL (Advanced Customizations for Universal Login)
 */

// Initialize custom password screen immediately
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing ConsumerAuth custom password screen...');

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

  async function initializeCustomPasswordScreen() {
    console.log('Starting custom password screen initialization...');

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
    welcomeTitle: 'Enter Your Password',
    welcomeDescription: 'Please enter your password to continue'
  };

  // Custom UI components for password screen with SDK integration
    function CustomPasswordScreen(auth0SDK) {
      this.auth0SDK = auth0SDK;
      this.passwordManager = null;
      this.container = null;

      // Try to initialize Password manager if SDK is available
      if (this.auth0SDK) {
        try {
          // For Auth0 ACUL SDK
          if (typeof window.Auth0ACUL !== 'undefined' && window.Auth0ACUL.LoginPassword) {
            console.log('Initializing Auth0 ACUL Password manager...');
            this.passwordManager = new window.Auth0ACUL.LoginPassword();

            // SDK Method Discovery
            console.log('=== ACUL PASSWORD SDK METHOD DISCOVERY ===');
            console.log('Password manager instance:', this.passwordManager);
            console.log('Available methods and properties:');

            for (const prop in this.passwordManager) {
              const value = this.passwordManager[prop];
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
            const expectedMethods = ['authenticate', 'login', 'submitPassword', 'submit', 'submitData'];
            console.log('Checking for expected methods:');
            expectedMethods.forEach(method => {
              const exists = typeof this.passwordManager[method] === 'function';
              console.log(`  ${method}: ${exists ? '✅ Available' : '❌ Not found'}`);
            });

            console.log('=== END PASSWORD SDK DISCOVERY ===');

            // Check for initial errors from transaction
            if (this.passwordManager.transaction?.errors && this.passwordManager.transaction.errors.length > 0) {
              console.log('⚠️ ACUL SDK errors detected:', this.passwordManager.transaction.errors);
            }

            // Set up SDK event listeners
            this.setupPasswordSDKEventListeners();
          }
        } catch (error) {
          console.warn('Failed to initialize Auth0 Password manager:', error);
        }
      }
    }

    CustomPasswordScreen.prototype.setupPasswordSDKEventListeners = function() {
      console.log('Setting up Password SDK event listeners...');

      if (this.passwordManager && typeof this.passwordManager.on === 'function') {
        const events = ['success', 'error', 'redirect', 'stateChange'];

        events.forEach(event => {
          try {
            this.passwordManager.on(event, (data) => {
              console.log(`Password SDK Event: ${event}`, data);

              if (event === 'error') {
                const errorContainer = document.getElementById('error-container');
                if (errorContainer) {
                  const errorMessage = data?.message || data?.description || data?.error_description || 'An error occurred. Please try again.';
                  errorContainer.innerHTML = '<div style="color: #dc2626; padding: 1rem; background: rgba(220, 38, 38, 0.1); border-radius: 8px; margin-bottom: 1rem;">' + errorMessage + '</div>';
                  errorContainer.style.display = 'block';
                }

                // Re-enable submit button
                const submitButton = document.getElementById('submit-button');
                if (submitButton) {
                  submitButton.disabled = false;
                  submitButton.innerHTML = 'Continue';
                }
              }
            });
            console.log(`✅ Listener registered for: ${event}`);
          } catch (error) {
            console.log(`❌ Could not register listener for: ${event}`, error);
          }
        });
      } else {
        console.log('⚠️ Password manager does not support event listeners');
      }
    };

    CustomPasswordScreen.prototype.render = function() {
      console.log('Rendering dramatic custom password screen');

      // Clear existing content and set body styles
      document.body.innerHTML = '';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.fontFamily = 'Inter, system-ui, -apple-system, sans-serif';
      document.body.style.overflow = 'hidden';

      // Create main split-screen container with password theme
      this.container = document.createElement('div');
      this.container.style.cssText = `
        display: flex;
        height: 100vh;
        width: 100vw;
        background: linear-gradient(135deg, #8360c3 0%, #2ebf91 50%, #f093fb 100%);
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
    };

    CustomPasswordScreen.prototype.createLeftPanel = function() {
      const panel = document.createElement('div');
      panel.style.cssText = `
        flex: 1;
        background: linear-gradient(45deg, #6a4c93 0%, #4a90e2 50%, #7b68ee 100%);
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

      // Large animated logo with password theme
      const logoContainer = document.createElement('div');
      logoContainer.style.cssText = `
        width: 120px;
        height: 120px;
        margin: 0 auto 2rem;
        background: linear-gradient(45deg, #8360c3, #2ebf91, #f093fb);
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

      // Animated title with password theme
      const title = document.createElement('h1');
      title.textContent = 'Welcome Back';
      title.style.cssText = `
        color: white;
        font-size: 2.8rem;
        font-weight: 700;
        margin: 0 0 1rem 0;
        background: linear-gradient(45deg, #8360c3, #2ebf91);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: pulse 2s ease-in-out infinite;
      `;

      // Password-specific subtitle
      const subtitle = document.createElement('p');
      subtitle.textContent = 'Secure • Trusted • Protected';
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
    };

    CustomPasswordScreen.prototype.createRightPanel = function() {
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

      // Form header with email display
      const header = document.createElement('div');
      header.style.cssText = 'text-align: center; margin-bottom: 2rem;';

      const welcomeTitle = document.createElement('h2');
      welcomeTitle.textContent = 'Enter Your Password';
      welcomeTitle.style.cssText = `
        color: #1a1a2e;
        font-size: 2rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
      `;

      // Email display
      const urlParams = new URLSearchParams(window.location.search);
      const email = urlParams.get('login_hint') || urlParams.get('email');
      let welcomeDesc;
      if (email) {
        welcomeDesc = document.createElement('p');
        welcomeDesc.innerHTML = `Signing in as <strong>${email}</strong>`;
        welcomeDesc.style.cssText = `
          color: #64748b;
          font-size: 1rem;
          margin: 0;
        `;
      } else {
        welcomeDesc = document.createElement('p');
        welcomeDesc.textContent = 'Enter your password to continue';
        welcomeDesc.style.cssText = `
          color: #64748b;
          font-size: 1rem;
          margin: 0;
        `;
      }

      header.appendChild(welcomeTitle);
      header.appendChild(welcomeDesc);

      // Form
      const form = this.createModernForm();

      formContainer.appendChild(header);
      formContainer.appendChild(form);
      panel.appendChild(formContainer);

      return panel;
    };

    CustomPasswordScreen.prototype.createModernForm = function() {
      const form = document.createElement('form');
      form.id = 'password-form';
      form.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      `;

      // Password input group
      const passwordGroup = document.createElement('div');
      passwordGroup.style.cssText = 'position: relative;';

      const passwordInput = document.createElement('input');
      passwordInput.type = 'password';
      passwordInput.id = 'password';
      passwordInput.name = 'password';
      passwordInput.placeholder = 'Enter your password';
      passwordInput.required = true;
      passwordInput.autofocus = true;
      passwordInput.style.cssText = `
        width: 100%;
        padding: 1rem;
        border: 2px solid rgba(131, 96, 195, 0.2);
        border-radius: 12px;
        font-size: 1rem;
        background: rgba(255,255,255,0.8);
        transition: all 0.3s ease;
        outline: none;
        box-sizing: border-box;
      `;

      // Enhanced focus effects
      passwordInput.addEventListener('focus', function() {
        this.style.borderColor = '#8360c3';
        this.style.background = 'rgba(255,255,255,0.95)';
        this.style.transform = 'scale(1.02)';
        this.style.boxShadow = '0 0 20px rgba(131, 96, 195, 0.3)';
      });

      passwordInput.addEventListener('blur', function() {
        this.style.borderColor = 'rgba(131, 96, 195, 0.2)';
        this.style.background = 'rgba(255,255,255,0.8)';
        this.style.transform = 'scale(1)';
        this.style.boxShadow = 'none';
      });

      passwordGroup.appendChild(passwordInput);

      // Submit button with enhanced styling
      const submitButton = document.createElement('button');
      submitButton.type = 'submit';
      submitButton.id = 'submit-button';
      submitButton.innerHTML = '<span id="submit-text">Continue</span><div id="submit-spinner" style="display: none;">⏳</div>';
      submitButton.style.cssText = `
        width: 100%;
        padding: 1rem;
        background: linear-gradient(45deg, #8360c3, #2ebf91);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      `;

      submitButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 8px 25px rgba(131, 96, 195, 0.4)';
      });

      submitButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
      });

      // Back link
      const backLink = document.createElement('a');
      backLink.href = '#';
      backLink.id = 'back-link';
      backLink.textContent = '← Back to email';
      backLink.style.cssText = `
        text-align: center;
        color: #8360c3;
        text-decoration: none;
        font-size: 0.9rem;
        transition: all 0.3s ease;
      `;

      backLink.addEventListener('mouseenter', function() {
        this.style.color = '#2ebf91';
      });

      backLink.addEventListener('mouseleave', function() {
        this.style.color = '#8360c3';
      });

      // Forgot password link
      const forgotLink = document.createElement('a');
      forgotLink.href = '#';
      forgotLink.id = 'forgot-password-link';
      forgotLink.textContent = 'Forgot your password?';
      forgotLink.style.cssText = `
        text-align: center;
        color: #64748b;
        text-decoration: none;
        font-size: 0.9rem;
        margin-top: 0.5rem;
        transition: all 0.3s ease;
      `;

      forgotLink.addEventListener('mouseenter', function() {
        this.style.color = '#8360c3';
      });

      forgotLink.addEventListener('mouseleave', function() {
        this.style.color = '#64748b';
      });

      // Error container
      const errorContainer = document.createElement('div');
      errorContainer.id = 'error-container';
      errorContainer.style.cssText = `
        display: none;
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        padding: 1rem;
        border-radius: 8px;
        font-size: 0.9rem;
        text-align: center;
        border: 1px solid rgba(239, 68, 68, 0.2);
      `;

      form.appendChild(errorContainer);
      form.appendChild(passwordGroup);
      form.appendChild(submitButton);
      form.appendChild(backLink);
      form.appendChild(forgotLink);

      return form;
    };

    CustomPasswordScreen.prototype.addGeometricShapes = function(container) {
      // Add floating geometric shapes for visual interest
      for (let i = 0; i < 6; i++) {
        const shape = document.createElement('div');
        const isCircle = Math.random() > 0.5;
        const size = 20 + Math.random() * 40;

        shape.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: rgba(255,255,255,0.1);
          border-radius: ${isCircle ? '50%' : '8px'};
          top: ${Math.random() * 100}%;
          left: ${Math.random() * 100}%;
          animation: float ${3 + Math.random() * 2}s ease-in-out infinite;
          animation-delay: ${Math.random() * 2}s;
        `;

        container.appendChild(shape);
      }
    };

    CustomPasswordScreen.prototype.addFloatingParticles = function() {
      // Add floating particles for enhanced visual appeal
      for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        const size = 3 + Math.random() * 5;

        particle.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: linear-gradient(45deg, #8360c3, #2ebf91, #f093fb);
          border-radius: 50%;
          top: ${Math.random() * 100}vh;
          left: ${Math.random() * 100}vw;
          animation: floatUp ${5 + Math.random() * 5}s linear infinite;
          opacity: 0.7;
          z-index: 1;
        `;

        this.container.appendChild(particle);
      }

      // Add CSS keyframes for particles
      const style = document.createElement('style');
      style.textContent = `
        @keyframes floatUp {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    };

    CustomPasswordScreen.prototype.playEntranceAnimation = function() {
      // Add entrance animation keyframes
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideInLeft {
          0% { transform: translateX(-100px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideInRight {
          0% { transform: translateX(100px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);

      // Trigger entrance animations
      setTimeout(() => {
        const leftPanel = this.container.querySelector('div:first-child');
        if (leftPanel) {
          leftPanel.style.animation = 'slideInLeft 0.8s ease-out forwards';
        }
      }, 100);
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

      // Check if elements exist before adding listeners
      if (form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          self.handlePasswordSubmit();
        });
      }

      if (backLink) {
        backLink.addEventListener('click', function(e) {
          e.preventDefault();
          self.handleBackToEmail();
        });
      }

      if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
          e.preventDefault();
          self.handleForgotPassword();
        });
      }

      // Input validation
      const passwordInput = document.getElementById('password');
      if (passwordInput) {
        passwordInput.addEventListener('blur', function() {
          self.validateInput(passwordInput);
        });
        passwordInput.addEventListener('input', function() {
          self.clearInputError(passwordInput);
        });
      }
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

      // Progressive SDK Enhancement: Try SDK methods first
      if (this.passwordManager) {
        this.tryPasswordSDKMethods(password);
      } else {
        // Fallback to manual submission
        console.log('No ACUL SDK available, using form submission fallback');
        this.submitPasswordToAuth0(password);
      }
    };

    CustomPasswordScreen.prototype.tryPasswordSDKMethods = function(password) {
      const methods = ['authenticate', 'login', 'submitPassword', 'submit', 'submitData'];

      console.log('=== ATTEMPTING PASSWORD SDK METHODS ===');

      // Get username from URL params if available
      const urlParams = new URLSearchParams(window.location.search);
      const username = urlParams.get('login_hint') || urlParams.get('email') || '';

      for (const method of methods) {
        if (typeof this.passwordManager[method] === 'function') {
          console.log(`Attempting SDK method: ${method}`);
          try {
            // Try different parameter formats
            const attempts = [
              { password: password, username: username },
              { password: password },
              password,
              { password: password, email: username },
              { password: password, identifier: username }
            ];

            for (const params of attempts) {
              try {
                console.log(`  Trying with params:`, params);
                const result = this.passwordManager[method](params);
                console.log(`  Result:`, result);

                // If successful, setup event listeners
                console.log(`✅ SDK method ${method} succeeded`);
                this.setupPasswordSDKEventListeners();
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
      this.submitPasswordToAuth0(password);
    };

    CustomPasswordScreen.prototype.setupPasswordSDKEventListeners = function() {
      console.log('Setting up password SDK event listeners');

      if (this.passwordManager && typeof this.passwordManager.on === 'function') {
        const events = ['success', 'error', 'redirect', 'authenticated', 'stateChange'];

        events.forEach(event => {
          try {
            this.passwordManager.on(event, (data) => {
              console.log(`Password SDK Event: ${event}`, data);

              if (event === 'error') {
                this.setLoadingState(false);
                this.showError(data.message || 'Authentication failed. Please try again.');
              }
            });
            console.log(`✅ Listener registered for: ${event}`);
          } catch (error) {
            console.log(`❌ Could not register listener for: ${event}`);
          }
        });
      }
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

    // Initialize the custom password screen with SDK
    console.log('Setting up custom password screen');

    try {
      const customPasswordScreen = new CustomPasswordScreen(auth0SDK);
      customPasswordScreen.render();
      console.log('✅ Custom password screen rendered successfully');
    } catch (error) {
      console.error('❌ Error rendering custom password screen:', error);

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