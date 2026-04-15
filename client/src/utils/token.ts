/**
 * token.ts
 * Centralized JWT & user session storage utilities.
 * Single source of truth for all localStorage interactions related to auth.
 */

const TOKEN_KEY = "mediQueue_token";
const USER_KEY = "mediQueue_user";

export const tokenUtils = {
  // ── Token ────────────────────────────────────────────────────────
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  // ── User ─────────────────────────────────────────────────────────
  getUser: <T = unknown>(): T | null => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  setUser: (user: unknown): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser: (): void => {
    localStorage.removeItem(USER_KEY);
  },

  // ── Session ───────────────────────────────────────────────────────
  /** Wipes both token and user — call on logout or 401. */
  clearAll: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /** Returns true only when a token exists in storage. */
  hasToken: (): boolean => {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },
};
