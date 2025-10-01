import { BaseContext } from '../../models/base-context';
import type { CustomOptions } from '../../../interfaces/common';
import type { LoginPasswordlessEmailCodeMembers, ScreenMembersOnLoginPasswordlessEmailCode as ScreenOptions, TransactionMembersOnLoginPasswordlessEmailCode as TransactionOptions, SubmitCodeOptions } from '../../../interfaces/screens/login-passwordless-email-code';
export default class LoginPasswordlessEmailCode extends BaseContext implements LoginPasswordlessEmailCodeMembers {
    static screenIdentifier: string;
    screen: ScreenOptions;
    transaction: TransactionOptions;
    constructor();
    /**
     * @example
     * //Creates an instance of LoginPasswordlessEmailCode and calls the method with sample data.
     * import LoginPasswordlessEmailCode from '@auth0/auth0-acul-js/login-passwordless-email-code';
     *
     * //Method to continue the login process using email and code.
     * const loginPasswordlessEmailCode = new LoginPasswordlessEmailCode();
     * loginPasswordlessEmailCode.submitCode({
     *  email: "test@domain.com";
     *  code: "<string>";
     * });
     */
    submitCode(payload: SubmitCodeOptions): Promise<void>;
    /**
     * @example
     * import LoginPasswordlessEmailCode from '@auth0/auth0-acul-js/login-passwordless-email-code';
     *
     * const loginPasswordlessEmailCode = new LoginPasswordlessEmailCode();
     * loginPasswordlessEmailCode.resendCode();
     */
    resendCode(payload?: CustomOptions): Promise<void>;
}
export { LoginPasswordlessEmailCodeMembers, SubmitCodeOptions, ScreenOptions as ScreenMembersOnLoginPasswordlessEmailCode, TransactionOptions as TransactionMembersOnLoginPasswordlessEmailCode, };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map