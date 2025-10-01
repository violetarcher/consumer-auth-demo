import type { IdentifierType } from '../../src/constants';
import type { CustomOptions } from '../common';
import type { BaseContext, BaseMembers } from '../models/base-context';
import type { ScreenContext, ScreenMembers, PasskeyRead } from '../models/screen';
import type { TransactionMembers, UsernamePolicy } from '../models/transaction';
import type { UntrustedDataContext } from '../models/untrusted-data';
export interface ExtendedScreenContext extends ScreenContext {
    links: {
        signup: string;
        reset_password: string;
    };
    data?: {
        passkey?: PasskeyRead;
    };
}
export interface ExtendedUntrustedDataContext extends UntrustedDataContext {
    submitted_form_data?: {
        username: string;
        'ulp_{someField}'?: string;
    };
}
export interface LoginId extends BaseContext {
    screen: ExtendedScreenContext;
    untrustedData?: ExtendedUntrustedDataContext;
}
export interface ScreenMembersOnLoginId extends ScreenMembers {
    signupLink: string | null;
    resetPasswordLink: string | null;
    publicKey: PasskeyRead['public_key'] | null;
}
export interface TransactionMembersOnLoginId extends TransactionMembers {
    isSignupEnabled: boolean;
    isPasskeyEnabled: boolean;
    isForgotPasswordEnabled: boolean;
    isUsernameRequired: boolean;
    usernamePolicy: UsernamePolicy | null;
    allowedIdentifiers: IdentifierType[] | null;
}
export interface LoginOptions {
    username: string;
    captcha?: string;
    [key: string]: string | number | boolean | undefined;
}
export interface FederatedLoginOptions {
    connection: string;
    [key: string]: string | number | boolean;
}
export interface LoginIdMembers extends BaseMembers {
    screen: ScreenMembersOnLoginId;
    login(payload: LoginOptions): Promise<void>;
    federatedLogin(payload: FederatedLoginOptions): Promise<void>;
    passkeyLogin(payload?: CustomOptions): Promise<void>;
    pickCountryCode(payload?: CustomOptions): Promise<void>;
}
//# sourceMappingURL=login-id.d.ts.map