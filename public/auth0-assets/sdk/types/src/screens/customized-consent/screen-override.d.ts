import { Screen } from '../../models/screen';
import type { AuthorizationDetail, Scope, ScreenContext } from '../../../interfaces/models/screen';
import type { ScreenMembersOnCustomizedConsent } from '../../../interfaces/screens/customized-consent';
/**
 * @class ScreenOverride
 * @extends Screen
 * @implements ScreenMembersOnCustomizedConsent
 * @description Screen-specific override for the Customized Consent screen ('customized-consent').
 * This class ensures that the `screen.data` object, particularly `scopes` and `authorizationDetails`,
 * are correctly parsed and typed according to the {@link ScreenMembersOnCustomizedConsent} interface.
 */
export declare class ScreenOverride extends Screen implements ScreenMembersOnCustomizedConsent {
    /**
     * An array of {@link Scope} objects detailing each permission (scope) being requested.
     * Parsed from `screenContext.data.scopes`.
     * @type {Scope[]}
     * @public
     */
    scopes: Scope[];
    /**
     * An array of {@link AuthorizationDetail} objects detailing specific authorization requests.
     * Parsed from `screenContext.data.authorization_details`.
     * @type {AuthorizationDetail[]}
     * @public
     */
    authorizationDetails: AuthorizationDetail[];
    /**
     * Creates an instance of ScreenOverride for the Customized Consent screen.
     * It initializes the `scopes` and `authorizationDetails` properties by parsing the provided `screenContext`.
     *
     * @param {ScreenContext} screenContext - The screen context object from the Universal Login global context,
     * specific to the 'customized-consent' screen.
     */
    constructor(screenContext: ScreenContext);
    /**
     * @static
     * @method getScopes
     * @description Extracts and transforms the `scopes` array from the provided screen context.
     * Uses a shared utility `getScopes` if available, or implements similar logic.
     *
     * @param {ScreenContext} screenContext - The screen context containing the raw data for the screen.
     * @returns {Scope[]} The structured array of {@link Scope} objects.
     * Returns an empty array if `screenContext.data.scopes` is not a valid array.
     */
    static getScopes: (screenContext: ScreenContext) => Scope[];
    /**
     * @static
     * @method getAuthorizationDetails
     * @description Extracts and transforms the `authorization_details` array from the provided screen context.
     * Ensures each item in the array conforms to the {@link AuthorizationDetail} interface.
     *
     * @param {ScreenContext} screenContext - The screen context containing the raw data for the screen.
     * @returns {AuthorizationDetail[]} The structured array of {@link AuthorizationDetail} objects.
     * Returns an empty array if `screenContext.data.authorization_details` is not a valid array or if items are malformed.
     */
    static getAuthorizationDetails: (screenContext: ScreenContext) => AuthorizationDetail[];
}
//# sourceMappingURL=screen-override.d.ts.map