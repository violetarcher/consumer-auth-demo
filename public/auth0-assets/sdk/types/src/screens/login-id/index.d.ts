import { BaseContext } from '../../models/base-context';
import type { CustomOptions } from '../../../interfaces/common';
import type { ScreenMembersOnLoginId as ScreenOptions, TransactionMembersOnLoginId as TransactionOptions, LoginIdMembers, LoginOptions, FederatedLoginOptions } from '../../../interfaces/screens/login-id';
export default class LoginId extends BaseContext implements LoginIdMembers {
    static screenIdentifier: string;
    screen: ScreenOptions;
    transaction: TransactionOptions;
    /**
     * Creates an instance of LoginIdManager.
     */
    constructor();
    /**
     * @example
     *
     * import LoginId from "@auth0/auth0-acul-js/login-id";
     *
     * const loginIdManager = new LoginId();
     *
     * loginIdManager.login({
     *   username: <usernameFieldValue>
     * });
     */
    login(payload: LoginOptions): Promise<void>;
    /**
     * @example
     * import LoginId from "@auth0/auth0-acul-js/login-id";
     * const loginIdManager = new LoginId();
     *
     * // Check if alternateConnections is available and has at least one item
     * if (!loginIdManager.transaction.alternateConnections) {
     *   console.error('No alternate connections available.');
     * }
     *
     * // Select the first available connection (users can select any available connection)
     * const selectedConnection = alternateConnections[0];
     *
     * // Log the chosen connection for debugging or informational purposes
     * console.log(`Selected connection: ${selectedConnection.name}`);
     *
     * // Proceed with federated login using the selected connection
     * loginIdManager.federatedLogin({
     *   connection: selectedConnection.name,
     * });
     */
    federatedLogin(payload: FederatedLoginOptions): Promise<void>;
    /**
     * @example
     * import LoginId from "@auth0/auth0-acul-js/login-id";
     * const loginIdManager = new LoginId();
     *
     * // It internally maps users available passkey config provided from auth0 server
     * loginIdManager.passkeyLogin();
     */
    passkeyLogin(payload?: CustomOptions): Promise<void>;
    /**
     * @example
     * import LoginId from "@auth0/auth0-acul-js/login-id";
     * const loginIdManager = new LoginId();
     *
     * loginIdManager.pickCountryCode();
     */
    pickCountryCode(payload?: CustomOptions): Promise<void>;
}
export { LoginIdMembers, LoginOptions, FederatedLoginOptions, ScreenOptions as ScreenMembersOnLoginId, TransactionOptions as TransactionMembersOnLoginId, };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map