# Soulbound Progression Architecture

## Overview

The **Soulbound Progression Engine** is the "Brain" that powers MyBestPurpose.com's "Apprentice to Pro" journey. It tracks, guides, and rewards users from their first game to their first paycheck.

---

## 🏗️ Architecture Components

### 1. The "Memory": Soulbound Profile (`src/engine/types.ts`)

A dynamic student record that serves as a living history of skills:

```typescript
interface SoulboundProfile {
    // Identity
    userId: string;
    displayName: string;
    archetype: string;       // Engineer, Architect, Creator, Commander
    sector: string;          // Nature, Tech, People
    
    // Progression
    skillGraph: SkillGraph;  // 6 skill categories with levels
    completedNodes: CompletedNode[];
    resumePoint?: { ... };   // "Welcome back" save state
    
    // Social
    squadId?: string;
    squadRole?: 'tank' | 'dps' | 'support' | 'strategist';
    reputation: number;
    
    // Economy
    genesisPoints: number;   // Play money (GP)
    realBalance: number;     // Actual USD earned
    pendingPayout: number;   // In escrow
    verifiedSolverBadge: boolean;
    
    // Engagement
    dailyStreak: number;
    longestStreak: number;
}
```

### 2. The Skill Graph

6 skill categories that grow with practice:

| Category | Description | Example Missions |
|----------|-------------|-----------------|
| **Logic** | Math, Programming, Problem Solving | CSS Color Fix, Key Decryption |
| **Creativity** | Art, Design, Writing | Logo Symmetry, Animation Timing |
| **Engineering** | Building, Hardware, Physics | Gear Ratio Calc, Battery Sort |
| **Leadership** | Team Management, Communication | Team Assign, Resource Alloc |
| **Nature** | Biology, Ecology, Environment | Leaf Pattern Match, Stream Flow |
| **Social** | Collaboration, Empathy, Networking | Team Communication, Feedback |

**Mastery Tiers:**
- **Novice** (Level 1-9)
- **Apprentice** (Level 10-24)
- **Journeyman** (Level 25-49)
- **Expert** (Level 50-79)
- **Master** (Level 80-100)

---

### 3. The "Guide": Sage AI Director (`src/engine/SageDirector.ts`)

The Mission Director that constantly analyzes and adapts:

#### The "Slip-In" Method

```
Scenario: Student plays "Forest Ranger" game
Academic Need: Failing 4th-grade Math (Fractions)

BEFORE: "Find the sick tree"
AFTER:  "Mix the medicine. Combine 1/2 cup of red serum 
        with 1/4 cup of blue serum to save the tree"

Result: User solves fraction problem to "win" the game level
```

#### Difficulty Calibration

| Performance | Accuracy | Time | Action |
|-------------|----------|------|--------|
| Struggling | < 60% | > 150% | Decrease difficulty |
| Perfect | > 90% | < 50% | Increase difficulty |
| Normal | 60-90% | 50-150% | Maintain |

#### Sage Directives

```typescript
type SageDirective = {
    type: 'adapt_difficulty' | 'slip_in_content' | 'suggest_squad' | 'unlock_bounty';
    priority: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    action: object;
}
```

---

### 4. The "Team": Squad System

#### Solo Cap Mechanics

| Level | Status | Access |
|-------|--------|--------|
| 1-5 | Solo Mode | Simulation missions only |
| 5+ | Squad Required | Wall hit - need teammates |
| 10+ | Bounty Eligible | Real client missions |

#### Squad Roles (Matching Archetypes)

| Archetype | Squad Role | Function |
|-----------|------------|----------|
| Engineer | Tank | Handles heavy technical work |
| Architect | DPS | Delivers core solutions |
| Creator | Support | Designs, documents, presents |
| Commander | Strategist | Coordinates, manages timeline |

#### Squad Formation Logic

```typescript
// User hits Level 5 alone → Cannot proceed
// Sage suggests: "Detected 'Builder_Bob' and 'Leader_Lisa' nearby"
// Combined power: 300 Points (enough to break the wall)
// Reward: Split XP, shared achievement
```

---

### 5. The "Economy": Genesis Points → Paychecks

#### Stage 1: Simulation (Genesis Points)

- Solve simulated bugs, design challenges
- Earn GP (Genesis Points)
- Buy avatars, skins, virtual gear

#### Stage 2: Verification (Shadow Work)

- Reach "Mastery Level" in a skill
- Real client task disguised as game level
- Anonymous data, no pressure
- Success → **Verified Solver Badge**

#### Stage 3: Paycheck (Real Money)

```
User solves real task: $500 bounty

SPLIT:
├── User:     $450 (90%)
├── Squad:    $25  (5%) [Residuals for teammates]
└── Platform: $25  (5%)
```

#### Economy Configuration

```typescript
const ECONOMY_CONFIG = {
    simulationCapLevel: 5,      // Max level in simulation
    verificationThreshold: 5000, // XP for verification tasks
    payoutUnlockLevel: 10,      // Level for real bounties
    
    userShare: 0.90,            // 90%
    squadShare: 0.05,           // 5%
    platformShare: 0.05,        // 5%
    
    minPayout: 25,              // Min USD for withdrawal
    escrowDays: 7               // Days before release
};
```

---

## 📁 File Structure

```
src/
├── engine/
│   ├── types.ts              # All type definitions
│   ├── ProgressionEngine.ts  # XP, streaks, economy logic
│   ├── SageDirector.ts       # AI guidance & slip-in method
│   └── index.ts              # Clean exports
│
├── components/
│   ├── ProgressionDashboard.tsx  # Visual skill graph UI
│   ├── SystemDiagnostic.tsx      # Path simulation tool
│   └── ...
│
└── App.tsx                   # Main application
```

---

## 🔄 User Flow Summary

```
INPUT:  User plays a game (Context: "I like Nature")
   ↓
AI:     Injects math/logic problems (Context: "Needs 4th Grade Math")
   ↓
WALL:   Mission gets too hard for one person (Level 5)
   ↓
SOCIAL: User recruits a Squad to break the wall
   ↓
GROW:   Squad completes missions, levels up together
   ↓
VERIFY: Shadow work → Verified Solver Badge
   ↓
OUTPUT: Squad solves real problems → Client pays the Squad
```

---

## 🧪 Testing

Use the **System Diagnostic** button (bottom-right) to:

1. Run all 12 path combinations (4 Archetypes × 3 Sectors)
2. Verify no dead ends
3. Confirm squad formation logic
4. Validate economy rules

---

## 🚀 Next Steps

1. **Backend Integration**: Connect to Supabase/Firebase for persistence
2. **AI API**: Wire Sage to actual LLM for dynamic responses
3. **Real Bounty Board**: Connect to business task queue
4. **Payment Processing**: Stripe integration for payouts
5. **Squad Matching**: Real-time user discovery system

---

*Education is the fuel. Gaming is the engine. Income is the destination.*
