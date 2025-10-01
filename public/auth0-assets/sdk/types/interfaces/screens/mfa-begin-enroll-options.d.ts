import type { MfaEnrollFactorType } from '../../src/constants';
import type { BaseMembers } from '../models/base-context';
/**
 * Options for continuing with factor enrollment
 */
export interface MfaEnrollOptions {
    /** The action indicating which factor to enroll */
    action: MfaEnrollFactorType;
    /** Any additional custom options */
    [key: string]: string | number | boolean | undefined;
}
/**
 * MFA Begin Enroll Options screen members interface
 */
export interface MfaBeginEnrollOptionsMembers extends BaseMembers {
    /**
     * Continues the enrollment process with the selected factor
     * @param payload The enrollment options including the selected factor
     */
    enroll(payload: MfaEnrollOptions): Promise<void>;
}
//# sourceMappingURL=mfa-begin-enroll-options.d.ts.map