import React from 'react';
import { cn } from '@/lib/utils';

interface LiquidGlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'hero';
  tint?: 'blue' | 'green' | 'amber' | 'red' | 'none';
  interactive?: boolean;
}

export const LiquidGlassPanel: React.FC<LiquidGlassPanelProps> = ({
  children,
  className,
  variant = 'primary',
  tint = 'none',
  interactive = false,
  ...props
}) => {
  const variantClasses = {
    hero: 'apple-card-hero',
    primary: 'apple-card',
    secondary: 'apple-card-secondary',
  };

  const tintClasses = {
    none: '',
    blue: 'border-apple-blue/30',
    green: 'border-apple-green/30',
    amber: 'border-apple-amber/30',
    red: 'border-apple-red/30',
  };

  return (
    <div
      className={cn(
        variantClasses[variant],
        tintClasses[tint],
        interactive && 'transition-all duration-150 hover:bg-[#242426] cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
