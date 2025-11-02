'use client';

import { useRef, useEffect } from 'react';
import { Group, Rect, Text } from 'react-konva';
import Konva from 'konva';
import { Gondola } from '@/types';

interface GondolaShapeProps {
  gondola: Gondola;
  isSelected: boolean;
  pixelsPerFoot: number;
  onSelect: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  viewMode?: 'design' | 'results';
}

export const GondolaShape = ({
  gondola,
  isSelected,
  pixelsPerFoot,
  onSelect,
  onDragEnd,
  viewMode = 'design',
}: GondolaShapeProps) => {
  const groupRef = useRef<Konva.Group>(null);

  const width = gondola.width * pixelsPerFoot;
  const height = gondola.depth * pixelsPerFoot;

  useEffect(() => {
    if (isSelected && groupRef.current) {
      const stage = groupRef.current.getStage();
      if (stage) {
        stage.container().style.cursor = 'grab';
      }
    }
  }, [isSelected]);

  const isDraggable = viewMode === 'design';
  const cursorStyle = viewMode === 'results' ? 'pointer' : 'grab';

  return (
    <Group
      ref={groupRef}
      x={gondola.x * pixelsPerFoot}
      y={gondola.y * pixelsPerFoot}
      rotation={gondola.rotation}
      draggable={isDraggable}
      onClick={() => onSelect(gondola.id)}
      onDragEnd={(e) => {
        if (isDraggable) {
          const newX = e.target.x() / pixelsPerFoot;
          const newY = e.target.y() / pixelsPerFoot;
          onDragEnd(gondola.id, newX, newY);
        }
      }}
      onMouseEnter={(e) => {
        const stage = e.target.getStage();
        if (stage) {
          stage.container().style.cursor = cursorStyle;
        }
      }}
      onMouseLeave={(e) => {
        const stage = e.target.getStage();
        if (stage) {
          stage.container().style.cursor = 'default';
        }
      }}
    >
      <Rect
        width={width}
        height={height}
        fill="#64748b"
        stroke={isSelected ? '#3b82f6' : '#475569'}
        strokeWidth={isSelected ? 3 : 1}
        cornerRadius={4}
      />
      <Text
        text={gondola.name}
        x={0}
        y={height / 2 - 10}
        width={width}
        height={20}
        align="center"
        fontSize={12}
        fill="#f1f5f9"
        pointerEvents="none"
      />
    </Group>
  );
};
