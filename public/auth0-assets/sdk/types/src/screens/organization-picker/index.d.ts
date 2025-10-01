import { BaseContext } from '../../models/base-context';
import type { CustomOptions } from '../../../interfaces/common';
import type { OrganizationPickerMembers, SelectOrganizationOptions } from '../../../interfaces/screens/organization-picker';
/**
 * Class implementing the organization-picker screen functionality.
 * This screen allows users to select an organization from a list of available organizations.
 */
export default class OrganizationPicker extends BaseContext implements OrganizationPickerMembers {
    /**
     * Creates an instance of OrganizationPicker screen manager.
     */
    constructor();
    /**
     * Submits the selected organization ID.
     * @param payload The ID of the selected organization. { organization: string; }
     * @example
     * ```typescript
     * import OrganizationPicker from '@auth0/auth0-acul-js/organization-picker';
     *
     * const organizationPicker = new OrganizationPicker();
     * organizationPicker.selectOrganization({
     *   organization: 'org_XXXXXXXXXXXXXXX'
     * });
     * ```
     */
    selectOrganization(payload: SelectOrganizationOptions): Promise<void>;
    /**
     * Submits the action to skip the organization selection.
     * @param payload Optional custom options to include with the request.
     * @example
     * ```typescript
     * import OrganizationPicker from '@auth0/auth0-acul-js/organization-picker';
     *
     * const organizationPicker = new OrganizationPicker();
     * organizationPicker.skipOrganizationSelection();
     * ```
     */
    skipOrganizationSelection(payload?: CustomOptions): Promise<void>;
}
export { OrganizationPickerMembers, SelectOrganizationOptions };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map