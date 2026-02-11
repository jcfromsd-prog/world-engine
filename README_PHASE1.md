
# PHASE 1: IDENTITY CALIBRATION

This package implements the core Identity Calibration protocol, raising contributor confidence from a cold-start (15%) to an active state (85%).

## Deliverables

- **UI:** `CalibrationModal.tsx` (3-step stepper with results report)
- **Service:** `CalibrationService.ts` (Safe, Atomic, Gated logic)
- **API:** Simulated `postCalibrate` bridge for future backend integration.
- **Verification:** Automated script to prevent regressions.

## Safety Protocols

1. **Solvency Guard:** Only unlocks Tier 0 (Training) tasks.
2. **Production Gating:** Restricted to Admins in production environments.
3. **Optimistic Locking:** Require `version` match to prevent state corruption.

## Local Verification

To run the safety verification script locally, execute the following command:

```bash
npx tsx scripts/verify-calibrate.ts
```

## Traceability

Each calibration event emits a `traceId` and is logged to the backend/console telemetry for auditing.
