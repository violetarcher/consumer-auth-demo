/**
 * ConsumerAuth - Auth0 Consent Screen
 * Dramatic split-screen design for user consent
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing ConsumerAuth consent screen...');

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

  async function initializeConsent() {
    console.log('Starting consent initialization...');

    const auth0SDK = await waitForAuth0SDK();

    if (!auth0SDK || !auth0SDK.Consent) {
      console.error('❌ Consent not available');
      return;
    }

    // Initialize ACUL Consent manager
    const consentManager = new auth0SDK.Consent();
    console.log('✅ Consent manager initialized:', consentManager);

    // Get screen data
    const screenData = consentManager.screen;
    const clientData = consentManager.client;
    const userData = consentManager.user;

    console.log('Screen data:', screenData);
    console.log('Client data:', clientData);
    console.log('User data:', userData);

    // Render the dramatic split-screen consent form
    renderConsentScreen(consentManager);
  }

  function renderConsentScreen(manager) {
    console.log('Rendering customized-consent screen...');

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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      position: relative;
    `;

    // Create left panel (brand/visual)
    const leftPanel = createLeftPanel(manager);
    container.appendChild(leftPanel);

    // Create right panel (consent form)
    const rightPanel = createRightPanel(manager);
    container.appendChild(rightPanel);

    // Append to body
    document.body.appendChild(container);
  }

  function createLeftPanel(manager) {
    const panel = document.createElement('div');
    panel.style.cssText = `
      flex: 1;
      background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
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

    // App logo if available
    if (manager.client?.logoUrl) {
      const logoImg = document.createElement('img');
      logoImg.src = manager.client.logoUrl;
      logoImg.style.cssText = `
        width: 120px;
        height: 120px;
        margin: 0 auto 2rem;
        border-radius: 30px;
        animation: float 3s ease-in-out infinite;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      `;
      brandContainer.appendChild(logoImg);
    } else {
      // Large animated logo
      const logoContainer = document.createElement('div');
      logoContainer.style.cssText = `
        width: 120px;
        height: 120px;
        margin: 0 auto 2rem;
        background: linear-gradient(45deg, #667eea, #764ba2);
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
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      `;
      logo.style.cssText = 'filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));';
      logoContainer.appendChild(logo);
      brandContainer.appendChild(logoContainer);
    }

    // Title
    const title = document.createElement('h1');
    title.textContent = manager.client?.name || 'Application';
    title.style.cssText = `
      color: white;
      font-size: 2.8rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      background: linear-gradient(45deg, #f093fb, #667eea);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: pulse 2s ease-in-out infinite;
    `;

    // Subtitle
    const subtitle = document.createElement('p');
    subtitle.textContent = 'Requesting Access';
    subtitle.style.cssText = `
      color: rgba(255,255,255,0.9);
      font-size: 1.2rem;
      font-weight: 300;
      margin: 0;
      letter-spacing: 2px;
    `;

    brandContainer.appendChild(title);
    brandContainer.appendChild(subtitle);
    panel.appendChild(brandContainer);

    return panel;
  }

  function createRightPanel(manager) {
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
      overflow-y: auto;
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
      max-width: 500px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      transform: translateX(20px);
      opacity: 0;
      animation: slideInRight 0.8s ease-out 0.3s forwards;
    `;

    // Form header
    const header = document.createElement('div');
    header.style.cssText = 'text-align: center; margin-bottom: 2rem;';

    const welcomeTitle = document.createElement('h2');
    welcomeTitle.textContent = 'Grant Permissions';
    welcomeTitle.style.cssText = `
      color: #1a1a2e;
      font-size: 2rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
    `;

    const welcomeDesc = document.createElement('p');
    welcomeDesc.textContent = `${manager.client?.name || 'This application'} would like to access your account`;
    welcomeDesc.style.cssText = `
      color: #64748b;
      font-size: 1rem;
      margin: 0;
    `;

    header.appendChild(welcomeTitle);
    header.appendChild(welcomeDesc);

    // Scopes list
    const scopesList = createScopesList(manager);

    // Form
    const form = createForm(manager);

    formContainer.appendChild(header);
    formContainer.appendChild(scopesList);
    formContainer.appendChild(form);
    panel.appendChild(formContainer);

    return panel;
  }

  function createScopesList(manager) {
    const container = document.createElement('div');
    container.style.cssText = `
      background: rgba(255,255,255,0.5);
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    `;

    const title = document.createElement('h3');
    title.textContent = 'Permissions Requested:';
    title.style.cssText = `
      color: #1a1a2e;
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 1rem 0;
    `;
    container.appendChild(title);

    const scopes = manager.screen?.scopes || [];

    if (scopes.length > 0) {
      const list = document.createElement('ul');
      list.style.cssText = `
        list-style: none;
        padding: 0;
        margin: 0;
      `;

      scopes.forEach(scope => {
        const item = document.createElement('li');
        item.style.cssText = `
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(0,0,0,0.1);
          display: flex;
          align-items: start;
          gap: 0.75rem;
        `;

        const icon = document.createElement('span');
        icon.textContent = '✓';
        icon.style.cssText = `
          color: #667eea;
          font-weight: bold;
          font-size: 1.2rem;
          flex-shrink: 0;
        `;

        const textContainer = document.createElement('div');

        const scopeValue = document.createElement('div');
        scopeValue.textContent = scope.value;
        scopeValue.style.cssText = `
          color: #1a1a2e;
          font-weight: 500;
          margin-bottom: 0.25rem;
        `;

        const scopeDesc = document.createElement('div');
        scopeDesc.textContent = scope.description || 'Access your information';
        scopeDesc.style.cssText = `
          color: #64748b;
          font-size: 0.875rem;
        `;

        textContainer.appendChild(scopeValue);
        textContainer.appendChild(scopeDesc);

        item.appendChild(icon);
        item.appendChild(textContainer);
        list.appendChild(item);
      });

      // Remove border from last item
      const lastItem = list.lastElementChild;
      if (lastItem) {
        lastItem.style.borderBottom = 'none';
      }

      container.appendChild(list);
    } else {
      const noScopes = document.createElement('p');
      noScopes.textContent = 'Basic profile access';
      noScopes.style.cssText = `
        color: #64748b;
        font-size: 0.9rem;
        margin: 0;
      `;
      container.appendChild(noScopes);
    }

    return container;
  }

  function createForm(manager) {
    const form = document.createElement('div');
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
    form.appendChild(errorContainer);

    // Button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; gap: 1rem; flex-direction: column;';

    // Accept button
    const acceptButton = document.createElement('button');
    acceptButton.type = 'button';
    acceptButton.id = 'accept-button';
    acceptButton.innerHTML = '<span id="accept-text">Accept</span><div id="accept-spinner" style="display: none; width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>';
    acceptButton.style.cssText = `
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
      box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
    `;

    acceptButton.addEventListener('mouseenter', () => {
      acceptButton.style.transform = 'translateY(-2px)';
      acceptButton.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4)';
    });

    acceptButton.addEventListener('mouseleave', () => {
      acceptButton.style.transform = 'translateY(0)';
      acceptButton.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.3)';
    });

    // Deny button
    const denyButton = document.createElement('button');
    denyButton.type = 'button';
    denyButton.id = 'deny-button';
    denyButton.textContent = 'Deny';
    denyButton.style.cssText = `
      width: 100%;
      padding: 1.25rem;
      background: rgba(255,255,255,0.2);
      color: #64748b;
      border: 2px solid rgba(100, 116, 139, 0.2);
      border-radius: 16px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    `;

    denyButton.addEventListener('mouseenter', () => {
      denyButton.style.background = 'rgba(255,255,255,0.3)';
      denyButton.style.color = '#1a1a2e';
      denyButton.style.borderColor = 'rgba(26, 26, 46, 0.2)';
    });

    denyButton.addEventListener('mouseleave', () => {
      denyButton.style.background = 'rgba(255,255,255,0.2)';
      denyButton.style.color = '#64748b';
      denyButton.style.borderColor = 'rgba(100, 116, 139, 0.2)';
    });

    // Accept button handler
    acceptButton.addEventListener('click', async () => {
      const acceptText = document.getElementById('accept-text');
      const acceptSpinner = document.getElementById('accept-spinner');
      acceptButton.disabled = true;
      denyButton.disabled = true;
      acceptText.style.display = 'none';
      acceptSpinner.style.display = 'block';
      errorContainer.style.display = 'none';

      try {
        console.log('Accepting consent...');
        await manager.accept();
        console.log('✅ Consent accepted successfully');
      } catch (error) {
        console.error('❌ Accept consent failed:', error);
        showError(error.message || 'An error occurred. Please try again.');

        acceptButton.disabled = false;
        denyButton.disabled = false;
        acceptText.style.display = 'inline';
        acceptSpinner.style.display = 'none';
      }
    });

    // Deny button handler
    denyButton.addEventListener('click', async () => {
      denyButton.disabled = true;
      acceptButton.disabled = true;
      errorContainer.style.display = 'none';

      try {
        console.log('Denying consent...');
        await manager.deny({ denial_reason: 'user_declined' });
        console.log('✅ Consent denied successfully');
      } catch (error) {
        console.error('❌ Deny consent failed:', error);
        showError(error.message || 'An error occurred. Please try again.');

        acceptButton.disabled = false;
        denyButton.disabled = false;
      }
    });

    function showError(message) {
      errorContainer.textContent = message;
      errorContainer.style.display = 'block';
    }

    buttonContainer.appendChild(acceptButton);
    buttonContainer.appendChild(denyButton);
    form.appendChild(buttonContainer);

    return form;
  }

  // Start initialization
  initializeConsent().catch(error => {
    console.error('❌ Initialization failed:', error);
  });
});
