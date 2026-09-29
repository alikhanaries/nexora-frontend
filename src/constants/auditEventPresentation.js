/**
 * Display label for audit eventType (backend value unchanged in API).
 * @param {string} eventType
 */
export function formatAuditEventLabel(eventType) {
  if (!eventType) return '—';
  return eventType
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ');
}
