const DEFAULT_MESSAGES = {
  401: 'Your session has expired. Please sign in again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'This action could not be completed due to a conflict.',
  422: 'Please check the information you entered and try again.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'Something went wrong on our side. Please try again later.',
  502: 'The service is temporarily unavailable. Please try again.',
  503: 'The service is temporarily unavailable. Please try again.',
};

/**
 * @typedef {Object} ApiErrorShape
 * @property {string} message
 * @property {number|null} httpStatus
 * @property {string|null} code
 * @property {string|null} requestId
 * @property {unknown} validationDetails
 * @property {boolean} isAuthError
 * @property {boolean} isNetworkError
 * @property {unknown} [rawResponse]
 */

/**
 * @param {unknown} error
 * @param {import('axios').AxiosError} [axiosError]
 * @returns {ApiErrorShape & Error}
 */
export function normalizeApiError(error, axiosError) {
  if (axiosError?.response) {
    const { status, data } = axiosError.response;
    const envelope = data && typeof data === 'object' ? data : null;
    const backendError =
      envelope && envelope.success === false && envelope.error ? envelope.error : null;

    const message =
      (backendError?.message && String(backendError.message)) ||
      DEFAULT_MESSAGES[status] ||
      DEFAULT_MESSAGES[500];

    const normalized = new Error(message);
    Object.assign(normalized, {
      name: 'ApiError',
      httpStatus: status,
      code: backendError?.code ?? null,
      requestId: envelope?.requestId ?? null,
      validationDetails: backendError?.details ?? null,
      isAuthError: status === 401,
      isNetworkError: false,
      rawResponse: import.meta.env.DEV ? data : undefined,
    });
    return normalized;
  }

  if (axiosError?.request) {
    const normalized = new Error('Unable to reach the server. Check your connection and try again.');
    Object.assign(normalized, {
      name: 'ApiError',
      httpStatus: null,
      code: 'NETWORK_ERROR',
      requestId: null,
      validationDetails: null,
      isAuthError: false,
      isNetworkError: true,
    });
    return normalized;
  }

  const normalized = new Error(error instanceof Error ? error.message : 'An unexpected error occurred.');
  Object.assign(normalized, {
    name: 'ApiError',
    httpStatus: null,
    code: null,
    requestId: null,
    validationDetails: null,
    isAuthError: false,
    isNetworkError: false,
  });
  return normalized;
}

/**
 * @param {ApiErrorShape & Error} error
 * @returns {string}
 */
export function getUserFacingMessage(error) {
  return error.message || DEFAULT_MESSAGES[500];
}
