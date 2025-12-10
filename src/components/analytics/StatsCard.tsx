import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: number;
  color?: string;
  delay?: number;
}

export const StatsCard = ({
  icon: Icon,
  label,
  value,
  sublabel,
  trend,
  color = 'primary',
  delay = 0,
}: StatsCardProps) => {
  const colorClasses = {
    primary: 'from-primary/20 to-primary/5 border-primary/30 text-primary',
    emerald: 'from-aurora-emerald/20 to-aurora-emerald/5 border-aurora-emerald/30 text-aurora-emerald',
    fuchsia: 'from-aurora-fuchsia/20 to-aurora-fuchsia/5 border-aurora-fuchsia/30 text-aurora-fuchsia',
    cyan: 'from-aurora-cyan/20 to-aurora-cyan/5 border-aurora-cyan/30 text-aurora-cyan',
  };

  const iconBg = {
    primary: 'bg-primary/20 shadow-[0_0_20px_hsl(var(--primary)/0.3)]',
    emerald: 'bg-aurora-emerald/20 shadow-[0_0_20px_hsl(var(--aurora-emerald)/0.3)]',
    fuchsia: 'bg-aurora-fuchsia/20 shadow-[0_0_20px_hsl(var(--aurora-fuchsia)/0.3)]',
    cyan: 'bg-aurora-cyan/20 shadow-[0_0_20px_hsl(var(--aurora-cyan)/0.3)]',
  };

  return (
    <div
      className={`relative p-5 rounded-2xl border bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} backdrop-blur-xl overflow-hidden group animate-slide-up hover:scale-[1.02] transition-transform duration-300`}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Corner decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
          <p className="text-3xl font-bold text-foreground">
            {value}
          </p>
          {sublabel && (
            <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>
          )}
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${trend >= 0 ? 'text-aurora-emerald' : 'text-destructive'}`}>
              <span>{trend >= 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(trend)}% from last week</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-xl ${iconBg[color as keyof typeof iconBg]}`}>
          <Icon className={`w-5 h-5 ${colorClasses[color as keyof typeof colorClasses].split(' ').pop()}`} />
        </div>
      </div>
    </div>
  );
};
