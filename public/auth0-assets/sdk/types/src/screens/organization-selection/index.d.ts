import { BaseContext } from '../../models/base-context';
import type { OrganizationSelectionMembers, ContinueWithOrganizationNameOptions, ScreenMembersOnOrganizationSelection as ScreenOptions } from '../../../interfaces/screens/organization-selection';
/**
 * Class implementing the organization-selection screen functionality.
 * This screen allows users to select an organization to continue with.
 */
export default class OrganizationSelection extends BaseContext implements OrganizationSelectionMembers {
    screen: ScreenOptions;
    /**
     * Creates an instance of OrganizationSelection screen manager.
     */
    constructor();
    /**
     * Continues with the selected organization name.
     * @param payload The options containing the organization name.
     * @example
     * ```typescript
     * import OrganizationSelection from '@auth0/auth0-acul-js/organization-selection';
     *
     * const organizationSelection = new OrganizationSelection();
     * await organizationSelection.continueWithOrganizationName({
     *   organizationName: 'testOrganizationName',
     * });
     * ```
     */
    continueWithOrganizationName(payload: ContinueWithOrganizationNameOptions): Promise<void>;
}
export { OrganizationSelectionMembers, ContinueWithOrganizationNameOptions, ScreenOptions as ScreenMembersOnOrganizationSelection };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map