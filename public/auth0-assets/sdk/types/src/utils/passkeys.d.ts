import type { PasskeyRead, PasskeyCreate } from '../../interfaces/models/screen';
import type { PasskeyCreateResponse, PasskeyCredentialResponse } from '../../interfaces/utils/passkeys';
export declare function getPasskeyCredentials(publicKey: PasskeyRead['public_key']): Promise<PasskeyCredentialResponse>;
export declare function createPasskeyCredentials(publicKey: PasskeyCreate['public_key']): Promise<PasskeyCreateResponse>;
//# sourceMappingURL=passkeys.d.ts.map