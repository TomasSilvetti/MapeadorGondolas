'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Eye, Edit3, BarChart3, Home } from 'lucide-react';

interface TopBarProps {
  onRunSolver?: () => void;
  viewMode?: 'design' | 'results';
  onBackToDesign?: () => void;
  hasResults?: boolean;
  onToggleMode?: (mode: 'design' | 'results') => void;
}

export const TopBar = ({ 
  onRunSolver, 
  viewMode = 'design', 
  onBackToDesign, 
  hasResults = false,
  onToggleMode 
}: TopBarProps) => {
  const router = useRouter();
  
  const handleToggleChange = (checked: boolean) => {
    if (onToggleMode) {
      onToggleMode(checked ? 'results' : 'design');
    }
  };

  return (
    <div className="h-16 bg-slate-950 border-b border-slate-700 flex items-center justify-between px-6">
      {/* Left side - Logo and title */}
      <div className="flex items-center gap-3">
        <Button
          onClick={() => router.push('/')}
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-slate-100 hover:bg-slate-800"
        >
          <Home className="w-4 h-4 mr-2" />
          Inicio
        </Button>
        <div className="w-px h-6 bg-slate-700" />
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">M</span>
        </div>
        <h1 className="text-lg font-semibold text-slate-100">Supermarket Layout Planner</h1>
      </div>

      {/* Center - Mode Toggle */}
      <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
        <div className={`flex items-center gap-2 ${viewMode === 'design' ? 'text-slate-100' : 'text-slate-400'}`}>
          <Edit3 className="w-4 h-4" />
          <span className="text-sm font-medium">Edición</span>
        </div>
        
        <Switch
          checked={viewMode === 'results'}
          onCheckedChange={handleToggleChange}
          disabled={!hasResults}
          className="data-[state=checked]:bg-green-600"
        />
        
        <div className={`flex items-center gap-2 ${viewMode === 'results' ? 'text-slate-100' : 'text-slate-400'}`}>
          <BarChart3 className="w-4 h-4" />
          <span className="text-sm font-medium">Resultados</span>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3">
        {viewMode === 'design' && (
          <Button
            onClick={onRunSolver}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Ejecutar Optimización
          </Button>
        )}
      </div>
    </div>
  );
};
