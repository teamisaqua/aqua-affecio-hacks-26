import React from 'react';
import { cn } from '@/lib/utils';

interface MetricBadgeProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: 'blue' | 'green' | 'amber' | 'red';
  className?: string;
}

export const MetricBadge: React.FC<MetricBadgeProps> = ({
  label,
  value,
  unit,
  color = 'blue',
  className,
}) => {
  const colorMap = {
    blue: 'text-apple-blue',
    green: 'text-apple-green',
    amber: 'text-apple-amber',
    red: 'text-apple-red',
  };

  return (
    <div
      className={cn(
        'inline-flex flex-col items-center justify-center px-4 py-2 rounded-[14px] bg-[#2C2C2E] border border-white/10',
        className
      )}
    >
      <span className="text-[11px] font-medium uppercase tracking-wider text-[#A1A1A6]">
        {label}
      </span>
      <div className="flex items-baseline space-x-1 tabular-data font-semibold text-lg leading-tight mt-0.5 text-white">
        <span className={colorMap[color]}>{value}</span>
        {unit && <span className="text-xs font-normal text-[#A1A1A6]">{unit}</span>}
      </div>
    </div>
  );
};
