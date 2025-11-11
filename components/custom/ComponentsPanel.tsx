'use client';

import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { ComponentCard } from './ComponentCard';
import { Input } from '@/components/ui/input';

interface Component {
  id: string;
  name: string;
  width: number;
  depth: number;
  category: string;
}

const COMPONENTS: Component[] = [
  // Shelving (dimensiones en metros)
  { id: 'shelf-standard', name: 'Standard', width: 3.6, depth: 1.2, category: 'Shelving' },
  { id: 'shelf-endcap', name: 'End Cap', width: 0.9, depth: 1.2, category: 'Shelving' },

  // Refrigeration (dimensiones en metros)
  { id: 'fridge-freezer', name: 'Freezer', width: 2.4, depth: 1.2, category: 'Refrigeration' },
  { id: 'fridge-cooler', name: 'Cooler', width: 3.6, depth: 1.2, category: 'Refrigeration' },

  // Checkouts (dimensiones en metros)
  { id: 'checkout-lane', name: 'Checkout Lane', width: 2.4, depth: 1.2, category: 'Checkouts' },

  // Structural (dimensiones en metros)
  { id: 'struct-wall', name: 'Wall Unit', width: 3.6, depth: 0.6, category: 'Structural' },
];

const CATEGORIES = ['Shelving', 'Refrigeration', 'Checkouts', 'Structural'];

export const ComponentsPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(CATEGORIES)
  );

  const filteredComponents = useMemo(() => {
    if (!searchTerm) return COMPONENTS;
    const term = searchTerm.toLowerCase();
    return COMPONENTS.filter((comp) => comp.name.toLowerCase().includes(term));
  }, [searchTerm]);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const componentsByCategory = useMemo(() => {
    const grouped: Record<string, Component[]> = {};
    filteredComponents.forEach((comp) => {
      if (!grouped[comp.category]) {
        grouped[comp.category] = [];
      }
      grouped[comp.category].push(comp);
    });
    return grouped;
  }, [filteredComponents]);

  return (
    <div className="w-[260px] bg-slate-900 border-r border-slate-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-sm font-semibold text-slate-100">Components</h2>
        <p className="text-xs text-slate-400">Drag to canvas</p>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-slate-700">
        <Input
          placeholder="Find components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500 text-sm"
        />
      </div>

      {/* Categories and Components */}
      <div className="flex-1 overflow-y-auto">
        {CATEGORIES.map((category) => {
          const components = componentsByCategory[category] || [];
          const isExpanded = expandedCategories.has(category);

          return (
            <div key={category} className="border-b border-slate-700">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-4 py-3 flex items-center gap-2 hover:bg-slate-800 transition-colors text-left"
              >
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform ${
                    isExpanded ? '' : '-rotate-90'
                  }`}
                />
                <span className="text-sm font-medium text-slate-300">{category}</span>
                <span className="text-xs text-slate-500 ml-auto">({components.length})</span>
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 space-y-2">
                  {components.length > 0 ? (
                    components.map((comp) => (
                      <ComponentCard
                        key={comp.id}
                        id={comp.id}
                        name={comp.name}
                        width={comp.width}
                        depth={comp.depth}
                        category={comp.category}
                      />
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 py-2">No components</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
