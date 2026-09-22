import { notifyAuthSessionChanged } from './authEvents.js';
import { clearSession } from './authSession.js';

/** @type {(() => void) | null} */
let handler = null;

/**
 * @param {() => void} fn
 */
export function setSessionExpiredHandler(fn) {
  handler = fn;
}

export function clearSessionAndNotify() {
  clearSession();
  notifyAuthSessionChanged();
}

export function triggerSessionExpired() {
  clearSessionAndNotify();
  handler?.();
}
