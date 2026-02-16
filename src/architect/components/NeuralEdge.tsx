import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from 'reactflow';
import type { EdgeProps } from 'reactflow';

export const NeuralEdge: React.FC<EdgeProps> = ({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
    selected
}) => {
    // 1. Calculate Bezier Path (Smooth Curve)
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    // 2. Logic State Styling
    const isError = data?.isError || false;
    const isValid = data?.isValid || true;

    // Pulse Animation: Active if valid, static if draft, shake logic handled by parent
    const strokeColor = isError ? '#ef4444' : selected ? '#3b82f6' : '#10b981'; // Red / Blue / Green
    const strokeWidth = selected ? 3 : 2;

    // Animation via framer-motion or CSS
    // Using inline CSS for performance on edges
    const animatedStyle = {
        ...style,
        stroke: strokeColor,
        strokeWidth,
        strokeDasharray: isValid && !isError ? '5,5' : 'none',
        animation: isValid && !isError ? 'dashdraw 1s linear infinite' : 'none',
        transition: 'stroke 0.3s ease'
    };

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={animatedStyle} />
            {/* Optional Logic Label (e.g. IF/THEN) */}
            {data?.label && (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            background: '#000',
                            padding: '4px 8px',
                            borderRadius: 4,
                            fontSize: 10,
                            fontWeight: 700,
                            border: `1px solid ${strokeColor}`,
                            color: strokeColor,
                            pointerEvents: 'all',
                        }}
                        className="nodrag nopan"
                    >
                        {data.label}
                    </div>
                </EdgeLabelRenderer>
            )}

            {/* Global Keyframes for Animations */}
            <style>
                {`
                    @keyframes dashdraw {
                        from { stroke-dashoffset: 10; }
                        to { stroke-dashoffset: 0; }
                    }
                `}
            </style>
        </>
    );
};
