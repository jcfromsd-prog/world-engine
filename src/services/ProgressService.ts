import { supabase } from '../lib/supabase';

export class ProgressService {
    /**
     * Records a submission artifact to the submissions table.
     */
    public static async recordSubmission(userId: string, nodeId: string, contentPayload: string, status: boolean): Promise<void> {
        try {
            const { error } = await supabase.from('submissions').insert({
                user_id: userId,
                node_id: nodeId,
                content_payload: contentPayload,
                status: status ? 'approved' : 'failed'
            });

            if (error) {
                console.error("[ProgressService] Error recording submission:", error);
            }
        } catch (err) {
            console.error("[ProgressService] Exception recording submission:", err);
        }
    }

    /**
     * Updates the reputation ledger with a delta.
     */
    public static async updateReputation(userId: string, delta: number, reason: string): Promise<void> {
        try {
            const { error } = await supabase.from('reputation_ledger').insert({
                user_id: userId,
                delta: delta,
                reason: reason
            });

            if (error) {
                console.error("[ProgressService] Error updating reputation:", error);
            }
        } catch (err) {
            console.error("[ProgressService] Exception updating reputation:", err);
        }
    }
}
