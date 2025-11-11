'use client';

interface ComponentCardProps {
  id: string;
  name: string;
  width: number;
  depth: number;
  category: string;
}

export const ComponentCard = ({ id, name, width, depth, category }: ComponentCardProps) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const componentData = {
      id,
      name,
      width,
      depth,
      category,
      type: category.toLowerCase().replace(' ', '_'),
    };
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify(componentData));
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-slate-700 hover:bg-slate-600 p-3 rounded cursor-grab active:cursor-grabbing transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-slate-100">{name}</h4>
          <p className="text-xs text-slate-400 mt-1">
            {width}m × {depth}m
          </p>
        </div>
      </div>
    </div>
  );
};
