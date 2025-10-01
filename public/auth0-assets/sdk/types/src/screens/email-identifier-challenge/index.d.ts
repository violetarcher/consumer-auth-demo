import { BaseContext } from '../../models/base-context';
import type { CustomOptions } from '../../../interfaces/common';
import type { EmailChallengeOptions, EmailIdentifierChallengeMembers, ScreenMembersOnEmailIdentifierChallenge as ScreenOptions } from '../../../interfaces/screens/email-identifier-challenge';
export default class EmailIdentifierChallenge extends BaseContext implements EmailIdentifierChallengeMembers {
    screen: ScreenOptions;
    static screenIdentifier: string;
    constructor();
    /**
     * @example
     * import EmailIdentifierChallenge from '@auth0/auth0-acul-js/email-identifier-challenge';
     *
     * const emailIdentifierChallenge = new EmailIdentifierChallenge();
     * emailIdentifierChallenge.submitEmailChallenge({
     *     code: "<string>"
     * });
     */
    submitEmailChallenge(payload: EmailChallengeOptions): Promise<void>;
    /**
     * @example
     * import EmailIdentifierChallenge from '@auth0/auth0-acul-js/email-identifier-challenge';
     *
     * const emailIdentifierChallenge = new EmailIdentifierChallenge();
     * emailIdentifierChallenge.resendCode();
     */
    resendCode(payload?: CustomOptions): Promise<void>;
    /**
     * @example
     * import EmailIdentifierChallenge from '@auth0/auth0-acul-js/email-identifier-challenge';
     *
     * const emailIdentifierChallenge = new EmailIdentifierChallenge();
     * emailIdentifierChallenge.returnToPrevious();
     */
    returnToPrevious(payload?: CustomOptions): Promise<void>;
}
export { EmailIdentifierChallengeMembers, ScreenOptions as ScreenMembersOnEmailIdentifierChallenge, EmailChallengeOptions };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map