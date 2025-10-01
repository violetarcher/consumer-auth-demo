import { BaseContext } from '../../models/base-context';
import type { ScreenMembersOnLoginPassword as ScreenOptions, LoginPasswordOptions, LoginPasswordMembers, FederatedLoginOptions, TransactionMembersOnLoginPassword as TransactionOptions } from '../../../interfaces/screens/login-password';
export default class LoginPassword extends BaseContext implements LoginPasswordMembers {
    static screenIdentifier: string;
    screen: ScreenOptions;
    transaction: TransactionOptions;
    constructor();
    /**
     * @remarks
     * This methods handles login-password related configuration.
     *
     * @example
     * import LoginPassword from "@auth0/auth0-acul-js/login-password";
     *
     * const loginPasswordManager = new LoginPassword();
     * loginPasswordManager.login({
     *  username: "testUser",
     *  password: "******"
     * });
     */
    login(payload: LoginPasswordOptions): Promise<void>;
    /**
       * @example
       * import LoginPassword from "@auth0/auth0-acul-js/login-id";
       * const loginIdManager = new LoginPassword();
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
}
export { LoginPasswordMembers, LoginPasswordOptions, FederatedLoginOptions, ScreenOptions as ScreenMembersOnLoginPassword, TransactionOptions as TransactionMembersOnLoginPassword, };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map