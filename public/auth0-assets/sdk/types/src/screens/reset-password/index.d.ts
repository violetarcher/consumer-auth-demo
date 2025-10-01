import { BaseContext } from '../../models/base-context';
import type { ResetPasswordOptions, ResetPasswordMembers, ScreenMembersOnResetPassword as ScreenOptions } from '../../../interfaces/screens/reset-password';
export default class ResetPassword extends BaseContext implements ResetPasswordMembers {
    static screenIdentifier: string;
    screen: ScreenOptions;
    constructor();
    /**
     * @example
     * import ResetPassword from '@auth0/auth0-acul-js/reset-password';
     *
     * const resetPassword = new ResetPassword();
     * resetPassword.resetPassword({
     *    'password-reset': 'Test@123!',
     *    're-enter-password': 'Test@123!',
     * });
     */
    resetPassword(payload: ResetPasswordOptions): Promise<void>;
}
export { ResetPasswordMembers, ResetPasswordOptions, ScreenOptions as ScreenMembersOnResetPassword };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map