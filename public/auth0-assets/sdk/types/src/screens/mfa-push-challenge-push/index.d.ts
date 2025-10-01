import { BaseContext } from '../../models/base-context';
import type { CustomOptions } from '../../../interfaces/common';
import type { MfaPushChallengePushMembers, WithRememberOptions, ScreenMembersOnMfaPushChallengePush as ScreenOptions, UntrustedDataMembersOnMfaPushChallengePush as UntrustedDataOptions } from '../../../interfaces/screens/mfa-push-challenge-push';
/**
 * Class implementing the mfa-push-challenge-push screen functionality
 * This screen is shown when a user needs to confirm a push notification during MFA
 */
export default class MfaPushChallengePush extends BaseContext implements MfaPushChallengePushMembers {
    static screenIdentifier: string;
    screen: ScreenOptions;
    untrustedData: UntrustedDataOptions;
    /**
     * Creates an instance of MfaPushChallengePush screen manager
     */
    constructor();
    /**
     * Continues with the push notification challenge
     * @param payload Optional custom options to include with the request
     * @example
     * ```typescript
     * const mfaPushChallengePush = new MfaPushChallengePush();
     * await mfaPushChallengePush.continue();
     * ```
     */
    continue(payload?: WithRememberOptions): Promise<void>;
    /**
     * Resends the push notification
     * @param payload Optional custom options to include with the request
     * @example
     * ```typescript
     * const mfaPushChallengePush = new MfaPushChallengePush();
     * await mfaPushChallengePush.resendPushNotification();
     * ```
     */
    resendPushNotification(payload?: WithRememberOptions): Promise<void>;
    /**
     * Switches to entering the verification code manually
     * @param payload Optional custom options to include with the request
     * @example
     * ```typescript
     * const mfaPushChallengePush = new MfaPushChallengePush();
     * await mfaPushChallengePush.enterCodeManually();
     * ```
     */
    enterCodeManually(payload?: CustomOptions): Promise<void>;
    /**
     * Allows trying another authentication method
     * @param payload Optional custom options to include with the request
     * @example
     * ```typescript
     * const mfaPushChallengePush = new MfaPushChallengePush();
     * await mfaPushChallengePush.tryAnotherMethod();
     * ```
     */
    tryAnotherMethod(payload?: CustomOptions): Promise<void>;
}
export { MfaPushChallengePushMembers, WithRememberOptions, ScreenOptions as ScreenMembersOnMfaPushChallengePush, UntrustedDataOptions as UntrustedDataMembersOnMfaPushChallengePush, };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map