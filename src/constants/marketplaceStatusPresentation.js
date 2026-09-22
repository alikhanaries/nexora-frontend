import { MARKETPLACE_STATUS } from './marketplaceCatalog.js';

/** @type {Record<string, { label: string, muiColor: 'success' | 'default' }>} */
export const marketplaceStatusPresentation = {
  [MARKETPLACE_STATUS.ACTIVE]: { label: 'Active', muiColor: 'success' },
  [MARKETPLACE_STATUS.INACTIVE]: { label: 'Inactive', muiColor: 'default' },
};

export function getMarketplaceStatusPresentation(status) {
  return marketplaceStatusPresentation[status] ?? { label: status, muiColor: 'default' };
}
