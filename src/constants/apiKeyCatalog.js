/** Mirrors backend api-key summary schema */
export const API_KEY_STATUS = {
  ACTIVE: 'ACTIVE',
  REVOKED: 'REVOKED',
  EXPIRED: 'EXPIRED',
};

export const API_KEY_TYPE = {
  STANDARD: 'STANDARD',
  INTEGRATION: 'INTEGRATION',
};

export const API_KEY_TYPE_OPTIONS = [API_KEY_TYPE.STANDARD, API_KEY_TYPE.INTEGRATION];
