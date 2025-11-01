'use client';

import { Line } from 'react-konva';

interface CanvasGridProps {
  gridSize: number; // en pies
  width: number; // en píxeles
  height: number; // en píxeles
  pixelsPerFoot: number; // píxeles por pie
}

export const CanvasGrid = ({ gridSize, width, height, pixelsPerFoot }: CanvasGridProps) => {
  const spacing = gridSize * pixelsPerFoot;
  const gridLines = [];

  // Líneas verticales
  for (let x = 0; x <= width; x += spacing) {
    gridLines.push(
      <Line
        key={`v-${x}`}
        points={[x, 0, x, height]}
        stroke="#334155"
        strokeWidth={1}
        opacity={0.3}
      />
    );
  }

  // Líneas horizontales
  for (let y = 0; y <= height; y += spacing) {
    gridLines.push(
      <Line
        key={`h-${y}`}
        points={[0, y, width, y]}
        stroke="#334155"
        strokeWidth={1}
        opacity={0.3}
      />
    );
  }

  return <>{gridLines}</>;
};
