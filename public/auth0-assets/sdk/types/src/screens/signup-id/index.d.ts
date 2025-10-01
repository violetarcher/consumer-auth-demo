import { BaseContext } from '../../models/base-context';
import type { SignupIdMembers, ScreenMembersOnSignupId as ScreenOptions, TransactionMembersOnSignupId as TransactionOptions, SignupOptions, FederatedSignupOptions } from '../../../interfaces/screens/signup-id';
export default class SignupId extends BaseContext implements SignupIdMembers {
    static screenIdentifier: string;
    screen: ScreenOptions;
    transaction: TransactionOptions;
    constructor();
    /**
     * @remarks
     * This methods handles signup-id related configuration.
     * It allows to signup new users via different identifiers.
     *
     * @example
     * import SignupId from "@auth0/auth0-acul-js/signup-id";
     *
     * const signupIdManager = new SignupId();
     * const { transaction } = signupIdManager;
     *
     * //get mandatory & optional identifiers required for signup
     * const mandatoryIdentifier = transaction.getRequiredIdentifiers(); // eg: email
     * const optionalIdentifiers = transaction.getOptionalIdentifiers() // eg: phone
     *
     * const signupParams = {
     *  email : "testEmail",
     *  phone : "+91923456789"
     * };
     *
     * signupIdManager.signup(signupParams);
     */
    signup(payload: SignupOptions): Promise<void>;
    /**
     * @remarks
     * This methods handles allows signup via different social identifiers.
     * Eg: Google, Facebook etc.
     *
     * @example
     * import SignupId from "@auth0/auth0-acul-js/signup-id";
     *
     * const signupIdManager = new SignupId();
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
export { SignupIdMembers, SignupOptions, FederatedSignupOptions, ScreenOptions as ScreenMembersOnSignupId, TransactionOptions as TransactionMembersOnSignupId, };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map