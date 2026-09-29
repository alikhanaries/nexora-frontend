const SENSITIVE_KEY_PATTERN =
  /secret|password|token|credential|authorization|cookie|private|hash|signing/i;

/**
 * Safe summary for audit metadata — never returns raw secrets.
 * @param {Record<string, unknown> | null | undefined} metadata
 */
export function formatAuditMetadataSummary(metadata) {
  if (!metadata || typeof metadata !== 'object') return '—';
  const entries = Object.entries(metadata);
  if (entries.length === 0) return '—';

  const safeParts = [];
  for (const [key, value] of entries) {
    if (SENSITIVE_KEY_PATTERN.test(key)) continue;
    if (value === null || value === undefined) continue;
    if (typeof value === 'string') {
      if (SENSITIVE_KEY_PATTERN.test(value)) continue;
      const trimmed = value.length > 48 ? `${value.slice(0, 45)}…` : value;
      safeParts.push(`${key}: ${trimmed}`);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      safeParts.push(`${key}: ${String(value)}`);
    } else if (Array.isArray(value)) {
      safeParts.push(`${key}: [${value.length} item(s)]`);
    } else if (typeof value === 'object') {
      safeParts.push(`${key}: {…}`);
    }
    if (safeParts.length >= 3) break;
  }

  if (safeParts.length === 0) return 'Available';
  return safeParts.join(' · ');
}
