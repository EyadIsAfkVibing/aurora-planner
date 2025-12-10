import { useEffect, useState } from 'react';

interface WeeklyChartProps {
  data: number[];
  maxValue?: number;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const WeeklyChart = ({ data, maxValue }: WeeklyChartProps) => {
  const [animatedData, setAnimatedData] = useState<number[]>(data.map(() => 0));
  const max = maxValue || Math.max(...data, 1);
  const today = new Date().getDay();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedData(data);
    }, 200);
    return () => clearTimeout(timeout);
  }, [data]);

  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-aurora-emerald animate-pulse" />
        Weekly Activity
      </h3>

      <div className="flex items-end justify-between gap-2 h-32">
        {data.map((value, index) => {
          const height = (animatedData[index] / max) * 100;
          const isToday = index === today;
          
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2 group/bar"
            >
              <div className="relative w-full h-24 flex items-end">
                {/* Bar background */}
                <div className="absolute inset-x-0 bottom-0 h-full bg-white/5 rounded-t-lg" />
                
                {/* Animated bar */}
                <div
                  className={`relative w-full rounded-t-lg transition-all duration-700 ease-out ${
                    isToday
                      ? 'bg-gradient-to-t from-primary to-aurora-cyan shadow-[0_0_20px_hsl(var(--primary)/0.5)]'
                      : 'bg-gradient-to-t from-muted-foreground/40 to-muted-foreground/20'
                  }`}
                  style={{
                    height: `${height}%`,
                    transitionDelay: `${index * 50}ms`,
                  }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/bar:opacity-100 group-hover/bar:animate-shimmer" />
                  
                  {/* Value tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-background/90 border border-white/10 rounded-md text-xs font-mono opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {value} {value === 1 ? 'lesson' : 'lessons'}
                  </div>
                </div>
              </div>
              
              <span
                className={`text-[10px] font-medium ${
                  isToday ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {DAYS[index]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
