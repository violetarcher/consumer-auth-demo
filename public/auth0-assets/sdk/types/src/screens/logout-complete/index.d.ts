import { BaseContext } from '../../models/base-context';
import type { LogoutCompleteMembers } from '../../../interfaces/screens/logout-complete';
/**
 * Class implementing the logout-complete screen functionality
 * This screen is displayed when a user aborts the logout process.
 */
export default class LogoutComplete extends BaseContext implements LogoutCompleteMembers {
    static screenIdentifier: string;
    /**
     * Creates an instance of LogoutComplete screen manager
     */
    constructor();
}
export { LogoutCompleteMembers };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map