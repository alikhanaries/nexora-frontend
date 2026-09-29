import { apiRequest } from './apiClient.js';

export const mfaService = {
  /** POST /api/v1/mfa/totp/start */
  startTotpEnrollment(body = {}) {
    return apiRequest({ method: 'POST', url: '/mfa/totp/start', data: body });
  },

  /** POST /api/v1/mfa/totp/verify */
  verifyTotpEnrollment(body) {
    return apiRequest({ method: 'POST', url: '/mfa/totp/verify', data: body });
  },

  /** POST /api/v1/mfa/totp/activate */
  activateTotpFactor(body) {
    return apiRequest({ method: 'POST', url: '/mfa/totp/activate', data: body });
  },

  /** POST /api/v1/mfa/verify — step-up with TOTP */
  verifyMfaStepUp(body) {
    return apiRequest({ method: 'POST', url: '/mfa/verify', data: body });
  },

  /** POST /api/v1/mfa/recovery-code/use — step-up with recovery code */
  useRecoveryCodeStepUp(body) {
    return apiRequest({ method: 'POST', url: '/mfa/recovery-code/use', data: body });
  },
};
