import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';

// ============================================================================
// NEURAL GRAPH: Interactive Skill Visualization
// ============================================================================
// Displays a force-directed graph of skill nodes connected by prerequisite edges.
// ALL DATA is passed via props — no hardcoded mocks.
// Designed to connect directly to Supabase profile/mastery data.
// ============================================================================

// --- Public Interfaces (for consumers to use) ---

export interface SkillNode {
    id: string;
    label: string;
    domain: 'literacy' | 'numeracy' | 'science' | 'social' | 'sel' | 'career' | 'coding' | 'creative';
    mastery: number;      // 0.0 - 1.0
    gradeLevel: number;   // 1-16
    unlocked: boolean;
}

export interface SkillEdge {
    source: string;
    target: string;
}

interface NeuralGraphProps {
    nodes: SkillNode[];
    edges: SkillEdge[];
    width?: number;
    height?: number;
    onNodeClick?: (node: SkillNode) => void;
    className?: string;
}

// --- Domain Color Map ---
const DOMAIN_COLORS: Record<string, string> = {
    literacy: '#00e5ff',
    numeracy: '#b000ff',
    science: '#00ff88',
    social: '#ffc107',
    sel: '#ff0080',
    career: '#ff6b35',
    coding: '#7c3aed',
    creative: '#f59e0b',
};

// --- Internal D3 Types ---
interface D3Node extends d3.SimulationNodeDatum {
    id: string;
    label: string;
    domain: string;
    mastery: number;
    gradeLevel: number;
    unlocked: boolean;
    color: string;
    radius: number;
}

interface D3Link extends d3.SimulationLinkDatum<D3Node> {
    source: string | D3Node;
    target: string | D3Node;
}

// --- Component ---

