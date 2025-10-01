import { BaseContext } from '../../models/base-context';
import type { CustomOptions } from '../../../interfaces/common';
import type { PhoneChallengeOptions, ScreenMembersOnPhoneIdentifierChallenge as ScreenOptions, PhoneIdentifierChallengeMembers } from '../../../interfaces/screens/phone-identifier-challenge';
export default class PhoneIdentifierChallenge extends BaseContext implements PhoneIdentifierChallengeMembers {
    static screenIdentifier: string;
    screen: ScreenOptions;
    constructor();
    /**
     * @example
     * import PhoneIdentifierChallenge from '@auth0/auth0-acul-js/phone-identifier-challenge';
     *
     * const phoneIdentifierChallenge = new PhoneIdentifierChallenge();
     * phoneIdentifierChallenge.submitPhoneChallenge({
     *     code: "<string>"
     * });
     */
    submitPhoneChallenge(payload: PhoneChallengeOptions): Promise<void>;
    /**
     * @example
     * import PhoneIdentifierChallenge from '@auth0/auth0-acul-js/phone-identifier-challenge';
     *
     * const phoneIdentifierChallenge = new PhoneIdentifierChallenge();
     * phoneIdentifierChallenge.resendCode();
     */
    resendCode(payload?: CustomOptions): Promise<void>;
    /**
     * @example
     * import PhoneIdentifierChallenge from '@auth0/auth0-acul-js/phone-identifier-challenge';
     *
     * const phoneIdentifierChallenge = new PhoneIdentifierChallenge();
     * phoneIdentifierChallenge.returnToPrevious();
     */
    returnToPrevious(payload?: CustomOptions): Promise<void>;
}
export { PhoneIdentifierChallengeMembers, PhoneChallengeOptions, ScreenOptions as ScreenMembersOnPhoneIdentifierChallenge };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map