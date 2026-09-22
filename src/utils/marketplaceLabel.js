/**
 * @param {import('../services/api/marketplacesService.js').Marketplace[] | undefined} marketplaces
 * @returns {Record<string, string>}
 */
export function buildMarketplaceNameById(marketplaces) {
  if (!marketplaces?.length) return {};
  return Object.fromEntries(marketplaces.map((marketplace) => [marketplace.id, marketplace.name]));
}

/**
 * @param {import('../services/api/marketplacesService.js').Marketplace[] | undefined} marketplaces
 * @param {string} marketplaceId
 */
export function formatMarketplaceLabel(marketplaces, marketplaceId) {
  if (!marketplaceId) return '—';
  const match = marketplaces?.find((marketplace) => marketplace.id === marketplaceId);
  if (match) return `${match.name} (${match.key})`;
  return marketplaceId;
}
