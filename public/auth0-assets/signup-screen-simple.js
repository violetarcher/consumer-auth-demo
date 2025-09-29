/**
 * ConsumerAuth - Auth0 Signup Screen Simple Version
 * Basic signup form without ACUL SDK complexity
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing simple ConsumerAuth signup...');

  function initializeSimpleSignup() {
    console.log('Starting simple signup initialization...');

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

    // Simple signup screen class
    class SimpleSignupScreen {
      constructor() {
        this.container = null;
      }

      render() {
        console.log('Rendering simple ConsumerAuth signup screen');

        // Clear existing content
        document.body.innerHTML = '';

        // Create main container
        this.container = document.createElement('div');
        this.container.className = 'auth0-login-container';
        this.container.style.cssText = `
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f8fafc;
          font-family: Inter, system-ui, -apple-system, sans-serif;
        `;

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
        card.style.cssText = `
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        `;

        // Create header
        const header = this.createHeader();
        card.appendChild(header);

        // Create form container
        const formContainer = this.createFormContainer();
        card.appendChild(formContainer);

        return card;
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
        const passwordConfirm = document.getElementById('password_confirm').value;

        console.log('Simple signup - submitting complete signup form');

        // Basic validation
        if (!username || !password || !passwordConfirm) {
          alert('Please fill in all fields.');
          return;
        }

        if (password !== passwordConfirm) {
          alert('Passwords do not match.');
          return;
        }

        if (password.length < 8) {
          alert('Password must be at least 8 characters long.');
          return;
        }

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

        const passwordConfirmInput = document.createElement('input');
        passwordConfirmInput.type = 'hidden';
        passwordConfirmInput.name = 'password_confirm';
        passwordConfirmInput.value = passwordConfirm;

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
        form.appendChild(passwordConfirmInput);

        document.body.appendChild(form);
        form.submit();
      }

      handleBackToLogin() {
        const urlParams = new URLSearchParams(window.location.search);
        const state = urlParams.get('state');

        if (state) {
          const loginUrl = `${window.location.origin}/u/login?state=${state}`;
          window.location.href = loginUrl;
        }
      }
    }

    // Initialize the simple signup screen
    try {
      const simpleSignup = new SimpleSignupScreen();
      simpleSignup.render();
      console.log('✅ Simple ConsumerAuth signup screen rendered successfully');
    } catch (error) {
      console.error('❌ Error rendering simple signup screen:', error);
      document.body.innerHTML = '<div style="text-align: center; padding: 2rem;"><h1>Loading...</h1></div>';
    }
  }

  // Start initialization
  initializeSimpleSignup();
});

// Global error handler
window.addEventListener('error', function(e) {
  console.error('Simple signup global error:', e.error);
});