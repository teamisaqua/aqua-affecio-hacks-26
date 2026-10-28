'use client';

import React from 'react';
import { sound } from '@/lib/sound/soundEffects';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', onClick, children, disabled, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      sound.playGlassClick();
      onClick?.(e);
    };

    let baseClass = 'btn-primary';
    if (variant === 'secondary') baseClass = 'btn-secondary';
    if (variant === 'ghost') baseClass = 'btn-ghost';
    if (variant === 'destructive') baseClass = 'btn-secondary !text-apple-red !border-apple-red/40';

    const sizeClass =
      size === 'sm' ? '!min-h-[36px] !py-1.5 !px-4 !text-xs' :
      size === 'lg' ? '!min-h-[48px] !py-3.5 !px-8 !text-base' :
      '';

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={`${baseClass} ${sizeClass} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
