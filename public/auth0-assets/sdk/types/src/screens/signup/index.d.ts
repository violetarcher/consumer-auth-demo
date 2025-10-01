import { BaseContext } from '../../models/base-context';
import type { SignupMembers, ScreenMembersOnSignup as ScreenOptions, SignupOptions, FederatedSignupOptions, TransactionMembersOnSignup as TransactionOptions } from '../../../interfaces/screens/signup';
export default class Signup extends BaseContext implements SignupMembers {
    static screenIdentifier: string;
    screen: ScreenOptions;
    transaction: TransactionOptions;
    constructor();
    /**
     * @remarks
     * This method handles the submission of the signup form.
     *
     * @example
     * ```typescript
     * import Signup from '@auth0/auth0-acul-js/signup';
     *
     * const signupManager = new Signup();
     *
     * signupManager.signup({
     *  email: 'test@example.com',
     *  password: 'P@$$wOrd123!',
     * });
     * ```
     */
    signup(payload: SignupOptions): Promise<void>;
    /**
     * Handles the submission of the social signup form.
     *
     * @remarks
     * This method is similar to the {@link signup} method but is used for social signups.
     *
     * @param payload - The payload containing the social signup options.
     *
     * @example
     * ```typescript
     * import Signup from '@auth0/auth0-acul-js/signup';
     *
     * const signupManager = new Signup();
     *
     * signupManager.federatedSignup({
     *  connection: 'google-oauth2'
     * });
     * ```
     */
    federatedSignup(payload: FederatedSignupOptions): Promise<void>;
    /**
     * @example
     * import Signup from "@auth0/auth0-acul-js/signup";
     * const signupManager = new Signup();
     *
     * signupManager.pickCountryCode();
     */
    pickCountryCode(): Promise<void>;
}
export { SignupMembers, SignupOptions, ScreenOptions as ScreenMembersOnSignup, TransactionOptions as TransactionMembersOnSignup, FederatedSignupOptions };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map