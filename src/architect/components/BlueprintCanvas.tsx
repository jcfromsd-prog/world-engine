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
import confetti from 'canvas-confetti';

import { BlueprintEngine } from '../core/BlueprintEngine';
import type { LogicNode, LogicConnection } from '../types';
import { devTelemetry } from '../../engines/logic-link/ObservabilityLayer';

import { NeuralEdge } from './NeuralEdge';
import { LogicSieve } from '../validation/LogicSieve';

// Initialize Engine Singleton
const engine = BlueprintEngine.getInstance();

const edgeTypes = {
    neural: NeuralEdge,
};

// Command Factory Helper
const createAddNodeCommand = (node: Node, setNodes: React.Dispatch<React.SetStateAction<Node[]>>, nodesRef: React.MutableRefObject<Node[]>) => ({
    label: `Add Node ${node.data.type}`,
    execute: () => {
        setNodes(nds => nds.concat(node));
        nodesRef.current.push(node);

        // Sync Logic Nodes to Engine
        // NOTE: In a full implementation, we'd map ReactFlow Nodes -> LogicNodes here
        const logicNodes = nodesRef.current.map(n => ({ id: n.id, type: n.data.type, position: n.position, label: n.data.label }));
        // We aren't updating connections in this specific command, but we should sync state broadly
        engine.updateLocalState(logicNodes, []); // Simplification for MVP Command
    },
    undo: () => {
        setNodes(nds => nds.filter(n => n.id !== node.id));
        nodesRef.current = nodesRef.current.filter(n => n.id !== node.id);

        const logicNodes = nodesRef.current.map(n => ({ id: n.id, type: n.data.type, position: n.position, label: n.data.label }));
        engine.updateLocalState(logicNodes, []);
    }
});

const BlueprintCanvas: React.FC = () => {
    // We use React State here ONLY for rendering, but Logic is decoupled.
    // The Engine is the source of truth for validation.
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [isValid, setIsValid] = useState(false);

    // Refs for performance (avoiding closure staleness in callbacks)
    const nodesRef = useRef<Node[]>([]);
    const edgesRef = useRef<Edge[]>([]);

    useEffect(() => {
        // Subscribe to Engine updates (e.g. from cloud sync or undo/redo)
        const unsubscribe = engine.subscribe((state) => {
            setIsValid(state.isValid);

            if (state.isValid) {
                // SUCCESS DOPAMINE
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#34d399', '#60a5fa', '#fbbf24'] // Green, Blue, Amber
                });
                devTelemetry.trackEvent('CHECK', 'Blueprint Compiled & Valid', 'success');
            }
        });
        return unsubscribe;
    }, []);

    // KEYBOARD SHORTCUTS
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
                e.preventDefault();
                if (e.shiftKey) {
                    engine.redo();
                } else {
                    engine.undo();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
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
        if (!connection.source || !connection.target) return;

        // 1. Construct Candidate Graph
        const currentNodes: LogicNode[] = nodesRef.current.map(n => ({
            id: n.id,
            type: (n.data?.type || 'ACTION') as any,
            label: n.data?.label || n.id,
            position: n.position
        }));

        const currentEdges: LogicConnection[] = edgesRef.current.map(e => ({
            id: e.id,
            source: e.source,
            target: e.target
        }));

        // Add candidate edge
        const candidateEdge: LogicConnection = {
            id: `temp-${Date.now()}`,
            source: connection.source,
            target: connection.target
        };

        // 2. Validate Cycle
        const hasCycle = LogicSieve.detectCycles(currentNodes, [...currentEdges, candidateEdge]);

        if (hasCycle) {
            // BLOCK CONNECTION
            devTelemetry.trackEvent('CHECK', 'Circular Dependency Detected & Blocked', 'failure');
            alert("⚠️ LOGIC LOOP DETECTED: You cannot connect output back to input upstream.");
            return;
        }

        // 3. ALLOW CONNECTION
        setEdges((eds) => {
            const newEdge: Edge = {
                ...connection,
                id: `e-${connection.source}-${connection.target}`,
                type: 'neural',
                animated: true,
                data: { isValid: true }
            } as Edge;

            const next = addEdge(newEdge, eds);
            edgesRef.current = next;

            // Sync to Engine
            const logicEdges: LogicConnection[] = next.map(e => ({
                id: e.id,
                source: e.source,
                target: e.target
            }));
            engine.updateLocalState(currentNodes, logicEdges);

            return next;
        });

        devTelemetry.trackEvent('ACTION', 'Neural Link Established', 'neutral');

    }, []);

    const handleCompile = useCallback(() => {
        // Trigger explicit validation check via Engine
        const validation = engine.validate();
        setIsValid(validation.valid);

        if (validation.valid) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#22d3ee', '#818cf8', '#34d399'] // Cyan, Indigo, Emerald
            });
            devTelemetry.trackEvent('CHECK', 'Blueprint Compiled & Valid', 'success');
        } else {
            devTelemetry.trackEvent('CHECK', `Blueprint Invalid: ${validation.error}`, 'failure');
            alert(`Blueprint Incomplete: ${validation.error}`);
        }
    }, []);

    // Helper to add node for testing (Wrapped in Command)
    const addNode = (type: string) => {
        const id = `${type}-${Date.now()}`;
        const newNode: Node = {
            id,
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            data: { label: type, type },
            style: { border: '1px solid #777', padding: 10, borderRadius: 5, background: '#1a1a1a', color: '#fff' }
        };

        // Execute via Engine Command
        const cmd = createAddNodeCommand(newNode, setNodes, nodesRef);
        engine.executeCommand(cmd);
    };

    return (
        <div data-testid="blueprint-root" className={`h-[600px] w-full border-4 transition-colors duration-500 ${isValid ? 'border-green-500/50' : 'border-red-500/50'}`}>
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
                edgeTypes={edgeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
            <div className="absolute bottom-4 left-4 text-xs text-white/30 font-mono pointer-events-none">
                undo: ctrl+z | redo: ctrl+shift+z
            </div>
        </div>
    );
};

export default BlueprintCanvas;
