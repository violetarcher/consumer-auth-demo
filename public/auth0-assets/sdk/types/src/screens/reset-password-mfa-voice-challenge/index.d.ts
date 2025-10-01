import { BaseContext } from '../../models/base-context';
import type { CustomOptions } from '../../../interfaces/common';
import type { ResetPasswordMfaVoiceChallengeMembers, ScreenMembersOnResetPasswordMfaVoiceChallenge as ScreenOptions, ContinueOptions } from '../../../interfaces/screens/reset-password-mfa-voice-challenge';
/**
 * @class ResetPasswordMfaVoiceChallenge
 * @description Class implementing the reset-password-mfa-voice-challenge screen functionality
 */
/**
 * Class implementing the reset-password-mfa-voice-challenge screen functionality.
 */
export default class ResetPasswordMfaVoiceChallenge extends BaseContext implements ResetPasswordMfaVoiceChallengeMembers {
    static screenIdentifier: string;
    screen: ScreenOptions;
    /**
     * Creates an instance of ResetPasswordMfaVoiceChallenge screen manager.
     */
    constructor();
    /**
     * Continues with the voice challenge using the provided code.
     *
     * @param payload - The options containing the code.
     * @returns A promise that resolves when the challenge is submitted.
     *
     * @example
     * ```ts
     * const reset = new ResetPasswordMfaVoiceChallenge();
     * await reset.continue({ code: '123456' });
     * ```
     */
    continue(payload: ContinueOptions): Promise<void>;
    /**
     * Switches to SMS verification.
     *
     * @param payload - Optional custom options to include with the request.
     * @returns A promise that resolves when the action completes.
     */
    switchToSms(payload?: CustomOptions): Promise<void>;
    /**
     * Resends the code via voice call.
     *
     * @param payload - Optional custom options to include with the request.
     * @returns A promise that resolves when the code is resent.
     */
    resendCode(payload?: CustomOptions): Promise<void>;
    /**
     * Allows the user to try another MFA method.
     *
     * @param payload - Optional custom options to include with the request.
     * @returns A promise that resolves when the request is submitted.
     */
    tryAnotherMethod(payload?: CustomOptions): Promise<void>;
}
export { ResetPasswordMfaVoiceChallengeMembers, ScreenOptions as ScreenMembersOnResetPasswordMfaVoiceChallenge, ContinueOptions };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map