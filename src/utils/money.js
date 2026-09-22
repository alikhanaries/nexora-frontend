import { formatCurrency } from './formatCurrency.js';

/**
 * Backend stores amounts as integer minor units (e.g. cents). Display via formatCurrency.
 * @param {number} amountMinor
 * @param {string} currency ISO 4217 (3 letters from API)
 */
export function formatMoneyMinor(amountMinor, currency) {
  return formatCurrency(amountMinor, currency.toUpperCase());
}

/**
 * Parse a decimal major-units string into minor units (×100).
 * Suitable for currencies with two decimal minor digits (matches backend int minor storage).
 * @param {string} majorUnits
 * @returns {number|null}
 */
export function parseMajorUnitsToMinor(majorUnits) {
  const trimmed = majorUnits.trim();
  if (!trimmed || !/^\d+(\.\d{1,2})?$/.test(trimmed)) return null;
  const [whole, fraction = ''] = trimmed.split('.');
  const minor = Number(whole) * 100 + Number(fraction.padEnd(2, '0').slice(0, 2));
  if (!Number.isInteger(minor) || minor <= 0) return null;
  return minor;
}

/**
 * @param {number} amountMinor
 * @returns {string}
 */
export function minorUnitsToMajorInput(amountMinor) {
  const major = amountMinor / 100;
  return major.toFixed(2);
}
