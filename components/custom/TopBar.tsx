'use client';

import { Button } from '@/components/ui/button';

interface TopBarProps {
  onRunSolver?: () => void;
}

export const TopBar = ({ onRunSolver }: TopBarProps) => {
  return (
    <div className="h-16 bg-slate-950 border-b border-slate-700 flex items-center justify-between px-6">
      {/* Left side - Logo and title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">M</span>
        </div>
        <h1 className="text-lg font-semibold text-slate-100">Supermarket Layout Planner</h1>
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

      {/* Right side - Run Solver button */}
      <Button
        onClick={onRunSolver}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Run Solver Algorithm
      </Button>
    </div>
  );
};
