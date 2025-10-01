import { BaseContext } from '../../models/base-context';
import type { DeviceCodeActivationDeniedMembers } from '../../../interfaces/screens/device-code-activation-denied';
/**
 * Class implementing the Device Code Activation Denied screen functionality.
 * This screen is displayed when the device code activation is denied.
 */
export default class DeviceCodeActivationDenied extends BaseContext implements DeviceCodeActivationDeniedMembers {
    static screenIdentifier: string;
    /**
     * Creates an instance of DeviceCodeActivationDenied screen manager.
     */
    constructor();
}
export { DeviceCodeActivationDeniedMembers };
export * from '../../../interfaces/export/common';
export * from '../../../interfaces/export/base-properties';
//# sourceMappingURL=index.d.ts.map