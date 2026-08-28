// Supported currencies with symbols and approximate USD exchange rates
// Rates are approximate and used for display conversion only
export const CURRENCIES: Record<string, { symbol: string; name: string; rateFromUSD: number }> = {
  USD: { symbol: "$",  name: "US Dollar",        rateFromUSD: 1       },
  EUR: { symbol: "€",  name: "Euro",              rateFromUSD: 0.92    },
  GBP: { symbol: "£",  name: "British Pound",     rateFromUSD: 0.79    },
  CAD: { symbol: "C$", name: "Canadian Dollar",   rateFromUSD: 1.36    },
  AUD: { symbol: "A$", name: "Australian Dollar", rateFromUSD: 1.53    },
  CHF: { symbol: "₣",  name: "Swiss Franc",       rateFromUSD: 0.90    },
  JPY: { symbol: "¥",  name: "Japanese Yen",      rateFromUSD: 155.0   },
  SGD: { symbol: "S$", name: "Singapore Dollar",  rateFromUSD: 1.34    },
  AED: { symbol: "د.إ",name: "UAE Dirham",        rateFromUSD: 3.67    },
  NGN: { symbol: "₦",  name: "Nigerian Naira",    rateFromUSD: 1600    },
  INR: { symbol: "₹",  name: "Indian Rupee",      rateFromUSD: 83.5    },
  CNY: { symbol: "¥",  name: "Chinese Yuan",      rateFromUSD: 7.25    },
  BRL: { symbol: "R$", name: "Brazilian Real",    rateFromUSD: 4.98    },
  ZAR: { symbol: "R",  name: "South African Rand",rateFromUSD: 18.5    },
  MXN: { symbol: "Mex$",name: "Mexican Peso",     rateFromUSD: 17.1    },
};

export type CurrencyCode = keyof typeof CURRENCIES;

/**
 * Convert a USD amount to the target currency
 */
export function convertFromUSD(usdAmount: number, toCurrency: CurrencyCode = "USD"): number {
  const rate = CURRENCIES[toCurrency]?.rateFromUSD ?? 1;
  return usdAmount * rate;
}

/**
 * Format a USD amount in the target currency with symbol
 */
export function formatInCurrency(usdAmount: number, currencyCode: CurrencyCode = "USD"): string {
  const currency = CURRENCIES[currencyCode] ?? CURRENCIES.USD;
  const converted = usdAmount * currency.rateFromUSD;

  // JPY and similar have no decimal places
  const decimals = currencyCode === "JPY" ? 0 : 2;

  const formatted = converted.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${currency.symbol}${formatted}`;
}

/**
 * Get just the currency symbol
 */
export function getCurrencySymbol(currencyCode: CurrencyCode = "USD"): string {
  return CURRENCIES[currencyCode]?.symbol ?? "$";
}
