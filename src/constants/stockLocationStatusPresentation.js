/** Mirrors backend stock-location-status.js */
export const STOCK_LOCATION_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

/** @type {Record<string, { label: string, muiColor: 'success' | 'default' }>} */
export const stockLocationStatusPresentation = {
  [STOCK_LOCATION_STATUS.ACTIVE]: { label: 'Active', muiColor: 'success' },
  [STOCK_LOCATION_STATUS.INACTIVE]: { label: 'Inactive', muiColor: 'default' },
};

export function getStockLocationStatusPresentation(status) {
  return (
    stockLocationStatusPresentation[status] ?? {
      label: status,
      muiColor: 'default',
    }
  );
}
