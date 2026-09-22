import { PRODUCT_STATUS } from './productCatalog.js';

/** @type {Record<string, { label: string, muiColor: 'success' | 'default' | 'warning' }>} */
export const productStatusPresentation = {
  [PRODUCT_STATUS.ACTIVE]: { label: 'Active', muiColor: 'success' },
  [PRODUCT_STATUS.INACTIVE]: { label: 'Inactive', muiColor: 'warning' },
  [PRODUCT_STATUS.ARCHIVED]: { label: 'Archived', muiColor: 'default' },
};

/**
 * @param {string} status
 */
export function getProductStatusPresentation(status) {
  return (
    productStatusPresentation[status] ?? {
      label: status,
      muiColor: 'default',
    }
  );
}
