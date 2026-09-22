import { getUserFacingMessage } from '../services/api/apiError.js';

/**
 * User-safe login failure messages (no raw API / stack traces).
 * @param {Error & { httpStatus?: number|null, isNetworkError?: boolean, code?: string|null }} error
 */
export function getLoginErrorMessage(error) {
  if (error?.isNetworkError) {
    return 'Unable to connect to the server. Please try again.';
  }

  const status = error?.httpStatus;
  if (status === 401 || error?.isAuthError || error?.code === 'AUTHENTICATION_ERROR') {
    return 'Invalid email, password, or tenant.';
  }

  if (status === 422) {
    return getUserFacingMessage(error);
  }

  return getUserFacingMessage(error);
}
