import { BaseContext } from '../../models/base-context';
import type { CustomOptions } from '../../../interfaces/common';
import type { MfaEmailChallengeMembers, ContinueOptions, ResendCodeOptions, TryAnotherMethodOptions, ScreenMembersOnMfaEmailChallenge as ScreenOptions, UntrustedDataMembersOnMfaEmailChallenge as UntrustedDataOptions } from '../../../interfaces/screens/mfa-email-challenge';
/**
 * Class implementing the mfa-email-challenge screen functionality
 * This screen is shown when a user needs to verify their email during MFA
 */
export default class MfaEmailChallenge extends BaseContext implements MfaEmailChallengeMembers {
    static screenIdentifier: string;
    screen: ScreenOptions;
    untrustedData: UntrustedDataOptions;
    /**
     * Creates an instance of MfaEmailChallenge screen manager
     */
    constructor();
    /**
     * Continues with the email challenge using the provided code
     * @param payload The options containing the code and rememberDevice flag
     * @example
     * ```typescript
     * import MfaEmailChallenge from '@auth0/auth0-acul-js/mfa-email-challenge';
     *
     * const mfaEmailChallenge = new MfaEmailChallenge();
     * await mfaEmailChallenge.continue({
     *   code: '123456',
     *   rememberDevice: true
     * });
     * ```
     */
    continue(payload: ContinueOptions): Promise<void>;
    /**
     * Resends the email code
     * @param payload Optional custom options to include with the request
     * @example
     * ```typescript
     * import MfaEmailChallenge from '@auth0/auth0-acul-js/mfa-email-challenge';
     *
     * const mfaEmailChallenge = new MfaEmailChallenge();
     * await mfaEmailChallenge.resendCode();
     * ```
     */
    resendCode(payload?: ResendCodeOptions): Promise<void>;
    /**
     * Allows the user to try another MFA method
     * @param payload Optional custom options to include with the request
     * @example
     * ```typescript
     * import MfaEmailChallenge from '@auth0/auth0-acul-js/mfa-email-challenge';
     *
     * const mfaEmailChallenge = new MfaEmailChallenge();
     * await mfaEmailChallenge.tryAnotherMethod();
     * ```
     */
    tryAnotherMethod(payload?: TryAnotherMethodOptions): Promise<void>;
    /**
     * Submits the action to pick a different Email configuration, if available.
     * @param {CustomOptions} [payload] - Optional payload.
     * @returns {Promise<void>}
     * @example
     * ```typescript
     * import MfaEmailChallenge from '@auth0/auth0-acul-js/mfa-email-challenge';
     *
     * const mfaEmailChallenge = new MfaEmailChallenge();
     * await mfaEmailChallenge.pickEmail();
     * ```
     */
    pickEmail(payload?: CustomOptions): Promise<void>;
}
export { MfaEmailChallengeMembers, ContinueOptions, ResendCodeOptions, TryAnotherMethodOptions, ScreenOptions as ScreenMembersOnMfaEmailChallenge, UntrustedDataOptions as UntrustedDataMembersOnMfaEmailChallenge, };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map