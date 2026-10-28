import React from 'react';
import { cn } from '@/lib/utils';

interface MetricBadgeProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: 'cyan' | 'rose' | 'emerald' | 'amber';
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
    cyan: 'text-sky-400 bg-sky-500/[0.08] border-sky-500/20',
    rose: 'text-rose-400 bg-rose-500/[0.08] border-rose-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/[0.08] border-amber-500/20',
  };

  return (
    <div
      className={cn(
        'inline-flex flex-col items-center justify-center px-4 py-2.5 rounded-xl border backdrop-blur-md',
        colorMap[color],
        className
      )}
    >
      <span className="text-[11px] font-medium tracking-wide uppercase text-slate-400">
        {label}
      </span>
      <div className="flex items-baseline space-x-1 tabular-data font-semibold text-lg leading-tight mt-0.5">
        <span>{value}</span>
        {unit && <span className="text-xs font-normal text-slate-400">{unit}</span>}
      </div>
    </div>
  );
};
