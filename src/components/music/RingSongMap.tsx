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
  COLLISION_RADIUS: 20,
  RADIAL_STRENGTH: 0.08,
  VELOCITY_DECAY: 0.5,
  ALPHA_MIN: 0.001,
  FREEZE_THRESHOLD: 0.01,
  ORBITAL_SPEED: 0.0003,

  ELLIPSE_COUNT: 8,
  VERTICAL_SPACING: 55,
  ELLIPSE_WIDTH_RATIO: 0.85,
  BASE_RADIUS: 140,
  RADIUS_VARIATION: 0.15,
  
  NODE_RADIUS: 4,
  LABEL_OFFSET: 12,
  JITTER_AMOUNT: 15,
  
  GRID_POINT_COUNT: 24,
};

interface NodeDatum extends SimulationNodeDatum {
  id: string;
  slug: string;
  title: string;
  level: number;
  angle: number;
  ellipseIndex: number;
  orbitDirection: number;
}

interface RingSongMapProps {
  songs: Song[];
}

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
  const [trophyHuntingTypedChars, setTrophyHuntingTypedChars] = useState(0);
  const [rushTypedChars, setRushTypedChars] = useState(0);
  const [testingTypedChars, setTestingTypedChars] = useState(0);
  const [supernovaTypedChars, setSupernovaTypedChars] = useState(0);

  const songsRef = useRef(songs);
  songsRef.current = songs;

  useEffect(() => {
    setMounted(true);
  }, []);

  const trophyHuntingText = "another's love is revealed as a hunt, and i recognize myself not as chosen, but as claimed.";
  const rushText = "to rush is to believe grief obeys distance. but the heart learns sorrow travels faster than flight.";
  const testingText = "recursion. testing. a quiet loop where fear rehearses itself as fate, and i hover between yielding and undoing.";
  const supernovaText = "a stable star overfed on love until it goes supernova, scattering devotion through a void.";

  useEffect(() => {
    if (hoveredNode === "trophy-hunting") {
      setTrophyHuntingTypedChars(0);
      let charIndex = 0;
      const interval = setInterval(() => {
        if (charIndex < trophyHuntingText.length) {
          charIndex++;
          setTrophyHuntingTypedChars(charIndex);
        } else {
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    } else {
      setTrophyHuntingTypedChars(0);
    }
  }, [hoveredNode, trophyHuntingText]);

  useEffect(() => {
    if (hoveredNode === "rush") {
      setRushTypedChars(0);
      let charIndex = 0;
      const interval = setInterval(() => {
        if (charIndex < rushText.length) {
          charIndex++;
          setRushTypedChars(charIndex);
        } else {
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    } else {
      setRushTypedChars(0);
    }
  }, [hoveredNode, rushText]);

  useEffect(() => {
    if (hoveredNode === "testing") {
      setTestingTypedChars(0);
      let charIndex = 0;
      const interval = setInterval(() => {
        if (charIndex < testingText.length) {
          charIndex++;
          setTestingTypedChars(charIndex);
        } else {
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    } else {
      setTestingTypedChars(0);
    }
  }, [hoveredNode, testingText]);

  useEffect(() => {
    if (hoveredNode === "supernova") {
      setSupernovaTypedChars(0);
      let charIndex = 0;
      const interval = setInterval(() => {
        if (charIndex < supernovaText.length) {
          charIndex++;
          setSupernovaTypedChars(charIndex);
        } else {
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    } else {
      setSupernovaTypedChars(0);
    }
  }, [hoveredNode, supernovaText]);

  const cx = dimensions.width / 2;
  const cy = dimensions.height / 2;

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

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    const totalHeight = TUNING.ELLIPSE_COUNT * TUNING.VERTICAL_SPACING;
    const startY = centerY - totalHeight / 2;

    const initialNodes: NodeDatum[] = [];
    const rotationOffset = Math.random() * Math.PI * 2;

    songsRef.current.forEach((song, songIndex) => {
      const level = Math.floor((songIndex / songsRef.current.length) * TUNING.ELLIPSE_COUNT);
      const ellipseIndex = Math.min(level, TUNING.ELLIPSE_COUNT - 1);
      
      const baseAngle = (2 * Math.PI * songIndex) / songsRef.current.length + rotationOffset;
      const jitterAngle = (Math.random() - 0.5) * 0.3;
      const angle = baseAngle + jitterAngle;

      const levelY = startY + ellipseIndex * TUNING.VERTICAL_SPACING;
      const radiusScale = 1 - (ellipseIndex / TUNING.ELLIPSE_COUNT) * TUNING.RADIUS_VARIATION;
      const rx = TUNING.BASE_RADIUS * radiusScale;
      const ry = rx * TUNING.ELLIPSE_WIDTH_RATIO * 0.35;

      const pos = getEllipsePoint(centerX, levelY, rx, ry, angle);

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

    if (simulationRef.current) simulationRef.current.stop();
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const simulation = forceSimulation<NodeDatum>(initialNodes)
      .force("collide", forceCollide<NodeDatum>(TUNING.COLLISION_RADIUS).strength(0.6))
      .velocityDecay(TUNING.VELOCITY_DECAY)
      .alphaMin(TUNING.ALPHA_MIN);

    simulationRef.current = simulation;
    setNodes([...initialNodes]);

    const applyEllipseForce = () => {
      const totalHeight = TUNING.ELLIPSE_COUNT * TUNING.VERTICAL_SPACING;
      const startY = centerY - totalHeight / 2;

      simulation.nodes().forEach((node) => {
        const levelY = startY + node.ellipseIndex * TUNING.VERTICAL_SPACING;
        const radiusScale = 1 - (node.ellipseIndex / TUNING.ELLIPSE_COUNT) * TUNING.RADIUS_VARIATION;
        const rx = TUNING.BASE_RADIUS * radiusScale;
        const ry = rx * TUNING.ELLIPSE_WIDTH_RATIO * 0.35;

        node.angle = (node.angle + TUNING.ORBITAL_SPEED * node.orbitDirection) % (Math.PI * 2);

        const targetX = centerX + rx * Math.cos(node.angle);
        const targetY = levelY + ry * Math.sin(node.angle);

        const k = TUNING.RADIAL_STRENGTH;
        node.vx = (node.vx ?? 0) + (targetX - (node.x ?? centerX)) * k;
        node.vy = (node.vy ?? 0) + (targetY - (node.y ?? levelY)) * k * 2;
      });
    };

    let lastUpdate = 0;
    const frameInterval = 1000 / 30;
    let isRunning = true;

    const tick = () => {
      if (!isRunning) return;

      const now = performance.now();
      if (now - lastUpdate >= frameInterval) {
        lastUpdate = now;
        applyEllipseForce();
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

  const totalHeight = TUNING.ELLIPSE_COUNT * TUNING.VERTICAL_SPACING;
  const startY = cy - totalHeight / 2;

  const ellipses = Array.from({ length: TUNING.ELLIPSE_COUNT }, (_, i) => {
    const levelY = startY + i * TUNING.VERTICAL_SPACING;
    const radiusScale = 1 - (i / TUNING.ELLIPSE_COUNT) * TUNING.RADIUS_VARIATION;
    const rx = TUNING.BASE_RADIUS * radiusScale;
    const ry = rx * TUNING.ELLIPSE_WIDTH_RATIO * 0.35;
    return { cx, cy: levelY, rx, ry, index: i };
  });

  const gridPoints = ellipses.flatMap((ellipse) => {
    return Array.from({ length: TUNING.GRID_POINT_COUNT }, (_, i) => {
      const angle = (2 * Math.PI * i) / TUNING.GRID_POINT_COUNT;
      const pos = getEllipsePoint(ellipse.cx, ellipse.cy, ellipse.rx, ellipse.ry, angle);
      return { ...pos, ellipseIndex: ellipse.index, pointIndex: i };
    });
  });

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

  if (!mounted) {
    return (
      <div ref={containerRef} className="w-full h-full min-h-screen relative" />
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full min-h-screen relative overflow-hidden">
      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0"
        role="img"
        aria-label="Structural music diagram"
      >
        <defs>
          <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <line
          x1={cx}
          y1={startY - 40}
          x2={cx}
          y2={startY + totalHeight + 40}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={0.5}
        />

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

        {gridPoints.map((point, i) => (
          <circle
            key={`grid-${i}`}
            cx={point.x}
            cy={point.y}
            r={1}
            fill="rgba(255, 255, 255, 0.15)"
          />
        ))}

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

        {activeNode && nodes.find((n) => n.id === activeNode) && (() => {
          const hovered = nodes.find((n) => n.id === activeNode)!;
          const nodeX = hovered.x ?? cx;
          const nodeY = hovered.y ?? cy;
          
          const estimateTextWidth = (text: string, fontSize: number): number => {
            const baseCharWidth = fontSize * 0.6;
            const wideChars = (text.match(/[MW@]/g) || []).length;
            return text.length * baseCharWidth + wideChars * (fontSize * 0.2);
          };
          
          const isTrophyHunting = hovered.slug === "trophy-hunting";
          const isRush = hovered.slug === "rush";
          const isTesting = hovered.slug === "testing";
          const isSupernova = hovered.slug === "supernova";
          const displayText = isTrophyHunting
            ? trophyHuntingText.slice(0, trophyHuntingTypedChars)
            : isRush
            ? rushText.slice(0, rushTypedChars)
            : isTesting
            ? testingText.slice(0, testingTypedChars)
            : isSupernova
            ? supernovaText.slice(0, supernovaTypedChars)
            : hovered.title;
          const fullTextForWidth = isTrophyHunting
            ? trophyHuntingText
            : isRush
            ? rushText
            : isTesting
            ? testingText
            : isSupernova
            ? supernovaText
            : hovered.title;
          
          const padding = 10;
          const lineHeight = 14;
          const verticalPadding = 8;
          const fontSize = dimensions.width < 640 ? 8 : 9;
          
          const maxBoxWidth = Math.min(dimensions.width - 40, 300);
          const charWidth = fontSize * 0.6;
          const charsPerLine = Math.floor((maxBoxWidth - padding * 2) / charWidth);
          
          const wrapText = (text: string): string[] => {
            const words = text.split(" ");
            const lines: string[] = [];
            let currentLine = "";
            
            for (const word of words) {
              const testLine = currentLine ? `${currentLine} ${word}` : word;
              if (testLine.length <= charsPerLine) {
                currentLine = testLine;
              } else {
                if (currentLine) lines.push(currentLine);
                currentLine = word.length > charsPerLine ? word.substring(0, charsPerLine) : word;
              }
            }
            if (currentLine) lines.push(currentLine);
            
            return lines.length > 0 ? lines : [text];
          };
          
          const textLines = wrapText(displayText);
          const maxLineWidth = Math.max(...textLines.map(line => estimateTextWidth(line, fontSize)));
          
          const minWidth = 120;
          const boxWidth = Math.min(maxBoxWidth, Math.max(minWidth, maxLineWidth + padding * 2));
          const boxHeight = (lineHeight * textLines.length) + verticalPadding * 2;
          
          const tooltipMargin = dimensions.width < 640 ? 15 : 40;
          const nodeOffset = 20;
          
          let tooltipX = nodeX < cx ? nodeX - boxWidth - nodeOffset : nodeX + nodeOffset;
          let tooltipY = nodeY - boxHeight - nodeOffset;
          let connectFromRight = nodeX < cx;
          
          if (tooltipX < tooltipMargin) {
            tooltipX = tooltipMargin;
            connectFromRight = false;
          }
          if (tooltipX + boxWidth > dimensions.width - tooltipMargin) {
            tooltipX = dimensions.width - boxWidth - tooltipMargin;
            connectFromRight = true;
          }
          
          if (tooltipY < tooltipMargin) {
            tooltipY = nodeY + nodeOffset;
          }
          if (tooltipY + boxHeight > dimensions.height - tooltipMargin) {
            tooltipY = dimensions.height - boxHeight - tooltipMargin;
          }
          
          const connectorEndX = connectFromRight ? tooltipX + boxWidth : tooltipX;
          const connectorEndY = tooltipY < nodeY 
            ? tooltipY + boxHeight
            : tooltipY;
          
          return (
            <g>
              <line
                x1={nodeX}
                y1={nodeY}
                x2={connectorEndX}
                y2={connectorEndY}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth={0.5}
              />
              <circle
                cx={connectorEndX}
                cy={connectorEndY}
                r={2}
                fill="rgba(255, 255, 255, 0.3)"
              />
              <rect
                x={tooltipX}
                y={tooltipY}
                width={boxWidth}
                height={boxHeight}
                fill="none"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth={0.5}
              />
              {textLines.map((line, index) => (
                <text
                  key={index}
                  x={tooltipX + padding}
                  y={tooltipY + verticalPadding + 10 + (index * lineHeight)}
                  className="fill-white/70"
                  style={{ 
                    fontFamily: "var(--font-mono)",
                    fontSize: `${fontSize}px`
                  }}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })()}

        <text
          x={cx}
          y={startY + totalHeight + 70}
          textAnchor="middle"
          className="fill-white/60 text-xs sm:text-sm uppercase tracking-[0.3em]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Music
        </text>

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

        {nodes.map((node) => {
          const isActive = activeNode === node.id;
          const labelPos = getLabelPosition(node);

          return (
            <Link
              key={node.id}
              href={`/music/${node.slug}`}
              className="group outline-none focus:outline-none focus-visible:outline-none"
              onFocus={() => setFocusedNode(node.id)}
              onBlur={() => setFocusedNode(null)}
            >
              <g
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer"
                role="button"
                aria-label={`Play ${node.title}`}
              >
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

                <circle
                  cx={node.x}
                  cy={node.y}
                  r={TUNING.NODE_RADIUS}
                  className={isActive ? "fill-white" : "fill-white/80"}
                  filter={isActive ? "url(#glow)" : undefined}
                />

                <text
                  x={(node.x ?? 0) + TUNING.NODE_RADIUS + 3}
                  y={(node.y ?? 0) + 3}
                  className="fill-white/30 text-[6px]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {node.ellipseIndex + 1}
                </text>

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

                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor={labelPos.anchor}
                  dominantBaseline="middle"
                  className={`
                    text-[8px] sm:text-[9px] uppercase tracking-widest
                    transition-all duration-200 cursor-pointer
                    ${isActive ? "fill-white/90" : "fill-white/50"}
                  `}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {node.title}
                </text>

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
