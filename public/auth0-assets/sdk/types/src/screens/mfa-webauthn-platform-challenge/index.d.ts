import { BaseContext } from '../../models/base-context';
import type { WebAuthnErrorDetails } from '../../../interfaces/common';
import type { MfaWebAuthnPlatformChallengeMembers, ScreenMembersOnMfaWebAuthnPlatformChallenge as ScreenOptions, VerifyPlatformAuthenticatorOptions, ReportBrowserErrorOptions, TryAnotherMethodOptions } from '../../../interfaces/screens/mfa-webauthn-platform-challenge';
import type { PasskeyCredentialResponse } from '../../../interfaces/utils/passkeys';
/**
 * @class MfaWebAuthnPlatformChallenge
 * @extends BaseContext
 * implements MfaWebAuthnPlatformChallengeMembers
 * description Manages interactions for the MFA WebAuthn Platform Challenge screen.
 * This screen prompts the user to use their device's platform authenticator.
 * It handles the WebAuthn `navigator.credentials.get()` API call, submission of the
 * resulting credential, reporting browser-side WebAuthn errors, and an option
 * to try a different MFA method.
 */
export default class MfaWebAuthnPlatformChallenge extends BaseContext implements MfaWebAuthnPlatformChallengeMembers {
    /**
     * static
     * @property {string} screenIdentifier - The unique identifier for the 'mfa-webauthn-platform-challenge' screen.
     * Used by `BaseContext` to ensure the correct screen class is instantiated.
     */
    static screenIdentifier: string;
    /**
     * @property {ScreenOptions} screen - Holds the specific screen data and properties for this screen,
     * processed by `ScreenOverride`. This includes `publicKey` for the WebAuthn API call
     * and `showRememberDevice`.
     */
    screen: ScreenOptions;
    /**
     * Initializes a new instance of the `MfaWebAuthnPlatformChallenge` class.
     * It retrieves the necessary context (screen, transaction, etc.) from the global `universal_login_context`.
     * @throws {Error} If the Universal Login Context is not available or if the screen name
     * in the context does not match `MfaWebAuthnPlatformChallenge.screenIdentifier`.
     */
    constructor();
    /**
     * Initiates the WebAuthn platform authenticator challenge.
     * Internally, this method retrieves the challenge options from `this.screen.publicKey`,
     * calls `navigator.credentials.get()` (via the `getPasskeyCredentials` utility),
     * and then submits the resulting credential assertion to the Auth0 server.
     *
     * @param {VerifyPlatformAuthenticatorOptions} [options] - Optional parameters for the verification.
     * This can include `rememberDevice` if `this.screen.showRememberDevice` is true,
     * and any other custom key-value pairs to be sent in the form submission.
     * @returns {Promise<void>} A promise that resolves when the credential submission is initiated.
     * A successful operation typically results in a server-side redirect.
     * @throws {Error} Throws an error if `this.screen.publicKey` is not available (indicating missing challenge options),
     * if `getPasskeyCredentials` (and thus `navigator.credentials.get()`) fails (e.g., user cancellation,
     * no authenticator found, hardware error), or if the final form submission to Auth0 fails.
     * It's crucial to catch errors from this method. WebAuthn API errors (like `NotAllowedError`)
     * should ideally be reported using `this.reportBrowserError()`.
     */
    verify(options?: VerifyPlatformAuthenticatorOptions): Promise<void>;
    /**
     * Reports a browser-side error encountered during the WebAuthn `navigator.credentials.get()` operation.
     * This method should be called when `verify()` fails due to a WebAuthn API error (e.g., user cancellation).
     * It sends the error details to the server with a specific action format.
     *
     * @param {ReportBrowserErrorOptions} options - Contains the `error` object (with `name` and `message`
     * properties from the browser's WebAuthn API DOMException) and any other custom options.
     * The `error` object will be JSON stringified and embedded in the `action` parameter.
     * @returns {Promise<void>} A promise that resolves when the error report is successfully submitted.
     * @throws {Error} Throws an error if the form submission fails (e.g., network issue, invalid state).
     */
    reportBrowserError(options: ReportBrowserErrorOptions): Promise<void>;
    /**
     * Allows the user to opt-out of the WebAuthn platform challenge and select a different MFA method.
     * This action submits `action: "pick-authenticator"` to Auth0, which should navigate
     * the user to an MFA factor selection screen.
     *
     * @param {TryAnotherMethodOptions} [options] - Optional. Any custom parameters to be sent with the request.
     * @returns {Promise<void>} A promise that resolves when the 'pick-authenticator' action is submitted.
     * @throws {Error} Throws an error if the form submission fails (e.g., network error, invalid state).
     */
    tryAnotherMethod(options?: TryAnotherMethodOptions): Promise<void>;
}
export { MfaWebAuthnPlatformChallengeMembers, ScreenOptions as ScreenMembersOnMfaWebAuthnPlatformChallenge, VerifyPlatformAuthenticatorOptions, ReportBrowserErrorOptions, TryAnotherMethodOptions, WebAuthnErrorDetails, // Re-export for convenience
PasskeyCredentialResponse, };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map