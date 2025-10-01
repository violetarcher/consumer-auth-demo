import { UntrustedData } from '../../models/untrusted-data';
import type { UntrustedDataContext } from '../../../interfaces/models/untrusted-data';
import type { UntrustedDataMembersOnMfaSmsChallenge as OverrideOptions } from '../../../interfaces/screens/mfa-sms-challenge';
/**
 * Untrusted data override class for the mfa-sms-challenge screen
 * Handles remember_device field from submitted form data
 */
export declare class UntrustedDataOverride extends UntrustedData implements OverrideOptions {
    submittedFormData: OverrideOptions['submittedFormData'];
    /**
     * Creates an instance of UntrustedDataOverride
     * @param untrustedDataContext The untrusted data context from Universal Login
     */
    constructor(untrustedDataContext: UntrustedDataContext);
    /**
     * @static
     * @method getSubmittedFormData
     * @description Extracts submitted form data from the untrusted data context with rememberDevice flag
     * @param {UntrustedDataContext | undefined} untrustedData - The untrusted data context
     * @returns Form data with rememberDevice or null if unavailable
     */
    static getSubmittedFormData(untrustedDataContext: UntrustedDataContext): OverrideOptions['submittedFormData'];
}
//# sourceMappingURL=untrusted-data-overrider.d.ts.map