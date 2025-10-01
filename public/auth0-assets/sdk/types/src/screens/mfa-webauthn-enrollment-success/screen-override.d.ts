import { Screen } from '../../models/screen';
import type { ScreenContext } from '../../../interfaces/models/screen';
import type { ScreenMembersOnMfaWebAuthnEnrollmentSuccess as OverrideOptions } from '../../../interfaces/screens/mfa-webauthn-enrollment-success';
/**
 * @class ScreenOverride
 * @extends Screen
 * @implements OverrideOptions
 * @description Provides specific data accessors for the 'mfa-webauthn-enrollment-success' screen context.
 * It ensures that `nickname` and `webauthnType` are correctly parsed and typed from the
 * `screen.data` object provided by the Universal Login context.
 */
export declare class ScreenOverride extends Screen implements OverrideOptions {
    /**
     * @property {object | null} data - Screen-specific data.
     * @property {string} data.nickname - The nickname of the enrolled WebAuthn authenticator.
     * @property {WebAuthnType} data.webauthnType - The type of the enrolled WebAuthn authenticator.
     */
    data: OverrideOptions['data'];
    /**
     * Initializes a new instance of the `ScreenOverride` class for the 'mfa-webauthn-enrollment-success' screen.
     * It calls the base `Screen` constructor and then parses the screen-specific data using `getScreenData`.
     * @param {ScreenContext} screenContext - The screen context object provided by Universal Login
     * for the 'mfa-webauthn-enrollment-success' screen.
     */
    constructor(screenContext: ScreenContext);
    /**
     * @static
     * @method getScreenData
     * @description Extracts and transforms the screen-specific data from the provided `ScreenContext`.
     * Specifically, it retrieves `nickname` and `webauthnType` from `screenContext.data`.
     *
     * @param {ScreenContext} screenContext - The screen context containing the raw data.
     * @returns {OverrideOptions['data']} A structured object containing `nickname` and `webauthnType`.
     * Returns `null` if the essential data (`nickname` or `webauthnType`) is missing or invalid in type.
     */
    static getScreenData: (screenContext: ScreenContext) => OverrideOptions["data"];
}
//# sourceMappingURL=screen-override.d.ts.map