"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  forceSimulation,
  forceCollide,
  Simulation,
  SimulationNodeDatum,
} from "d3-force";
import type { Song } from "@/content/music/songs";


const TUNING = {
  // Physics
  COLLISION_RADIUS: 20,
  RADIAL_STRENGTH: 0.08,
  VELOCITY_DECAY: 0.5,
  ALPHA_MIN: 0.001,
  FREEZE_THRESHOLD: 0.01,
  ORBITAL_SPEED: 0.0003, // Radians per frame - very slow orbit

  // Structure
  ELLIPSE_COUNT: 8, // Number of elliptical rings per level
  VERTICAL_SPACING: 55, // Space between ellipse levels
  ELLIPSE_WIDTH_RATIO: 0.85, // Ellipse width as ratio of height
  BASE_RADIUS: 140, // Base ellipse radius
  RADIUS_VARIATION: 0.15, // How much rings vary in size
  
  // Nodes
  NODE_RADIUS: 4,
  LABEL_OFFSET: 12,
  JITTER_AMOUNT: 15,
  
  // Grid points
  GRID_POINT_COUNT: 24, // Points around each ellipse
};

interface NodeDatum extends SimulationNodeDatum {
  id: string;
  slug: string;
  title: string;
  level: number; // Vertical level
  angle: number; // Current position on ellipse (radians)
  ellipseIndex: number;
  orbitDirection: number; // 1 or -1 for direction
}

interface RingSongMapProps {
  songs: Song[];
}

// Generate grid points around an ellipse
function getEllipsePoint(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  angle: number
): { x: number; y: number } {
  return {
    x: cx + rx * Math.cos(angle),
    y: cy + ry * Math.sin(angle),
  };
}

