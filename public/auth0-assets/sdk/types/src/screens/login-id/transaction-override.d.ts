import { Transaction } from '../../../src/models/transaction';
import type { TransactionContext } from '../../../interfaces/models/transaction';
import type { TransactionMembersOnLoginId as OverrideMembers } from '../../../interfaces/screens/login-id';
export declare class TransactionOverride extends Transaction implements OverrideMembers {
    isSignupEnabled: OverrideMembers['isSignupEnabled'];
    isForgotPasswordEnabled: OverrideMembers['isForgotPasswordEnabled'];
    isPasskeyEnabled: OverrideMembers['isPasskeyEnabled'];
    isUsernameRequired: OverrideMembers['isUsernameRequired'];
    usernamePolicy: OverrideMembers['usernamePolicy'];
    allowedIdentifiers: OverrideMembers['allowedIdentifiers'];
    constructor(transactionContext: TransactionContext);
    static getAllowedIdentifiers(transactionContext: TransactionContext, connectionStrategy: string | null): OverrideMembers['allowedIdentifiers'];
}
//# sourceMappingURL=transaction-override.d.ts.map