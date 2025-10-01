import { BaseContext } from '../../models/base-context';
import type { CustomOptions } from '../../../interfaces/common';
import type { MfaVoiceChallengeMembers, ScreenMembersOnMfaVoiceChallenge as ScreenOptions, MfaVoiceChallengeContinueOptions, UntrustedDataMembersOnMfaVoiceChallenge as UntrustedDataOptions } from '../../../interfaces/screens/mfa-voice-challenge';
/**
 * MFA Voice Challenge screen implementation.
 *
 * This screen is displayed when a user needs to verify their identity using a voice call
 * as part of a multi-factor authentication flow.
 */
export default class MfaVoiceChallenge extends BaseContext implements MfaVoiceChallengeMembers {
    /**
     * Screen-specific properties and data.
     */
    screen: ScreenOptions;
    untrustedData: UntrustedDataOptions;
    /**
     * Creates an instance of MfaVoiceChallenge.
     */
    constructor();
    /**
     * Submits the voice verification code to validate the MFA challenge.
     *
     * @param payload - Object containing the verification code and optional parameters
     * @returns Promise that resolves when the code is successfully validated
     *
     * @example
     * ```typescript
     * const mfaVoiceChallenge = new MfaVoiceChallenge();
     * mfaVoiceChallenge.continue({
     *   code: '123456',
     *   rememberDevice: true
     * });
     * ```
     */
    continue(payload: MfaVoiceChallengeContinueOptions): Promise<void>;
    /**
     * Navigates to the screen for selecting a different phone number.
     *
     * @param payload - Optional custom parameters
     * @returns Promise that resolves when navigation is complete
     *
     * @example
     * ```typescript
     * const mfaVoiceChallenge = new MfaVoiceChallenge();
     * mfaVoiceChallenge.pickPhone();
     * ```
     */
    pickPhone(payload?: CustomOptions): Promise<void>;
    /**
     * Switches to SMS verification method instead of voice call.
     *
     * @param payload - Optional custom parameters
     * @returns Promise that resolves when switching is complete
     *
     * @example
     * ```typescript
     * const mfaVoiceChallenge = new MfaVoiceChallenge();
     * mfaVoiceChallenge.switchToSms();
     * ```
     */
    switchToSms(payload?: CustomOptions): Promise<void>;
    /**
     * Requests a new voice call with a verification code.
     *
     * @param payload - Optional custom parameters
     * @returns Promise that resolves when the new code is sent
     *
     * @example
     * ```typescript
     * const mfaVoiceChallenge = new MfaVoiceChallenge();
     * mfaVoiceChallenge.resendCode();
     * ```
     */
    resendCode(payload?: CustomOptions): Promise<void>;
    /**
     * Navigates to the screen for selecting an alternative MFA method.
     *
     * @param payload - Optional custom parameters
     * @returns Promise that resolves when navigation is complete
     *
     * @example
     * ```typescript
     * const mfaVoiceChallenge = new MfaVoiceChallenge();
     * mfaVoiceChallenge.tryAnotherMethod();
     * ```
     */
    tryAnotherMethod(payload?: CustomOptions): Promise<void>;
}
export { MfaVoiceChallengeMembers, ScreenOptions as ScreenMembersOnMfaVoiceChallenge, MfaVoiceChallengeContinueOptions, UntrustedDataOptions as UntrustedDataMembersOnMfaVoiceChallenge, };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map