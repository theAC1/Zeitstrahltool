"use client";

import { useState } from "react";
import type { Timeline as TimelineType, TimelineEvent, Epoch } from "../../types/timeline";
import { generateTicks } from "../../lib/timeline/axis";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "./ui-components";
import { useZoom } from "../../hooks/useZoom";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react";

function scaleYear(year: number, minYear: number, maxYear: number, width: number) {
  const span = maxYear - minYear || 1;
  return ((year - minYear) / span) * width;
}

function eventAnchorYear(ev: TimelineEvent): number {
  if (typeof ev.year === "number") return ev.year;
  if (typeof ev.startYear === "number") return ev.startYear;
  if (typeof ev.endYear === "number") return ev.endYear;
  return 0;
}

// Default epoch colors if not specified
const DEFAULT_EPOCH_COLORS = [
  "#fef3c7", // amber-100
  "#dbeafe", // blue-100
  "#dcfce7", // green-100
  "#fce7f3", // pink-100
  "#f3e8ff", // purple-100
  "#fed7aa", // orange-100
];

interface TimelineProps {
  timeline: TimelineType;
  /** Optional callback when zoom level changes */
  onZoomChange?: (zoom: number) => void;
}

export function Timeline({ timeline, onZoomChange }: TimelineProps) {
  const { zoom, zoomPercent, zoomIn, zoomOut, resetZoom, handleWheel, canZoomIn, canZoomOut } = useZoom({
    initialZoom: 1,
    minZoom: 0.5,
    maxZoom: 3,
    zoomStep: 0.25,
  });

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const eventsSorted = [...timeline.events].sort((a, b) => {
    const ay = eventAnchorYear(a);
    const by = eventAnchorYear(b);
    if (ay !== by) return ay - by;
    return a.id.localeCompare(b.id);
  });

  // Sort epochs by start year for layering
  const epochsSorted = [...timeline.epochs].sort((a, b) => a.startYear - b.startYear);

  const years = eventsSorted.flatMap((e) => {
    if (typeof e.year === "number") return [e.year];
    if (typeof e.startYear === "number" && typeof e.endYear === "number") return [e.startYear, e.endYear];
    return [];
  });

  // Include epoch years in axis calculation
  const epochYears = epochsSorted.flatMap((ep) => [ep.startYear, ep.endYear]);
  const allYears = [...years, ...epochYears];

  const dataMinYear = allYears.length ? Math.min(...allYears) : 0;
  const dataMaxYear = allYears.length ? Math.max(...allYears) : 1;

  const axisMinYear = typeof timeline.axis?.minYear === "number" ? timeline.axis.minYear : dataMinYear;
  const axisMaxYear = typeof timeline.axis?.maxYear === "number" ? timeline.axis.maxYear : dataMaxYear;

  // Virtual Canvas Size - scaled by zoom
  const baseWidth = 1200;
  const baseHeight = 400; // Increased to accommodate epochs
  const width = baseWidth * zoom;
  const height = baseHeight;
  const paddingX = 60;
  const epochAreaHeight = 60; // Height for epoch bars
  const lineY = epochAreaHeight + 80; // Shifted down to make room for epochs
  const innerWidth = width - paddingX * 2;

  const ticks = generateTicks(axisMinYear, axisMaxYear, {
    step: timeline.axis?.tickStep,
    targetTickCount: timeline.axis?.targetTickCount,
  });

  return (
    <Card
      id="timeline-capture-area"
      className="w-full overflow-hidden bg-white shadow-lg border-opacity-50 border-gray-200"
      role="region"
      aria-label={`Timeline: ${timeline.title}`}
    >
      {/* Header with Zoom Controls */}
      <div className="px-6 py-4 border-b bg-gray-50/50 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-xl text-gray-800 tracking-tight">{timeline.title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {timeline.events.length} Events • {timeline.epochs.length} Epochs • {axisMinYear} to {axisMaxYear}
          </p>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-3" role="toolbar" aria-label="Zoom controls">
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            <button
              onClick={zoomOut}
              disabled={!canZoomOut}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Zoom out"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4 text-gray-600" />
            </button>

            <span className="text-xs font-mono text-gray-600 min-w-[48px] text-center">
              {zoomPercent}%
            </span>

            <button
              onClick={zoomIn}
              disabled={!canZoomIn}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Zoom in"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4 text-gray-600" />
            </button>

            <div className="w-px h-4 bg-gray-200 mx-1" />

            <button
              onClick={resetZoom}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
              aria-label="Reset zoom"
              title="Reset zoom (100%)"
            >
              <RotateCcw className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <span className="text-xs font-mono text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            {Math.abs(axisMaxYear - axisMinYear)} Years Span
          </span>
        </div>
      </div>

      {/* Visualization Canvas */}
      <div
        className="w-full overflow-x-auto p-4 bg-gradient-to-b from-white via-white to-gray-50/50"
        onWheel={handleWheel}
        role="application"
        aria-label="Interactive timeline visualization. Use Ctrl+scroll to zoom."
        tabIndex={0}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto select-none transition-all duration-200"
          style={{ minWidth: `${Math.max(800, baseWidth * zoom)}px`, width: `${baseWidth * zoom}px` }}
          role="img"
          aria-label={`Timeline visualization showing ${timeline.events.length} events and ${timeline.epochs.length} epochs from ${axisMinYear} to ${axisMaxYear}`}
        >
          {/* Accessibility: Hidden description for screen readers */}
          <title>{timeline.title}</title>
          <desc>
            This timeline displays {timeline.events.length} historical events
            {timeline.epochs.length > 0 && ` and ${timeline.epochs.length} time periods (epochs)`}
            spanning from year {axisMinYear} to {axisMaxYear}.
          </desc>
          <defs>
            <linearGradient id="axisGradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.1" />
              <stop offset="10%" stopColor="#3b82f6" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="90%" stopColor="#3b82f6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.1" />
            </linearGradient>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.15" />
            </filter>
            <filter id="epochShadow" x="-5%" y="-20%" width="110%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000000" floodOpacity="0.1" />
            </filter>
          </defs>

          {/* Epoch Bars - Rendered first (behind everything) */}
          <AnimatePresence>
            {epochsSorted.map((epoch, i) => {
              const startX = paddingX + scaleYear(epoch.startYear, axisMinYear, axisMaxYear, innerWidth);
              const endX = paddingX + scaleYear(epoch.endYear, axisMinYear, axisMaxYear, innerWidth);
              const epochWidth = endX - startX;
              const epochColor = epoch.color || DEFAULT_EPOCH_COLORS[i % DEFAULT_EPOCH_COLORS.length];

              // Calculate a darker border color
              const borderColor = epoch.color
                ? `${epoch.color}99` // Add transparency to make it darker-looking
                : DEFAULT_EPOCH_COLORS[(i + 1) % DEFAULT_EPOCH_COLORS.length];

              return (
                <motion.g
                  key={`epoch-${epoch.id}`}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  style={{ transformOrigin: `${startX}px ${epochAreaHeight / 2 + 10}px` }}
                >
                  {/* Epoch Bar */}
                  <rect
                    x={startX}
                    y={10}
                    width={Math.max(epochWidth, 2)}
                    height={epochAreaHeight}
                    rx="6"
                    ry="6"
                    fill={epochColor}
                    stroke={borderColor}
                    strokeWidth="1"
                    filter="url(#epochShadow)"
                    className="cursor-pointer hover:brightness-95 transition-all"
                    role="graphics-symbol"
                    aria-label={`Epoch: ${epoch.title}, from ${epoch.startYear} to ${epoch.endYear}`}
                  />

                  {/* Epoch Label */}
                  <text
                    x={startX + epochWidth / 2}
                    y={epochAreaHeight / 2 + 15}
                    textAnchor="middle"
                    className="fill-gray-700 text-xs font-semibold pointer-events-none"
                    style={{
                      fontSize: epochWidth > 100 ? "12px" : epochWidth > 50 ? "10px" : "8px",
                      display: epochWidth < 30 ? "none" : "block"
                    }}
                  >
                    {epoch.title}
                  </text>

                  {/* Epoch Year Range (smaller text below title) */}
                  {epochWidth > 80 && (
                    <text
                      x={startX + epochWidth / 2}
                      y={epochAreaHeight / 2 + 30}
                      textAnchor="middle"
                      className="fill-gray-500 pointer-events-none"
                      style={{ fontSize: "9px" }}
                    >
                      {epoch.startYear} – {epoch.endYear}
                    </text>
                  )}

                  {/* Vertical connection line from epoch to axis */}
                  <line
                    x1={startX}
                    y1={epochAreaHeight + 10}
                    x2={startX}
                    y2={lineY}
                    stroke={epochColor}
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.5"
                  />
                  <line
                    x1={endX}
                    y1={epochAreaHeight + 10}
                    x2={endX}
                    y2={lineY}
                    stroke={epochColor}
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.5"
                  />
                </motion.g>
              );
            })}
          </AnimatePresence>

          {/* Time Axis Line */}
          <motion.line
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "circOut" }}
            x1={paddingX}
            y1={lineY}
            x2={width - paddingX}
            y2={lineY}
            stroke="url(#axisGradient)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Ticks and Grid */}
          <AnimatePresence>
            {ticks.map((t) => {
              const x = paddingX + scaleYear(t, axisMinYear, axisMaxYear, innerWidth);
              return (
                <motion.g
                  key={`tick-${t}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <line x1={x} y1={lineY - 6} x2={x} y2={lineY + 6} stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                  <text
                    x={x}
                    y={lineY + 24}
                    textAnchor="middle"
                    className="fill-gray-400 text-xs font-mono font-medium"
                  >
                    {t}
                  </text>
                </motion.g>
              );
            })}
          </AnimatePresence>

          {/* Events */}
          <AnimatePresence>
            {eventsSorted.map((ev, i) => {
              const labelYear = eventAnchorYear(ev);
              const x = paddingX + scaleYear(labelYear, axisMinYear, axisMaxYear, innerWidth);
              const isSelected = selectedEventId === ev.id;

              // Layout logic: Alternate Top/Bottom to avoid overlap
              const isTop = i % 2 === 0;
              const yStart = isTop ? lineY - 15 : lineY + 15;
              const yEnd = isTop ? lineY - 60 : lineY + 60;
              const textY = isTop ? yEnd - 15 : yEnd + 25;

              return (
                <motion.g
                  key={ev.id}
                  initial={{ opacity: 0, scale: 0, transformOrigin: `${x}px ${lineY}px` }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: i * 0.05 }}
                  className="group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedEventId(isSelected ? null : ev.id)}
                  role="button"
                  aria-label={`Event: ${ev.title}, Year ${labelYear}${ev.description ? `. ${ev.description}` : ''}. ${isSelected ? 'Selected' : 'Click to select'}`}
                  aria-pressed={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedEventId(isSelected ? null : ev.id);
                    }
                  }}
                >
                  {/* Connection Line */}
                  <motion.line
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
                    x1={x} y1={yStart} x2={x} y2={yEnd}
                    stroke={isSelected ? "#2563eb" : "#60a5fa"}
                    strokeWidth={isSelected ? 3 : 2}
                    strokeDasharray="4 4"
                    className="opacity-60 group-hover:opacity-100 transition-opacity"
                  />

                  {/* Central Dot on Axis */}
                  <circle
                    cx={x}
                    cy={lineY}
                    r={isSelected ? 7 : 5}
                    className={`fill-white stroke-[3px] transition-all ${isSelected
                      ? "stroke-blue-600 fill-blue-100"
                      : "stroke-blue-500 group-hover:fill-blue-100"
                      }`}
                  />

                  {/* Selection Ring */}
                  {isSelected && (
                    <motion.circle
                      cx={x}
                      cy={lineY}
                      r={12}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.5 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}

                  {/* Title */}
                  <text
                    x={x}
                    y={textY}
                    textAnchor="middle"
                    className={`text-sm font-bold tracking-tight drop-shadow-sm ${isSelected ? "fill-blue-700" : "fill-gray-800"
                      }`}
                    style={{ textShadow: "0px 2px 4px rgba(0,0,0,0.1)" }}
                  >
                    {ev.title}
                  </text>

                  {/* Year Label */}
                  <text
                    x={x}
                    y={textY + (isTop ? -16 : 16)}
                    textAnchor="middle"
                    className={`text-xs font-semibold ${isSelected ? "fill-blue-600" : "fill-blue-500"}`}
                  >
                    {labelYear}
                  </text>

                </motion.g>
              );
            })}
          </AnimatePresence>
        </svg>
      </div>

      {/* Accessibility hint */}
      <div className="px-6 py-2 border-t bg-gray-50/50 text-xs text-gray-400 text-center" role="note">
        💡 Hold Ctrl/Cmd + scroll to zoom • Click or press Enter on an event to select it • Use Tab to navigate
      </div>
    </Card>
  );
}
