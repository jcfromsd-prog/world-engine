// =============================================================================
// SOULBOUND PROGRESSION ENGINE - Main Export
// =============================================================================
// Central export for all engine components

// Types
export * from './types';

// Progression Engine
export {
    addSkillXP,
    calculateSkillDecay,
    updateSkillGraph,
    updateStreak,
    saveResumePoint,
    clearResumePoint,
    getWelcomeBackMessage,
    completeNode,
    hasCompletedNode,
    addGenesisPoints,
    processClientPayment,
    canAccessBounties,
    checkSoloCap,
    saveProfile,
    loadProfile,
    initializeProfile
} from './ProgressionEngine';

// Sage AI Director
export {
    analyzeSkillGaps,
    generateSlipIn,
    calibrateDifficulty,
    findSquadCandidates,
    generateSageDirectives,
    generateFullAnalysis,
    getSageResponse
} from './SageDirector';
