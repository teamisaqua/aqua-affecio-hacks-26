import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'live' | 'neutral' | 'success' | 'accent';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  let style = 'bg-[#141417] text-[#9E9EA7] border-white/8';
  let dotColor = 'bg-white/40';

  if (variant === 'live') {
    style = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25';
    dotColor = 'bg-emerald-400 animate-pulse';
  } else if (variant === 'success') {
    style = 'bg-emerald-500/15 text-apple-green border-emerald-500/30';
    dotColor = 'bg-apple-green';
  } else if (variant === 'accent') {
    style = 'bg-blue-500/15 text-apple-blue border-blue-500/30';
    dotColor = 'bg-apple-blue';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium tracking-tight ${style} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{children}</span>
    </span>
  );
};
