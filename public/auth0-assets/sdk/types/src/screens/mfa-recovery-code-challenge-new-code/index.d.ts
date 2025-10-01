import { BaseContext } from '../../models/base-context';
import type { ContinueOptions, MfaRecoveryCodeChallengeNewCodeMembers, ScreenMembersOnMfaRecoveryCodeChallengeNewCode } from '../../../interfaces/screens/mfa-recovery-code-challenge-new-code';
/**
 * @class MfaRecoveryCodeChallengeNewCode
 * @extends BaseContext
 * implements MfaRecoveryCodeChallengeNewCodeMembers
 * description Manages the interactions and state for the 'mfa-recovery-code-challenge-new-code' screen.
 * This screen is crucial for ensuring the user securely stores their new recovery code after MFA enrollment.
 */
export default class MfaRecoveryCodeChallengeNewCode extends BaseContext implements MfaRecoveryCodeChallengeNewCodeMembers {
    /**
     * The unique identifier for this screen, used internally and for telemetry.
     * @type {string}
     */
    static screenIdentifier: string;
    /**
     * Holds the specific screen data and properties, processed by ScreenOverride.
     * @type {ScreenMembersOnMfaRecoveryCodeChallengeNewCode}
     */
    screen: ScreenMembersOnMfaRecoveryCodeChallengeNewCode;
    /**
     * Initializes a new instance of the `MfaRecoveryCodeChallengeNewCode` class.
     * It retrieves the necessary context (screen, transaction, etc.) and sets up screen-specific properties.
     * @throws {Error} If the Universal Login Context is not available or if the screen name doesn't match.
     */
    constructor();
    /**
     * Confirms that the user has saved the new recovery code and continues the authentication flow.
     * This method sends a POST request to the `/u/mfa-recovery-code-challenge-new-code` endpoint
     * with the required `state`, `action`, and `saved` parameters.
     *
     * @param {ContinueOptions} [payload] - Optional custom data to include with the request form body.
     * @returns {Promise<void>} A promise that resolves when the confirmation is successfully submitted.
     *                          On success, the browser will typically be redirected to the next step.
     * @throws {Error} Throws an error if the form submission fails (e.g., network issue, invalid state,
     *                 or if the server responds with a 400 error like 'no-confirmation').
     * @example
     * ```typescript
     * const screenManager = new MfaRecoveryCodeChallengeNewCode();
     * // Assuming a checkbox 'confirmSaved' is checked by the user
     * if (confirmSaved) {
     *   try {
     *     await screenManager.continue({ customData: 'optionalValue' });
     *   } catch (err) {
     *     // Handle errors, potentially check screenManager.transaction.errors
     *     console.error("Confirmation failed:", err);
     *   }
     * } else {
     *   // Prompt user to confirm saving the code
     * }
     * ```
     */
    continue(payload?: ContinueOptions): Promise<void>;
}
export { MfaRecoveryCodeChallengeNewCodeMembers, ContinueOptions, ScreenMembersOnMfaRecoveryCodeChallengeNewCode, };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map