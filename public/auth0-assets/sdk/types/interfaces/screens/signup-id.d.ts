import type { IdentifierType } from '../../src/constants';
import type { BaseContext } from '../models/base-context';
import type { ScreenContext, ScreenMembers } from '../models/screen';
import type { TransactionMembers, UsernamePolicy } from '../models/transaction';
import type { UntrustedDataContext } from '../models/untrusted-data';
interface ExtendedScreenContext extends ScreenContext {
    links: {
        login: string;
    };
}
interface ExtendedUntrustedDataContext extends UntrustedDataContext {
    submitted_form_data?: {
        email?: string;
        phone?: string;
        username?: string;
        'ulp_{someField}'?: string;
    };
}
export interface ScreenMembersOnSignupId extends ScreenMembers {
    loginLink: string | null;
}
export interface TransactionMembersOnSignupId extends TransactionMembers {
    isPasskeyEnabled: boolean;
    usernamePolicy: UsernamePolicy | null;
    requiredIdentifiers: IdentifierType[] | null;
    optionalIdentifiers: IdentifierType[] | null;
}
export interface SignupId extends BaseContext {
    screen: ExtendedScreenContext;
    untrusted_data?: ExtendedUntrustedDataContext;
}
export interface FederatedSignupOptions {
    connection: string;
    [key: string]: string | number | boolean;
}
export interface SignupOptions {
    email?: string;
    username?: string;
    phone?: string;
    captcha?: string;
    [key: string]: string | number | boolean | undefined;
}
export interface SignupIdMembers {
    screen: ScreenMembersOnSignupId;
    transaction: TransactionMembersOnSignupId;
    signup(payload: SignupOptions): Promise<void>;
    federatedSignup(payload: FederatedSignupOptions): Promise<void>;
}
export {};
//# sourceMappingURL=signup-id.d.ts.map