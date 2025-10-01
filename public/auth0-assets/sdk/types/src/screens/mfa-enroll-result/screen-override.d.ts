import { Screen } from '../../models/screen';
import type { ScreenContext } from '../../../interfaces/models/screen';
import type { ScreenMembersOnMfaEnrollResult as OverrideOptions } from '../../../interfaces/screens/mfa-enroll-result';
/**
 * @class ScreenOverride
 * @extends Screen
 * @implements OverrideOptions
 * @description Screen-specific override for the MFA Enroll Result screen ('mfa-enroll-result').
 * This class ensures that the `screen.data.status` property is correctly parsed and typed
 * according to the {@link ScreenMembersOnMfaEnrollResult} interface.
 */
export declare class ScreenOverride extends Screen implements OverrideOptions {
    /**
     * Screen-specific data containing the status of the MFA enrollment.
     * @type {{ status: string; } | null}
     * @public
     */
    data: OverrideOptions['data'];
    /**
     * Creates an instance of ScreenOverride for the MFA Enroll Result screen.
     * It initializes the `data` (specifically `status`) by parsing the provided `screenContext`.
     *
     * @param {ScreenContext} screenContext - The screen context object from the Universal Login global context,
     * specific to the 'mfa-enroll-result' screen.
     */
    constructor(screenContext: ScreenContext);
    /**
     * @static
     * @method getScreenData
     * @description Extracts and transforms the screen-specific data from the provided screen context.
     * Specifically, it retrieves the `status` of the MFA enrollment.
     *
     * @param {ScreenContext} screenContext - The screen context containing the raw data for the screen.
     * @returns {OverrideOptions['data']} The structured screen data containing the `status`,
     * or `null` if the `status` is not present or not a string in the context data.
     */
    static getScreenData: (screenContext: ScreenContext) => OverrideOptions["data"];
}
//# sourceMappingURL=screen-override.d.ts.map