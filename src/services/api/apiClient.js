import axios from 'axios';
import { getEnv } from '../../config/env.js';
import { getAccessToken } from '../auth/authSession.js';
import { triggerSessionExpired } from '../auth/sessionExpired.js';
import { isAuthRefreshUrl, refreshAccessTokenSingleFlight } from '../auth/tokenRefresh.js';
import { normalizeApiError } from './apiError.js';

let clientInstance = null;

function isPublicAuthRequest(url, method) {
  if (!url) return false;
  const path = url.replace(getEnv().apiBaseUrl || '', '');
  if (path.includes('/auth/login') || path.includes('/auth/logout')) {
    return true;
  }
  if (path.includes('/auth/refresh') && method?.toLowerCase() === 'post') {
    return true;
  }
  return false;
}

/**
 * @returns {import('axios').AxiosInstance}
 */
export function getApiClient() {
  if (clientInstance) {
    return clientInstance;
  }

  const { apiBaseUrl } = getEnv();

  clientInstance = axios.create({
    baseURL: apiBaseUrl || undefined,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    timeout: 30_000,
  });

  clientInstance.interceptors.request.use((config) => {
    if (!config.headers.Authorization) {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  clientInstance.interceptors.response.use(
    (response) => {
      const data = response.data;
      if (data && typeof data === 'object' && 'success' in data) {
        if (data.success === true) {
          return data.data;
        }
        const err = normalizeApiError(null, {
          response: {
            status: response.status,
            data,
          },
          isAxiosError: true,
        });
        return Promise.reject(err);
      }
      return data;
    },
    async (axiosError) => {
      const normalized = normalizeApiError(axiosError, axiosError);
      const originalRequest = axiosError.config;

      if (
        normalized.httpStatus === 401 &&
        originalRequest &&
        !originalRequest._authRetry &&
        !originalRequest.skipAuthRefresh &&
        !isPublicAuthRequest(originalRequest.url, originalRequest.method) &&
        !isAuthRefreshUrl(originalRequest.url)
      ) {
        originalRequest._authRetry = true;
        try {
          await refreshAccessTokenSingleFlight();
          originalRequest.headers.Authorization = `Bearer ${getAccessToken()}`;
          return clientInstance.request(originalRequest);
        } catch {
          triggerSessionExpired();
          return Promise.reject(normalized);
        }
      }

      return Promise.reject(normalized);
    },
  );

  return clientInstance;
}

/**
 * @template T
 * @param {import('axios').AxiosRequestConfig} config
 * @returns {Promise<T>}
 */
export async function apiRequest(config) {
  const client = getApiClient();
  return client.request(config);
}

/**
 * Resets the singleton (for tests or hot reload edge cases).
 */
export function resetApiClientForTesting() {
  clientInstance = null;
}
