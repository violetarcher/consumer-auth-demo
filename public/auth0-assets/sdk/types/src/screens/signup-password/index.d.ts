import { BaseContext } from '../../models/base-context';
import type { SignupPasswordMembers, ScreenMembersOnSignupPassword as ScreenOptions, TransactionMembersOnSignupPassword as TransactionOptions, SignupPasswordOptions, FederatedSignupOptions } from '../../../interfaces/screens/signup-password';
export default class SignupPassword extends BaseContext implements SignupPasswordMembers {
    static screenIdentifier: string;
    screen: ScreenOptions;
    transaction: TransactionOptions;
    constructor();
    /**
     * @remarks
     * This methods handles signup-password related screen configuration.
     * It allows to proceed with registering signup password along with signup identifiers passed in previous screen
     *
     * @example
     * import SignupPassword from "@auth0/auth0-acul-js/signup-password";
     *
     * const signupPasswordManager = new SignupPassword();
     * const { transaction, screen } = signupPasswordManager;
     *
     * //get mandatory & optional identifiers required for signup-password screen to proceed
     * const mandatoryIdentifier = transaction.getRequiredIdentifiers(); //eg: email
     * const optionalIdentifiers = transaction.getOptionalIdentifiers() //eg: phone
     *
     * //get signup data submitted on previous screen from previous screen
     * const data = transaction.screen.getScreenData(); //eg: email, phone
     *
     *
     * const signupParams = {
     *  email : data.email,
     *  password: "******"
     * };
     *
     * signupPasswordManager.signup(signupParams);
     */
    signup(payload: SignupPasswordOptions): Promise<void>;
    /**
       * @remarks
       * This methods handles allows signup via different social identifiers.
       * Eg: Google, Facebook etc.
       *
       * @example
       * import SignupPassword from "@auth0/auth0-acul-js/signup-id";
       *
       * const signupIdManager = new SignupPassword();
       * const { transaction } = signupIdManager;
       *
       * //get social connections
       * const socialConnection = transaction.getAlternateConnections(); //eg: "google-oauth2"
       *
       * const signupParams = {
       *  connection : socialConnection[0].name, // "google-oauth2"
       * };
       *
       * signupIdManager.federatedSignup(signupParams);
       */
    federatedSignup(payload: FederatedSignupOptions): Promise<void>;
}
export { SignupPasswordMembers, SignupPasswordOptions, FederatedSignupOptions, ScreenOptions as ScreenMembersOnSignupPassword, TransactionOptions as TransactionMembersOnSignupPassword, };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map