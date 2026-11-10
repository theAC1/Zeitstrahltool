"use client";

import { useState, useCallback, useMemo, type WheelEvent } from "react";

export interface UseZoomOptions {
    /** Initial zoom level (1 = 100%) */
    initialZoom?: number;
    /** Minimum zoom level */
    minZoom?: number;
    /** Maximum zoom level */
    maxZoom?: number;
    /** Step for zoom in/out buttons */
    zoomStep?: number;
}

export interface UseZoomReturn {
    /** Current zoom level (1 = 100%) */
    zoom: number;
    /** Zoom percentage for display (e.g., 150 for 150%) */
    zoomPercent: number;
    /** Set zoom to specific level */
    setZoom: (level: number) => void;
    /** Zoom in by step */
    zoomIn: () => void;
    /** Zoom out by step */
    zoomOut: () => void;
    /** Reset to initial zoom */
    resetZoom: () => void;
    /** Handle mouse wheel for zooming */
    handleWheel: (e: WheelEvent<HTMLElement>) => void;
    /** Check if can zoom in further */
    canZoomIn: boolean;
    /** Check if can zoom out further */
    canZoomOut: boolean;
}

/**
 * Custom hook for managing zoom state and controls.
 * Provides zoom level, zoom functions, and wheel handler.
 */
export function useZoom(options: UseZoomOptions = {}): UseZoomReturn {
    const {
        initialZoom = 1,
        minZoom = 0.25,
        maxZoom = 4,
        zoomStep = 0.25,
    } = options;

    const [zoom, setZoomState] = useState<number>(initialZoom);

    const clampZoom = useCallback(
        (value: number): number => {
            return Math.min(Math.max(value, minZoom), maxZoom);
        },
        [minZoom, maxZoom]
    );

    const setZoom = useCallback(
        (level: number) => {
            setZoomState(clampZoom(level));
        },
        [clampZoom]
    );

    const zoomIn = useCallback(() => {
        setZoomState((prev) => clampZoom(prev + zoomStep));
    }, [clampZoom, zoomStep]);

    const zoomOut = useCallback(() => {
        setZoomState((prev) => clampZoom(prev - zoomStep));
    }, [clampZoom, zoomStep]);

    const resetZoom = useCallback(() => {
        setZoomState(initialZoom);
    }, [initialZoom]);

    const handleWheel = useCallback(
        (e: WheelEvent<HTMLElement>) => {
            // Only zoom when Ctrl/Cmd is pressed
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
                setZoomState((prev) => clampZoom(prev + delta));
            }
        },
        [clampZoom, zoomStep]
    );

    const zoomPercent = useMemo(() => Math.round(zoom * 100), [zoom]);
    const canZoomIn = zoom < maxZoom;
    const canZoomOut = zoom > minZoom;

    return {
        zoom,
        zoomPercent,
        setZoom,
        zoomIn,
        zoomOut,
        resetZoom,
        handleWheel,
        canZoomIn,
        canZoomOut,
    };
}
