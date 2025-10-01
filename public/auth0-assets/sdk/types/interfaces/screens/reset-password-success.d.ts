import type { BaseMembers } from '../models/base-context';
import type { ScreenMembers, ScreenData } from '../models/screen';
export interface ResetPasswordSuccessOptions {
    [key: string]: string | number | boolean | undefined;
}
export interface ScreenDataOptions extends ScreenData {
    username?: string;
}
export interface ScreenMembersOnResetPasswordSuccess extends ScreenMembers {
}
export interface ResetPasswordSuccessMembers extends BaseMembers {
    screen: ScreenMembersOnResetPasswordSuccess;
}
//# sourceMappingURL=reset-password-success.d.ts.map