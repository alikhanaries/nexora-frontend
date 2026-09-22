import { AUTH_STORAGE_KEYS } from '../../constants/auth.js';

function read(key) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    if (value === null) {
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, value);
    }
  } catch {
    /* sessionStorage unavailable */
  }
}

export function getAccessToken() {
  return read(AUTH_STORAGE_KEYS.accessToken);
}

export function getRefreshToken() {
  return read(AUTH_STORAGE_KEYS.refreshToken);
}

export function getTokenExpiresAt() {
  const raw = read(AUTH_STORAGE_KEYS.expiresAt);
  return raw ? Number(raw) : null;
}

/**
 * @param {{ accessToken: string, refreshToken: string, expiresIn: number }} tokens
 */
export function persistSession(tokens) {
  const expiresAt = Date.now() + tokens.expiresIn * 1000;
  write(AUTH_STORAGE_KEYS.accessToken, tokens.accessToken);
  write(AUTH_STORAGE_KEYS.refreshToken, tokens.refreshToken);
  write(AUTH_STORAGE_KEYS.expiresAt, String(expiresAt));
}

export function clearSession() {
  write(AUTH_STORAGE_KEYS.accessToken, null);
  write(AUTH_STORAGE_KEYS.refreshToken, null);
  write(AUTH_STORAGE_KEYS.expiresAt, null);
}

export function hasStoredSession() {
  return Boolean(getAccessToken());
}
