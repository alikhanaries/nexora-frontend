import axios from 'axios';
import { getEnv } from '../../config/env.js';
import { getAccessToken } from '../auth/authSession.js';
import { normalizeApiError } from './apiError.js';

let clientInstance = null;

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
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    (axiosError) => Promise.reject(normalizeApiError(axiosError, axiosError)),
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
