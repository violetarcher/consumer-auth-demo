import { BaseContext } from '../../models/base-context';
import type { CustomOptions } from '../../../interfaces/common';
import type { ResetPasswordMfaSmsChallengeMembers, MfaSmsChallengeOptions, ScreenMembersOnResetPasswordMfaSmsChallenge as ScreenOptions } from '../../../interfaces/screens/reset-password-mfa-sms-challenge';
/**
 * This class provides methods to handle the reset-password-mfa-sms-challenge screen.
 * @extends BaseContext
 */
export default class ResetPasswordMfaSmsChallenge extends BaseContext implements ResetPasswordMfaSmsChallengeMembers {
    static screenIdentifier: string;
    screen: ScreenOptions;
    constructor();
    /**
     * Submits the MFA SMS challenge with the provided code.
     * @param {MfaSmsChallengeOptions} payload - The payload containing the code.
     * @returns {Promise<void>}
     * @example
     * ```typescript
     * import ResetPasswordMfaSmsChallenge from '@auth0/auth0-acul-js/reset-password-mfa-sms-challenge';
     *
     * const resetPasswordMfaSmsChallenge = new ResetPasswordMfaSmsChallenge();
     * await resetPasswordMfaSmsChallenge.continueMfaSmsChallenge({
     *   code: '123456',
     * });
     * ```
     */
    continueMfaSmsChallenge(payload: MfaSmsChallengeOptions): Promise<void>;
    /**
     * Submits the action to resend the SMS code.
     * @param {CustomOptions} [payload] - Optional payload.
     * @returns {Promise<void>}
     * @example
     * ```typescript
     * import ResetPasswordMfaSmsChallenge from '@auth0/auth0-acul-js/reset-password-mfa-sms-challenge';
     *
     * const resetPasswordMfaSmsChallenge = new ResetPasswordMfaSmsChallenge();
     * await resetPasswordMfaSmsChallenge.resendCode();
     * ```
     */
    resendCode(payload?: CustomOptions): Promise<void>;
    /**
     * Submits the action to try another MFA method.
     * @param {CustomOptions} [payload] - Optional payload.
     * @returns {Promise<void>}
     * @example
     * ```typescript
     * import ResetPasswordMfaSmsChallenge from '@auth0/auth0-acul-js/reset-password-mfa-sms-challenge';
     *
     * const resetPasswordMfaSmsChallenge = new ResetPasswordMfaSmsChallenge();
     * await resetPasswordMfaSmsChallenge.tryAnotherMethod();
     * ```
     */
    tryAnotherMethod(payload?: CustomOptions): Promise<void>;
    /**
     * Submits the action to switch to voice call verification.
     * @param {CustomOptions} [payload] - Optional payload.
     * @returns {Promise<void>}
     * @example
     * ```typescript
     * import ResetPasswordMfaSmsChallenge from '@auth0/auth0-acul-js/reset-password-mfa-sms-challenge';
     *
     * const resetPasswordMfaSmsChallenge = new ResetPasswordMfaSmsChallenge();
     * await resetPasswordMfaSmsChallenge.getACall();
     * ```
     */
    getACall(payload?: CustomOptions): Promise<void>;
}
export { ResetPasswordMfaSmsChallengeMembers, MfaSmsChallengeOptions, ScreenOptions as ScreenMembersOnResetPasswordMfaSmsChallenge };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map