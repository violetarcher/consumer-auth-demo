import { BaseContext } from '../../models/base-context';
import type { CustomOptions } from '../../../interfaces/common';
import type { ResetPasswordMfaPushChallengePushMembers, ScreenMembersOnResetPasswordMfaPushChallengePush as ScreenOptions } from '../../../interfaces/screens/reset-password-mfa-push-challenge-push';
/**
 * Class representing the reset-password-mfa-push-challenge-push screen functionality
 * This screen is shown when a push notification has been sent to the user's device during password reset
 */
export default class ResetPasswordMfaPushChallengePush extends BaseContext implements ResetPasswordMfaPushChallengePushMembers {
    static screenIdentifier: string;
    screen: ScreenOptions;
    constructor();
    /**
     * Continues with the push notification challenge
     * @param payload Optional custom options to include with the request
     * @example
     * ```typescript
     * import ResetPasswordMfaPushChallengePush from '@auth0/auth0-acul-js/reset-password-mfa-push-challenge-push';
     *
     * const resetPasswordMfaPushChallengePush = new ResetPasswordMfaPushChallengePush();
     * await resetPasswordMfaPushChallengePush.continue();
     * ```
     */
    continue(payload?: CustomOptions): Promise<void>;
    /**
     * Re-sends the push notification
     * @param payload Optional custom options to include with the request
     * @example
     * ```typescript
     * import ResetPasswordMfaPushChallengePush from '@auth0/auth0-acul-js/reset-password-mfa-push-challenge-push';
     *
     * const resetPasswordMfaPushChallengePush = new ResetPasswordMfaPushChallengePush();
     * await resetPasswordMfaPushChallengePush.resendPushNotification();
     * ```
     */
    resendPushNotification(payload?: CustomOptions): Promise<void>;
    /**
     * Switches to entering the verification code manually
     * @param payload Optional custom options to include with the request
     * @example
     * ```typescript
     * import ResetPasswordMfaPushChallengePush from '@auth0/auth0-acul-js/reset-password-mfa-push-challenge-push';
     *
     * const resetPasswordMfaPushChallengePush = new ResetPasswordMfaPushChallengePush();
     * await resetPasswordMfaPushChallengePush.enterCodeManually();
     * ```
     */
    enterCodeManually(payload?: CustomOptions): Promise<void>;
    /**
     * Allows trying another authentication method
     * @param payload Optional custom options to include with the request
     * @example
     * ```typescript
     * import ResetPasswordMfaPushChallengePush from '@auth0/auth0-acul-js/reset-password-mfa-push-challenge-push';
     *
     * const resetPasswordMfaPushChallengePush = new ResetPasswordMfaPushChallengePush();
     * await resetPasswordMfaPushChallengePush.tryAnotherMethod();
     * ```
     */
    tryAnotherMethod(payload?: CustomOptions): Promise<void>;
}
export { ResetPasswordMfaPushChallengePushMembers, ScreenOptions as ScreenMembersOnResetPasswordMfaPushChallengePush };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map