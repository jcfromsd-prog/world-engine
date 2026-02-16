import { z } from 'zod';

// --- Domain Models ---

export const NodeTypeSchema = z.enum([
    'GOAL',
    'ACTION',
    'DECISION',
    'CHECK',
    'PAYOFF'
]);

export type LogicNodeType = z.infer<typeof NodeTypeSchema>;

export interface LogicNode {
    id: string;
    type: LogicNodeType;
    label: string;
    position: { x: number; y: number };
    data?: Record<string, any>;
}

export interface LogicConnection {
    id: string;
    source: string;
    target: string;
    label?: string;
}

export interface BlueprintState {
    nodes: LogicNode[];
    connections: LogicConnection[];
    isValid: boolean;
    lastSynced: number;
}
