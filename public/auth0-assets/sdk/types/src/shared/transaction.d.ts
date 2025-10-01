import type { UsernamePolicy, PasswordPolicy, TransactionContext } from '../../interfaces/models/transaction';
import type { TransactionMembersOnLoginId } from '../../interfaces/screens/login-id';
import type { TransactionMembersOnSignupId } from '../../interfaces/screens/signup-id';
/**
 * Checks if signup is enabled for the current connection.
 *
 * @param transaction - The transaction context from Universal Login
 * @returns True if signup is enabled, false otherwise
 */
export declare function isSignupEnabled(transaction: TransactionContext): boolean;
/**
 * Checks if forgot password is enabled for the current database connection.
 *
 * @param transaction - The transaction context from Universal Login
 * @returns True if forgot password is enabled, false otherwise
 */
export declare function isForgotPasswordEnabled(transaction: TransactionContext): boolean;
/**
 * Checks if passkeys are enabled in the current connection configuration.
 *
 * @param transaction - The transaction context from Universal Login
 * @returns True if passkeys are enabled, false otherwise
 */
export declare function isPasskeyEnabled(transaction: TransactionContext): boolean;
/**
 * Determines if a username is required for authentication based on connection settings.
 *
 * @param transaction - The transaction context from Universal Login
 * @returns True if username is required, false otherwise
 */
export declare function isUsernameRequired(transaction: TransactionContext): boolean;
/**
 * Retrieves the username policy configuration from the transaction context.
 * This includes settings like minimum/maximum length and allowed formats.
 *
 * @param transaction - The transaction context from Universal Login
 * @returns The username policy object or null if not defined
 */
export declare function getUsernamePolicy(transaction: TransactionContext): UsernamePolicy | null;
/**
 * Retrieves the password policy configuration from the transaction context.
 * This includes properties like minimum length and complexity requirements.
 *
 * @param transaction - The transaction context from Universal Login
 * @returns The password policy object or null if not defined
 */
export declare function getPasswordPolicy(transaction: TransactionContext): PasswordPolicy | null;
/**
 * Returns the allowed identifiers (email, username, phone) based on the connection settings.
 * This includes both required and optional identifier types.
 *
 * @param transaction - The transaction context from Universal Login
 * @returns An array of allowed identifier types or null if none are defined
 */
export declare function getAllowedIdentifiers(transaction: TransactionContext): TransactionMembersOnLoginId['allowedIdentifiers'];
/**
 * Returns only the required identifiers for signup flow based on connection settings.
 *
 * @param transaction - The transaction context from Universal Login
 * @returns An array of required identifier types or null if none are defined
 */
export declare function getRequiredIdentifiers(transaction: TransactionContext): TransactionMembersOnSignupId['requiredIdentifiers'];
/**
 * Returns only the optional identifiers for signup flow based on connection settings.
 *
 * @param transaction - The transaction context from Universal Login
 * @returns An array of optional identifier types or null if none are defined
 */
export declare function getOptionalIdentifiers(transaction: TransactionContext): TransactionMembersOnSignupId['optionalIdentifiers'];
/**
 * Checks if the connection supports flexible identifiers.
 * A connection supports flexible identifiers if it has attributes configured.
 *
 * @param transaction - The transaction context from Universal Login
 * @returns True if flexible identifiers are supported, false otherwise
 */
export declare function hasFlexibleIdentifier(transaction: TransactionContext): boolean;
//# sourceMappingURL=transaction.d.ts.map