
/** 
 * Generates a realistic 10-digit bank account number with no leading zero. 
 */ 
export function generateAccountNumber() { 
  const firstDigit = Math.floor(Math.random() * 9) + 1; 
  const remaining = Math.floor(Math.random() * 1000000000) 
    .toString() 
    .padStart(9, "0"); 
  return `${firstDigit}${remaining}`; 
} 

/** 
 * Generates an 8-character alphanumeric transaction reference. 
 */ 
export function generateTransactionRef() { 
  return Math.random().toString(36).substring(2, 10).toUpperCase(); 
} 

/** 
 * Generates a masked account number for display (e.g. ****4821) 
 */ 
export function maskAccountNumber(accountNumber: string) { 
  return `****${accountNumber.slice(-4)}`; 
}
