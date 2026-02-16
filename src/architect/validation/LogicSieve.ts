import type { LogicNode, LogicConnection } from '../types';

export class LogicSieve {
    /**
     * Depth-First Search to detect cycles in the graph.
     * Returns true if a cycle is detected.
     */
    static detectCycles(nodes: LogicNode[], connections: LogicConnection[]): boolean {
        const adjacencyList = new Map<string, string[]>();

        // Build Graph
        nodes.forEach(node => adjacencyList.set(node.id, []));
        connections.forEach(conn => {
            const neighbors = adjacencyList.get(conn.source);
            if (neighbors) neighbors.push(conn.target);
        });

        const visited = new Set<string>();
        const recursionStack = new Set<string>();

        const visit = (nodeId: string): boolean => {
            if (recursionStack.has(nodeId)) return true; // Cycle detected
            if (visited.has(nodeId)) return false;

            visited.add(nodeId);
            recursionStack.add(nodeId);

            const neighbors = adjacencyList.get(nodeId) || [];
            for (const neighbor of neighbors) {
                if (visit(neighbor)) return true;
            }

            recursionStack.delete(nodeId);
            return false;
        };

        for (const node of nodes) {
            if (visit(node.id)) return true;
        }

        return false;
    }

    /**
     * Validates that the blueprint is structurally sound.
     * Rules:
     * 1. Must have exactly one GOAL node.
     * 2. Must have at least one PAYOFF node.
     * 3. No cycles.
     * 4. All nodes must be connected. (Simplified: No orphans except during editing)
     */
    static validateCompleteness(nodes: LogicNode[], connections: LogicConnection[]): { valid: boolean; error?: string } {
        if (nodes.length === 0) return { valid: false, error: "Canvas is empty." };

        const goals = nodes.filter(n => n.type === 'GOAL');
        if (goals.length !== 1) return { valid: false, error: "Blueprint must have exactly one GOAL node." };

        const payoffs = nodes.filter(n => n.type === 'PAYOFF');
        if (payoffs.length < 1) return { valid: false, error: "Blueprint must have at least one PAYOFF node." };

        if (this.detectCycles(nodes, connections)) {
            return { valid: false, error: "Infinite Logic Cycle Detected." };
        }

        // Future: Check for orphans if necessary.

        return { valid: true };
    }
}
