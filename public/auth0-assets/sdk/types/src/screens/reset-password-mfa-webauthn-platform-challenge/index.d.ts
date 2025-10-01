import { BaseContext } from '../../models/base-context';
import type { WebAuthnErrorDetails } from '../../../interfaces/common';
import type { ResetPasswordMfaWebAuthnPlatformChallengeMembers, ScreenMembersOnResetPasswordMfaWebAuthnPlatformChallenge as ScreenOptions, ContinueWithPasskeyOptions, ReportBrowserErrorOptions, TryAnotherMethodOptions } from '../../../interfaces/screens/reset-password-mfa-webauthn-platform-challenge';
import type { PasskeyCredentialResponse } from '../../../interfaces/utils/passkeys';
/**
 * @class ResetPasswordMfaWebAuthnPlatformChallenge
 * @extends BaseContext
 * implements ResetPasswordMfaWebAuthnPlatformChallengeMembers
 * description Manages interactions for the 'reset-password-mfa-webauthn-platform-challenge' screen.
 * This screen is part of the password reset flow and requires the user to verify their identity
 * using a WebAuthn platform authenticator (e.g., Touch ID, Windows Hello) as a second factor.
 *
 * It provides methods to:
 * - Initiate the platform authenticator verification using `navigator.credentials.get()` and submit the result (`continueWithPasskey`).
 * - Report browser-side errors encountered during the WebAuthn API interaction (`reportBrowserError`).
 * - Allow the user to choose a different MFA method (`tryAnotherMethod`).
 *
 * The SDK expects `window.universal_login_context` to be populated with the necessary data for this screen,
 * including `screen.publicKey` for the WebAuthn challenge.
 */
export default class ResetPasswordMfaWebAuthnPlatformChallenge extends BaseContext implements ResetPasswordMfaWebAuthnPlatformChallengeMembers {
    /**
     * static
     * @property {string} screenIdentifier - The unique identifier for the 'reset-password-mfa-webauthn-platform-challenge' screen.
     * This is used by the `BaseContext` to ensure the correct screen class is instantiated based on the
     * `window.universal_login_context.screen.name`.
     */
    static screenIdentifier: string;
    /**
     * @property {ScreenOptions} screen - Holds the specific screen data and properties for this screen,
     * processed by `ScreenOverride`. This includes `publicKey` (for the WebAuthn challenge)
     * and `showRememberDevice`.
     * @public
     */
    screen: ScreenOptions;
    /**
     * Initializes a new instance of the `ResetPasswordMfaWebAuthnPlatformChallenge` class.
     * It retrieves the necessary context (screen, transaction, etc.) from the global `universal_login_context`
     * and sets up screen-specific properties via `ScreenOverride`.
     * @throws {Error} If the Universal Login Context is not available or if the screen name
     * in the context does not match `ResetPasswordMfaWebAuthnPlatformChallenge.screenIdentifier`.
     */
    constructor();
    /**
     * Initiates the WebAuthn platform authenticator challenge by calling `navigator.credentials.get()`
     * using the challenge options provided in `screen.publicKey`.
     * If successful, it submits the resulting credential assertion to Auth0 with `action: "default"`.
     *
     * @param {ContinueWithPasskeyOptions} [options] - Optional parameters for the verification process,
     * such as `rememberDevice` (if `screen.showRememberDevice` is true) and other custom options.
     * @returns {Promise<void>} A promise that resolves when the verification attempt is submitted.
     *                          A successful operation typically results in a redirect.
     * @throws {Error} Throws an error if `screen.publicKey` is missing,
     *                 if `navigator.credentials.get()` fails (e.g., user cancellation `NotAllowedError`),
     *                 or if the form submission to Auth0 fails. If `navigator.credentials.get()` fails
     *                 with a `DOMException`, it's recommended to catch that error and call `reportBrowserError`.
     *
     * @example
     * ```typescript
     * // Assuming 'sdk' is an instance of ResetPasswordMfaWebAuthnPlatformChallenge
     * try {
     *   await sdk.continueWithPasskey({
     *     rememberDevice: true // if user checked the box and sdk.screen.showRememberDevice is true
     *   });
     *   // On success, Auth0 handles redirection.
     * } catch (error) {
     *   console.error("Platform authenticator verification failed:", error);
     *   // If it's a WebAuthn API error (DOMException), report it
     *   if (error instanceof DOMException && error.name && error.message) { // DOMException check
     *     await sdk.reportBrowserError({ error: { name: error.name, message: error.message } });
     *   }
     *   // Check sdk.transaction.errors for server-side validation messages if the page reloads.
     * }
     * ```
     */
    continueWithPasskey(options?: ContinueWithPasskeyOptions): Promise<void>;
    /**
     * Reports a browser-side error that occurred during the `navigator.credentials.get()` API call.
     * This is used to inform Auth0 about issues like user cancellation (`NotAllowedError`),
     * timeout, or other WebAuthn API specific errors.
     * It submits the error details with `action: "showError::{errorDetailsJsonString}"`.
     *
     * @param {ReportBrowserErrorOptions} options - An object containing:
     *   - `error`: A `WebAuthnErrorDetails` object with at least `name` and `message` properties
     *              from the `DOMException` thrown by `navigator.credentials.get()`.
     *   - Any other `CustomOptions` to be included in the form submission.
     * @returns {Promise<void>} A promise that resolves when the error report is successfully submitted.
     * @throws {Error} If the form submission fails (e.g., network error, invalid state).
     *
     * @example
     * ```typescript
     * // In your UI component, in the catch block of navigator.credentials.get():
     * // } catch (webAuthnError) {
     * //   if (webAuthnError instanceof DOMException) {
     * //     await sdk.reportBrowserError({
     * //       error: { name: webAuthnError.name, message: webAuthnError.message }
     * //     });
     * //   } else {
     * //     // Handle other types of errors
     * //   }
     * // }
     * ```
     */
    reportBrowserError(options: ReportBrowserErrorOptions): Promise<void>;
    /**
     * Allows the user to opt-out of the WebAuthn platform authenticator challenge and select
     * a different MFA method for verifying their identity during password reset.
     * This action submits `action: "pick-authenticator"` to Auth0, which should navigate
     * the user to an MFA factor selection screen.
     *
     * @param {TryAnotherMethodOptions} [options] - Optional. Any custom parameters to be sent with the request.
     *                                             These will be included in the form data.
     * @returns {Promise<void>} A promise that resolves when the 'pick-authenticator' action is submitted.
     * @throws {Error} If the form submission fails (e.g., network error, invalid state).
     *
     * @example
     * ```typescript
     * // In your UI component, when a "Try Another Method" button is clicked:
     * try {
     *   await sdk.tryAnotherMethod();
     *   // On success, Auth0 handles redirection to the MFA factor selection screen.
     * } catch (error) {
     *   console.error("Failed to switch MFA method:", error);
     * }
     * ```
     */
    tryAnotherMethod(options?: TryAnotherMethodOptions): Promise<void>;
}
export { ResetPasswordMfaWebAuthnPlatformChallengeMembers, ScreenOptions as ScreenMembersOnResetPasswordMfaWebAuthnPlatformChallenge, ContinueWithPasskeyOptions, ReportBrowserErrorOptions, TryAnotherMethodOptions, WebAuthnErrorDetails, PasskeyCredentialResponse, };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map