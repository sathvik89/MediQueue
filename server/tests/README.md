# Backend Test Cases and Results

These tests cover the first batch of automated backend checks for MediQueue. They focus on logic that can be verified without starting the Express server or connecting to MongoDB.

## How to Run

```bash
cd server
npm test
```

## Current Results

Last verified command:

```bash
npm test
```

Result:

```text
tests 10
pass 10
fail 0
```

## Test Cases

| Test File | Test Case | Expected Result | Result |
| --- | --- | --- | --- |
| `appointment_factory.test.ts` | Factory provider returns the correct factory for walk-in, scheduled, and emergency appointments | Correct factory instance is returned for each appointment type | Pass |
| `appointment_factory.test.ts` | Scheduled appointment factory creates a scheduled appointment | Appointment type is `SCHEDULED`, default priority is `NORMAL`, and status is `PENDING` | Pass |
| `appointment_factory.test.ts` | Emergency appointment factory creates an emergency appointment | Appointment type is `EMERGENCY` and default priority is `CRITICAL` | Pass |
| `auth_middleware.test.ts` | Request without bearer token is rejected | Response status is `401` with authentication error message | Pass |
| `auth_middleware.test.ts` | Request with valid JWT and active user is accepted | Authenticated user is attached to request and `next()` is called | Pass |
| `auth_middleware.test.ts` | Role authorization allows matching role and rejects wrong role | Matching role continues, wrong role returns `403` | Pass |
| `queue_strategy.test.ts` | FIFO queue strategy orders patients by check-in time | Earliest checked-in patient is served first | Pass |
| `queue_strategy.test.ts` | Priority queue strategy serves higher priority first | Critical/high-priority cases are ordered before normal cases | Pass |
| `queue_strategy.test.ts` | Priority queue strategy handles equal priority by check-in time | Earlier checked-in patient is served first when priority matches | Pass |
| `queue_strategy.test.ts` | Round-robin strategy rotates starting token | Queue order rotates across repeated calls | Pass |


