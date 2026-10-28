'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-[#9E9EA7]">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`input-text ${error ? '!border-apple-red' : ''} ${className}`}
          {...props}
        />
        {error && (
          <span className="block text-[11px] text-apple-red font-medium">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
