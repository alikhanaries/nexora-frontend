import {
  MARKETPLACE_CONNECTION_STATUS,
  MARKETPLACE_CONNECTION_TEST_OUTCOME,
} from './marketplaceConnectionCatalog.js';

/** @type {Record<string, { label: string, muiColor: 'success' | 'default' | 'warning' | 'info' | 'error' }>} */
export const marketplaceConnectionStatusPresentation = {
  [MARKETPLACE_CONNECTION_STATUS.ACTIVE]: { label: 'Connected', muiColor: 'success' },
  [MARKETPLACE_CONNECTION_STATUS.DISABLED]: { label: 'Disconnected', muiColor: 'default' },
};

export const marketplaceConnectionTestOutcomePresentation = {
  [MARKETPLACE_CONNECTION_TEST_OUTCOME.SUCCESS]: { label: 'Success', muiColor: 'success' },
  [MARKETPLACE_CONNECTION_TEST_OUTCOME.FAILURE]: { label: 'Failed', muiColor: 'error' },
};

export function getMarketplaceConnectionStatusPresentation(status) {
  return marketplaceConnectionStatusPresentation[status] ?? { label: status, muiColor: 'default' };
}

export function getMarketplaceConnectionTestOutcomePresentation(outcome) {
  return marketplaceConnectionTestOutcomePresentation[outcome] ?? { label: outcome ?? '—', muiColor: 'default' };
}
