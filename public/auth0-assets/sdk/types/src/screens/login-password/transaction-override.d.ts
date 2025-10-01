import { Transaction } from '../../models/transaction';
import type { TransactionContext } from '../../../interfaces/models/transaction';
import type { TransactionMembersOnLoginPassword as OverrideMembers } from '../../../interfaces/screens/login-password';
export declare class TransactionOverride extends Transaction implements OverrideMembers {
    constructor(transactionContext: TransactionContext);
    isSignupEnabled: boolean;
    isForgotPasswordEnabled: boolean;
    isPasskeyEnabled: boolean;
    getPasswordPolicy: OverrideMembers['getPasswordPolicy'];
    getUsernamePolicy: OverrideMembers['getUsernamePolicy'];
    getAllowedIdentifiers: OverrideMembers['getAllowedIdentifiers'];
}
//# sourceMappingURL=transaction-override.d.ts.map