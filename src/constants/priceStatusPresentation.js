import { PRICE_STATUS } from './priceCatalog.js';

/** @type {Record<string, { label: string, muiColor: 'success' | 'default' }>} */
export const priceStatusPresentation = {
  [PRICE_STATUS.ACTIVE]: { label: 'Active', muiColor: 'success' },
  [PRICE_STATUS.INACTIVE]: { label: 'Inactive', muiColor: 'default' },
};

export function getPriceStatusPresentation(status) {
  return priceStatusPresentation[status] ?? { label: status, muiColor: 'default' };
}
