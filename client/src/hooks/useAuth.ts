/**
 * useAuth.ts
 *
 * Industry-standard hook re-export.
 * Consumers import from here rather than directly from the context module,
 * which keeps the context implementation as an internal detail — easier to
 * swap out later (e.g. to Zustand or Redux) without touching every component.
 *
 * Usage:
 *   import { useAuth } from '../hooks/useAuth';
 */
export { useAuth } from "../context/AuthContext";
