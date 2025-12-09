import { ReactNode } from 'react';

interface GlitchTextProps {
  children: ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const GlitchText = ({ children, className = '', intensity = 'medium' }: GlitchTextProps) => {
  const intensityClass = {
    low: 'hover:animate-glitch-low',
    medium: 'hover:animate-glitch-medium',
    high: 'hover:animate-glitch-high',
  };

  return (
    <span className={`relative inline-block ${intensityClass[intensity]} ${className}`}>
      <span className="relative z-10">{children}</span>
      <span
        className="absolute inset-0 text-aurora-cyan opacity-0 hover:opacity-70 animate-glitch-layer-1"
        style={{ clipPath: 'inset(40% 0 60% 0)' }}
        aria-hidden
      >
        {children}
      </span>
      <span
        className="absolute inset-0 text-aurora-fuchsia opacity-0 hover:opacity-70 animate-glitch-layer-2"
        style={{ clipPath: 'inset(60% 0 20% 0)' }}
        aria-hidden
      >
        {children}
      </span>
    </span>
  );
};
