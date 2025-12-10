import { useEffect, useState } from 'react';
import { Zap, Star } from 'lucide-react';

interface XPBarProps {
  level: number;
  progress: number;
  totalXP: number;
  xpToNext: number;
}

export const XPBar = ({ level, progress, totalXP, xpToNext }: XPBarProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedProgress(progress * 100);
    }, 300);
    return () => clearTimeout(timeout);
  }, [progress]);

  return (
    <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Level badge */}
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.4)] group-hover:shadow-[0_0_40px_hsl(var(--primary)/0.6)] transition-shadow">
                <span className="text-lg font-bold text-primary-foreground">{level}</span>
              </div>
              {/* Floating stars */}
              <Star className="absolute -top-1 -right-1 w-4 h-4 text-amber-400 animate-pulse" />
            </div>
            
            <div>
              <p className="text-sm font-medium text-foreground">Level {level}</p>
              <p className="text-xs text-muted-foreground">{totalXP.toLocaleString()} Total XP</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-primary">{xpToNext} to next</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
          {/* Animated fill */}
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-accent to-aurora-cyan rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${animatedProgress}%` }}
          >
            {/* Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
          
          {/* Glow */}
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent blur-md opacity-50 transition-all duration-1000"
            style={{ width: `${animatedProgress}%` }}
          />
          
          {/* Pulse dot at end */}
          {animatedProgress > 0 && (
            <div
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white] animate-pulse transition-all duration-1000"
              style={{ left: `calc(${animatedProgress}% - 4px)` }}
            />
          )}
        </div>
        
        {/* Progress labels */}
        <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
          <span>Level {level}</span>
          <span>{Math.round(progress * 100)}%</span>
          <span>Level {level + 1}</span>
        </div>
      </div>
    </div>
  );
};
