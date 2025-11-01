'use client';

import { useRef, useEffect, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';
import { CanvasGrid } from './CanvasGrid';
import { GondolaShape } from './GondolaShape';
import { Gondola } from '@/types';

interface CanvasStageProps {
  gondolas: Gondola[];
  selectedGondolaId: string | null;
  onSelectGondola: (id: string | null) => void;
  onGondolaMove: (id: string, x: number, y: number) => void;
  onDrop: (x: number, y: number, componentData: Record<string, unknown>) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  stagePos: { x: number; y: number };
  onStagePosChange: (pos: { x: number; y: number }) => void;
}

const CANVAS_SIZE_FT = 100;
const PIXELS_PER_FOOT = 30;
const CANVAS_WIDTH = CANVAS_SIZE_FT * PIXELS_PER_FOOT;
const CANVAS_HEIGHT = CANVAS_SIZE_FT * PIXELS_PER_FOOT;

export const CanvasStage = ({
  gondolas,
  selectedGondolaId,
  onSelectGondola,
  onGondolaMove,
  onDrop,
  zoom,
  onZoomChange,
  stagePos,
  onStagePosChange,
}: CanvasStageProps) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [isDraggingStage, setIsDraggingStage] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });

  // Actualizar dimensiones al cambiar tamaño de ventana
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth - 260 - 300;
      const height = window.innerHeight - 64 - 48;
      setDimensions({ width: Math.max(width, 500), height: Math.max(height, 400) });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Manejo de scroll para zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!stageRef.current) return;

      e.preventDefault();

      const stage = stageRef.current;
      const oldScale = zoom;
      const direction = e.deltaY > 0 ? -0.1 : 0.1;
      const newScale = Math.max(0.25, Math.min(4, oldScale + direction));

      const pointerPosition = stage.getPointerPosition();
      if (!pointerPosition) return;

      const mousePointTo = {
        x: pointerPosition.x / oldScale - stage.x() / oldScale,
        y: pointerPosition.y / oldScale - stage.y() / oldScale,
      };

      const newPos = {
        x: -(mousePointTo.x - pointerPosition.x / newScale) * newScale,
        y: -(mousePointTo.y - pointerPosition.y / newScale) * newScale,
      };

      onZoomChange(newScale);
      onStagePosChange(newPos);
    };

    const container = stageRef.current?.container();
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [zoom, onZoomChange, onStagePosChange]);

  // Manejo de drag del canvas
  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 1 || !e.target.hasName('empty')) return;
    
    setIsDraggingStage(true);
    setDragStart({
      x: e.evt.clientX - stagePos.x,
      y: e.evt.clientY - stagePos.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingStage) return;

      const newPos = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      };
      onStagePosChange(newPos);
    };

    const handleMouseUp = () => {
      setIsDraggingStage(false);
    };

    if (isDraggingStage) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingStage, dragStart, onStagePosChange]);

  // Manejo de drag and drop desde panel
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;

    const componentData = JSON.parse(data) as Record<string, unknown>;
    const stage = stageRef.current;
    if (!stage) return;

    const rect = stage.container().getBoundingClientRect();

    const x = (e.clientX - rect.left - stagePos.x) / zoom / PIXELS_PER_FOOT;
    const y = (e.clientY - rect.top - stagePos.y) / zoom / PIXELS_PER_FOOT;

    onDrop(x, y, componentData);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        flex: 1,
        display: 'flex',
      }}
    >
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        scale={{ x: zoom, y: zoom }}
        position={stagePos}
        onMouseDown={handleStageMouseDown}
        style={{
          backgroundColor: '#1e293b',
          cursor: isDraggingStage ? 'grabbing' : 'grab',
          flex: 1,
        }}
      >
        <Layer>
          {/* Grid */}
          <CanvasGrid
            gridSize={1}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            pixelsPerFoot={PIXELS_PER_FOOT}
          />

          {/* Góndolas */}
          {gondolas.map((gondola) => (
            <GondolaShape
              key={gondola.id}
              gondola={gondola}
              isSelected={selectedGondolaId === gondola.id}
              pixelsPerFoot={PIXELS_PER_FOOT}
              onSelect={onSelectGondola}
              onDragEnd={onGondolaMove}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};
