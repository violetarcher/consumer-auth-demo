"use strict";
var Auth0ACULBundle = (() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // node_modules/@auth0/auth0-acul-js/dist/constants/form-actions.js
  var E = { DEFAULT: "default", BACK: "back-action", PICK_AUTHENTICATOR: "pick-authenticator", PICK_SMS: "pick-sms", PICK_EMAIL: "pick-email", PICK_COUNTRY_CODE: "pick-country-code", RESEND_CODE: "resend-code", RESEND: "resend", CONTINUE: "continue", TOGGLE_VIEW: "toggle-view", ENTER_OTP_CODE: "enter-otp-code", SWITCH_TO_VOICE: "switch-to-voice", ABORT_PASSKEY_ENROLLMENT: "abort-passkey-enrollment", BACK_TO_LOGIN: "back-to-login", ACCEPT: "accept", DENY: "deny", ENROLL: "enroll", RESEND_EMAIL: "resend-email-action", PICK_PHONE: "pick-phone", SWITCH_TO_SMS: "switch-to-sms", CONFIRM: "confirm", CANCEL: "cancel", SHOW_ERROR_ACTION_PREFIX: "showError::", SNOOZE_ENROLLMENT: "snooze-enrollment", REFUSE_ADD_DEVICE: "refuse-add-device", TRY_AGAIN: "tryagain", USE_PASSWORD: "use-password" };

  // node_modules/@auth0/auth0-acul-js/dist/constants/enums.js
  var e = { EMAIL_IDENTIFIER_CHALLENGE: "email-identifier-challenge", INTERSTITIAL_CAPTCHA: "interstitial-captcha", LOGIN: "login", LOGIN_ID: "login-id", LOGIN_PASSWORD: "login-password", LOGIN_PASSWORDLESS_EMAIL_CODE: "login-passwordless-email-code", LOGIN_PASSWORDLESS_SMS_OTP: "login-passwordless-sms-otp", MFA_BEGIN_ENROLL_OPTIONS: "mfa-begin-enroll-options", MFA_COUNTRY_CODES: "mfa-country-codes", MFA_DETECT_BROWSER_CAPABILITIES: "mfa-detect-browser-capabilities", MFA_EMAIL_CHALLENGE: "mfa-email-challenge", MFA_EMAIL_LIST: "mfa-email-list", MFA_ENROLL_RESULT: "mfa-enroll-result", MFA_LOGIN_OPTIONS: "mfa-login-options", MFA_PUSH_CHALLENGE_PUSH: "mfa-push-challenge-push", MFA_PUSH_ENROLLMENT_QR: "mfa-push-enrollment-qr", MFA_PUSH_LIST: "mfa-push-list", MFA_PUSH_WELCOME: "mfa-push-welcome", MFA_SMS_CHALLENGE: "mfa-sms-challenge", MFA_SMS_ENROLLMENT: "mfa-sms-enrollment", MFA_SMS_LIST: "mfa-sms-list", PASSKEY_ENROLLMENT: "passkey-enrollment", PASSKEY_ENROLLMENT_LOCAL: "passkey-enrollment-local", PHONE_IDENTIFIER_CHALLENGE: "phone-identifier-challenge", PHONE_IDENTIFIER_ENROLLMENT: "phone-identifier-enrollment", RESET_PASSWORD: "reset-password", RESET_PASSWORD_EMAIL: "reset-password-email", RESET_PASSWORD_ERROR: "reset-password-error", RESET_PASSWORD_MFA_EMAIL_CHALLENGE: "reset-password-mfa-email-challenge", RESET_PASSWORD_MFA_PUSH_CHALLENGE_PUSH: "reset-password-mfa-push-challenge-push", RESET_PASSWORD_MFA_SMS_CHALLENGE: "reset-password-mfa-sms-challenge", RESET_PASSWORD_REQUEST: "reset-password-request", RESET_PASSWORD_SUCCESS: "reset-password-success", SIGNUP: "signup", SIGNUP_ID: "signup-id", SIGNUP_PASSWORD: "signup-password", MFA_OTP_CHALLENGE: "mfa-otp-challenge", ACCEPT_INVITATION: "accept-invitation", CUSTOMIZED_CONSENT: "customized-consent", MFA_PHONE_ENROLLMENT: "mfa-phone-enrollment", MFA_VOICE_ENROLLMENT: "mfa-voice-enrollment", MFA_RECOVERY_CODE_CHALLENGE: "mfa-recovery-code-challenge", DEVICE_CODE_ACTIVATION_ALLOWED: "device-code-activation-allowed", DEVICE_CODE_ACTIVATION_DENIED: "device-code-activation-denied", DEVICE_CODE_ACTIVATION: "device-code-activation", RESET_PASSWORD_MFA_RECOVERY_CODE_CHALLENGE: "reset-password-mfa-recovery-code-challenge", RESET_PASSWORD_MFA_VOICE_CHALLENGE: "reset-password-mfa-voice-challenge", REDEEM_TICKET: "redeem-ticket", DEVICE_CODE_CONFIRMATION: "device-code-confirmation", MFA_PHONE_CHALLENGE: "mfa-phone-challenge", MFA_RECOVERY_CODE_ENROLLMENT: "mfa-recovery-code-enrollment", RESET_PASSWORD_MFA_PHONE_CHALLENGE: "reset-password-mfa-phone-challenge", MFA_RECOVERY_CODE_CHALLENGE_NEW_CODE: "mfa-recovery-code-challenge-new-code", LOGOUT: "logout", LOGOUT_ABORTED: "logout-aborted", LOGOUT_COMPLETE: "logout-complete", EMAIL_OTP_CHALLENGE: "email-otp-challenge", EMAIL_VERIFICATION_RESULT: "email-verification-result", LOGIN_EMAIL_VERIFICATION: "login-email-verification", MFA_WEBAUTHN_PLATFORM_ENROLLMENT: "mfa-webauthn-platform-enrollment", MFA_WEBAUTHN_ERROR: "mfa-webauthn-error", MFA_WEBAUTHN_NOT_AVAILABLE_ERROR: "mfa-webauthn-not-available-error", MFA_WEBAUTHN_ROAMING_ENROLLMENT: "mfa-webauthn-roaming-enrollment", MFA_WEBAUTHN_ROAMING_CHALLENGE: "mfa-webauthn-roaming-challenge", MFA_WEBAUTHN_PLATFORM_CHALLENGE: "mfa-webauthn-platform-challenge", MFA_WEBAUTHN_ENROLLMENT_SUCCESS: "mfa-webauthn-enrollment-success", MFA_WEBAUTHN_CHANGE_KEY_NICKNAME: "mfa-webauthn-change-key-nickname", CONSENT: "consent", RESET_PASSWORD_MFA_WEBAUTHN_PLATFORM_CHALLENGE: "reset-password-mfa-webauthn-platform-challenge", RESET_PASSWORD_MFA_WEBAUTHN_ROAMING_CHALLENGE: "reset-password-mfa-webauthn-roaming-challenge" };

  // node_modules/@auth0/auth0-acul-js/dist/constants/errors.js
  var e2 = { PASSKEY_DATA_UNAVAILABLE: "Passkey data is unavailable. Please verify if passkeys are enabled in your Auth0 dashboard settings.", PASSKEY_PUBLIC_KEY_UNAVAILABLE: "Public key data is unavailable. Please verify if passkeys are enabled in your Auth0 dashboard settings.", PASSKEY_CREDENTIALS_UNAVAILABLE: "Unable to retrieve the credential. No credentials found or multiple options detected.", PASSKEY_CREATE_FAILED: "Failed to create credentials", PASSKEY_EXPECTED_ASSERTION_RESPONSE: "Expected AuthenticatorAssertionResponse" };

  // node_modules/@auth0/auth0-acul-js/dist/models/branding.js
  var e3 = class _e {
    constructor(t8) {
      __publicField(this, "settings");
      __publicField(this, "themes");
      this.settings = _e.getSettings(t8), this.themes = _e.getThemes(t8);
    }
    static getSettings(e12) {
      if (!e12?.settings) return null;
      const { colors: t8, favicon_url: r6, logo_url: g, font: n6 } = e12.settings;
      return { ...t8 && { colors: { primary: t8.primary, pageBackground: "string" == typeof t8.page_background ? t8.page_background : t8.page_background && { type: t8.page_background.type, start: t8.page_background.start, end: t8.page_background.end, angleDegree: t8.page_background.angle_deg } } }, ..."string" == typeof r6 && r6.length > 0 ? { faviconUrl: r6 } : {}, ..."string" == typeof g && g.length > 0 ? { logoUrl: g } : {}, ..."string" == typeof n6?.url && n6.url.length > 0 ? { fontUrl: n6.url } : {} };
    }
    static getThemes(e12) {
      if (!e12?.themes) return null;
      const { default: { borders: t8 = {}, colors: r6 = {}, displayName: g = "", fonts: n6 = {}, page_background: s3 = {}, widget: o2 = {} } = {} } = e12.themes;
      return { default: { borders: t8, colors: r6, displayName: g, fonts: n6, pageBackground: s3, widget: o2 } };
    }
  };

  // node_modules/@auth0/auth0-acul-js/dist/models/client.js
  var t = class {
    constructor(t8) {
      __publicField(this, "id");
      __publicField(this, "name");
      __publicField(this, "logoUrl");
      __publicField(this, "description");
      __publicField(this, "metadata");
      this.id = t8?.id, this.name = t8?.name, this.logoUrl = t8?.logo_uri ?? null, this.description = t8?.description ?? null, this.metadata = t8?.metadata ?? null;
    }
  };

  // node_modules/@auth0/auth0-acul-js/dist/models/organization.js
  var a = class {
    constructor(a6) {
      __publicField(this, "id");
      __publicField(this, "name");
      __publicField(this, "usage");
      __publicField(this, "displayName");
      __publicField(this, "branding");
      __publicField(this, "metadata");
      this.id = a6?.id ?? null, this.name = a6?.name ?? null, this.usage = a6?.usage ?? null, this.displayName = a6?.display_name ?? null, this.branding = a6?.branding ?? null, this.metadata = a6?.metadata ?? null;
    }
  };

  // node_modules/@auth0/auth0-acul-js/dist/models/prompt.js
  var a2 = class {
    constructor(a6) {
      __publicField(this, "name");
      this.name = a6.name;
    }
  };

  // node_modules/@auth0/auth0-acul-js/dist/models/screen.js
  var a3 = class _a2 {
    constructor(t8) {
      __publicField(this, "name");
      __publicField(this, "captchaImage");
      __publicField(this, "captchaSiteKey");
      __publicField(this, "captchaProvider");
      __publicField(this, "isCaptchaAvailable");
      __publicField(this, "data");
      __publicField(this, "links");
      __publicField(this, "texts");
      __publicField(this, "captcha");
      this.name = t8.name, this.captchaImage = t8.captcha?.image ?? null, this.captchaSiteKey = t8.captcha?.siteKey ?? null, this.captchaProvider = t8.captcha?.provider ?? null, this.isCaptchaAvailable = !!t8.captcha, this.texts = t8.texts ?? null, this.captcha = t8.captcha ?? null, this.data = _a2.getScreenData(t8), this.links = _a2.getScreenLinks(t8);
    }
    static getScreenData(a6) {
      return a6.data ?? null;
    }
    static getScreenLinks(a6) {
      return a6.links ?? null;
    }
  };

  // node_modules/@auth0/auth0-acul-js/dist/models/tenant.js
  var e4 = class {
    constructor(e12) {
      __publicField(this, "name");
      __publicField(this, "friendlyName");
      __publicField(this, "enabledLocales");
      __publicField(this, "enabledFactors");
      this.name = e12?.name ?? null, this.friendlyName = e12?.friendly_name ?? null, this.enabledLocales = e12?.enabled_locales ?? null, this.enabledFactors = e12?.enabled_factors ?? null;
    }
  };

  // node_modules/@auth0/auth0-acul-js/dist/models/transaction.js
  var t2 = class _t {
    constructor(e12) {
      __publicField(this, "state");
      __publicField(this, "hasErrors");
      __publicField(this, "locale");
      __publicField(this, "countryCode");
      __publicField(this, "countryPrefix");
      __publicField(this, "connectionStrategy");
      __publicField(this, "errors");
      __publicField(this, "currentConnection");
      __publicField(this, "alternateConnections");
      this.state = e12.state, this.hasErrors = !!(e12.errors && e12.errors.length > 0), this.locale = e12.locale, this.countryCode = e12.country_code?.code ?? null, this.countryPrefix = e12.country_code?.prefix ?? null, this.connectionStrategy = e12?.connection?.strategy?.toLowerCase() ?? null, this.errors = _t.getErrors(e12), this.currentConnection = _t.getCurrentConnection(e12), this.alternateConnections = _t.getAlternateConnections(e12);
    }
    static getErrors(t8) {
      return t8.errors && 0 !== t8.errors.length ? t8.errors.map(((t9) => ({ code: t9.code, field: t9.field, message: t9.message }))) : null;
    }
    static getCurrentConnection(t8) {
      if (!t8?.connection) return null;
      const { name: e12, strategy: n6, metadata: r6 } = t8.connection;
      return { name: e12, strategy: n6, metadata: r6 };
    }
    static getAlternateConnections(t8) {
      const e12 = t8?.alternate_connections;
      return e12 && Array.isArray(e12) ? e12.map(((t9) => {
        const { name: e13, strategy: n6, metadata: r6 } = t9, o2 = { name: e13, strategy: n6, metadata: r6 };
        if ("options" in t9) {
          const { icon_url: e14, display_name: n7, show_as_button: r7 } = t9.options;
          return { ...o2, options: { iconUrl: e14, displayName: n7, showAsButton: r7 } };
        }
        return o2;
      })) : null;
    }
  };

  // node_modules/@auth0/auth0-acul-js/dist/models/untrusted-data.js
  var t3 = class _t {
    constructor(a6) {
      __publicField(this, "submittedFormData");
      __publicField(this, "authorizationParams");
      this.submittedFormData = _t.getSubmittedFormData(a6), this.authorizationParams = _t.getAuthorizationParams(a6);
    }
    static getSubmittedFormData(t8) {
      return t8?.submitted_form_data ? t8?.submitted_form_data ?? null : null;
    }
    static getAuthorizationParams(t8) {
      return t8?.authorization_params ? { login_hint: t8?.authorization_params?.login_hint, screen_hint: t8?.authorization_params?.screen_hint, ui_locales: t8?.authorization_params?.ui_locales, ...t8?.authorization_params } : null;
    }
  };

  // node_modules/@auth0/auth0-acul-js/dist/models/user.js
  var e5 = class _e {
    constructor(a6) {
      __publicField(this, "id");
      __publicField(this, "username");
      __publicField(this, "email");
      __publicField(this, "picture");
      __publicField(this, "phoneNumber");
      __publicField(this, "userMetadata");
      __publicField(this, "appMetadata");
      __publicField(this, "enrolledFactors");
      __publicField(this, "enrolledEmails");
      __publicField(this, "enrolledPhoneNumbers");
      __publicField(this, "enrolledDevices");
      __publicField(this, "organizations");
      this.id = a6?.id ?? null, this.username = a6?.username ?? null, this.email = a6?.email ?? null, this.picture = a6?.picture ?? null, this.phoneNumber = a6?.phone_number ?? null, this.userMetadata = a6?.user_metadata ?? null, this.appMetadata = a6?.app_metadata ?? null, this.enrolledFactors = a6?.enrolled_factors ?? null, this.enrolledEmails = a6?.enrolled_emails ?? null, this.enrolledPhoneNumbers = a6?.enrolled_phone_numbers ?? null, this.enrolledDevices = a6?.enrolled_devices ?? null, this.organizations = _e.getOrganizations(a6);
    }
    static getOrganizations(e12) {
      return e12?.organizations && Array.isArray(e12?.organizations) ? e12?.organizations.map(((e13) => ({ organizationId: e13.id, organizationName: e13.name, displayName: e13.display_name, branding: { logoUrl: e13.branding?.logo_url } }))) : null;
    }
  };

  // node_modules/@auth0/auth0-acul-js/dist/models/base-context.js
  var _m = class _m {
    constructor() {
      __publicField(this, "branding");
      __publicField(this, "screen");
      __publicField(this, "tenant");
      __publicField(this, "prompt");
      __publicField(this, "organization");
      __publicField(this, "client");
      __publicField(this, "transaction");
      __publicField(this, "user");
      __publicField(this, "untrustedData");
      if (!_m.context) {
        const t8 = window;
        _m.context = t8.universal_login_context ?? null;
      }
      const u3 = _m.context, l3 = new.target?.screenIdentifier;
      if (!u3) throw new Error("Universal Login Context is not available on the global window object.");
      if (l3 !== u3?.screen?.name && "" !== l3) throw new Error(`Incorrect import: The current screen name does not match the imported screen class. Imported Screen: ${l3}, Current Screen: ${u3?.screen?.name}`);
      this.branding = new e3(u3.branding), this.screen = new a3(u3.screen), this.tenant = new e4(u3.tenant), this.prompt = new a2(u3.prompt), this.organization = new a(u3.organization), this.client = new t(u3.client), this.transaction = new t2(u3.transaction), this.user = new e5(u3.user), this.untrustedData = new t3(u3.untrusted_data);
    }
    getContext(t8) {
      if (!_m.context) {
        const t9 = window;
        _m.context = t9.universal_login_context ?? null;
      }
      if (_m.context) return _m.context[t8];
    }
    getError() {
      return this.transaction?.errors ?? [];
    }
  };
  __publicField(_m, "context", null);
  __publicField(_m, "screenIdentifier", "");
  var m = _m;

  // node_modules/@auth0/auth0-acul-js/dist/utils/browser-capabilities.js
  async function a4() {
    if ("undefined" == typeof navigator) return false;
    const a6 = navigator;
    if (a6.brave?.isBrave && "function" == typeof a6.brave.isBrave) try {
      return Boolean(await a6.brave.isBrave());
    } catch {
      return false;
    }
    return false;
  }
  function e6() {
    return void 0 !== window.PublicKeyCredential;
  }
  async function n() {
    if (!window || !window.PublicKeyCredential) return false;
    try {
      return Boolean(await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());
    } catch (a6) {
      return console.warn("isUserVerifyingPlatformAuthenticatorAvailable failed", a6), false;
    }
  }
  async function t4() {
    if (!e6()) return false;
    try {
      return await n() && Boolean(await window.PublicKeyCredential.isConditionalMediationAvailable());
    } catch (a6) {
      return console.warn("isPasskeySupported failed", a6), false;
    }
  }
  async function r() {
    return { "js-available": true, "is-brave": await a4(), "webauthn-available": e6(), "webauthn-platform-available": await n(), "allow-passkeys": await t4() };
  }

  // node_modules/@auth0/auth0-acul-js/dist/utils/form-handler.js
  var t5 = class {
    constructor(t8) {
      __publicField(this, "options");
      this.options = t8;
    }
    async submitData(t8) {
      const e12 = { ...t8, state: this.options.state }, n6 = this.buildForm(e12);
      document.body.appendChild(n6), n6.submit();
    }
    buildForm(t8) {
      const e12 = document.createElement("form");
      return e12.method = "POST", e12.action = this.options.route ?? "", Object.entries(t8).forEach((([t9, n6]) => {
        const o2 = document.createElement("input");
        o2.type = "hidden", o2.name = t9, o2.value = String(n6 ?? ""), e12.appendChild(o2);
      })), this.addTelemetryField(e12), e12;
    }
    addTelemetryField(t8) {
      const e12 = document.createElement("input");
      return e12.type = "hidden", e12.name = "acul-sdk", e12.value = "@auth0/auth0-acul-js@0.1.0-beta.8", t8.appendChild(e12), t8;
    }
  };

  // node_modules/@auth0/auth0-acul-js/dist/utils/codec.js
  function r2(r6) {
    if (!r6 || "string" != typeof r6) throw new TypeError("Invalid base64Url input");
    const e12 = r6.replace(/-/g, "+").replace(/_/g, "/"), t8 = (4 - e12.length % 4) % 4, n6 = e12 + "=".repeat(t8), o2 = atob(n6), a6 = new Uint8Array(o2.length);
    for (let r7 = 0; r7 < o2.length; r7++) a6[r7] = o2.charCodeAt(r7);
    return a6.buffer;
  }
  function e7(r6) {
    if (!(r6 instanceof ArrayBuffer)) throw new TypeError("Expected an ArrayBuffer");
    const e12 = new Uint8Array(r6);
    let t8 = "";
    for (const r7 of e12) t8 += String.fromCharCode(r7);
    return btoa(t8).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  // node_modules/@auth0/auth0-acul-js/dist/utils/passkeys.js
  function n2(t8) {
    return t8 ? e7(t8) : null;
  }
  async function i(r6) {
    if (!r6?.challenge) throw new Error(e2.PASSKEY_PUBLIC_KEY_UNAVAILABLE);
    const i5 = await n(), o2 = r2(r6.challenge), c2 = await navigator.credentials.get({ publicKey: { challenge: o2 } });
    if (!c2) throw new Error(e2.PASSKEY_CREDENTIALS_UNAVAILABLE);
    if (!(function(t8) {
      return void 0 !== t8.authenticatorData;
    })(c2.response)) throw new Error(e2.PASSKEY_EXPECTED_ASSERTION_RESPONSE);
    const s3 = c2.response;
    return { id: c2.id, rawId: n2(c2.rawId ?? null), type: c2.type, authenticatorAttachment: c2.authenticatorAttachment, response: { clientDataJSON: n2(s3.clientDataJSON ?? null), authenticatorData: n2(s3.authenticatorData ?? null), signature: n2(s3.signature ?? null), userHandle: n2(s3.userHandle ?? null) }, isUserVerifyingPlatformAuthenticatorAvailable: i5 };
  }

  // node_modules/@auth0/auth0-acul-js/dist/shared/screen.js
  function n3(n6) {
    const t8 = n6?.links;
    return t8?.signup ?? null;
  }
  function e8(n6) {
    const t8 = n6?.links;
    return t8?.login ?? null;
  }
  function r3(n6) {
    const t8 = n6?.links;
    return t8?.reset_password ?? null;
  }
  function i2(n6) {
    const t8 = n6?.links;
    return t8?.edit_identifier ?? null;
  }
  function u(n6) {
    const t8 = n6.data?.passkey;
    return t8?.public_key ?? null;
  }

  // node_modules/@auth0/auth0-acul-js/dist/screens/login-id/screen-override.js
  var t6 = class extends a3 {
    constructor(s3) {
      super(s3);
      __publicField(this, "signupLink");
      __publicField(this, "resetPasswordLink");
      __publicField(this, "publicKey");
      this.signupLink = n3(s3), this.resetPasswordLink = r3(s3), this.publicKey = u(s3);
    }
  };

  // node_modules/@auth0/auth0-acul-js/dist/constants/identifiers.js
  var e9 = { EMAIL: "email", PHONE: "phone" };

  // node_modules/@auth0/auth0-acul-js/dist/constants/connection-strategy.js
  var s = { SMS: "sms", EMAIL: "email" };

  // node_modules/@auth0/auth0-acul-js/dist/shared/transaction.js
  function n4(n6) {
    return true === n6?.connection?.options?.signup_enabled;
  }
  function t7(n6) {
    const t8 = n6?.connection;
    return true === t8?.options?.forgot_password_enabled;
  }
  function o(n6) {
    const t8 = n6?.connection;
    return t8?.options?.authentication_methods?.passkey?.enabled ?? false;
  }
  function e10(n6) {
    const t8 = n6?.connection;
    return t8?.options?.username_required ?? false;
  }
  function i3(n6) {
    const t8 = n6?.connection, o2 = t8?.options?.attributes?.username?.validation;
    return o2 ? { maxLength: o2.max_length, minLength: o2.min_length, allowedFormats: { usernameInEmailFormat: o2.allowed_types?.email ?? false, usernameInPhoneFormat: o2.allowed_types?.phone_number ?? false } } : null;
  }
  function s2(n6) {
    const t8 = n6?.connection, o2 = t8?.options?.authentication_methods?.password;
    return o2 ? { minLength: o2.min_length, policy: o2.policy, passwordSecurityInfo: o2.password_security_info } : null;
  }
  function u2(n6) {
    const t8 = n6?.connection;
    return t8?.options?.attributes ? l(t8, ["required", "optional"]) : null;
  }
  function r4(n6) {
    return l(n6?.connection, ["required"]);
  }
  function c(n6) {
    return l(n6?.connection, ["optional"]);
  }
  function l(n6, t8) {
    return n6?.options?.attributes && Object.entries(n6.options.attributes).filter((([, n7]) => n7.signup_status && t8.includes(n7.signup_status))).map((([n7]) => n7)).length > 0 ? Object.entries(n6.options.attributes).filter((([, n7]) => n7.signup_status && t8.includes(n7.signup_status))).map((([n7]) => n7)) : null;
  }

  // node_modules/@auth0/auth0-acul-js/dist/screens/login-id/transaction-override.js
  var l2 = class _l extends t2 {
    constructor(s3) {
      super(s3);
      __publicField(this, "isSignupEnabled");
      __publicField(this, "isForgotPasswordEnabled");
      __publicField(this, "isPasskeyEnabled");
      __publicField(this, "isUsernameRequired");
      __publicField(this, "usernamePolicy");
      __publicField(this, "allowedIdentifiers");
      this.isSignupEnabled = n4(s3), this.isForgotPasswordEnabled = t7(s3), this.isPasskeyEnabled = o(s3), this.isUsernameRequired = e10(s3), this.usernamePolicy = i3(s3), this.allowedIdentifiers = _l.getAllowedIdentifiers(s3, this.connectionStrategy);
    }
    static getAllowedIdentifiers(i5, t8) {
      return t8 === s.SMS ? [e9.PHONE] : t8 === s.EMAIL ? [e9.EMAIL] : u2(i5);
    }
  };

  // node_modules/@auth0/auth0-acul-js/dist/screens/login-id/index.js
  var _m2 = class _m2 extends m {
    constructor() {
      super();
      __publicField(this, "screen");
      __publicField(this, "transaction");
      const t8 = this.getContext("screen"), e12 = this.getContext("transaction");
      this.screen = new t6(t8), this.transaction = new l2(e12);
    }
    async login(t8) {
      const e12 = { state: this.transaction.state, telemetry: [_m2.screenIdentifier, "login"] }, s3 = await r();
      await new t5(e12).submitData({ ...t8, ...s3 });
    }
    async federatedLogin(t8) {
      const e12 = { state: this.transaction.state, telemetry: [_m2.screenIdentifier, "federatedLogin"] };
      await new t5(e12).submitData(t8);
    }
    async passkeyLogin(t8) {
      const e12 = this.screen.publicKey;
      if (!e12) throw new Error(e2.PASSKEY_DATA_UNAVAILABLE);
      const n6 = await i(e12), r6 = { state: this.transaction.state, telemetry: [_m2.screenIdentifier, "passkeyLogin"] };
      await new t5(r6).submitData({ ...t8, passkey: JSON.stringify(n6) });
    }
    async pickCountryCode(e12) {
      const s3 = { state: this.transaction.state, telemetry: [_m2.screenIdentifier, "pickCountryCode"] };
      await new t5(s3).submitData({ ...e12, action: E.PICK_COUNTRY_CODE });
    }
  };
  __publicField(_m2, "screenIdentifier", e.LOGIN_ID);
  var m2 = _m2;

  // node_modules/@auth0/auth0-acul-js/dist/screens/signup/screen-override.js
  var e11 = class extends a3 {
    constructor(s3) {
      super(s3);
      __publicField(this, "loginLink");
      this.loginLink = e8(s3);
    }
  };

  // node_modules/@auth0/auth0-acul-js/dist/screens/signup/transaction-override.js
  var d = class _d extends t2 {
    constructor(s3) {
      super(s3);
      __publicField(this, "isPasskeyEnabled");
      __publicField(this, "usernamePolicy");
      __publicField(this, "optionalIdentifiers");
      __publicField(this, "requiredIdentifiers");
      __publicField(this, "passwordPolicy");
      this.isPasskeyEnabled = o(s3), this.usernamePolicy = i3(s3), this.optionalIdentifiers = c(s3), this.requiredIdentifiers = _d.getRequiredIdentifiers(s3, this.connectionStrategy), this.passwordPolicy = s2(s3);
    }
    static getRequiredIdentifiers(i5, t8) {
      return t8 === s.SMS ? [e9.PHONE] : t8 === s.EMAIL ? [e9.EMAIL] : r4(i5);
    }
  };

  // node_modules/@auth0/auth0-acul-js/dist/screens/signup/index.js
  var _i = class _i extends m {
    constructor() {
      super();
      __publicField(this, "screen");
      __publicField(this, "transaction");
      const t8 = this.getContext("screen"), e12 = this.getContext("transaction");
      this.screen = new e11(t8), this.transaction = new d(e12);
    }
    async signup(t8) {
      const e12 = { state: this.transaction.state, telemetry: [_i.screenIdentifier, "signup"] };
      await new t5(e12).submitData(t8);
    }
    async federatedSignup(t8) {
      const e12 = { state: this.transaction.state, telemetry: [_i.screenIdentifier, "federatedSignup"] };
      await new t5(e12).submitData(t8);
    }
    async pickCountryCode() {
      const e12 = { state: this.transaction.state, telemetry: [_i.screenIdentifier, "pickCountryCode"] };
      await new t5(e12).submitData({ action: E.PICK_COUNTRY_CODE });
    }
  };
  __publicField(_i, "screenIdentifier", e.SIGNUP);
  var i4 = _i;

  // node_modules/@auth0/auth0-acul-js/dist/screens/login-password/screen-override.js
  var r5 = class extends a3 {
    constructor(r6) {
      super(r6);
      __publicField(this, "signupLink");
      __publicField(this, "resetPasswordLink");
      __publicField(this, "editIdentifierLink");
      __publicField(this, "data");
      this.signupLink = n3(r6), this.resetPasswordLink = r3(r6), this.editIdentifierLink = i2(r6), this.data = a3.getScreenData(r6);
    }
  };

  // node_modules/@auth0/auth0-acul-js/dist/screens/login-password/transaction-override.js
  var n5 = class extends t2 {
    constructor(s3) {
      super(s3);
      __publicField(this, "isSignupEnabled");
      __publicField(this, "isForgotPasswordEnabled");
      __publicField(this, "isPasskeyEnabled");
      __publicField(this, "getPasswordPolicy");
      __publicField(this, "getUsernamePolicy");
      __publicField(this, "getAllowedIdentifiers");
      this.isSignupEnabled = n4(s3), this.isForgotPasswordEnabled = t7(s3), this.isPasskeyEnabled = o(s3), this.getPasswordPolicy = () => s2(s3), this.getUsernamePolicy = () => i3(s3), this.getAllowedIdentifiers = () => u2(s3);
    }
  };

  // node_modules/@auth0/auth0-acul-js/dist/screens/login-password/index.js
  var _a = class _a extends m {
    constructor() {
      super();
      __publicField(this, "screen");
      __publicField(this, "transaction");
      const t8 = this.getContext("screen"), e12 = this.getContext("transaction");
      this.screen = new r5(t8), this.transaction = new n5(e12);
    }
    async login(t8) {
      const e12 = { state: this.transaction.state, telemetry: [_a.screenIdentifier, "login"] };
      await new t5(e12).submitData(t8);
    }
    async federatedLogin(t8) {
      const e12 = { state: this.transaction.state, telemetry: [_a.screenIdentifier, "federatedLogin"] };
      await new t5(e12).submitData(t8);
    }
  };
  __publicField(_a, "screenIdentifier", e.LOGIN_PASSWORD);
  var a5 = _a;

  // temp-sdk-entry.js
  window.Auth0ACUL = {
    LoginId: m2,
    Signup: i4,
    LoginPassword: a5
  };
  console.log("\u2705 Auth0 ACUL SDK loaded");
  console.log("Available:", Object.keys(window.Auth0ACUL));
})();
