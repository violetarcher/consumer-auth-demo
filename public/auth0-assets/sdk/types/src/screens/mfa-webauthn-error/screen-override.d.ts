import { Screen } from '../../models/screen';
import type { ScreenContext } from '../../../interfaces/models/screen';
import type { ScreenMembersOnMfaWebAuthnError as OverrideOptions } from '../../../interfaces/screens/mfa-webauthn-error';
/**
 * @class ScreenOverride
 * @extends Screen
 * @description Overrides the base Screen class to provide specific data accessors for the
 * 'mfa-webauthn-error' screen context. It ensures that `errorType` and `webauthnType`
 * are correctly typed and accessible from the screen's data.
 * @implements {OverrideOptions}
 */
export declare class ScreenOverride extends Screen implements OverrideOptions {
    /**
     * @property {object | null} data - Screen-specific data.
     * @property {string} data.errorType - A string code or message describing the WebAuthn error.
     * @property {WebAuthnType} data.webauthnType - Indicates the type of WebAuthn authenticator involved.
     */
    data: OverrideOptions['data'];
    /**
     * Initializes a new instance of the `ScreenOverride` class for the 'mfa-webauthn-error' screen.
     * Parses the screen context to extract and type `errorType` and `webauthnType`.
     * @param {ScreenContext} screenContext - The screen context provided by Universal Login.
     */
    constructor(screenContext: ScreenContext);
    /**
     * @static
     * @method getScreenData
     * @description Extracts and transforms the screen-specific data from the provided screen context.
     * Specifically, it retrieves `errorType` and `webauthnType`.
     * @param {ScreenContext} screenContext - The screen context containing the raw data.
     * @returns {OverrideOptions['data']} The structured screen data, or `null` if essential
     * data (`data.errorType` or `data.webauthnType`) is missing or invalid.
     */
    static getScreenData: (screenContext: ScreenContext) => OverrideOptions["data"];
}
//# sourceMappingURL=screen-override.d.ts.map