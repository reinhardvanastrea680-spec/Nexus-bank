import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Nexsus Bank Utility Functions

/**
 * Formats a number as currency ($X,XXX.XX)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Generates a random 10-digit account number with no leading zeros
 */
export function generateAccountNumber(): string {
  const firstDigit = Math.floor(Math.random() * 9) + 1; // 1-9
  const remainingDigits = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  return `${firstDigit}${remainingDigits}`;
}

/**
 * Logs an admin action to activity log (mock implementation)
 */
export function logAdminAction(
  action: string,
  description: string,
  targetUserId?: string,
  targetUserName?: string,
  meta?: Record<string, any>
): void {
  console.log('Admin Action:', {
    action,
    description,
    targetUserId,
    targetUserName,
    meta,
    timestamp: new Date().toISOString(),
    adminId: 'admin1',
  });
}

/**
 * Recalculates balances (mock implementation)
 */
export function recalculateBalances(userId: string, account: 'checking' | 'savings'): void {
  console.log(`Recalculating ${account} balance for user ${userId}...`);
  // In real app, would fetch transactions, recalculate, update DB
}

/**
 * Exports data to CSV
 */
export function exportToCSV(data: any[], filename: string): void {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
