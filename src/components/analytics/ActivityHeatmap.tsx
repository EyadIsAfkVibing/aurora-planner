import { useMemo } from 'react';

interface ActivityHeatmapProps {
  data: { [date: string]: number };
}

export const ActivityHeatmap = ({ data }: ActivityHeatmapProps) => {
  const { cells, maxValue, months } = useMemo(() => {
    const today = new Date();
    const cells: { date: string; value: number; dayOfWeek: number }[] = [];
    const monthSet = new Set<string>();
    let max = 1;

    // Generate last 12 weeks (84 days)
    for (let i = 83; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const value = data[dateStr] || 0;
      max = Math.max(max, value);
      
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      monthSet.add(monthName);

      cells.push({
        date: dateStr,
        value,
        dayOfWeek: date.getDay(),
      });
    }

    return { cells, maxValue: max, months: Array.from(monthSet).slice(-4) };
  }, [data]);

  const getIntensity = (value: number) => {
    if (value === 0) return 'bg-white/5';
    const ratio = value / maxValue;
    if (ratio < 0.25) return 'bg-aurora-emerald/20';
    if (ratio < 0.5) return 'bg-aurora-emerald/40';
    if (ratio < 0.75) return 'bg-aurora-emerald/60';
    return 'bg-aurora-emerald/80 shadow-[0_0_8px_hsl(var(--aurora-emerald)/0.5)]';
  };

  // Group cells by week
  const weeks: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-aurora-emerald/5 rounded-full blur-3xl" />
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-aurora-emerald animate-pulse" />
          Activity Heatmap
        </h3>
        
        {/* Legend */}
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-0.5">
            {['bg-white/5', 'bg-aurora-emerald/20', 'bg-aurora-emerald/40', 'bg-aurora-emerald/60', 'bg-aurora-emerald/80'].map((color, i) => (
              <div key={i} className={`w-2 h-2 rounded-sm ${color}`} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Month labels */}
      <div className="flex gap-[3px] mb-1 pl-6">
        {months.map((month, i) => (
          <span
            key={i}
            className="text-[10px] text-muted-foreground"
            style={{ width: `${100 / months.length}%` }}
          >
            {month}
          </span>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-[3px] text-[10px] text-muted-foreground pr-1">
          <span className="h-[10px]"></span>
          <span className="h-[10px]">Mon</span>
          <span className="h-[10px]"></span>
          <span className="h-[10px]">Wed</span>
          <span className="h-[10px]"></span>
          <span className="h-[10px]">Fri</span>
          <span className="h-[10px]"></span>
        </div>

        {/* Grid */}
        <div className="flex gap-[3px] flex-1 overflow-x-auto pb-2 custom-scrollbar">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[3px]">
              {week.map((cell, dayIndex) => (
                <div
                  key={cell.date}
                  className={`w-[10px] h-[10px] rounded-sm transition-all duration-300 hover:scale-150 hover:z-10 cursor-pointer group/cell relative ${getIntensity(cell.value)}`}
                  style={{
                    animationDelay: `${(weekIndex * 7 + dayIndex) * 10}ms`,
                  }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-background/95 border border-white/10 rounded-md text-[10px] whitespace-nowrap opacity-0 group-hover/cell:opacity-100 transition-opacity z-20 pointer-events-none">
                    <div className="font-medium text-foreground">{cell.value} {cell.value === 1 ? 'lesson' : 'lessons'}</div>
                    <div className="text-muted-foreground">{cell.date}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
