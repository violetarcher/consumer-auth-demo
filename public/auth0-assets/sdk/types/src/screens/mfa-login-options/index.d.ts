import { type MfaLoginFactorType } from '../../constants';
import { BaseContext } from '../../models/base-context';
import type { MfaLoginOptionsMembers, LoginEnrollOptions, ScreenMembersOnMfaLoginOptions } from '../../../interfaces/screens/mfa-login-options';
/**
 * Class implementing the mfa-login-options screen functionality
 * This screen allows users to select which MFA factor they want to use for login
 */
export default class MfaLoginOptions extends BaseContext implements MfaLoginOptionsMembers {
    static screenIdentifier: string;
    /**
     * Creates an instance of MfaLoginOptions screen manager
     */
    constructor();
    /**
     * Continues the login process with the selected MFA factor
     * @param payload The options containing the selected factor
     * @example
     * ```typescript
     * const mfaLoginOptions = new MfaLoginOptions();
     * await mfaLoginOptions.enroll({
     *   action: 'push-notification'
     * });
     * ```
     */
    enroll(payload: LoginEnrollOptions): Promise<void>;
}
export { MfaLoginOptionsMembers, LoginEnrollOptions, MfaLoginFactorType, ScreenMembersOnMfaLoginOptions };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map