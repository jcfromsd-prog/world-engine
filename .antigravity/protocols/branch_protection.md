
# Branch Protection Rules: main

To ensure the stability of the World Engine, the following rules must be enforced on the `main` branch.
These rules prevent direct pushes and ensure all code is verified by the CI/CD pipeline before merging.

### 1. Require Pull Requests

* **Require a pull request before merging:** Enabled.
* **Dismiss stale pull request approvals when new commits are pushed:** Enabled.

### 2. Status Checks (CI/CD)

* **Require status checks to pass before merging:** Enabled.
* **Status Check Name:** `lint-and-build` (matches the job name in `.github/workflows/ci-cd.yml`).
* **Strict Mode:** Require branches to be up to date before merging.

### 3. Administrator Privileges

* **Include administrators:** Enabled (prevents accidental bypass).
* **Allow force pushes:** Disabled (Critical).
* **Allow deletions:** Disabled.

### 4. Implementation Steps

1. Go to **Settings** -> **Branches**.
2. Click **Add branch protection rule**.
3. **Branch name pattern:** `main`
4. Check **Require a pull request before merging**.
5. Check **Require status checks to pass before merging**.
6. Search for and select: `lint-and-build`.
7. Check **Include administrators**.
8. Click **Create**.

---
*Created by Antigravity Agent - 2026-02-15*
