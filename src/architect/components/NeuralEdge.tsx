
import React from 'react';
import { BaseEdge, getBezierPath } from 'reactflow';
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
    data
}) => {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const isValid = data?.isValid !== false; // Default to valid if undefined
    const strokeColor = isValid ? '#22d3ee' : '#ef4444'; // Cyan-400 vs Red-500

    return (
        <>
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    ...style,
                    stroke: strokeColor,
                    strokeWidth: 2,
                    strokeDasharray: '5,5',
                    animation: 'dashdraw 0.5s linear infinite', // We'll need to ensure this keyframe exists in global CSS or inline styles
                }}
            />
            {/* Optional: Add glow effect for valid edges */}
            {isValid && (
                <path
                    d={edgePath}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={8}
                    className="opacity-20 animate-pulse"
                />
            )}
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
