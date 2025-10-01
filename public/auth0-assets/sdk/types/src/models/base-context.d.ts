import type { ClientMembers, PromptMembers, ScreenMembers, OrganizationMembers, UserMembers, TransactionMembers, TenantMembers, UntrustedDataMembers, BrandingMembers } from '../../interfaces/models';
import type { BaseContext as UniversalLoginContext, BaseMembers } from '../../interfaces/models/base-context';
import type { Error as TransactionError } from '../../interfaces/models/transaction';
/**
 * @class BaseContext
 * @description Foundation class that provides access to the Universal Login Context, which contains all information
 * about the current authentication flow, including user data, client information, and screen configuration.
 */
export declare class BaseContext implements BaseMembers {
    branding: BrandingMembers;
    screen: ScreenMembers;
    tenant: TenantMembers;
    prompt: PromptMembers;
    organization: OrganizationMembers;
    client: ClientMembers;
    transaction: TransactionMembers;
    user: UserMembers;
    untrustedData: UntrustedDataMembers;
    private static context;
    /**
     * @property {string} screenIdentifier - Identifier for the current screen, used to verify correct screen imports
     */
    static screenIdentifier: string;
    /**
     * @constructor
     * @description Initializes a new instance of the BaseContext class and populates its properties with data from the Universal Login Context.
     * @throws {Error} If Universal Login Context is not available or screen identifier doesn't match.
     */
    constructor();
    /**
     * Retrieves a specific part of the Universal Login Context.
     * @template K - The key type of the UniversalLoginContext
     * @param {K} model - The key of the context to retrieve
     * @returns {UniversalLoginContext[K] | undefined} The requested context portion or undefined if not available
     * @ignore - Internal method not intended for public use
     */
    getContext<K extends keyof UniversalLoginContext>(model: K): UniversalLoginContext[K] | undefined;
    /**
    * Retrieves the array of transaction errors from the context, or an empty array if none exist.
    * @returns {TransactionError[]} An array of error objects from the transaction context.
    */
    getError(): TransactionError[];
}
//# sourceMappingURL=base-context.d.ts.map