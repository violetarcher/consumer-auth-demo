import { Screen } from '../../models/screen';
import type { ScreenContext } from '../../../interfaces/models/screen';
import type { ScreenMembersOnMfaWebAuthnRoamingEnrollment as OverrideOptions } from '../../../interfaces/screens/mfa-webauthn-roaming-enrollment';
/**
 * Screen override class for the mfa-webauthn-roaming-enrollment screen.
 * Provides specific data parsing for this screen.
 */
export declare class ScreenOverride extends Screen implements OverrideOptions {
    webauthnType: string | null;
    publicKey: OverrideOptions['publicKey'];
    /**
     * Creates an instance of ScreenOverride for mfa-webauthn-roaming-enrollment.
     * @param screenContext The screen context from Universal Login.
     */
    constructor(screenContext: ScreenContext);
    static getPublicKey: (screenContext: ScreenContext) => OverrideOptions["publicKey"];
    /**
     * Retrieves the WebAuthn type from the screen context.
     * @param screenContext The screen context containing the data.
     * @returns The WebAuthn type (e.g., 'roaming') or null if not available.
     */
    static getWebAuthnType: (screenContext: ScreenContext) => string | null;
}
//# sourceMappingURL=screen-override.d.ts.map