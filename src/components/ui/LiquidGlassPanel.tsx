import React from 'react';
import { cn } from '@/lib/utils';

interface LiquidGlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  tint?: 'cyan' | 'rose' | 'emerald' | 'amber' | 'none';
  interactive?: boolean;
}

export const LiquidGlassPanel: React.FC<LiquidGlassPanelProps> = ({
  children,
  className,
  tint = 'none',
  interactive = false,
  ...props
}) => {
  const tintClasses = {
    none: '',
    cyan: 'border-sky-500/25 bg-gradient-to-b from-sky-500/[0.04] to-transparent',
    rose: 'border-rose-500/25 bg-gradient-to-b from-rose-500/[0.04] to-transparent',
    emerald: 'border-emerald-500/25 bg-gradient-to-b from-emerald-500/[0.04] to-transparent',
    amber: 'border-amber-500/25 bg-gradient-to-b from-amber-500/[0.04] to-transparent',
  };

  return (
    <div
      className={cn(
        'apple-glass rounded-2xl relative overflow-hidden',
        tintClasses[tint],
        interactive && 'apple-glass-interactive cursor-pointer',
        className
      )}
      {...props}
    >
      {/* Hairline top specular edge highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
