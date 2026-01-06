'use client';

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type WheelEvent,
  type MouseEvent,
  type TouchEvent,
} from 'react';
import { cn } from '@/lib/utils';
import { useTimeline } from './TimelineContext';
import { TimelineScale } from './TimelineScale';
import { TimelineEpochs } from './TimelineEpochs';
import { TimelineEvents } from './TimelineEvents';
import { berechneZoomOffset, begrenzeOffset } from '@/lib/zeitstrahl';

interface TimelineProps {
  className?: string;
}

// Zoom limits
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;
const ZOOM_FACTOR = 0.001;

/**
 * Main Timeline component with zoom, pan, and rendering
 */
export function Timeline({ className }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 600 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPosition, setLastPanPosition] = useState({ x: 0, y: 0 });

  const {
    zeitstrahl,
    zoom,
    offset,
    setZoom,
    setOffset,
    renderKontext,
    aktivesWerkzeug,
  } = useTimeline();

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Create render context with actual dimensions
  const kontext = renderKontext
    ? { ...renderKontext, breite: dimensions.width, hoehe: dimensions.height - 80 }
    : null;

  // Handle wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent<HTMLDivElement>) => {
      // Only zoom if Ctrl/Cmd is held, otherwise let it scroll
      if (!e.ctrlKey && !e.metaKey) {
        // Pan horizontally with shift+scroll or just scroll
        const deltaX = e.shiftKey ? e.deltaY : e.deltaX;
        const deltaY = e.shiftKey ? 0 : e.deltaY;

        if (kontext) {
          const newOffset = begrenzeOffset(
            { x: offset.x - deltaX, y: offset.y - deltaY },
            kontext,
            kontext.breite * zoom,
            kontext.hoehe
          );
          setOffset(newOffset);
        }
        return;
      }

      e.preventDefault();

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || !kontext) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate new zoom
      const delta = -e.deltaY * ZOOM_FACTOR;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * (1 + delta)));

      // Calculate new offset to zoom towards mouse position
      const newOffset = berechneZoomOffset(
        { x: mouseX, y: mouseY },
        zoom,
        newZoom,
        offset
      );

      setZoom(newZoom);
      setOffset(begrenzeOffset(newOffset, kontext, kontext.breite * newZoom, kontext.hoehe));
    },
    [zoom, offset, setZoom, setOffset, kontext]
  );

  // Handle pan start
  const handlePanStart = useCallback(
    (clientX: number, clientY: number) => {
      if (aktivesWerkzeug === 'navigation' || aktivesWerkzeug === 'auswaehlen') {
        setIsPanning(true);
        setLastPanPosition({ x: clientX, y: clientY });
      }
    },
    [aktivesWerkzeug]
  );

  // Handle pan move
  const handlePanMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isPanning || !kontext) return;

      const deltaX = clientX - lastPanPosition.x;
      const deltaY = clientY - lastPanPosition.y;

      const newOffset = begrenzeOffset(
        { x: offset.x + deltaX, y: offset.y + deltaY },
        kontext,
        kontext.breite * zoom,
        kontext.hoehe
      );

      setOffset(newOffset);
      setLastPanPosition({ x: clientX, y: clientY });
    },
    [isPanning, lastPanPosition, offset, zoom, setOffset, kontext]
  );

  // Handle pan end
  const handlePanEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.button === 0) {
        handlePanStart(e.clientX, e.clientY);
      }
    },
    [handlePanStart]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      handlePanMove(e.clientX, e.clientY);
    },
    [handlePanMove]
  );

  const handleMouseUp = useCallback(() => {
    handlePanEnd();
  }, [handlePanEnd]);

  const handleMouseLeave = useCallback(() => {
    handlePanEnd();
  }, [handlePanEnd]);

  // Touch event handlers
  const handleTouchStart = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        if (touch) {
          handlePanStart(touch.clientX, touch.clientY);
        }
      }
    },
    [handlePanStart]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        if (touch) {
          handlePanMove(touch.clientX, touch.clientY);
        }
      }
    },
    [handlePanMove]
  );

  const handleTouchEnd = useCallback(() => {
    handlePanEnd();
  }, [handlePanEnd]);

  if (!kontext) {
    return (
      <div className={cn('flex items-center justify-center bg-muted/20', className)}>
        <p className="text-muted-foreground">Lade Timeline...</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex flex-col overflow-hidden bg-background',
        isPanning ? 'cursor-grabbing' : 'cursor-grab',
        className
      )}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="application"
      aria-label="Interaktiver Zeitstrahl"
      tabIndex={0}
    >
      {/* Main Timeline Canvas */}
      <div className="relative flex-1 overflow-hidden">
        <svg
          width={dimensions.width}
          height={dimensions.height - 80}
          className="block"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {/* Background grid (optional) */}
          <defs>
            <pattern
              id="grid"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 100 0 L 0 0 0 100"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.05"
                className="text-foreground"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Epochs layer (behind events) */}
          <TimelineEpochs kontext={kontext} />

          {/* Center axis line */}
          <line
            x1={0}
            y1={(dimensions.height - 80) / 2}
            x2={dimensions.width * zoom}
            y2={(dimensions.height - 80) / 2}
            stroke="currentColor"
            strokeOpacity={0.1}
            strokeWidth={2}
            className="text-foreground"
          />

          {/* Events layer */}
          <TimelineEvents kontext={kontext} />
        </svg>

        {/* Empty state */}
        {!zeitstrahl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-muted-foreground">
                Kein Zeitstrahl geladen. Erstellen Sie einen neuen Zeitstrahl oder laden Sie einen vorhandenen.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Time Scale */}
      <TimelineScale kontext={kontext} position="bottom" />

      {/* Zoom indicator */}
      <div className="absolute bottom-12 right-4 rounded bg-background/80 px-2 py-1 text-xs text-muted-foreground backdrop-blur">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
}
