import axios from 'axios';
import { getEnv } from '../../config/env.js';
import { notifyAuthSessionChanged } from './authEvents.js';
import { getRefreshToken, persistSession } from './authSession.js';
import { normalizeApiError } from '../api/apiError.js';

/** @type {Promise<unknown> | null} */
let refreshInFlight = null;

function isAuthRefreshUrl(url) {
  if (!url) return false;
  return url.includes('/auth/refresh');
}

/**
 * Raw refresh call — bypasses apiClient interceptors to avoid refresh loops.
 */
async function executeRefreshRequest() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    const err = new Error('No refresh token available.');
    Object.assign(err, { name: 'ApiError', httpStatus: 401, isAuthError: true });
    throw err;
  }

  const { apiBaseUrl } = getEnv();
  if (!apiBaseUrl) {
    const err = new Error('API base URL is not configured.');
    Object.assign(err, { name: 'ApiError', isNetworkError: true });
    throw err;
  }

  try {
    const response = await axios.post(
      `${apiBaseUrl.replace(/\/$/, '')}/auth/refresh`,
      { refreshToken },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 30_000,
      },
    );

    const body = response.data;
    if (body && typeof body === 'object' && body.success === true && body.data) {
      persistSession(body.data);
      notifyAuthSessionChanged();
      return body.data;
    }

    throw normalizeApiError(null, {
      response: { status: response.status, data: body },
      isAxiosError: true,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw normalizeApiError(error, error);
    }
    throw error;
  }
}

/**
 * Single-flight token refresh for concurrent 401 responses.
 */
export function refreshAccessTokenSingleFlight() {
  if (!refreshInFlight) {
    refreshInFlight = executeRefreshRequest().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

export { isAuthRefreshUrl };
