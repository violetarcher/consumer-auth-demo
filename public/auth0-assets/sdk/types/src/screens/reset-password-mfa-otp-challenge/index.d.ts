import { BaseContext } from '../../models/base-context';
import type { ResetPasswordMfaOtpChallengeMembers, ContinueOptions, TryAnotherMethodOptions } from '../../../interfaces/screens/reset-password-mfa-otp-challenge';
/**
 * Class implementing the reset-password-mfa-otp-challenge screen functionality
 */
export default class ResetPasswordMfaOtpChallenge extends BaseContext implements ResetPasswordMfaOtpChallengeMembers {
    /**
     * Creates an instance of ResetPasswordMfaOtpChallenge screen manager
     */
    constructor();
    /**
     * Continues with the OTP challenge using the provided code.
     * @param payload The options containing the code.
     * @example
     * ```typescript
     * import ResetPasswordMfaOtpChallenge from '@auth0/auth0-acul-js/reset-password-mfa-otp-challenge';
     *
     * const resetPasswordMfaOtpChallenge = new ResetPasswordMfaOtpChallenge();
     * await resetPasswordMfaOtpChallenge.continue({
     *   code: '123456',
     * });
     * ```
     */
    continue(payload: ContinueOptions): Promise<void>;
    /**
     * Allows the user to try another MFA method.
     * @param payload Optional custom options to include with the request.
     * @example
     * ```typescript
     * import ResetPasswordMfaOtpChallenge from '@auth0/auth0-acul-js/reset-password-mfa-otp-challenge';
     *
     * const resetPasswordMfaOtpChallenge = new ResetPasswordMfaOtpChallenge();
     * await resetPasswordMfaOtpChallenge.tryAnotherMethod();
     * ```
     */
    tryAnotherMethod(payload?: TryAnotherMethodOptions): Promise<void>;
}
export { ResetPasswordMfaOtpChallengeMembers, ContinueOptions, TryAnotherMethodOptions };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map