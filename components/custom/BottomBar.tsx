'use client';

import { Button } from '@/components/ui/button';
import { Undo2, Redo2 } from 'lucide-react';

interface BottomBarProps {
  zoom: number;
  cursorX: number;
  cursorY: number;
  floorSpace: number;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const BottomBar = ({
  zoom,
  cursorX,
  cursorY,
  floorSpace,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: BottomBarProps) => {
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="h-12 bg-slate-950 border-t border-slate-700 flex items-center justify-between px-6">
      {/* Left side - Undo/Redo buttons */}
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className="text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          className="text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={16} />
        </Button>
      </div>

      {/* Right side - Info */}
      <div className="flex gap-6 text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <span>Zoom:</span>
          <span className="text-slate-300 font-medium">{zoomPercent}%</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Grid:</span>
          <span className="text-slate-300 font-medium">1 ft</span>
        </div>
        <div className="flex items-center gap-1">
          <span>X:</span>
          <span className="text-slate-300 font-medium">{cursorX.toFixed(1)}</span>
          <span>, Y:</span>
          <span className="text-slate-300 font-medium">{cursorY.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Floor Space:</span>
          <span className="text-slate-300 font-medium">{floorSpace} sq ft</span>
        </div>
      </div>
    </div>
  );
};
