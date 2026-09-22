import { OFFER_STATUS } from './offerCatalog.js';

/** @type {Record<string, { label: string, muiColor: 'success' | 'default' | 'warning' | 'info' }>} */
export const offerStatusPresentation = {
  [OFFER_STATUS.DRAFT]: { label: 'Draft', muiColor: 'info' },
  [OFFER_STATUS.ACTIVE]: { label: 'Active', muiColor: 'success' },
  [OFFER_STATUS.INACTIVE]: { label: 'Inactive', muiColor: 'default' },
  [OFFER_STATUS.SUSPENDED]: { label: 'Suspended', muiColor: 'warning' },
};

export function getOfferStatusPresentation(status) {
  return offerStatusPresentation[status] ?? { label: status, muiColor: 'default' };
}
