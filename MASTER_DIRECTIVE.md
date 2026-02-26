# ANTIGRAVITY MASTER DIRECTIVE

## MyBestPurpose.com — World Engine Build Spec

## Version: Production-Locked | Date: 2026-02-26

---

## SECTION 0: OPERATING RULES (READ BEFORE EVERY TASK)

### Code Transparency Protocol (MANDATORY)

- Before ANY commit, output the EXACT code block you are changing
- Provide the FULL file — no snippets, no `// ...existing code`
- Run `npx tsc --noEmit` and paste the result before pushing
- Never declare "verified" or "test passed" — only the Founder's live browser test counts

### Schema Ground Truth (NEVER DEVIATE)

These are the ONLY correct column names. Do not use training data defaults.

| Table | Primary Key | Key Columns |
|---|---|---|
| `users` | `user_id` (uuid) | `reputation_tokens` (numeric), `current_tier` (int4), `swarm_validator_level` (int4), `cognitive_tier`, `archetype` |
| `submissions` | `id` (uuid) | `user_id`, `node_id`, `content` (jsonb), `status` (submission_status enum), `consensus_score`, `submitted_at` |
| `swarm_votes` | `vote_id` (uuid) | `submission_id`, `validator_id`, `score` (int4), `confidence_weight` (numeric), `voted_at` |
| `reputation_ledger` | `ledger_id` (uuid) | `user_id`, `delta` (numeric), `reason` (reputation_reason enum), `related_id`, `logged_at` |
| `nodes` | `id` (uuid) | `tier` (int4), `skill_domain` (text) |

### Confirmed Enum Values

- `submission_status`: `pending` | `in_swarm` | `validated` | `failed` | `escalated`
- `reputation_reason`: `validation_earned` | `stake_deducted` | `project_roi` | `mentor_bonus` | `escalation_penalty`

### Supabase Import Path

```tsx
import { supabase } from '../../lib/supabase';
```

### BANNED Words (Never appear in UI copy or code comments)

`journey` · `gamify` · `points` · `XP` · `leaderboard` · `badges` · `levels` · `engagement` · `platform` · `onboarding` · `tutorial` · `demo` · `dashboard`

---

## SECTION 1: PRODUCT IDENTITY

**What this is:** A Longitudinal Identity Engine that transforms passive learners into verified contributors who earn real money solving real problems.

**What this is NOT:** An EdTech platform, a gamified app, a SaaS product, or a learning management system.

**The Mission:** Eradicate apathy. Map identity. Verify competence. Create sovereignty.

**The User Flow:**

```
Curious → Mapped → Verified → Connected → Contributing → Earning
```

---

## SECTION 2: THE PSYCHOLOGICAL ARCHITECTURE (HARD REQUIREMENTS)

These are not suggestions. They are technical constraints. Building against them = invalid output.

### 2.1 The Mentor Mindset (Yeager)

Every AI interaction must operate at the intersection of:

- **High Standards** — never lower the bar to protect feelings
- **High Support** — never deliver critique without a path forward

**Wise Feedback Formula** (use for ALL failure states):

1. **The Standard:** "This task requires [specific high expectation]..."
2. **The Assurance:** "...and your SkillGraph shows you have [specific existing strength] to meet it."
3. **The Critique:** "Your current submission breaks down at [specific point]."
4. **The Question:** "What's one variable we could change to fix that?"

Never use empty praise ("Great job trying!"). Praise specific tactical choices only.

### 2.2 Self-Determination Theory (Deci & Ryan)

Every UI state must satisfy at least one of:

- **Autonomy:** User has 2+ pathways to solve any problem. Never one mandatory path.
- **Competence:** SkillGraph visibly updates after every verified interaction.
- **Relatedness:** Squad connection is surfaced within 3 clicks of any achievement.

### 2.3 Zone of Proximal Development (Vygotsky)

