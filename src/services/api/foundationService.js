import { apiRequest } from './apiClient.js';

export const foundationService = {
  ping() {
    return apiRequest({ method: 'GET', url: '/foundation/ping' });
  },

  /**
   * @param {{ message: string }} body
   */
  echo(body) {
    return apiRequest({ method: 'POST', url: '/foundation/echo', data: body });
  },
};
