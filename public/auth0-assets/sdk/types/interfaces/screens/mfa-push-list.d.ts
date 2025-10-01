import type { CustomOptions } from '../common';
import type { BaseMembers } from '../models/base-context';
/**
 * Options for selecting an MFA push device.
 */
export interface SelectMfaPushDeviceOptions {
    /**
     * The index of the device to select from the list of enrolled devices.
     * The index is 0-based.
     */
    deviceIndex: number;
    [key: string]: string | number | boolean | undefined;
}
/**
 * Interface defining the available methods and properties for the mfa-push-list screen
 */
export interface MfaPushListMembers extends BaseMembers {
    /**
     * Selects a registered device from the list to initiate MFA push.
     * @param payload The options containing the device index.
     */
    selectMfaPushDevice(payload: SelectMfaPushDeviceOptions): Promise<void>;
    /**
     * Navigates back to the previous screen.
     * @param payload Optional custom options to include with the request.
     */
    goBack(payload?: CustomOptions): Promise<void>;
}
//# sourceMappingURL=mfa-push-list.d.ts.map