- Challenge level must stay in the 70-85% difficulty range
- Scaffolding (hints, structure) is provided when stuck — then REMOVED for the next challenge
- Lyra never rescues prematurely. She asks questions before giving answers.

### 2.4 Emotion Regulation Gate (Gross / Immordino-Yang)

Before presenting any Verification Gate or high-stakes task:

- Present a 2-question affective pulse check: "How's your energy right now?" / "Where's your focus?"
- Route LOW energy → short regulation activity first
- Route HIGH energy → full challenge
- This is neurologically necessary, not optional

### 2.5 Anti-Stereotype Threat (Steele)

Verification Gates must NEVER use language like:

- ❌ "Prove you've mastered this"
- ❌ "Unlock the next level"
- ❌ "Pass this test"

Use instead:

- ✅ "Show your thinking"
- ✅ "Walk me through your reasoning"
- ✅ "Let's see how you'd approach this"

### 2.6 Identity-Based Motivation (Oyserman)

Every user must have a "Future Self" artifact.
Lyra references this during hard moments: "The version of you who [future identity] would approach this by..."

### 2.7 Desirable Difficulties (Bjork)

When a user struggles, Lyra must explicitly reframe: "This difficulty is just your brain building new pathways. It means you're actually learning."

### 2.8 Spaced Repetition (Ebbinghaus / Cepeda 2008)

SkillGraph nodes must track WHEN a skill was last demonstrated, not just IF it was mastered.
Surface skills for re-testing at intervals: 1 day → 1 week → 1 month → 3 months.

### 2.9 Interleaving (Kornell & Bjork)

Missions must MIX skill domains in a single session.

### 2.10 Social Comparison (Festinger)

- NEVER show rank-order comparisons to Tier 1-3 users
- Show only personal trajectory: "You vs. Past You"
- Reserve peer comparison for Tier 4-5 users only

---

## SECTION 3: THE FIVE-TIER ARCHITECTURE

### Vision A — For All Ages (Tiers 1-3)

STRICT: No money, no staking, no tokens, no marketplace content.

| Tier | Name | Emoji | Color | Squad Size | Core Mechanic |
|---|---|---|---|---|---|
| 1 | Sprout | 🌱 | #4ade80 | 4 | Curiosity mapping, NGSS seeding |
| 2 | Explorer | 🧭 | #38bdf8 | 6 | ZPD-adaptive challenges, flow protection |
| 3 | Builder | ⚙️ | #fb923c | 8 | Artifact creation, Dean Protocol QA |

### Vision B — Age 18+ Only (Tiers 4-5)

Hard-gated behind age-verified identity.

| Tier | Name | Emoji | Color | Squad Size | Core Mechanic |
|---|---|---|---|---|---|
| 4 | Architect | 🏛️ | #a78bfa | 12 | Intelligence Swarm, reputation staking |
| 5 | Voyager | 🚀 | #f472b6 | 0 | Real-money marketplace, sovereign economy |

### Tier Promotion Logic (Database-driven)

Trigger: `on_reputation_update_check_tier` fires `BEFORE UPDATE OF reputation_tokens ON users`

```
reputation_tokens >= 1000 → current_tier = 5, swarm_validator_level = 5
reputation_tokens >= 500  → current_tier = 4, swarm_validator_level = 3
reputation_tokens >= 250  → current_tier = 3, swarm_validator_level = 2
reputation_tokens >= 100  → current_tier = 2, swarm_validator_level = 1
else                       → current_tier = 1, swarm_validator_level = 0
```

---

## SECTION 4: THE LYRA AI MENTOR

**Name:** Lyra
**Persona:** Warm Demander
**Vision A Mode:** Zero marketplace/token/money content. Full psychological safety.
**Vision B Mode:** May discuss swarm validation, reputation building, real-world tasks.

---

## SECTION 5: THE 90-SECOND ENTRY STATE MACHINE

