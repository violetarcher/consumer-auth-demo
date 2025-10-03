/**
 * ConsumerAuth - Auth0 Signup Password Screen
 * Dramatic split-screen design matching the signup screen
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing ConsumerAuth signup-password screen...');

  // Wait for Auth0 ACUL SDK
  function waitForAuth0SDK() {
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 20;

      function checkSDK() {
        attempts++;
        console.log(`Attempt ${attempts}: Checking for Auth0 ACUL SDK...`);

        if (typeof window.Auth0ACUL !== 'undefined') {
          console.log('✅ Auth0 ACUL SDK loaded');
          console.log('Available:', Object.keys(window.Auth0ACUL));
          resolve(window.Auth0ACUL);
          return;
        }

        if (attempts >= maxAttempts) {
          console.warn('⚠️ Auth0 SDK not found');
          resolve(null);
          return;
        }

        setTimeout(checkSDK, 200);
      }

      checkSDK();
    });
  }

  async function initializeSignupPassword() {
    console.log('Starting signup-password initialization...');

    const auth0SDK = await waitForAuth0SDK();

    if (!auth0SDK || !auth0SDK.SignupPassword) {
      console.error('❌ SignupPassword not available');
      return;
    }

    // Initialize ACUL SignupPassword manager
    const signupPasswordManager = new auth0SDK.SignupPassword();
    console.log('✅ SignupPassword manager initialized:', signupPasswordManager);

    // Get screen data
    const screenData = signupPasswordManager.screen;
    const transactionData = signupPasswordManager.transaction;
    const email = screenData?.data?.email || '';

    console.log('Screen data:', screenData);
    console.log('Transaction data:', transactionData);
    console.log('Email:', email);

    // Check for ACUL SDK errors from transaction
    let initialErrors = null;
    if (transactionData?.errors && transactionData.errors.length > 0) {
      console.log('⚠️ ACUL SDK errors detected:', transactionData.errors);
      initialErrors = transactionData.errors;
    }

    // Set up SDK event listeners if available
    setupSignupPasswordSDKEventListeners(signupPasswordManager);

    // Render the dramatic split-screen form
    renderSignupPasswordScreen(signupPasswordManager, email, initialErrors);
  }

  function setupSignupPasswordSDKEventListeners(manager) {
    console.log('Setting up SignupPassword SDK event listeners...');

    if (manager && typeof manager.on === 'function') {
      const events = ['success', 'error', 'redirect', 'stateChange'];

      events.forEach(event => {
        try {
          manager.on(event, (data) => {
            console.log(`SignupPassword SDK Event: ${event}`, data);

            if (event === 'error') {
              const errorContainer = document.getElementById('error-container');
              if (errorContainer) {
                const errorMessage = data?.message || data?.description || 'An error occurred. Please try again.';
                errorContainer.textContent = errorMessage;
                errorContainer.style.display = 'block';
              }

              // Re-enable submit button
              const submitButton = document.getElementById('submit-button');
              const submitText = document.getElementById('submit-text');
              const submitSpinner = document.getElementById('submit-spinner');
              if (submitButton) {
                submitButton.disabled = false;
                if (submitText) submitText.style.display = 'inline';
                if (submitSpinner) submitSpinner.style.display = 'none';
              }
            }
          });
          console.log(`✅ Listener registered for: ${event}`);
        } catch (error) {
          console.log(`❌ Could not register listener for: ${event}`, error);
        }
      });
    } else {
      console.log('⚠️ SignupPassword manager does not support event listeners');
    }
  }

  function renderSignupPasswordScreen(manager, email, initialErrors) {
    console.log('Rendering signup-password screen...');
    if (initialErrors) {
      console.log('Rendering with initial errors:', initialErrors);
    }

    // Clear existing content and set body styles
    document.body.innerHTML = '';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.fontFamily = 'Inter, system-ui, -apple-system, sans-serif';
    document.body.style.overflow = 'hidden';

    // Add keyframe animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
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
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    // Create main split-screen container
    const container = document.createElement('div');
    container.style.cssText = `
      display: flex;
      height: 100vh;
      width: 100vw;
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 50%, #ff9ff3 100%);
      position: relative;
    `;

    // Create left panel (brand/visual)
    const leftPanel = createLeftPanel();
    container.appendChild(leftPanel);

    // Create right panel (form)
    const rightPanel = createRightPanel(manager, email, initialErrors);
    container.appendChild(rightPanel);

    // Append to body
    document.body.appendChild(container);
  }

  function createLeftPanel() {
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

    // Brand container
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
      background: linear-gradient(45deg, #38ef7d, #11998e, #2d1b69);
      border-radius: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: float 3s ease-in-out infinite;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    `;

    const logo = document.createElement('div');
    logo.innerHTML = `
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        <path d="m7.5 4.27 9 5.15"></path>
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
        <path d="m3.3 7 8.7 5 8.7-5"></path>
        <path d="M12 22V12"></path>
      </svg>
    `;
    logo.style.cssText = 'filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));';
    logoContainer.appendChild(logo);

    // Title
    const title = document.createElement('h1');
    title.textContent = 'Almost There!';
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

    // Subtitle
    const subtitle = document.createElement('p');
    subtitle.textContent = 'Secure • Simple • Fast';
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

    return panel;
  }

  function createRightPanel(manager, email, initialErrors) {
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
    welcomeTitle.textContent = 'Create Your Password';
    welcomeTitle.style.cssText = `
      color: #1a1a2e;
      font-size: 2rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
    `;

    const welcomeDesc = document.createElement('p');
    welcomeDesc.textContent = `Choose a strong password for ${email}`;
    welcomeDesc.style.cssText = `
      color: #64748b;
      font-size: 1rem;
      margin: 0;
    `;

    header.appendChild(welcomeTitle);
    header.appendChild(welcomeDesc);

    // Form
    const form = createForm(manager, email, initialErrors);

    formContainer.appendChild(header);
    formContainer.appendChild(form);
    panel.appendChild(formContainer);

    return panel;
  }

  function createForm(manager, email, initialErrors) {
    const form = document.createElement('form');
    form.id = 'signup-password-form';
    form.style.cssText = 'width: 100%;';

    // Error container
    const errorContainer = document.createElement('div');
    errorContainer.id = 'error-container';
    errorContainer.style.cssText = `
      display: none;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #ef4444;
      padding: 1rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
    `;

    // Display initial ACUL SDK errors if present
    if (initialErrors && initialErrors.length > 0) {
      const errorMessages = initialErrors.map(err => err.message || err.description || 'Unknown error').join('. ');
      errorContainer.textContent = errorMessages;
      errorContainer.style.display = 'block';
    }

    form.appendChild(errorContainer);

    // Password input with toggle visibility
    const passwordGroup = document.createElement('div');
    passwordGroup.style.cssText = 'margin-bottom: 1rem; position: relative;';

    const passwordInput = document.createElement('input');
    passwordInput.id = 'password';
    passwordInput.name = 'password';
    passwordInput.type = 'password';
    passwordInput.placeholder = 'Enter your password';
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
      <svg id="eye-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
      <svg id="eye-off-icon" style="display: none;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
      const eyeIcon = document.getElementById('eye-icon');
      const eyeOffIcon = document.getElementById('eye-off-icon');

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

    // Add input focus effects
    passwordInput.addEventListener('focus', () => {
      passwordInput.style.border = '2px solid #11998e';
      passwordInput.style.background = 'rgba(255,255,255,0.2)';
      passwordInput.style.transform = 'scale(1.02)';
    });

    passwordInput.addEventListener('blur', () => {
      passwordInput.style.border = '2px solid rgba(255,255,255,0.3)';
      passwordInput.style.background = 'rgba(255,255,255,0.1)';
      passwordInput.style.transform = 'scale(1)';
    });

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
    form.appendChild(requirementsHint);

    // Submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.id = 'submit-button';
    submitButton.innerHTML = '<span id="submit-text">Continue</span><div id="submit-spinner" style="display: none; width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>';
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
    backContainer.style.cssText = 'text-align: center;';

    if (manager.screen?.loginLink) {
      const backLink = document.createElement('a');
      backLink.href = manager.screen.loginLink;
      backLink.textContent = 'Already have an account? Sign in';
      backLink.style.cssText = `
        color: #64748b;
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.3s ease;
      `;

      backLink.addEventListener('mouseenter', () => {
        backLink.style.color = '#1a1a2e';
      });

      backLink.addEventListener('mouseleave', () => {
        backLink.style.color = '#64748b';
      });

      backContainer.appendChild(backLink);
    }

    // Client-side password validation
    function validatePassword(password) {
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

    // Form submission handler
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const password = passwordInput.value;

      // Validate password
      const validationErrors = validatePassword(password);
      if (validationErrors.length > 0) {
        showError(validationErrors.join('. '));
        return;
      }

      // Set loading state
      const submitText = document.getElementById('submit-text');
      const submitSpinner = document.getElementById('submit-spinner');
      submitButton.disabled = true;
      submitText.style.display = 'none';
      submitSpinner.style.display = 'block';
      errorContainer.style.display = 'none';

      try {
        console.log('Submitting signup with password...');

        // Call the ACUL SDK signup method with email and password
        const signupData = {
          email: email,
          password: password
        };

        console.log('Signup data:', signupData);
        await manager.signup(signupData);

        console.log('✅ Signup submitted successfully');
      } catch (error) {
        console.error('❌ Signup failed:', error);

        // Extract error message from Auth0 response
        let errorMessage = 'An error occurred. Please try again.';

        if (error.message) {
          errorMessage = error.message;
        } else if (error.description) {
          errorMessage = error.description;
        } else if (error.error_description) {
          errorMessage = error.error_description;
        }

        showError(errorMessage);

        // Re-enable submit button
        submitButton.disabled = false;
        submitText.style.display = 'inline';
        submitSpinner.style.display = 'none';
      }
    });

    function showError(message) {
      errorContainer.textContent = message;
      errorContainer.style.display = 'block';
    }

    form.appendChild(passwordGroup);
    form.appendChild(submitButton);
    form.appendChild(backContainer);

    return form;
  }

  // Start initialization
  initializeSignupPassword().catch(error => {
    console.error('❌ Initialization failed:', error);
  });
});
