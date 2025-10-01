import { BaseContext } from '../../models/base-context';
import type { CustomOptions } from '../../../interfaces/common';
import type { MfaOtpEnrollmentQrMembers, ScreenMembersOnMfaOtpEnrollmentQr as ScreenOptions, ContinueOptions } from '../../../interfaces/screens/mfa-otp-enrollment-qr';
/**
 * Class implementing the mfa-otp-enrollment-qr screen functionality
 */
export default class MfaOtpEnrollmentQr extends BaseContext implements MfaOtpEnrollmentQrMembers {
    screen: ScreenOptions;
    /**
     * Creates an instance of MfaOtpEnrollmentQr screen manager
     */
    constructor();
    /**
     * Navigates to the authenticator selection screen.
     * @param {object} payload - An object containing any custom options.
     * @returns {Promise<void>} A promise that resolves when the action is successfully submitted.
     *
     *
     * @example
     * ```typescript
     * import MfaOtpEnrollmentQr from '@auth0/auth0-acul-js/mfa-otp-enrollment-qr';
     *
     * const mfaOtpEnrollmentQr = new MfaOtpEnrollmentQr();
     * await mfaOtpEnrollmentQr.toggleView();
     * ```
     */
    toggleView(payload?: CustomOptions): Promise<void>;
    /**
    * Continues with the default action.
    *
    * @param {ContinueOptions} payload - Payload including the OTP code and optional custom options.
    * @returns {Promise<void>}
    * @example
    * ```typescript
    * import MfaOtpEnrollmentQr from '@auth0/auth0-acul-js/mfa-otp-enrollment-qr';
    *
    * const mfaOtpEnrollmentQr = new MfaOtpEnrollmentQr();
    * await mfaOtpEnrollmentQr.continue({ code: '123456' });
    * ```
    */
    continue(payload: ContinueOptions): Promise<void>;
    /**
     * Navigates to the authenticator selection screen.
     * @param payload Optional custom options to include with the request
     * @example
     * ```typescript
     * import MfaOtpEnrollmentQr from '@auth0/auth0-acul-js/mfa-otp-enrollment-qr';
     *
     * const mfaOtpEnrollmentQr = new MfaOtpEnrollmentQr();
     * await mfaOtpEnrollmentQr.tryAnotherMethod();
     * ```
     */
    tryAnotherMethod(payload?: CustomOptions): Promise<void>;
}
export { MfaOtpEnrollmentQrMembers, ScreenOptions as ScreenMembersOnMfaOtpEnrollmentQr, ContinueOptions };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map