import { BaseContext } from '../../models/base-context';
import type { CustomOptions } from '../../../interfaces/common';
import type { MfaPushEnrollmentQrMembers, ScreenMembersOnMfaPushEnrollmentQr as ScreenOptions } from '../../../interfaces/screens/mfa-push-enrollment-qr';
/**
 * Class implementing the mfa-push-enrollment-qr screen functionality
 */
export default class MfaPushEnrollmentQr extends BaseContext implements MfaPushEnrollmentQrMembers {
    static screenIdentifier: string;
    screen: ScreenOptions;
    constructor();
    /**
     * Navigates to the authenticator selection screen.
     * @param payload Optional custom options to include with the request
     * @example
     * ```typescript
     * import MfaPushEnrollmentQr from '@auth0/auth0-acul-js/mfa-push-enrollment-qr';
     *
     * const mfaPushEnrollmentQr = new MfaPushEnrollmentQr();
     * await mfaPushEnrollmentQr.pickAuthenticator();
     * ```
     */
    pickAuthenticator(payload?: CustomOptions): Promise<void>;
}
export { MfaPushEnrollmentQrMembers, ScreenOptions as ScreenMembersOnMfaPushEnrollmentQr };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map