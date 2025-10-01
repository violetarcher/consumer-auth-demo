import { BaseContext } from '../../models/base-context';
import type { MfaOtpEnrollmentCodeMembers, ContinueOptions, TryAnotherMethodOptions, ScreenMembersOnMfaOtpEnrollmentCode as ScreenOptions } from '../../../interfaces/screens/mfa-otp-enrollment-code';
/**
 * Class implementing the mfa-otp-enrollment-code screen functionality.
 * This screen is displayed when the user needs to enter the OTP code received during MFA enrollment.
 */
export default class MfaOtpEnrollmentCode extends BaseContext implements MfaOtpEnrollmentCodeMembers {
    /**
     * The screen properties for the mfa-otp-enrollment-code screen.
     */
    screen: ScreenOptions;
    /**
     * Creates an instance of MfaOtpEnrollmentCode.
     */
    constructor();
    /**
     * Continues the MFA OTP enrollment process by submitting the OTP code.
     *
     * @param {ContinueOptions} payload - The options containing the OTP code.
     * @returns {Promise<void>}
     * @example
     * ```typescript
     * import MfaOtpEnrollmentCode from '@auth0/auth0-acul-js/mfa-otp-enrollment-code';
     *
     * const mfaOtpEnrollmentCode = new MfaOtpEnrollmentCode();
     * await mfaOtpEnrollmentCode.continue({
     *   code: '123456',
     * });
     * ```
     */
    continue(payload: ContinueOptions): Promise<void>;
    /**
     * Allows the user to try another MFA method.
     *
     * @param {TryAnotherMethodOptions} [payload] - Optional payload.
     * @returns {Promise<void>}
     * @example
     * ```typescript
     * import MfaOtpEnrollmentCode from '@auth0/auth0-acul-js/mfa-otp-enrollment-code';
     *
     * const mfaOtpEnrollmentCode = new MfaOtpEnrollmentCode();
     * await mfaOtpEnrollmentCode.tryAnotherMethod();
     * ```
     */
    tryAnotherMethod(payload?: TryAnotherMethodOptions): Promise<void>;
}
export { MfaOtpEnrollmentCodeMembers, ContinueOptions, TryAnotherMethodOptions, ScreenOptions as ScreenMembersOnMfaOtpEnrollmentCode };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map