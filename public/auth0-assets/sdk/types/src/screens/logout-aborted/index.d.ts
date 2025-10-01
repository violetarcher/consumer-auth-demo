import { BaseContext } from '../../models/base-context';
import type { LogoutAbortedMembers } from '../../../interfaces/screens/logout-aborted';
/**
 * Class implementing the logout-aborted screen functionality
 * This screen is displayed when a user aborts the logout process.
 */
export default class LogoutAborted extends BaseContext implements LogoutAbortedMembers {
    static screenIdentifier: string;
    /**
     * Creates an instance of LogoutAborted screen manager
     */
    constructor();
}
export { LogoutAbortedMembers };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map