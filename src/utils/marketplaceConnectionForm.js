/**
 * @param {import('../constants/marketplaceConnectionCatalog.js').MarketplaceConnectionFieldDef[]} fields
 * @param {Record<string, string>} values
 * @param {{ mode: 'create' | 'edit' }} options
 */
export function buildMarketplaceConnectionSectionPayload(fields, values, options) {
  /** @type {Record<string, unknown>} */
  const payload = {};
  for (const field of fields) {
    const raw = values[field.name] ?? '';
    const trimmed = raw.trim();
    if (options.mode === 'edit' && field.secret && trimmed.length === 0) {
      continue;
    }
    if (field.required && trimmed.length === 0) {
      throw new Error(`${field.label} is required`);
    }
    if (trimmed.length === 0) {
      continue;
    }
    payload[field.name] = field.multiline ? raw : trimmed;
  }
  return payload;
}

/**
 * @param {Record<string, unknown>} configuration
 * @param {import('../constants/marketplaceConnectionCatalog.js').MarketplaceConnectionFieldDef[]} fields
 */
export function configurationToFormValues(configuration, fields) {
  /** @type {Record<string, string>} */
  const values = {};
  for (const field of fields) {
    const value = configuration[field.name];
    values[field.name] = value === undefined || value === null ? '' : String(value);
  }
  return values;
}

/** @param {Record<string, unknown>} configuration */
export function formatConfigurationSummary(configuration) {
  const entries = Object.entries(configuration ?? {}).filter(
    ([, value]) => value !== undefined && value !== null && String(value).trim() !== '',
  );
  if (entries.length === 0) return '—';
  return entries.map(([key, value]) => `${key}: ${String(value)}`).join(' · ');
}
