/**
 * @param {number} amountMinor
 * @param {string} currency ISO 4217 code
 * @param {string} [locale]
 */
export function formatCurrency(amountMinor, currency, locale = undefined) {
  const major = amountMinor / 100;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(major);
}
