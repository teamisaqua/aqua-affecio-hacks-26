import React from 'react';
import { cn } from '@/lib/utils';

interface MetricBadgeProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: 'cyan' | 'pink' | 'purple' | 'amber' | 'emerald';
  className?: string;
}

export const MetricBadge: React.FC<MetricBadgeProps> = ({
  label,
  value,
  unit,
  color = 'cyan',
  className,
}) => {
  const colorMap = {
    cyan: 'text-lab-cyan bg-lab-cyan/10 border-lab-cyan/30',
    pink: 'text-lab-pink bg-lab-pink/10 border-lab-pink/30',
    purple: 'text-lab-purple bg-lab-purple/10 border-lab-purple/30',
    amber: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  };

  return (
    <div
      className={cn(
        'inline-flex flex-col items-center justify-center px-4 py-2 rounded-xl border backdrop-blur-md',
        colorMap[color],
        className
      )}
    >
      <span className="text-[10px] uppercase tracking-widest font-mono text-slate-400">
        {label}
      </span>
      <div className="flex items-baseline space-x-1 font-mono font-bold text-lg leading-tight">
        <span>{value}</span>
        {unit && <span className="text-xs font-normal opacity-75">{unit}</span>}
      </div>
    </div>
  );
};
