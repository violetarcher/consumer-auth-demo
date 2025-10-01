import { BaseContext } from '../../models/base-context';
import type { CustomOptions } from '../../../interfaces/common';
import type { MfaEmailListMembers, ScreenMembersOnMfaEmailList as ScreenOptions, SelectMfaEmailOptions } from '../../../interfaces/screens/mfa-email-list';
/**
 * Class implementing the mfa-email-list screen functionality
 * This screen allows users to select an enrolled email address for MFA
 */
export default class MfaEmailList extends BaseContext implements MfaEmailListMembers {
    static screenIdentifier: string;
    /**
     * Creates an instance of MfaEmailList screen manager
     */
    constructor();
    /**
     * Selects an enrolled email address from the list
     * @param payload The options containing the selection action
     * @example
     * ```typescript
     * import MfaEmailList from '@auth0/auth0-acul-js/mfa-email-list';
     *
     * const mfaEmailList = new MfaEmailList();
     * await mfaEmailList.selectMfaEmail({
     *   index: 0 // for demonstration we are selecting the first index
     * });
     * ```
     */
    selectMfaEmail(payload: SelectMfaEmailOptions): Promise<void>;
    /**
     * Navigates back to the previous screen
     * @param payload Optional custom options to include with the request
     * @example
     * ```typescript
     * import MfaEmailList from '@auth0/auth0-acul-js/mfa-email-list';
     *
     * const mfaEmailList = new MfaEmailList();
     * await mfaEmailList.goBack();
     * ```
     */
    goBack(payload?: CustomOptions): Promise<void>;
}
export { MfaEmailListMembers, ScreenOptions as ScreenMembersOnMfaEmailList, SelectMfaEmailOptions };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map