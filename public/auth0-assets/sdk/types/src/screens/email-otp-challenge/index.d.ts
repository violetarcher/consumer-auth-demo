import { BaseContext } from '../../models/base-context';
import type { CustomOptions } from '../../../interfaces/common';
import type { EmailOTPChallengeMembers, OtpCodeOptions, ScreenMembersOnEmailOTPChallenge as ScreenOptions } from '../../../interfaces/screens/email-otp-challenge';
/**
 * Represents the Email OTP Challenge screen.
 */
export default class EmailOTPChallenge extends BaseContext implements EmailOTPChallengeMembers {
    static screenIdentifier: string;
    constructor();
    /**
     * Submits the OTP code entered by the user.
     * @param options Optional parameters to include in the submission.
     * @example
     * ```typescript
     * import EmailOTPChallenge from '@auth0/auth0-acul-js/email-otp-challenge';
     *
     * const emailOTPChallenge = new EmailOTPChallenge();
     * emailOTPChallenge.submitCode({
     *   code: '123456',
     * });
     * ```
     */
    submitCode(options: OtpCodeOptions): Promise<void>;
    /**
     * Requests a new OTP code to be sent to the user's email.
     * @param options Optional parameters to include in the resend request.
     * @example
     * ```typescript
     * import EmailOTPChallenge from '@auth0/auth0-acul-js/email-otp-challenge';
     *
     * const emailOTPChallenge = new EmailOTPChallenge();
     * emailOTPChallenge.resendCode();
     * ```
     */
    resendCode(options?: CustomOptions): Promise<void>;
}
export { EmailOTPChallengeMembers, ScreenOptions as ScreenMembersOnEmailOTPChallenge };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map