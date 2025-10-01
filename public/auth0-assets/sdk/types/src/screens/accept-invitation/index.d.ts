import { BaseContext } from '../../models/base-context';
import type { CustomOptions } from '../../../interfaces/common';
import type { AcceptInvitationMembers, ScreenMembersOnAcceptInvitation as ScreenOptions } from '../../../interfaces/screens/accept-invitation';
/**
 * Class implementing the accept-invitation screen functionality.
 * This screen is displayed when a user needs to accept an invitation to an organization.
 */
export default class AcceptInvitation extends BaseContext implements AcceptInvitationMembers {
    static screenIdentifier: string;
    screen: ScreenOptions;
    /**
     * Creates an instance of AcceptInvitation screen manager.
     */
    constructor();
    /**
     * Accepts the invitation to the organization.
     * @param payload Optional custom options to include with the request.
     * @example
     * ```typescript
     * import AcceptInvitation from '@auth0/auth0-acul-js/accept-invitation';
     *
     * const acceptInvitation = new AcceptInvitation();
     * await acceptInvitation.acceptInvitation();
     * ```
     */
    acceptInvitation(payload?: CustomOptions): Promise<void>;
}
export { AcceptInvitationMembers, ScreenOptions as ScreenMembersOnAcceptInvitation };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map