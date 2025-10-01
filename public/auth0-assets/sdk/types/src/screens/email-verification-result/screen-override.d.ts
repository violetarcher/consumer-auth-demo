import { Screen } from '../../models/screen';
import type { ScreenContext } from '../../../interfaces/models/screen';
import type { ScreenMembersOnEmailVerificationResult as OverrideOptions } from '../../../interfaces/screens/email-verification-result';
/**
 * @class ScreenOverride
 * @extends Screen
 * @implements OverrideOptions
 * @description Screen-specific override for the Email Verification Result screen.
 * This class ensures that the `data.status` and `links.login` properties are correctly
 * typed and accessible for this particular screen.
 */
export declare class ScreenOverride extends Screen implements OverrideOptions {
    /**
     * Screen-specific data containing the status of the email verification.
     * @type {{ status: string; } | null}
     */
    data: OverrideOptions['data'];
    /**
     * Navigation links available on this screen, specifically the login link.
     * @type {{ login: string; } | null}
     */
    loginLink: OverrideOptions['loginLink'];
    /**
     * Creates an instance of ScreenOverride for the Email Verification Result screen.
     * It initializes the `data` and `links` properties by parsing the provided `screenContext`.
     *
     * @param {ScreenContext} screenContext - The screen context object from the Universal Login global context,
     * specific to the 'email-verification-result' screen.
     */
    constructor(screenContext: ScreenContext);
    /**
     * @static
     * @method getScreenData
     * @description Extracts and transforms the screen-specific data from the provided screen context.
     * Specifically, it retrieves the `status` of the email verification.
     *
     * @param {ScreenContext} screenContext - The screen context containing the raw data for the screen.
     * @returns {OverrideOptions['data']} The structured screen data containing the `status`,
     * or `null` if the `status` is not present or not a string in the context data.
     */
    static getScreenData: (screenContext: ScreenContext) => OverrideOptions["data"];
}
//# sourceMappingURL=screen-override.d.ts.map