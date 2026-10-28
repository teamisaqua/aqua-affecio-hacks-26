import React from 'react';
import { cn } from '@/lib/utils';

interface LiquidGlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: 'cyan' | 'pink' | 'purple' | 'none';
  interactive?: boolean;
}

export const LiquidGlassPanel: React.FC<LiquidGlassPanelProps> = ({
  children,
  className,
  glow = 'none',
  interactive = false,
  ...props
}) => {
  const glowClasses = {
    none: '',
    cyan: 'border-glow-cyan',
    pink: 'border-glow-pink',
    purple: 'shadow-glow-purple border-lab-purple/30',
  };

  return (
    <div
      className={cn(
        'glass-panel rounded-2xl relative overflow-hidden',
        glowClasses[glow],
        interactive && 'glass-panel-interactive cursor-pointer',
        className
      )}
      {...props}
    >
      {/* Specular Edge Refraction Line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
