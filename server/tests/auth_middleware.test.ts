import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { authenticate, authorizeRole } from "../src/middlewares/auth_middleware";
import { UserModel } from "../src/models/user_model";
import { UserRole } from "../src/types/system.types";

const JWT_SECRET = "default_jwt_secret_mediqueue_2026";
const originalFindById = UserModel.findById;

type MockResponse = {
  statusCode?: number;
  body?: unknown;
  status: (code: number) => MockResponse;
  json: (payload: unknown) => MockResponse;
};

const createResponse = (): MockResponse => ({
  status(code: number) {
    this.statusCode = code;
    return this;
  },
  json(payload: unknown) {
    this.body = payload;
    return this;
  },
});

test.afterEach(() => {
  UserModel.findById = originalFindById;
});

test("authenticate rejects requests without a bearer token", async () => {
  const req = { headers: {} };
  const res = createResponse();
  let nextCalled = false;

  await authenticate(req as any, res as any, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.body, { message: "Authentication required" });
  assert.equal(nextCalled, false);
});

test("authenticate attaches an active user and calls next for a valid token", async () => {
  const token = jwt.sign({ id: "user-1", role: UserRole.PATIENT }, JWT_SECRET);
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = createResponse();
  let nextCalled = false;

  (UserModel.findById as any) = () => ({
    select: async () => ({
      _id: "user-1",
      role: UserRole.PATIENT,
      isActive: true,
    }),
  });

  await authenticate(req as any, res as any, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.deepEqual((req as any).user, {
    _id: "user-1",
    role: UserRole.PATIENT,
  });
});

test("authorizeRole allows matching roles and rejects insufficient roles", () => {
  const allowedReq = { user: { _id: "doctor-1", role: UserRole.DOCTOR } };
  const allowedRes = createResponse();
  let allowedNextCalled = false;

  authorizeRole(UserRole.DOCTOR)(allowedReq as any, allowedRes as any, () => {
    allowedNextCalled = true;
  });

  const rejectedReq = { user: { _id: "patient-1", role: UserRole.PATIENT } };
  const rejectedRes = createResponse();
  let rejectedNextCalled = false;

  authorizeRole(UserRole.DOCTOR)(rejectedReq as any, rejectedRes as any, () => {
    rejectedNextCalled = true;
  });

  assert.equal(allowedNextCalled, true);
  assert.equal(allowedRes.statusCode, undefined);
  assert.equal(rejectedNextCalled, false);
  assert.equal(rejectedRes.statusCode, 403);
  assert.deepEqual(rejectedRes.body, { message: "Access forbidden: insufficient role" });
});
