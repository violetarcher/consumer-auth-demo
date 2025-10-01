import { BaseContext } from '../../models/base-context';
import type { CustomOptions } from '../../../interfaces/common';
import type { MfaSmsChallengeMembers, MfaSmsChallengeOptions, ScreenMembersOnMfaSmsChallenge as ScreenOptions, UntrustedDataMembersOnMfaSmsChallenge as UntrustedDataOptions } from '../../../interfaces/screens/mfa-sms-challenge';
/**
 * This class provides methods to handle the mfa-sms-challenge screen.
 * @extends BaseContext
 */
export default class MfaSmsChallenge extends BaseContext implements MfaSmsChallengeMembers {
    static screenIdentifier: string;
    screen: ScreenOptions;
    untrustedData: UntrustedDataOptions;
    /**
     * Creates an instance of MfaSmsChallenge screen manager
     */
    constructor();
    /**
     * Submits the MFA SMS challenge with the provided code and rememberDevice option.
     * @param {MfaSmsChallengeOptions} payload - The payload containing the code and rememberDevice option.
     * @returns {Promise<void>}
     * @example
     * ```typescript
     * import MfaSmsChallenge from '@auth0/auth0-acul-js/mfa-sms-challenge';
     *
     * const mfaSmsChallenge = new MfaSmsChallenge();
     * await mfaSmsChallenge.continueMfaSmsChallenge({
     *   code: '123456',
     *   rememberDevice: true,
     * });
     * ```
     */
    continueMfaSmsChallenge(payload: MfaSmsChallengeOptions): Promise<void>;
    /**
     * Submits the action to pick a different SMS configuration, if available.
     * @param {CustomOptions} [payload] - Optional payload.
     * @returns {Promise<void>}
     * @example
     * ```typescript
     * import MfaSmsChallenge from '@auth0/auth0-acul-js/mfa-sms-challenge';
     *
     * const mfaSmsChallenge = new MfaSmsChallenge();
     * await mfaSmsChallenge.pickSms();
     * ```
     */
    pickSms(payload?: CustomOptions): Promise<void>;
    /**
     * Submits the action to resend the SMS code.
     * @param {CustomOptions} [payload] - Optional payload.
     * @returns {Promise<void>}
     * @example
     * ```typescript
     * import MfaSmsChallenge from '@auth0/auth0-acul-js/mfa-sms-challenge';
     *
     * const mfaSmsChallenge = new MfaSmsChallenge();
     * await mfaSmsChallenge.resendCode();
     * ```
     */
    resendCode(payload?: CustomOptions): Promise<void>;
    /**
     * Submits the action to try another MFA method.
     * @param {CustomOptions} [payload] - Optional payload.
     * @returns {Promise<void>}
     * @example
     * ```typescript
     * import MfaSmsChallenge from '@auth0/auth0-acul-js/mfa-sms-challenge';
     *
     * const mfaSmsChallenge = new MfaSmsChallenge();
     * await mfaSmsChallenge.tryAnotherMethod();
     * ```
     */
    tryAnotherMethod(payload?: CustomOptions): Promise<void>;
    /**
     * Submits the action to switch to voice call verification.
     * @param {CustomOptions} [payload] - Optional payload.
     * @returns {Promise<void>}
     * @example
     * ```typescript
     * import MfaSmsChallenge from '@auth0/auth0-acul-js/mfa-sms-challenge';
     *
     * const mfaSmsChallenge = new MfaSmsChallenge();
     * await mfaSmsChallenge.getACall();
     * ```
     */
    getACall(payload?: CustomOptions): Promise<void>;
}
export { MfaSmsChallengeMembers, MfaSmsChallengeOptions, ScreenOptions as ScreenMembersOnMfaSmsChallenge, UntrustedDataOptions as UntrustedDataMembersOnMfaSmsChallenge, };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map