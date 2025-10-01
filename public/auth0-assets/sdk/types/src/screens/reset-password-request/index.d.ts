import { BaseContext } from '../../models/base-context';
import type { CustomOptions } from '../../../interfaces/common';
import type { ResetPasswordRequestOptions, ResetPasswordRequestMembers, ScreenMembersOnResetPasswordRequest as ScreenOptions, TransactionMembersOnResetPasswordRequest as TransactionOptions } from '../../../interfaces/screens/reset-password-request';
export default class ResetPasswordRequest extends BaseContext implements ResetPasswordRequestMembers {
    static screenIdentifier: string;
    screen: ScreenOptions;
    transaction: TransactionOptions;
    constructor();
    /**
     * @example
     * import ResetPasswordRequest from '@auth0/auth0-acul-js/reset-password-request';
     *
     * const resetPasswordRequest = new ResetPasswordRequest();
     * resetPasswordRequest.resetPassword({ username: 'testuser' });
     */
    resetPassword(payload: ResetPasswordRequestOptions): Promise<void>;
    /**
     * @example
     * import ResetPasswordRequest from '@auth0/auth0-acul-js/reset-password-request';
     *
     * const resetPasswordRequest = new ResetPasswordRequest();
     * resetPasswordRequest.backToLogin();
     */
    backToLogin(payload?: CustomOptions): Promise<void>;
}
export { ResetPasswordRequestMembers, ResetPasswordRequestOptions, ScreenOptions as ScreenMembersOnResetPasswordRequest, TransactionOptions as TransactionMembersOnResetPasswordRequest, };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map