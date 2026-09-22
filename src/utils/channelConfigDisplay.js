/**
 * configurationReference points at external config — never treat as a credential to display in full.
 * @param {string | null | undefined} configurationReference
 */
export function formatConfigurationReference(configurationReference) {
  if (!configurationReference) return 'Not configured';
  return 'Configured';
}

/**
 * Admin-safe hint for detail views (reference id, not secret material).
 * @param {string | null | undefined} configurationReference
 */
export function formatConfigurationReferenceDetail(configurationReference) {
  if (!configurationReference) return 'Not configured';
  const value = configurationReference.trim();
  if (value.length <= 12) return 'Configured';
  return `Configured (ref …${value.slice(-8)})`;
}
