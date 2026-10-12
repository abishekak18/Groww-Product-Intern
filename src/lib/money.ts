/**
 * Money utilities for Groww Start.
 * All monetary amounts in the domain state are stored as integer Paise (1 Rupee = 100 Paise).
 * This eliminates standard IEEE-754 floating point rounding bugs (e.g., 0.1 + 0.2 = 0.30000000000000004).
 */

export const PAISE_PER_RUPEE = 100;

/**
 * Converts a rupee amount (number or string) safely to integer paise.
 * Rounds to nearest integer paise to prevent fractional paise accumulation.
 */
export function toPaise(rupees: number | string): number {
  const numericRupees = typeof rupees === 'string' ? parseFloat(rupees.trim()) : rupees;
  if (!Number.isFinite(numericRupees) || isNaN(numericRupees)) {
    return 0;
  }
  return Math.round(numericRupees * PAISE_PER_RUPEE);
}

/**
 * Converts integer paise back to fractional rupees.
 */
export function toRupees(paise: number): number {
  if (!Number.isFinite(paise) || isNaN(paise)) {
    return 0;
  }
  return paise / PAISE_PER_RUPEE;
}

/**
 * Formats an amount into standard Indian Rupee format (e.g., ₹1,00,000 or ₹2,450.50)
 * Uses Indian numbering grouping (lakhs, crores).
 *
 * @param amount The value in Paise (default) or Rupees
 * @param isPaise Whether the input is in Paise (default: true)
 * @param showDecimals Whether to force decimal paise display (e.g. .50) or hide if .00
 */
export function formatINR(
  amount: number,
  options: { isPaise?: boolean; showDecimals?: 'always' | 'auto' | 'never' } = {}
): string {
  const { isPaise = true, showDecimals = 'auto' } = options;
  const rupeeVal = isPaise ? toRupees(amount) : amount;

  if (!Number.isFinite(rupeeVal) || isNaN(rupeeVal)) {
    return '₹0';
  }

  const isNegative = rupeeVal < 0;
  const absVal = Math.abs(rupeeVal);

  const parts = absVal.toFixed(2).split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Indian numbering grouping: last 3 digits, then groups of 2 digits
  let formattedInteger = '';
  if (integerPart.length <= 3) {
    formattedInteger = integerPart;
  } else {
    const lastThree = integerPart.substring(integerPart.length - 3);
    const remaining = integerPart.substring(0, integerPart.length - 3);
    const groupsOfTwo = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    formattedInteger = `${groupsOfTwo},${lastThree}`;
  }

  let finalDecimal = '';
  if (showDecimals === 'always') {
    finalDecimal = `.${decimalPart}`;
  } else if (showDecimals === 'auto') {
    if (decimalPart !== '00') {
      finalDecimal = `.${decimalPart}`;
    }
  }

  const prefix = isNegative ? '-₹' : '₹';
  return `${prefix}${formattedInteger}${finalDecimal}`;
}

/**
 * Formats a percentage with optional +/- signs.
 */
export function formatPercentage(percent: number, options: { includeSign?: boolean; decimals?: number } = {}): string {
  const { includeSign = false, decimals = 2 } = options;
  if (!Number.isFinite(percent) || isNaN(percent)) {
    return '0.00%';
  }
  const sign = includeSign && percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(decimals)}%`;
}
