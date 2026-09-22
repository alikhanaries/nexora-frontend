/**
 * @param {string|Date} value
 * @param {Intl.DateTimeFormatOptions} [options]
 * @param {string} [locale]
 */
export function formatDate(value, options = {}, locale = undefined) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
    ...options,
  }).format(date);
}
