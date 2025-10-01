import { BaseContext } from '../../models/base-context';
import type { EmailVerificationResultMembers, ScreenMembersOnEmailVerificationResult as ScreenOptions } from '../../../interfaces/screens/email-verification-result';
/**
 * @class EmailVerificationResult
 * @extends BaseContext
 * implements EmailVerificationResultMembers
 * description Manages the interactions and data for the Email Verification Result screen.
 * This screen displays the outcome of an email verification process and offers a link to login.
 * It typically doesn't involve form submissions or complex operations from the user beyond navigation.
 *
 * @example
 * ```typescript
 * import EmailVerificationResult from '@auth0/auth0-acul-js/email-verification-result';
 *
 * const emailVerificationResultScreen = new EmailVerificationResult();
 *
 * // Access screen data
 * const status = emailVerificationResultScreen.screen.data?.status;
 * const loginLink = emailVerificationResultScreen.screen.loginLink;
 *
 * console.log(`Verification Status: ${status}`);
 * if (loginLink) {
 *   console.log(`Proceed to login: ${loginLink}`);
 *   // In a UI, you would use this link for a button or anchor tag
 *   // e.g., <a href={loginLink}>Go to Login</a>
 * }
 * ```
 */
export default class EmailVerificationResult extends BaseContext implements EmailVerificationResultMembers {
    /**
     * static
     * @property {string} screenIdentifier - The unique identifier for the Email Verification Result screen.
     * This identifier is used by `BaseContext` to ensure the correct screen class is instantiated.
     */
    static screenIdentifier: string;
    /**
     * @property {ScreenOptions} screen - Holds the specific screen data and properties for the
     * This includes the verification status and the login link.
     */
    screen: ScreenOptions;
    /**
     * Initializes a new instance of the `EmailVerificationResult` class.
     * It retrieves the screen-specific context and sets up the `screen` property
     * @throws {Error} If the Universal Login Context is not available or if the
     * current screen name in the context does not match `EmailVerificationResult.screenIdentifier`.
     */
    constructor();
}
export { EmailVerificationResultMembers, ScreenOptions as ScreenMembersOnEmailVerificationResult };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map