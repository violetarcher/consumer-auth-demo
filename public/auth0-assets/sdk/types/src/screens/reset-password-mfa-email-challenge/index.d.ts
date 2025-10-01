import { BaseContext } from '../../models/base-context';
import type { ResetPasswordMfaEmailChallengeMembers, ScreenMembersOnResetPasswordMfaEmailChallenge as ScreenOptions, ContinueOptions, ResendCodeOptions, TryAnotherMethodOptions } from '../../../interfaces/screens/reset-password-mfa-email-challenge';
/**
 * Class implementing the reset-password-mfa-email-challenge screen functionality
 */
export default class ResetPasswordMfaEmailChallenge extends BaseContext implements ResetPasswordMfaEmailChallengeMembers {
    static screenIdentifier: string;
    screen: ScreenOptions;
    /**
     * Creates an instance of ResetPasswordMfaEmailChallenge screen manager
     */
    constructor();
    /**
     * Continues with the email challenge using the provided code.
     * @param payload The options containing the code and rememberDevice flag.
     * @example
     * ```typescript
     * import ResetPasswordMfaEmailChallenge from '@auth0/auth0-acul-js/reset-password-mfa-email-challenge';
     *
     * const resetPasswordMfaEmailChallenge = new ResetPasswordMfaEmailChallenge();
     * await resetPasswordMfaEmailChallenge.continue({
     *   code: '123456',
     * });
     * ```
     */
    continue(payload: ContinueOptions): Promise<void>;
    /**
     * Resends the email code.
     * @param payload Optional custom options to include with the request.
     * @example
     * ```typescript
     * import ResetPasswordMfaEmailChallenge from '@auth0/auth0-acul-js/reset-password-mfa-email-challenge';
     *
     * const resetPasswordMfaEmailChallenge = new ResetPasswordMfaEmailChallenge();
     * await resetPasswordMfaEmailChallenge.resendCode();
     * ```
     */
    resendCode(payload?: ResendCodeOptions): Promise<void>;
    /**
     * Allows the user to try another MFA method.
     * @param payload Optional custom options to include with the request.
     * @example
     * ```typescript
     * import ResetPasswordMfaEmailChallenge from '@auth0/auth0-acul-js/reset-password-mfa-email-challenge';
     *
     * const resetPasswordMfaEmailChallenge = new ResetPasswordMfaEmailChallenge();
     * await resetPasswordMfaEmailChallenge.tryAnotherMethod();
     * ```
     */
    tryAnotherMethod(payload?: TryAnotherMethodOptions): Promise<void>;
}
export { ResetPasswordMfaEmailChallengeMembers, ContinueOptions, ResendCodeOptions, TryAnotherMethodOptions, ScreenOptions as ScreenMembersOnResetPasswordMfaEmailChallenge, };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map