import React, { useRef, useCallback, useEffect, useState } from 'react';
import ReactFlow, {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    Controls,
    MiniMap
} from 'reactflow';
import type {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange
} from 'reactflow';
import 'reactflow/dist/style.css';
import { BlueprintEngine } from '../core/BlueprintEngine';
import type { LogicNode, LogicConnection } from '../types';
import { devTelemetry } from '../../engines/logic-link/ObservabilityLayer';

// Initialize Engine Singleton
const engine = BlueprintEngine.getInstance();

const BlueprintCanvas: React.FC = () => {
    // We use React State here ONLY for rendering, but Logic is decoupled.
    // The Engine is the source of truth for validation.
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [isValid, setIsValid] = useState(false);

    // Refs for performance (avoiding closure staleness)
    const nodesRef = useRef<Node[]>([]);
    const edgesRef = useRef<Edge[]>([]);

    useEffect(() => {
        // Subscribe to Engine updates (e.g. from cloud sync)
        const unsubscribe = engine.subscribe((state) => {
            setIsValid(state.isValid);
            // Transform LogicTypes to ReactFlow Types if needed
            // For now assuming 1:1 mapping for simplicity
        });
        return unsubscribe;
    }, []);

    const onNodesChange = useCallback((changes: NodeChange[]) => {
        setNodes((nds) => {
            const next = applyNodeChanges(changes, nds);
            nodesRef.current = next;
            return next;
        });
    }, []);

    const onEdgesChange = useCallback((changes: EdgeChange[]) => {
        setEdges((eds) => {
            const next = applyEdgeChanges(changes, eds);
            edgesRef.current = next;
            return next;
        });
    }, []);

    const onConnect = useCallback((connection: Connection) => {
        setEdges((eds) => {
            const next = addEdge(connection, eds);
            edgesRef.current = next;
            return next;
        });
    }, []);

    const handleCompile = useCallback(() => {
        // Transform ReactFlow Nodes -> LogicNodes
        const logicNodes: LogicNode[] = nodesRef.current.map(n => ({
            id: n.id,
            type: (n.data?.type || 'ACTION') as any, // Type assertion for now
            label: n.data?.label || n.id,
            position: n.position,
            data: n.data
        }));

        const logicConnections: LogicConnection[] = edgesRef.current.map(e => ({
            id: e.id,
            source: e.source,
            target: e.target
        }));

        // Send to Engine
        engine.updateLocalState(logicNodes, logicConnections);

        // Check Validity
        const validation = engine.validate();
        setIsValid(validation.valid);

        // Feedback
        if (validation.valid) {
            devTelemetry.trackEvent('CHECK', 'Blueprint Compiled & Valid', 'success');
        } else {
            devTelemetry.trackEvent('CHECK', `Blueprint Invalid: ${validation.error}`, 'failure');
        }

    }, []);

    // Helper to add node for testing
    const addNode = (type: string) => {
        const id = `${type}-${Date.now()}`;
        const newNode: Node = {
            id,
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            data: { label: type, type },
            style: { border: '1px solid #777', padding: 10, borderRadius: 5, background: '#1a1a1a', color: '#fff' }
        };
        setNodes(nds => nds.concat(newNode));
        nodesRef.current.push(newNode);
    };

    return (
        <div className={`h-[600px] w-full border-4 transition-colors duration-500 ${isValid ? 'border-green-500/50' : 'border-red-500/50'}`}>
            <div className="absolute top-4 right-4 z-50 flex gap-2">
                <button onClick={() => addNode('GOAL')} className="px-4 py-2 bg-slate-800 text-white rounded shadow">Add GOAL</button>
                <button onClick={() => addNode('ACTION')} className="px-4 py-2 bg-slate-800 text-white rounded shadow">Add ACTION</button>
                <button onClick={() => addNode('PAYOFF')} className="px-4 py-2 bg-slate-800 text-white rounded shadow">Add PAYOFF</button>
                <button
                    onClick={handleCompile}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow-lg transition-all"
                >
                    COMPILE
                </button>
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
};

export default BlueprintCanvas;