export default function RingSongMap({ songs }: RingSongMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<Simulation<NodeDatum, undefined> | null>(null);
  const rafRef = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [nodes, setNodes] = useState<NodeDatum[]>([]);
  const [focusedNode, setFocusedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const songsRef = useRef(songs);
  songsRef.current = songs;

  // Only render on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const cx = dimensions.width / 2;
  const cy = dimensions.height / 2;

  // Handle resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        setDimensions((prev) => {
          if (prev.width === width && prev.height === height) return prev;
          return { width, height };
        });
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Initialize simulation
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    // Calculate structure dimensions
    const totalHeight = TUNING.ELLIPSE_COUNT * TUNING.VERTICAL_SPACING;
    const startY = centerY - totalHeight / 2;

    // Create nodes for each song
    const initialNodes: NodeDatum[] = [];
    const rotationOffset = Math.random() * Math.PI * 2;

    songsRef.current.forEach((song, songIndex) => {
      // Distribute songs across different levels
      const level = Math.floor((songIndex / songsRef.current.length) * TUNING.ELLIPSE_COUNT);
      const ellipseIndex = Math.min(level, TUNING.ELLIPSE_COUNT - 1);
      
      // Position on ellipse
      const baseAngle = (2 * Math.PI * songIndex) / songsRef.current.length + rotationOffset;
      const jitterAngle = (Math.random() - 0.5) * 0.3;
      const angle = baseAngle + jitterAngle;

      // Calculate ellipse for this level
      const levelY = startY + ellipseIndex * TUNING.VERTICAL_SPACING;
      const radiusScale = 1 - (ellipseIndex / TUNING.ELLIPSE_COUNT) * TUNING.RADIUS_VARIATION;
      const rx = TUNING.BASE_RADIUS * radiusScale;
      const ry = rx * TUNING.ELLIPSE_WIDTH_RATIO * 0.35; // Flatten for perspective

      const pos = getEllipsePoint(centerX, levelY, rx, ry, angle);

      // Alternate orbit direction for visual interest
      const orbitDirection = songIndex % 2 === 0 ? 1 : -1;

      initialNodes.push({
        id: song.slug,
        slug: song.slug,
        title: song.title,
        level: ellipseIndex,
        angle,
        ellipseIndex,
        orbitDirection,
        x: pos.x + (Math.random() - 0.5) * TUNING.JITTER_AMOUNT,
        y: pos.y + (Math.random() - 0.5) * TUNING.JITTER_AMOUNT,
        vx: 0,
        vy: 0,
      });
    });

    if (initialNodes.length === 0) return;

    // Cleanup existing simulation
    if (simulationRef.current) simulationRef.current.stop();
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    // Create simulation with gentle forces
    const simulation = forceSimulation<NodeDatum>(initialNodes)
      .force("collide", forceCollide<NodeDatum>(TUNING.COLLISION_RADIUS).strength(0.6))
      .velocityDecay(TUNING.VELOCITY_DECAY)
      .alphaMin(TUNING.ALPHA_MIN);

    simulationRef.current = simulation;
    setNodes([...initialNodes]);

    // Custom elliptical constraint force with orbital motion
    const applyEllipseForce = () => {
      const totalHeight = TUNING.ELLIPSE_COUNT * TUNING.VERTICAL_SPACING;
      const startY = centerY - totalHeight / 2;

      simulation.nodes().forEach((node) => {
        const levelY = startY + node.ellipseIndex * TUNING.VERTICAL_SPACING;
        const radiusScale = 1 - (node.ellipseIndex / TUNING.ELLIPSE_COUNT) * TUNING.RADIUS_VARIATION;
        const rx = TUNING.BASE_RADIUS * radiusScale;
        const ry = rx * TUNING.ELLIPSE_WIDTH_RATIO * 0.35;

        // Advance the node's angle for orbital motion
        node.angle = (node.angle + TUNING.ORBITAL_SPEED * node.orbitDirection) % (Math.PI * 2);

        // Calculate target position on ellipse based on updated angle
        const targetX = centerX + rx * Math.cos(node.angle);
        const targetY = levelY + ry * Math.sin(node.angle);

        // Move node toward target position
        const k = TUNING.RADIAL_STRENGTH;
        node.vx = (node.vx ?? 0) + (targetX - (node.x ?? centerX)) * k;
        node.vy = (node.vy ?? 0) + (targetY - (node.y ?? levelY)) * k * 2;
      });
    };

    // Animation loop - runs continuously for orbital motion
    let lastUpdate = 0;
    const frameInterval = 1000 / 30; // 30 fps for smooth but efficient animation
    let isRunning = true;

    const tick = () => {
      if (!isRunning) return;

      const now = performance.now();
      if (now - lastUpdate >= frameInterval) {
        lastUpdate = now;
        
        // Apply orbital motion and ellipse constraint
        applyEllipseForce();
        
        // Update React state with current positions
        setNodes([...simulation.nodes()]);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    simulation.on("tick", () => {});
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      if (simulationRef.current) {
        simulationRef.current.stop();
        simulationRef.current = null;
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [dimensions.width, dimensions.height]);

  // Calculate structure for rendering
  const totalHeight = TUNING.ELLIPSE_COUNT * TUNING.VERTICAL_SPACING;
  const startY = cy - totalHeight / 2;

  // Generate ellipses data
  const ellipses = Array.from({ length: TUNING.ELLIPSE_COUNT }, (_, i) => {
    const levelY = startY + i * TUNING.VERTICAL_SPACING;
    const radiusScale = 1 - (i / TUNING.ELLIPSE_COUNT) * TUNING.RADIUS_VARIATION;
    const rx = TUNING.BASE_RADIUS * radiusScale;
    const ry = rx * TUNING.ELLIPSE_WIDTH_RATIO * 0.35;
    return { cx, cy: levelY, rx, ry, index: i };
  });

  // Generate grid points for each ellipse
  const gridPoints = ellipses.flatMap((ellipse) => {
    return Array.from({ length: TUNING.GRID_POINT_COUNT }, (_, i) => {
      const angle = (2 * Math.PI * i) / TUNING.GRID_POINT_COUNT;
      const pos = getEllipsePoint(ellipse.cx, ellipse.cy, ellipse.rx, ellipse.ry, angle);
      return { ...pos, ellipseIndex: ellipse.index, pointIndex: i };
    });
  });

  // Generate vertical axis lines
  const verticalLines = Array.from({ length: 8 }, (_, i) => {
    const angle = (2 * Math.PI * i) / 8;
    const topEllipse = ellipses[0];
    const bottomEllipse = ellipses[ellipses.length - 1];
    
    if (!topEllipse || !bottomEllipse) return null;
    
    const top = getEllipsePoint(topEllipse.cx, topEllipse.cy, topEllipse.rx, topEllipse.ry, angle);
    const bottom = getEllipsePoint(bottomEllipse.cx, bottomEllipse.cy, bottomEllipse.rx, bottomEllipse.ry, angle);
    return { x1: top.x, y1: top.y, x2: bottom.x, y2: bottom.y };
  }).filter(Boolean);

  const activeNode = hoveredNode || focusedNode;

  // Get label position
  const getLabelPosition = (node: NodeDatum) => {
    const ellipse = ellipses[node.ellipseIndex];
    if (!ellipse) return { x: node.x ?? 0, y: node.y ?? 0, anchor: "start" as const };
    
    const dx = (node.x ?? cx) - cx;
    return {
      x: (node.x ?? cx) + (dx > 0 ? TUNING.LABEL_OFFSET : -TUNING.LABEL_OFFSET),
      y: (node.y ?? cy) - 2,
      anchor: dx > 0 ? "start" as const : "end" as const,
    };
  };

  // Don't render SVG content until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div ref={containerRef} className="w-full h-full min-h-[600px] relative" />
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full min-h-[600px] relative">
      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0"
        role="img"
        aria-label="Structural music diagram"
      >
        <defs>
          {/* Glow filter */}
          <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Central vertical axis */}
        <line
          x1={cx}
          y1={startY - 40}
          x2={cx}
          y2={startY + totalHeight + 40}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={0.5}
        />

        {/* Vertical structural lines */}
        {verticalLines.map((line, i) => (
          line && (
            <line
              key={`vline-${i}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="rgba(255, 255, 255, 0.04)"
              strokeWidth={0.5}
            />
          )
        ))}

        {/* Elliptical rings */}
        {ellipses.map((ellipse) => (
          <ellipse
            key={`ellipse-${ellipse.index}`}
            cx={ellipse.cx}
            cy={ellipse.cy}
            rx={ellipse.rx}
            ry={ellipse.ry}
            fill="none"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth={0.5}
          />
        ))}

        {/* Grid points (small dots around ellipses) */}
        {gridPoints.map((point, i) => (
          <circle
            key={`grid-${i}`}
            cx={point.x}
            cy={point.y}
            r={1}
            fill="rgba(255, 255, 255, 0.15)"
          />
        ))}

        {/* Grid point numbers (sparse) */}
        {gridPoints
          .filter((_, i) => i % 3 === 0)
          .map((point, i) => (
            <text
              key={`num-${i}`}
              x={point.x}
              y={point.y - 6}
              textAnchor="middle"
              className="fill-white/20 text-[7px]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {point.pointIndex + 1}
            </text>
          ))}

        {/* Hover tooltip annotation box */}
        {activeNode && nodes.find((n) => n.id === activeNode) && (() => {
          const hovered = nodes.find((n) => n.id === activeNode)!;
          const nodeX = hovered.x ?? cx;
          const nodeY = hovered.y ?? cy;
          
          // Calculate text dimensions (monospace font estimation)
          // IBM Plex Mono character widths: 9px ≈ 5.4px/char, 8px ≈ 4.8px/char, 7px ≈ 4.2px/char
          const estimateTextWidth = (text: string, fontSize: number): number => {
            // More accurate monospace estimation: fontSize * 0.6 for most chars
            // Add extra for wider characters (M, W, etc.)
            const baseCharWidth = fontSize * 0.6;
            const wideChars = (text.match(/[MW@]/g) || []).length;
            return text.length * baseCharWidth + wideChars * (fontSize * 0.2);
          };
          
          const line1 = "Node Classification";
          const line2 = `Temporal Index: ${hovered.ellipseIndex + 1}`;
          const line3 = `Spatial Coordinate: ${hovered.title}`;
          
          const padding = 10; // Horizontal padding
          const lineHeight = 12; // Vertical spacing between lines
          const verticalPadding = 8; // Top and bottom padding
          
          const line1Width = estimateTextWidth(line1, 9);
          const line2Width = estimateTextWidth(line2, 8);
          const line3Width = estimateTextWidth(line3, 7);
          
          // Box width is max text width + padding, with minimum width
          const minWidth = 120;
          const boxWidth = Math.max(minWidth, Math.max(line1Width, line2Width, line3Width) + padding * 2);
          // Box height is based on number of lines
          const boxHeight = (lineHeight * 3) + verticalPadding * 2;
          
          // Determine tooltip position (prefer top-left or top-right quadrant)
          const isLeft = nodeX < cx;
          const isTop = nodeY < cy;
          
          // Position tooltip in upper quadrant opposite to node
          const tooltipX = isLeft ? nodeX - boxWidth - 20 : nodeX + 20;
          const tooltipY = isTop ? nodeY - boxHeight - 20 : nodeY - boxHeight - 20;
          
          // Connector line endpoint (edge of tooltip box)
          const connectorEndX = isLeft ? tooltipX + boxWidth : tooltipX;
          const connectorEndY = tooltipY + (isTop ? boxHeight : boxHeight);
          
          return (
            <g>
              {/* Connector line */}
              <line
                x1={nodeX}
                y1={nodeY}
                x2={connectorEndX}
                y2={connectorEndY}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth={0.5}
              />
              {/* Connector endpoint dot */}
              <circle
                cx={connectorEndX}
                cy={connectorEndY}
                r={2}
                fill="rgba(255, 255, 255, 0.3)"
              />
              {/* Tooltip box */}
              <rect
                x={tooltipX}
                y={tooltipY}
                width={boxWidth}
                height={boxHeight}
                fill="none"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth={0.5}
              />
              <text
                x={tooltipX + padding}
                y={tooltipY + verticalPadding + 10}
                className="fill-white/70 text-[9px]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {line1}
              </text>
              <text
                x={tooltipX + padding}
                y={tooltipY + verticalPadding + 10 + lineHeight}
                className="fill-white/50 text-[8px]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {line2}
              </text>
              <text
                x={tooltipX + padding}
                y={tooltipY + verticalPadding + 10 + lineHeight * 2}
                className="fill-white/40 text-[7px]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {line3}
              </text>
            </g>
          );
        })()}

        {/* Title at bottom */}
        <text
          x={cx}
          y={startY + totalHeight + 70}
          textAnchor="middle"
          className="fill-white/60 text-sm uppercase tracking-[0.3em]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Music
        </text>

        {/* Radial line to active node */}
        {activeNode && nodes.find((n) => n.id === activeNode) && (
          <line
            x1={cx}
            y1={ellipses[nodes.find((n) => n.id === activeNode)!.ellipseIndex]?.cy ?? cy}
            x2={nodes.find((n) => n.id === activeNode)?.x ?? cx}
            y2={nodes.find((n) => n.id === activeNode)?.y ?? cy}
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth={0.5}
            strokeDasharray="2 3"
          />
        )}

        {/* Song nodes */}
        {nodes.map((node) => {
          const isActive = activeNode === node.id;
          const labelPos = getLabelPosition(node);

          return (
            <Link
              key={node.id}
              href={`/music/${node.slug}`}
              className="group outline-none"
              onFocus={() => setFocusedNode(node.id)}
              onBlur={() => setFocusedNode(null)}
            >
              <g
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`Play ${node.title}`}
              >
                {/* Outer ring for active state */}
                {isActive && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={TUNING.NODE_RADIUS + 8}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth={0.5}
                  />
                )}

                {/* Node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={TUNING.NODE_RADIUS}
                  className={isActive ? "fill-white" : "fill-white/80"}
                  filter={isActive ? "url(#glow)" : undefined}
                />

                {/* Small index number */}
                <text
                  x={(node.x ?? 0) + TUNING.NODE_RADIUS + 3}
                  y={(node.y ?? 0) + 3}
                  className="fill-white/30 text-[6px]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {node.ellipseIndex + 1}
                </text>

                {/* Focus indicator */}
                {focusedNode === node.id && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={TUNING.NODE_RADIUS + 5}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.5)"
                    strokeWidth={1}
                    strokeDasharray="2 2"
                  />
                )}

                {/* Node label */}
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor={labelPos.anchor}
                  dominantBaseline="middle"
                  className={`
                    text-[9px] uppercase tracking-widest
                    transition-all duration-200 pointer-events-none
                    ${isActive ? "fill-white/90" : "fill-white/50"}
                  `}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {node.title}
                </text>

                {/* Decorative brackets for active */}
                {isActive && (
                  <>
                    <text
                      x={labelPos.x - (labelPos.anchor === "start" ? 6 : -6)}
                      y={labelPos.y}
                      textAnchor={labelPos.anchor}
                      dominantBaseline="middle"
                      className="fill-white/40 text-[9px]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {labelPos.anchor === "start" ? "[" : "]"}
                    </text>
                  </>
                )}
              </g>
            </Link>
          );
        })}
      </svg>
    </div>
  );
}
