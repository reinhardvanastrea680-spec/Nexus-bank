/**
 * Account Helpers
 * Utilities for working with dynamic account types (standard + custom accounts)
 */

export interface AccountOption {
  value: string;
  label: string;
  balance: number;
  accountNumber?: string;
  status?: string;
}

/**
 * Get all available accounts for a user (standard + custom)
 * @param account - User account data from useUserAccount
 * @param customAccounts - Custom accounts from useCustomAccounts
 * @returns Array of account options with value, label, and balance
 */
export function getAllAccountOptions(
  account: any,
  customAccounts: any[]
): AccountOption[] {
  const options: AccountOption[] = [];

  // Standard accounts
  if (account) {
    options.push(
      {
        value: "checking",
        label: "Checking",
        balance: account.checkingBalance || 0,
        accountNumber: account.checkingAccountNumber,
        status: account.status || "active",
      },
      {
        value: "savings",
        label: "Savings",
        balance: account.savingsBalance || 0,
        accountNumber: account.savingsAccountNumber,
        status: account.status || "active",
      }
    );

    // Only show investment account if it was explicitly created
    // (investmentBalance must be a positive number set by the admin)
    if (typeof account.investmentBalance === "number" && account.investmentBalance > 0) {
      options.push({
        value: "investment",
        label: "Investment",
        balance: account.investmentBalance,
        accountNumber: account.investmentAccountNumber,
        status: account.status || "active",
      });
    }
  }

  // Custom accounts
  if (customAccounts && customAccounts.length > 0) {
    customAccounts.forEach((ca) => {
      options.push({
        value: ca.id,
        label: ca.name,
        balance: ca.balance || 0,
        accountNumber: ca.accountNumber,
        status: ca.status || "active",
      });
    });
  }

  return options;
}

/**
 * Get balance for a specific account
 * @param accountValue - The account value/identifier
 * @param accountOptions - Array of all available account options
 * @returns The balance for the specified account, or 0 if not found
 */
export function getAccountBalance(
  accountValue: string,
  accountOptions: AccountOption[]
): number {
  return accountOptions.find((opt) => opt.value === accountValue)?.balance || 0;
}

/**
 * Get account label by value
 * @param accountValue - The account value/identifier
 * @param accountOptions - Array of all available account options
 * @returns The label for the specified account, or the value itself if not found
 */
export function getAccountLabel(
  accountValue: string,
  accountOptions: AccountOption[]
): string {
  return accountOptions.find((opt) => opt.value === accountValue)?.label || accountValue;
}

/**
 * Convert account value to fundingAccount format for submitTransaction
 * @param accountValue - The account value/identifier
 * @returns "checking" | "savings" | the custom account ID
 */
export function toFundingAccount(accountValue: string): string {
  // Keep custom account IDs as-is, convert standard accounts to lowercase
  if (accountValue === "checking" || accountValue === "savings" || accountValue === "investment") {
    return accountValue.toLowerCase();
  }
  return accountValue; // Custom account ID
}
