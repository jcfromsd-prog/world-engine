---
description: Run the Director's Audit Loop on the active file or component.
---
# Director's Audit Loop

1. **ARCHITECT SCAN**: Read the active file. Does it align with the `MASTER_VISION.md`?

2. **SIMULATOR WALKTHROUGH**:
    - Pretend to be a User (K-5 or 6-12).
    - Can they break it?
    - Is the "Why" clear?
    - Are there dead ends?

3. **BUILDER DIAGNOSIS**:
    - Identify logic errors (TypeScript, React hooks).
    - Check for unused imports or variables.
    - Validate Supabase integration (RLS, Types).

4. **STRATEGIST REPORT**:
    - Summarize findings.
    - Propose 3 actionable fixes (High, Medium, Low priority).

Use `view_file` to read the active document and then provide your analysis based on the `core_protocol.md`.
