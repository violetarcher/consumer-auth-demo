import { BaseContext } from '../../models/base-context';
import type { CustomOptions } from '../../../interfaces/common';
import type { ScreenMembersOnLoginPasswordlessSmsOtp as ScreenOptions, TransactionMembersOnLoginPasswordlessSmsOtp as TransactionOptions, LoginPasswordlessSmsOtpMembers, SubmitOTPOptions } from '../../../interfaces/screens/login-passwordless-sms-otp';
export default class LoginPasswordlessSmsOtp extends BaseContext implements LoginPasswordlessSmsOtpMembers {
    static screenIdentifier: string;
    screen: ScreenOptions;
    transaction: TransactionOptions;
    constructor();
    /**
     * @example
     * import LoginPasswordlessSmsOtp from '@auth0/auth0-acul-js/login-passwordless-sms-otp';
     * const loginPasswordlessSmsOtp = new LoginPasswordlessSmsOtp();
     *
     * loginPasswordlessSmsOtp.submitOTP({
     *     username: "test@domain.com";
     *     code: "<string>";
     * });
     */
    submitOTP(payload: SubmitOTPOptions): Promise<void>;
    /**
     * @example
     * import LoginPasswordlessSmsOtp from '@auth0/auth0-acul-js/login-passwordless-sms-otp';
     *
     * const loginPasswordlessSmsOtp = new LoginPasswordlessSmsOtp();
     * loginPasswordlessSmsOtp.resendOTP();
     */
    resendOTP(payload?: CustomOptions): Promise<void>;
}
export { LoginPasswordlessSmsOtpMembers, SubmitOTPOptions, ScreenOptions as ScreenMembersOnLoginPasswordlessSmsOtp, TransactionOptions as TransactionMembersOnLoginPasswordlessSmsOtp, };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map