import { BaseContext } from '../../models/base-context';
import type { ScreenMembersOnLogin as ScreenOptions, LoginOptions, LoginMembers, TransactionMembersOnLogin as TransactionOptions, FederatedLoginOptions } from '../../../interfaces/screens/login';
/**
 * Login screen implementation class
 */
export default class Login extends BaseContext implements LoginMembers {
    static screenIdentifier: string;
    screen: ScreenOptions;
    transaction: TransactionOptions;
    /**
     * Creates an instance of Login screen manager
     */
    constructor();
    /**
     * Performs login with username/password
     * @param payload The login options containing username and password
     * @example
     * ```typescript
     * import Login from "@auth0/auth0-acul-js/login";
     * const loginManager = new Login();
     * loginManager.login({
     *   username: "testUser",
     *   password: "testPassword"
     * });
     * ```
     */
    login(payload: LoginOptions): Promise<void>;
    /**
     * Performs login with social provider
     * @param payload The social login options containing connection name
     * @example
     * ```typescript
     * import Login from "@auth0/auth0-acul-js/login";
     * const loginManager = new Login();
     * loginManager.federatedLogin({
     *   connection: "google-oauth2"
     * });
     * ```
     */
    federatedLogin(payload: FederatedLoginOptions): Promise<void>;
}
export { LoginMembers, LoginOptions, FederatedLoginOptions, ScreenOptions as ScreenMembersOnLogin, TransactionOptions as TransactionMembersOnLogin };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map