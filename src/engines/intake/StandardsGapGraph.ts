
import { PurposeLedger } from '../../services/PurposeLedger';
import type { MasteryMap, MasteryGap } from './IntakeRegistry';

export class StandardsGapGraph {
    private currentGaps: MasteryGap[] = [];
    private initialGapCount: number = 0;

    constructor(initialMap: MasteryMap) {
        this.currentGaps = [...initialMap.gaps];
        this.initialGapCount = initialMap.gaps.length;
    }

    /**
     * Recalculates the gap graph after a skill atom is mastered.
     * Returns the delta (percentage reduction in gaps).
     */
    public async recordMastery(standardId: string, userId: string): Promise<{ delta: number, remainingGaps: number }> {
        const gapIndex = this.currentGaps.findIndex(g => g.standardId === standardId);

        if (gapIndex !== -1) {
            this.currentGaps.splice(gapIndex, 1);

            const delta = this.initialGapCount > 0
                ? (1 / this.initialGapCount) * 100
                : 0;

            // Log the mastery event to PurposeLedger
            await PurposeLedger.addEntry({
                user_id: userId,
                mission_id: `MASTERY_${standardId}`,
                verified_outputs: [`SkillAtom Mastered: ${standardId}`],
                impact_metrics: {
                    portfolio_items_added: 1,
                    skills_demonstrated: [standardId],
                    real_value_created: 0,
                    engine_progress: {
                        impact_to_legend: 0.1, // Small baseline impact
                        gap_reduction: delta
                    }
                }
            });

            return { delta, remainingGaps: this.currentGaps.length };
        }

        return { delta: 0, remainingGaps: this.currentGaps.length };
    }

    public getStatus() {
        return {
            totalGaps: this.initialGapCount,
            currentGaps: this.currentGaps.length,
            progress: this.initialGapCount > 0
                ? ((this.initialGapCount - this.currentGaps.length) / this.initialGapCount) * 100
                : 100
        };
    }
}
