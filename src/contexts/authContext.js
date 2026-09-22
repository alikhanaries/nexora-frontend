import { createContext } from 'react';

/** @typedef {'bootstrapping' | 'authenticated' | 'anonymous'} AuthStatus */

/**
 * @typedef {Object} AuthContextValue
 * @property {AuthStatus} status
 * @property {boolean} isAuthenticated
 * @property {boolean} isLoading
 * @property {import('../services/auth/authService.js').MePayload | null} user
 * @property {(input: import('../services/auth/authService.js').LoginInput) => Promise<void>} login
 * @property {() => Promise<void>} logout
 */

export const AuthContext = createContext(/** @type {AuthContextValue | null} */ (null));