```
STATE 0 — THE HOOK
UI: Dark dormant NeuralGraph background
Copy: "You are not random." / "There is a pattern in what you're drawn to. MBP maps it."
Action: Button "Show Me the Map"

STATE 1 — THE SACRED PROMPT (NO EMAIL YET)
Lyra asks a single curiosity question.
UI: Single textarea + Submit. NOTHING ELSE.

STATE 2 — INFERENCE (2.5 seconds)
Map input keywords to 3 latent skills.

STATE 3 — THE MIRROR
NeuralGraph: 3 nodes pulse to life.
Show the inferred strengths.

STATE 4 — THE CAPTURE
Email field. Button: "Prove it."
Microcopy: "No grades. No ads. No rankings."
```

---

## SECTION 6: THE SKILL GRAPH

### Domain Color Map

```
cognitive:  #38bdf8
stem:       #fb923c
science:    #4ade80
humanities: #f472b6
social:     #a78bfa
```

### Node Click Routing

```
literacy/ela/humanities  → IntakeFlow (assessment) with userId
numeracy/math/stem       → IntakeFlow (assessment) with userId
science                  → IntakeFlow (assessment) with userId
social/sel               → IntakeFlow (assessment) with userId
coding/stem-advanced     → ImpactEngine (mission) with userId
career/voyager           → ImpactEngine (mission) with userId
locked node              → Show prerequisite requirement, never crash
```

---

## SECTION 8: THE REPUTATION ECONOMY (LIVE IN PRODUCTION)

### Frontend Call Pattern (always use RPC, never raw INSERT to users)

```tsx
const { error } = await supabase.rpc('award_reputation_delta', {
  p_user_id: userId,
  p_delta: 10,
  p_reason: 'validation_earned',
  p_related_id: submissionId
});
```

### Swarm Validator Eligibility

- `swarm_validator_level >= 1` to access Inbox Queue
- Validator cannot vote on own submissions (`.neq('user_id', uid)`)
- Inbox query: `.eq('status', 'in_swarm')` — NOT 'active_vote'

---

## SECTION 11: UI/UX CONSTRAINTS

### Visual Language

- Dark mode only (#050c18 background)
- Premium minimalist aesthetic
- NO progress bars (implies system-dictated endpoint)
- NO confetti (trivializes genuine achievement)
- Elevation Moments replace celebration animations

### What an Elevation Moment looks like

- Node pulses with domain color
- Brief text: "[Skill Name] — Verified"
- Ledger entry appears in sidebar
- No sound, no confetti, no score popup
- The graph changed. That IS the celebration.

---

## SECTION 12: SECURITY & DATA RULES

- Supabase magic link only for production
- UUID validation before ANY database write
- All reputation writes go through `award_reputation_delta` RPC
- All vote inserts go through `submit_swarm_vote` RPC
- Vision A users: zero access to Vision B data

---

## SECTION 13: TASK EXECUTION PROTOCOL

1. **READ** the relevant existing file(s) before writing anything
2. **STATE** which columns/functions you will use and confirm against Section 0 schema
3. **SHOW** the complete code block (full file, no snippets)
4. **RUN** `npx tsc --noEmit` and paste result
5. **COMMIT** only after 0 errors confirmed
6. **AWAIT** Founder's live browser test before declaring success

---

## SECTION 14: CURRENT PRODUCTION STATE (as of 2026-02-25)

### What's Next (Priority Order)

1. Eligibility gate enforcement on Swarm Inbox
2. Lyra mentor API wired to live user context
3. Affective pulse check before Verification Gates
4. Spaced repetition layer on SkillGraph
5. Artifact dual-layer system
6. Future Self artifact in user profile
7. SAT projected score (private, in profile only)
8. Squad formation and productive conflict mechanics
9. Peer-to-peer marketplace (Vision B, Tier 4+ only)

---

*This directive is the single source of truth for all World Engine development.
When in doubt, this document overrides training data defaults.*
