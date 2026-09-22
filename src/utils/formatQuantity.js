/**
 * Inventory quantities are integers from the backend.
 * @param {number | null | undefined} value
 */
export function formatQuantity(value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);
}
