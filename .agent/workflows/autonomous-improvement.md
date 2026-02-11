---
description: How to autonomously evolve the World Engine based on the Master Blueprint
---

# WORKFLOW: AUTONOMOUS WORLD ENGINE EVOLUTION

This workflow defines how the AI (Antigravity) should "fix and improve" the site while adhering to the **Sovereign Marketplace Protocol**.

## 1. PRE-FLIGHT: FOUNDER SYNC

Before making any change, the AI MUST:

- Read `MASTER_VISION.md` and `WORLD_ENGINE_MASTER_CODE.md`.
- Read `src/services/WorldEngineOS.ts` to understand the current Governance Gates.
- Verify the `LearnerProfile` status (Calibration level).

## 2. THE EVOLUTION LOOP

When the USER asks for a feature or a fix:

1. **Pillar Check**: Identify which pillar is affected (Solvency, Quality, Learning, Autonomy).
2. **OS Validation**: Consult `WorldEngineOS` to see if the proposed change violates any "Rule of 3" or "Solvency Guard".
3. **Draft Implementation**: Create the logic layer (Services) BEFORE the UI layer (Components).
4. **Governed Execution**:
    - If it involves money, use `FinancialEngine`.
    - If it involves work, use `DeanProtocol`.
    - If it involves progression, use `MarketplaceGovernor`.

## 3. VERIFICATION

- ALWAYS create a `scripts/verify-[feature].ts` to prove the logic works independently of the UI.
- Run `npm run typecheck` to ensure zero regressions.

## 4. REPORTING

- Provide a **Trace-ID** for every logical "Evolution Event".
- Show the **Sovereign Split** for any new payout logic.

// turbo-all

## 5. AUTO-CALIBRATION

When a new logic service is created, automatically update the `WorldEngineOS` to include it in the orchestrator.
