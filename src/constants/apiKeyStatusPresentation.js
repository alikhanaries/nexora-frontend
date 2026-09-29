import { API_KEY_STATUS } from './apiKeyCatalog.js';

/** @type {Record<string, { label: string, muiColor: 'success' | 'default' | 'warning' | 'error' }>} */
export const apiKeyStatusPresentation = {
  [API_KEY_STATUS.ACTIVE]: { label: 'Active', muiColor: 'success' },
  [API_KEY_STATUS.REVOKED]: { label: 'Revoked', muiColor: 'error' },
  [API_KEY_STATUS.EXPIRED]: { label: 'Expired', muiColor: 'warning' },
};

export function getApiKeyStatusPresentation(status) {
  return apiKeyStatusPresentation[status] ?? { label: status, muiColor: 'default' };
}
