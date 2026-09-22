/**
 * Validated Vite environment variables.
 * @returns {{ apiBaseUrl: string }}
 */
export function getEnv() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? '';

  if (!apiBaseUrl && import.meta.env.PROD) {
    console.warn('[env] VITE_API_BASE_URL is not set. API requests will fail until configured.');
  }

  return { apiBaseUrl };
}
