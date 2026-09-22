import { LISTING_STATUS } from './offerCatalog.js';

/** @type {Record<string, { label: string, muiColor: 'success' | 'default' | 'warning' }>} */
export const listingStatusPresentation = {
  [LISTING_STATUS.UNLISTED]: { label: 'Unlisted', muiColor: 'default' },
  [LISTING_STATUS.LISTED]: { label: 'Listed', muiColor: 'success' },
  [LISTING_STATUS.DELISTED]: { label: 'Delisted', muiColor: 'warning' },
};

export function getListingStatusPresentation(status) {
  return listingStatusPresentation[status] ?? { label: status, muiColor: 'default' };
}
