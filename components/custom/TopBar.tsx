'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye } from 'lucide-react';

interface TopBarProps {
  onRunSolver?: () => void;
  viewMode?: 'design' | 'results';
  onBackToDesign?: () => void;
}

export const TopBar = ({ onRunSolver, viewMode = 'design', onBackToDesign }: TopBarProps) => {
  return (
    <div className="h-16 bg-slate-950 border-b border-slate-700 flex items-center justify-between px-6">
      {/* Left side - Logo and title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">M</span>
        </div>
        <h1 className="text-lg font-semibold text-slate-100">Supermarket Layout Planner</h1>
        
        {/* Indicador de modo */}
        {viewMode === 'results' && (
          <Badge className="bg-green-900/30 text-green-300 border-green-700 flex items-center gap-1">
            <Eye className="w-3 h-3" />
            Modo Resultados
          </Badge>
        )}
      </div>

      {/* Center - Menu */}
      <div className="flex gap-6">
        <button className="text-sm text-slate-300 hover:text-slate-100 transition-colors">
          File
        </button>
        <button className="text-sm text-slate-300 hover:text-slate-100 transition-colors">
          Edit
        </button>
        <button className="text-sm text-slate-300 hover:text-slate-100 transition-colors">
          View
        </button>
        <button className="text-sm text-slate-300 hover:text-slate-100 transition-colors">
          Help
        </button>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3">
        {viewMode === 'results' && onBackToDesign && (
          <Button
            onClick={onBackToDesign}
            variant="outline"
            className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Diseño
          </Button>
        )}
        
        {viewMode === 'design' && (
          <Button
            onClick={onRunSolver}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Run Solver Algorithm
          </Button>
        )}
      </div>
    </div>
  );
};
