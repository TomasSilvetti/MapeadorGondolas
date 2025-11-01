'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarToggleButtonProps {
  isVisible: boolean;
  onToggle: () => void;
  side: 'left' | 'right';
}

export const SidebarToggleButton = ({
  isVisible,
  onToggle,
  side,
}: SidebarToggleButtonProps) => {
  const Icon = side === 'left' ? ChevronRight : ChevronLeft;
  const position = side === 'left' ? 'left-0' : 'right-0';

  return (
    <button
      onClick={onToggle}
      className={`
        absolute ${position} top-1/2 -translate-y-1/2 z-50
        w-8 h-12
        bg-slate-800/90 border border-slate-600
        hover:bg-slate-700
        transition-all duration-200
        flex items-center justify-center
        ${side === 'left' ? 'rounded-r-md' : 'rounded-l-md'}
        shadow-lg
      `}
      title={isVisible ? 'Ocultar panel' : 'Mostrar panel'}
    >
      <Icon size={16} className="text-slate-300" />
    </button>
  );
};

