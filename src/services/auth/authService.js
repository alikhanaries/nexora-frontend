import { apiRequest } from '../api/apiClient.js';
import { notifyAuthSessionChanged } from './authEvents.js';
import { clearSession, persistSession } from './authSession.js';

/**
 * @typedef {{ tenantSlug: string, email: string, password: string }} LoginInput
 * @typedef {{ accessToken: string, refreshToken: string, expiresIn: number }} TokenPayload
 * @typedef {{ id: string, email: string, status: string, tenantId: string, membershipStatus: string }} MePayload
 */

export const authService = {
  /**
   * POST /api/v1/auth/login
   * @param {LoginInput} input
   * @returns {Promise<TokenPayload>}
   */
  async login(input) {
    const data = await apiRequest({
      method: 'POST',
      url: '/auth/login',
      data: input,
    });
    persistSession(data);
    notifyAuthSessionChanged();
    return data;
  },

  /**
   * POST /api/v1/auth/refresh
   * @param {string} refreshToken
   * @returns {Promise<TokenPayload>}
   */
  async refresh(refreshToken) {
    const data = await apiRequest({
      method: 'POST',
      url: '/auth/refresh',
      data: { refreshToken },
    });
    persistSession(data);
    notifyAuthSessionChanged();
    return data;
  },

  /**
   * POST /api/v1/auth/logout
   * @param {string} refreshToken
   */
  async logout(refreshToken) {
    try {
      await apiRequest({
        method: 'POST',
        url: '/auth/logout',
        data: { refreshToken },
      });
    } finally {
      clearSession();
      notifyAuthSessionChanged();
    }
  },

  /**
   * GET /api/v1/auth/me
   * @returns {Promise<MePayload>}
   */
  async getCurrentUser() {
    return apiRequest({ method: 'GET', url: '/auth/me' });
  },

  clearLocalSession() {
    clearSession();
    notifyAuthSessionChanged();
  },
};