export const NeuralGraph: React.FC<NeuralGraphProps> = ({
    nodes = [],
    edges = [],
    width,
    height,
    onNodeClick,
    className = '',
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const [tooltip, setTooltip] = useState<{ x: number; y: number; node: SkillNode } | null>(null);
    const [dimensions, setDimensions] = useState({ w: width || 800, h: height || 500 });

    // Responsive sizing
    useEffect(() => {
        if (width && height) {
            setDimensions({ w: width, h: height });
            return;
        }
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                const rect = entry.contentRect;
                setDimensions({
                    w: Math.max(rect.width, 300),
                    h: Math.max(rect.height, 300),
                });
            }
        });
        observer.observe(container);
        return () => observer.disconnect();
    }, [width, height]);

    const handleNodeHover = useCallback((event: MouseEvent, node: D3Node) => {
        setTooltip({
            x: event.offsetX,
            y: event.offsetY,
            node: {
                id: node.id,
                label: node.label,
                domain: node.domain as SkillNode['domain'],
                mastery: node.mastery,
                gradeLevel: node.gradeLevel,
                unlocked: node.unlocked,
            },
        });
    }, []);

    const handleNodeLeave = useCallback(() => {
        setTooltip(null);
    }, []);

    // D3 Force Simulation
    useEffect(() => {
        if (!svgRef.current || nodes.length === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clean slate

        const { w, h } = dimensions;

        // Build D3 data
        const d3Nodes: D3Node[] = nodes.map(n => ({
            id: n.id,
            label: n.label,
            domain: n.domain,
            mastery: n.mastery,
            gradeLevel: n.gradeLevel,
            unlocked: n.unlocked,
            color: DOMAIN_COLORS[n.domain] || '#00e5ff',
            radius: 6 + n.mastery * 14, // 6-20px based on mastery
        }));

        const d3Links: D3Link[] = edges
            .filter(e => d3Nodes.some(n => n.id === e.source) && d3Nodes.some(n => n.id === e.target))
            .map(e => ({ source: e.source, target: e.target }));

        // Define gradient
        const defs = svg.append('defs');

        // Per-link gradient
        d3Links.forEach((_, i) => {
            const gradient = defs.append('linearGradient')
                .attr('id', `link-gradient-${i}`)
                .attr('gradientUnits', 'userSpaceOnUse');
            gradient.append('stop').attr('offset', '0%').attr('stop-color', '#00e5ff').attr('stop-opacity', 0.6);
            gradient.append('stop').attr('offset', '100%').attr('stop-color', '#b000ff').attr('stop-opacity', 0.2);
        });

        // Glow filter
        const glowFilter = defs.append('filter').attr('id', 'neural-glow');
        glowFilter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
        const feMerge = glowFilter.append('feMerge');
        feMerge.append('feMergeNode').attr('in', 'coloredBlur');
        feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

        // Force simulation
        const simulation = d3.forceSimulation<D3Node>(d3Nodes)
            .force('link', d3.forceLink<D3Node, D3Link>(d3Links).id(d => d.id).distance(80).strength(0.4))
            .force('charge', d3.forceManyBody().strength(-200))
            .force('center', d3.forceCenter(w / 2, h / 2))
            .force('collision', d3.forceCollide<D3Node>().radius(d => d.radius + 8))
            .force('x', d3.forceX(w / 2).strength(0.05))
            .force('y', d3.forceY(h / 2).strength(0.05));

        // Draw links
        const linkGroup = svg.append('g').attr('class', 'links');
        const link = linkGroup.selectAll<SVGLineElement, D3Link>('line')
            .data(d3Links)
            .join('line')
            .attr('stroke', (_d, i) => `url(#link-gradient-${i})`)
            .attr('stroke-width', 1.5)
            .attr('opacity', 0.4);

        // Draw nodes
        const nodeGroup = svg.append('g').attr('class', 'nodes');
        const node = nodeGroup.selectAll<SVGGElement, D3Node>('g')
            .data(d3Nodes)
            .join('g')
            .style('cursor', 'pointer');

        // Outer glow ring
        node.append('circle')
            .attr('r', d => d.radius + 4)
            .attr('fill', 'none')
            .attr('stroke', d => d.color)
            .attr('stroke-width', 1)
            .attr('opacity', d => d.unlocked ? 0.3 : 0.08)
            .attr('filter', 'url(#neural-glow)');

        // Main circle
        node.append('circle')
            .attr('r', d => d.radius)
            .attr('fill', d => d.unlocked ? d.color : '#1a1a2e')
            .attr('stroke', d => d.color)
            .attr('stroke-width', d => d.unlocked ? 2 : 1)
            .attr('opacity', d => d.unlocked ? 0.9 : 0.35)
            .attr('filter', d => d.unlocked && d.mastery > 0.5 ? 'url(#neural-glow)' : 'none');

        // Mastery indicator (inner arc)
        node.each(function (d) {
            if (d.mastery > 0 && d.unlocked) {
                const arc = d3.arc<unknown>()
                    .innerRadius(d.radius - 3)
                    .outerRadius(d.radius - 1)
                    .startAngle(0)
                    .endAngle(d.mastery * Math.PI * 2);

                d3.select(this).append('path')
                    .attr('d', arc as any)
                    .attr('fill', '#fff')
                    .attr('opacity', 0.7);
            }
        });

        // Label
        node.append('text')
            .text(d => d.label.length > 10 ? d.label.slice(0, 9) + '…' : d.label)
            .attr('text-anchor', 'middle')
            .attr('dy', d => d.radius + 16)
            .attr('fill', d => d.unlocked ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)')
            .attr('font-size', '9px')
            .attr('font-weight', '600')
            .attr('font-family', 'Inter, sans-serif');

        // Interaction
        node.on('mouseover', function (event, d) {
            d3.select(this).select('circle:nth-child(2)')
                .transition().duration(200)
                .attr('r', d.radius + 3)
                .attr('opacity', 1);
            handleNodeHover(event, d);
        });

        node.on('mouseout', function (_, d) {
            d3.select(this).select('circle:nth-child(2)')
                .transition().duration(200)
                .attr('r', d.radius)
                .attr('opacity', d.unlocked ? 0.9 : 0.35);
            handleNodeLeave();
        });

        node.on('click', (_, d) => {
            if (onNodeClick) {
                onNodeClick({
                    id: d.id,
                    label: d.label,
                    domain: d.domain as SkillNode['domain'],
                    mastery: d.mastery,
                    gradeLevel: d.gradeLevel,
                    unlocked: d.unlocked,
                });
            }
        });

        // Drag behavior
        const drag = d3.drag<SVGGElement, D3Node>()
            .on('start', (event, d) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on('drag', (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on('end', (event, d) => {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            });

        node.call(drag);

        // Tick
        simulation.on('tick', () => {
            link
                .attr('x1', d => (d.source as D3Node).x || 0)
                .attr('y1', d => (d.source as D3Node).y || 0)
                .attr('x2', d => (d.target as D3Node).x || 0)
                .attr('y2', d => (d.target as D3Node).y || 0);

            node.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
        });

        // Warm start — run simulation synchronously first for smoother initial render
        simulation.alpha(1).tick(80);

        return () => {
            simulation.stop();
        };
    }, [nodes, edges, dimensions, onNodeClick, handleNodeHover, handleNodeLeave]);

    // Empty state
    if (nodes.length === 0) {
        return (
            <div ref={containerRef} className={`mbp-neural-graph ${className}`} style={{ minHeight: 300 }}>
                <div className="flex items-center justify-center h-full opacity-30">
                    <div className="text-center">
                        <div className="text-4xl mb-3">🧬</div>
                        <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                            Neural Map Initializing...
                        </p>
                        <p className="text-[10px] text-zinc-600 mt-1">
                            Complete missions to reveal your skill constellation
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className={`mbp-neural-graph ${className}`} style={{ position: 'relative' }}>
            <svg
                ref={svgRef}
                viewBox={`0 0 ${dimensions.w} ${dimensions.h}`}
                preserveAspectRatio="xMidYMid meet"
            />

            {/* Tooltip */}
            {tooltip && (
                <div
                    className="absolute pointer-events-none z-50 mbp-card-elevated px-4 py-3 min-w-[160px]"
                    style={{
                        left: tooltip.x + 16,
                        top: tooltip.y - 10,
                        transform: 'translateY(-100%)',
                    }}
                >
                    <div className="text-xs font-black text-white mb-1">{tooltip.node.label}</div>
                    <div className="flex items-center gap-2 mb-2">
                        <span
                            className="w-2 h-2 rounded-full"
                            style={{ background: DOMAIN_COLORS[tooltip.node.domain] }}
                        />
                        <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">
                            {tooltip.node.domain}
                        </span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                        <span className="text-zinc-500">Mastery</span>
                        <span className="text-white font-bold">{Math.round(tooltip.node.mastery * 100)}%</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all"
                            style={{
                                width: `${tooltip.node.mastery * 100}%`,
                                background: DOMAIN_COLORS[tooltip.node.domain],
                            }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] mt-2">
                        <span className="text-zinc-500">Grade Level</span>
                        <span className="text-zinc-300">{tooltip.node.gradeLevel}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NeuralGraph;
