import { Screen } from '../../models/screen';
import type { ScreenContextOnSignupPassword, ScreenMembersOnSignupPassword as OverrideOptions } from '../../../interfaces/screens/signup-password';
export declare class ScreenOverride extends Screen implements OverrideOptions {
    loginLink: OverrideOptions['loginLink'];
    editLink: OverrideOptions['editLink'];
    data: OverrideOptions['data'];
    constructor(screenContext: ScreenContextOnSignupPassword);
}
//# sourceMappingURL=screen-override.d.ts.map