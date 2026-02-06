import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { Psychometrics } from '../context/UserContext';

interface PsychometricGraphProps {
    data: Psychometrics;
    width?: number;
    height?: number;
}

const PsychometricGraph: React.FC<PsychometricGraphProps> = ({
    data,
    width = 300,
    height = 300
}) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const stats = [
            { axis: "Autonomy", value: data.autonomy },
            { axis: "Competence", value: data.competence },
            { axis: "Relatedness", value: data.relatedness }
        ];

        const margin = 40;
        const radius = Math.min(width, height) / 2 - margin;
        const g = svg.append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        const rScale = d3.scaleLinear().range([0, radius]).domain([0, 100]);
        const angleSlice = (Math.PI * 2) / stats.length;

        // Draw the circular grid
        const levels = 4;
        for (let l = 1; l <= levels; l++) {
            const levelFactor = radius * (l / levels);

            // Draw polygon for each level
            const points: [number, number][] = stats.map((_, i) => [
                levelFactor * Math.cos(angleSlice * i - Math.PI / 2),
                levelFactor * Math.sin(angleSlice * i - Math.PI / 2)
            ]);

            g.append("path")
                .datum([...points, points[0]])
                .attr("d", d3.line<[number, number]>()
                    .x(p => p[0])
                    .y(p => p[1])
                )
                .attr("fill", "none")
                .attr("stroke", "rgba(255, 255, 255, 0.05)")
                .attr("stroke-width", "1px");
        }

        // Draw Axes
        const axes = g.selectAll(".axis")
            .data(stats)
            .enter()
            .append("g")
            .attr("class", "axis");

        axes.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", (_, i) => rScale(100) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr("y2", (_, i) => rScale(100) * Math.sin(angleSlice * i - Math.PI / 2))
            .attr("stroke", "rgba(255, 255, 255, 0.1)")
            .attr("stroke-width", "1px");

        // Add Labels
        axes.append("text")
            .attr("x", (_, i) => rScale(115) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr("y", (_, i) => rScale(115) * Math.sin(angleSlice * i - Math.PI / 2))
            .text(d => d.axis)
            .style("font-size", "10px")
            .style("font-weight", "900")
            .style("text-transform", "uppercase")
            .style("letter-spacing", "0.1em")
            .attr("fill", "rgba(255, 255, 255, 0.4)")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle");

        // Draw the Blob (Hero Shape)
        const radarLine = d3.lineRadial<{ axis: string, value: number }>()
            .curve(d3.curveLinearClosed)
            .radius(d => rScale(d.value))
            .angle((_, i) => i * angleSlice);

        // Gradient for the blob
        const gradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "radarGradient")
            .attr("x1", "0%").attr("y1", "0%")
            .attr("x2", "100%").attr("y2", "100%");

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#3b82f6");

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#4ade80");

        // Area Fill
        g.append("path")
            .datum(stats)
            .attr("class", "radarArea")
            .attr("d", radarLine)
            .style("fill", "url(#radarGradient)")
            .style("fill-opacity", 0.4);

        // Stroke
        g.append("path")
            .datum(stats)
            .attr("class", "radarStroke")
            .attr("d", radarLine)
            .style("stroke-width", 2)
            .style("stroke", "#60a5fa")
            .style("fill", "none")
            .style("filter", "drop-shadow(0 0 8px rgba(96, 165, 250, 0.5))");

        // Add data points
        g.selectAll(".radarCircle")
            .data(stats)
            .enter()
            .append("circle")
            .attr("class", "radarCircle")
            .attr("r", 4)
            .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
            .style("fill", "#fff")
            .style("fill-opacity", 0.8)
            .style("stroke", "#60a5fa")
            .style("stroke-width", 2);

    }, [data, width, height]);

    return (
        <div className="flex items-center justify-center">
            <svg ref={svgRef} width={width} height={height} className="overflow-visible" />
        </div>
    );
};

export default PsychometricGraph;
