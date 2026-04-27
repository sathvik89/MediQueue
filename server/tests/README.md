# Backend Test Cases and Results

These tests cover the automated backend checks for MediQueue. They focus on controller behavior, middleware behavior, appointment creation logic, and queue-ordering rules without starting the Express server or connecting to MongoDB.

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
tests 15
pass 15
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
| `patient_controller.test.ts` | Patient books an appointment for today | Appointment is created, queue entry is added, token number is assigned, and response status is `201` | Pass |
| `patient_controller.test.ts` | Patient cancels an appointment | Appointment status changes to `CANCELLED`, cancellation time is recorded, queue entry is removed, and response status is `200` | Pass |
| `patient_controller.test.ts` | Patient checks queue status | Current queue position, estimated wait time, token number, total waiting count, and doctor name are returned | Pass |
| `doctor_controller.test.ts` | Doctor views today's queue | Queue entries are formatted for the dashboard with patient names, issue text, status, priority, token number, and critical flag | Pass |
| `doctor_controller.test.ts` | Doctor completes consultation | Appointment is completed, queue entry is marked done, medical record is created, and response status is `200` | Pass |
| `queue_strategy.test.ts` | FIFO queue strategy orders patients by check-in time | Earliest checked-in patient is served first | Pass |
| `queue_strategy.test.ts` | Priority queue strategy serves higher priority first | Critical/high-priority cases are ordered before normal cases | Pass |
| `queue_strategy.test.ts` | Priority queue strategy handles equal priority by check-in time | Earlier checked-in patient is served first when priority matches | Pass |
| `queue_strategy.test.ts` | Round-robin strategy rotates starting token | Queue order rotates across repeated calls | Pass |

## Test File Summary

- `appointment_factory.test.ts`: validates the Factory Pattern implementation for creating appointment objects.
- `auth_middleware.test.ts`: validates JWT authentication and role-based authorization middleware.
- `patient_controller.test.ts`: validates patient booking, cancellation, and queue-status controller flows.
- `doctor_controller.test.ts`: validates doctor queue display and consultation completion controller flows.
- `queue_strategy.test.ts`: validates FIFO, priority, and round-robin queue ordering strategies.
- `helpers/mock_response.ts`: provides a lightweight mock Express response object used by controller and middleware tests.

## Possible Future Test Improvements

- Add integration tests with a temporary MongoDB test database.
- Add frontend tests for protected routes and dashboard rendering.
- Add end-to-end tests for the deployed patient and doctor workflows.
