'use client';

import { useState, useCallback } from 'react';

export const useCanvasControls = () => {
  const [zoom, setZoom] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  const handleZoom = useCallback((newZoom: number) => {
    const clampedZoom = Math.max(0.25, Math.min(4, newZoom));
    setZoom(clampedZoom);
  }, []);

  const handleStagePos = useCallback((newPos: { x: number; y: number }) => {
    setStagePos(newPos);
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setStagePos({ x: 0, y: 0 });
  }, []);

  return {
    zoom,
    setZoom: handleZoom,
    stagePos,
    setStagePos: handleStagePos,
    resetZoom,
  };
};
