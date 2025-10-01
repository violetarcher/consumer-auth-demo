import type { CustomOptions } from '../common';
import type { BaseMembers } from '../models/base-context';
import type { ScreenData, ScreenMembers } from '../models/screen';
export interface ScreenDataOptions extends ScreenData {
    messageType?: 'text' | 'voice';
    phone?: 'string';
}
export interface ScreenMembersOnPhoneIdentifierEnrollment extends ScreenMembers {
    data: {
        phone?: 'string';
        messageType?: 'text' | 'voice';
    } | null;
    editIdentifierLink: string | null;
}
export interface PhoneEnrollmentOptions {
    type: 'text' | 'voice';
    [key: string]: string | number | boolean;
}
export interface PhoneIdentifierEnrollmentMembers extends BaseMembers {
    screen: ScreenMembersOnPhoneIdentifierEnrollment;
    continuePhoneEnrollment(payload: PhoneEnrollmentOptions): Promise<void>;
    returnToPrevious(payload?: CustomOptions): Promise<void>;
}
//# sourceMappingURL=phone-identifier-enrollment.d.ts.map