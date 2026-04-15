import api from "./api";
import { tokenUtils } from "../utils/token";
import type { User, Role } from "../types";

// ─── Types ────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
  /** Frontend role string e.g. 'patient' — normalized to uppercase before sending */
  role: Role;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
  /** Required when role is 'doctor' */
  specialty?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

// ─── Helpers ──────────────────────────────────────────────────────

/**
 * Backend UserRole enum values are uppercase (PATIENT/DOCTOR/ADMIN).
 * Frontend Role type is lowercase. This normalises the backend response.
 */
const normalizeRole = (backendRole: string): Role =>
  backendRole.toLowerCase() as Role;

const toBackendRole = (frontendRole: Role): string =>
  frontendRole.toUpperCase();

const mapUser = (raw: {
  id: string;
  name: string;
  email: string;
  role: string;
  specialization?: string;
}): User => ({
  id: raw.id,
  name: raw.name,
  email: raw.email,
  role: normalizeRole(raw.role),
  ...(raw.specialization ? { specialization: raw.specialization } : {}),
});

// ─── Auth API Calls ───────────────────────────────────────────────

/**
 * POST /api/auth/login
 * Validates credentials against MongoDB, returns JWT + user.
 */
export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await api.post("/auth/login", {
    email: payload.email,
    password: payload.password,
    role: toBackendRole(payload.role),
  });

  const user = mapUser(data.user);
  tokenUtils.setToken(data.token);
  tokenUtils.setUser(user);

  return { user, token: data.token, message: data.message };
};

/**
 * POST /api/auth/register
 * Creates a new user in MongoDB, returns JWT + user.
 */
export const register = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  const { data } = await api.post("/auth/register", {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    phone: payload.phone,
    role: toBackendRole(payload.role),
    ...(payload.specialty ? { specialty: payload.specialty } : {}),
  });

  const user = mapUser(data.user);
  tokenUtils.setToken(data.token);
  tokenUtils.setUser(user);

  return { user, token: data.token, message: data.message };
};

/**
 * GET /api/auth/me  (Bearer token required)
 * Used by AuthContext on page load to silently re-validate a stored JWT.
 * Returns null if the token is missing, expired or invalid.
 */
export const getMe = async (): Promise<User | null> => {
  try {
    const { data } = await api.get("/auth/me");
    return mapUser(data);
  } catch {
    return null;
  }
};

/**
 * Client-side logout — wipes token + user from storage.
 * The AuthContext calls this to reset state.
 */
export const logout = (): void => {
  tokenUtils.clearAll();
};

