import { useEffect, useState } from 'react';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: string;
  glowColor?: string;
}

export const ProgressRing = ({
  progress,
  size = 160,
  strokeWidth = 8,
  label,
  sublabel,
  color = 'hsl(var(--primary))',
  glowColor = 'hsl(var(--primary) / 0.5)',
}: ProgressRingProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timeout);
  }, [progress]);

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Background glow */}
      <div
        className="absolute inset-0 rounded-full animate-pulse-slow opacity-30"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        }}
      />

      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted) / 0.3)"
          strokeWidth={strokeWidth}
        />
        
        {/* Animated gradient track */}
        <defs>
          <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="50%" stopColor="hsl(var(--accent))" />
            <stop offset="100%" stopColor="hsl(var(--aurora-cyan))" />
          </linearGradient>
        </defs>
        
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#gradient-${label})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${glowColor})`,
          }}
        />
        
        {/* Glowing dot at progress point */}
        {animatedProgress > 0 && (
          <circle
            cx={size / 2 + radius * Math.cos(((animatedProgress / 100) * 360 - 90) * Math.PI / 180)}
            cy={size / 2 + radius * Math.sin(((animatedProgress / 100) * 360 - 90) * Math.PI / 180)}
            r={strokeWidth / 2 + 2}
            fill={color}
            className="animate-pulse"
            style={{
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
          />
        )}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground animate-text-glow">
          {Math.round(animatedProgress)}%
        </span>
        {label && (
          <span className="text-xs text-muted-foreground mt-1">{label}</span>
        )}
        {sublabel && (
          <span className="text-[10px] text-muted-foreground/60">{sublabel}</span>
        )}
      </div>
    </div>
  );
};
