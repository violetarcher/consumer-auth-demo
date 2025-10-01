import type { BaseMembers } from '../models/base-context';
import type { ScreenMembers, ScreenData } from '../models/screen';
export interface ResetPasswordOptions {
    'password-reset': string;
    're-enter-password': string;
    [key: string]: string | number | boolean | undefined;
}
export interface ScreenDataOptions extends ScreenData {
    username?: string;
}
export interface ScreenMembersOnResetPassword extends ScreenMembers {
    data: {
        username?: string;
    } | null;
}
export interface ResetPasswordMembers extends BaseMembers {
    screen: ScreenMembersOnResetPassword;
    resetPassword(payload: ResetPasswordOptions): Promise<void>;
}
//# sourceMappingURL=reset-password.d.ts.map