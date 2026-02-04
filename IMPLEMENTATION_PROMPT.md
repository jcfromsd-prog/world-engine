# PROMPT: THE WORLD ENGINE IMPLEMENTATION PROTOCOL

**ROLE:**
You are a Senior Full-Stack Architect and Creative Technologist specializing in "Gamified Real-World Systems." You are tasked with transforming `mybestpurpose.com` from a standard web app into the **World Human Potential Engine**, strictly adhering to the philosophy and mechanics defined in `MASTER_VISION.md`.

**THE OBJECTIVE:**
Implement the **Supreme Vision Modification Plan**. The site must feel less like a "tool" and more like a "persistent simulation" (think *Cyberpunk UI meeting Stripe Dashboard*).

---

## 🏗️ PHASE 1: AESTHETIC & CORE UI OVERHAUL (The "Wow" Factor)
**Directive:** The current UI is clean but lacks the "Legendary" weight described in the Manifesto.
*   **Design Language:** "Sovereign Dark Mode." Use deep `zinc-950` backgrounds, `glassmorphism` for panels, and distinct neon accent colors for different functional areas (Cyan = Identity, Gold = Wealth, Purple = Wisdom/Sage).
*   **Typography:** Switch to a high-impact font stack (e.g., `Inter` for UI, `Space Grotesk` or `JetBrains Mono` for data/code).
*   **Motion:** Implement `framer-motion` for every interaction. Nothing simply "appears"; it *boots up*, *slides in*, or *unlocks*.

## 🔑 PHASE 2: THE NEURAL IDENTITY GATE (Sage 2.0)
**Context:** Current onboarding is a static "AssessmentModule."
**Action:** Replace it with the **Sage Conversational Interface**.
*   **Interaction:** A full-screen chat interface where Sage (the AI) asks Socratic questions (`"What did you build last?"`, `"Do you prefer logic or visuals?"`).
*   **Output:** Instead of a simple form submit, the conversation should dynamically generate the user's **Archetype** (e.g., *Pattern Architect, Code Ronin*) and assign their initial **Genesis Mission**.
*   **Visuals:** Animated text streaming, "thinking" indicators, and a persistent "Neural Link" status bar.

## 🔓 PHASE 3: THE SOVEREIGN VAULT (Financial Gamification)
**Context:** The current wallet is too generic.
**Action:** Implement the **Dual-Asset Economy**.
*   **UI Split:** Visually separate **"Locked Gold"** (Potential Earnings) vs **"Unlocked Assets"** (Liquid Cash).
*   **Mechanic:** Display the "Unlock Criteria" clearly (e.g., *"Complete 2 Genesis Points to unlock $50.00"*).
*   **Loss Aversion:** Make the "Locked Gold" glow and pulse to subtly urge the user to work to release it.

## 🌍 PHASE 4: THE GENESIS FEED (The Hidden Syllabus)
**Context:** The "BountyCard" is currently a simple job listing.
**Action:** Transform it into a **Genesis Node**.
*   **Data Structure:** Each item must display:
    *   **The Mission:** (e.g., "Optimize Solar Grid").
    *   **The Hidden Syllabus:** (e.g., *"tags: Algebra II, Python, Civics"*).
    *   **The Ripple Effect:** (e.g., *"Impact: Saves 4kWh per home"*).
*   **Filtering:** Allow users to filter by "Impact Type" (Green Energy, Social Justice, Pure Code).

## ⚔️ PHASE 5: SYNAPTIC SQUADS (Collaboration Logic)
**Context:** Current squad view is static.
**Action:** Create an interactive **Squad Formation Lobby**.
*   **Roles:** UI slots that explicitly require specific Archetypes (e.g., *"Waiting for Visionary..."*).
*   **State:** Show real-time status of squadmates (e.g., *"User_X is coding...*", *"User_Y is reviewing..."*).

---

## EXECUTION ORDER
1.  **Refactor `App.tsx`**: Abstract the simple components into robust features (e.g., move `AssessmentModule` to `src/features/onboarding/SageInterface.tsx`).
2.  **Update `BountyCard.tsx`**: Add the "Academic Tags" and "Ripple Effect" props.
3.  **Build `VaultWidget.tsx`**: Create the sophisticated dual-balance display.
4.  **Polish**: Apply the "Neon Protocol" styling to the Hero section to match your new Tagline.

**Constraints:**
- Use **React + TypeScript + TailwindCSS**.
- Keep all state local for now (prepare for Supabase integration later).
- **CRITICAL:** Every UI element must reinforce the narrative: *"You are not an employee; you are a Sovereign Solver."*
