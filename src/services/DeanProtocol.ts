
/**
 * THE DEAN PROTOCOL (Phase 2: Quality Governance)
 * Multi-Sig Approval State Machine for Mission Quality Assurance.
 * 
 * Enforces the "Rule of 3":
 * 1. AI QA Validation (Score > 85)
 * 2. Peer Review #1 (Pass)
 * 3. Peer Review #2 (Pass)
 */

export type MissionApprovalState = 'DRAFT' | 'SUBMITTED' | 'REVIEWING' | 'APPROVED' | 'REJECTED';

export interface PeerReview {
    reviewerId: string;
    status: 'PASS' | 'FAIL';
    feedback: string;
    timestamp: number;
}

export interface AIReview {
    score: number; // 0-100
    feedback: string;
    timestamp: number;
}

export interface ApprovalRecord {
    missionId: string;
    state: MissionApprovalState;
    artifactUrl?: string;
    aiReview?: AIReview;
    peerReviews: PeerReview[];
}

export class DeanProtocol {
    private static approvalRegistry: Map<string, ApprovalRecord> = new Map();

    /**
     * Initializes or updates the evidence for a mission.
     */
    public static submitEvidence(missionId: string, artifactUrl: string): void {
        const record = this.getOrCreateRecord(missionId);
        record.state = 'SUBMITTED';
        record.artifactUrl = artifactUrl;
        this.approvalRegistry.set(missionId, record);
    }

    /**
     * Registers a simulated AI QA review.
     */
    public static registerAIReview(missionId: string, score: number, feedback: string): void {
        const record = this.getOrCreateRecord(missionId);
        record.state = 'REVIEWING';
        record.aiReview = { score, feedback, timestamp: Date.now() };
        this.approvalRegistry.set(missionId, record);
        this.recalculateStatus(missionId);
    }

    /**
     * Registers a human peer review.
     */
    public static registerPeerReview(missionId: string, reviewerId: string, status: 'PASS' | 'FAIL', feedback: string): void {
        const record = this.getOrCreateRecord(missionId);
        record.state = 'REVIEWING';

        // Ensure unique peer reviews
        record.peerReviews = record.peerReviews.filter(r => r.reviewerId !== reviewerId);
        record.peerReviews.push({ reviewerId, status, feedback, timestamp: Date.now() });

        this.approvalRegistry.set(missionId, record);
        this.recalculateStatus(missionId);
    }

    /**
     * Internal check for the "Rule of 3".
     */
    public static checkApprovalStatus(missionId: string): boolean {
        const record = this.approvalRegistry.get(missionId);
        if (!record) return false;

        const hasAIApproval = record.aiReview ? record.aiReview.score >= 85 : false;
        const passPeerReviews = record.peerReviews.filter(r => r.status === 'PASS');
        const hasTwoPeerApprovals = passPeerReviews.length >= 2;

        return hasAIApproval && hasTwoPeerApprovals;
    }

    /**
     * Updates the global state of the record based on current metrics.
     */
    private static recalculateStatus(missionId: string): void {
        const record = this.approvalRegistry.get(missionId);
        if (!record) return;

        if (this.checkApprovalStatus(missionId)) {
            record.state = 'APPROVED';
        } else if (record.peerReviews.some(r => r.status === 'FAIL')) {
            // If any peer rejects, we mark it as reviewing/stalled (re-submission needed)
            // For now, we don't automatically fail it unless we want strict rejection.
        }
    }

    private static getOrCreateRecord(missionId: string): ApprovalRecord {
        return this.approvalRegistry.get(missionId) || {
            missionId,
            state: 'DRAFT',
            peerReviews: []
        };
    }

    public static getRecord(missionId: string): ApprovalRecord | undefined {
        return this.approvalRegistry.get(missionId);
    }
}
