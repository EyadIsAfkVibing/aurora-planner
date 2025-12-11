import { motion } from 'framer-motion';
import { Brain, Zap, AlertTriangle, Sparkles } from 'lucide-react';

interface CognitiveLoadMeterProps {
  load: number;
  level: 'light' | 'moderate' | 'heavy' | 'overloaded';
  lessonsRemaining?: number;
}

export const CognitiveLoadMeter = ({ load, level, lessonsRemaining }: CognitiveLoadMeterProps) => {
  const maxLoad = 35;
  const percent = Math.min((load / maxLoad) * 100, 100);
  
  const levelConfig = {
    light: { 
      color: 'aurora-emerald', 
      icon: Sparkles, 
      label: 'Light Day',
      description: 'Perfect for deep focus'
    },
    moderate: { 
      color: 'aurora-cyan', 
      icon: Brain, 
      label: 'Balanced',
      description: 'Good cognitive balance'
    },
    heavy: { 
      color: 'amber-400', 
      icon: Zap, 
      label: 'Heavy',
      description: 'Take breaks between tasks'
    },
    overloaded: { 
      color: 'destructive', 
      icon: AlertTriangle, 
      label: 'Overloaded',
      description: 'Consider rescheduling'
    },
  };

  const config = levelConfig[level];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 rounded-2xl relative overflow-hidden group"
    >
      {/* Background glow based on level */}
      <div 
        className={`absolute inset-0 opacity-10 bg-gradient-to-br from-${config.color} to-transparent`} 
      />
      
      {/* Animated particles for heavy/overloaded */}
      {(level === 'heavy' || level === 'overloaded') && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full bg-${config.color}`}
              initial={{ 
                x: Math.random() * 100 + '%', 
                y: '100%',
                opacity: 0.5 
              }}
              animate={{ 
                y: '-100%',
                opacity: [0.5, 1, 0] 
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-xl bg-${config.color}/20 flex items-center justify-center`}>
              <Icon className={`w-5 h-5 text-${config.color}`} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">{config.label}</h3>
              <p className="text-xs text-muted-foreground">{config.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold text-${config.color}`}>{load}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Load Units</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-white/5 rounded-full overflow-hidden relative">
          {/* Threshold markers */}
          <div className="absolute inset-y-0 left-[30%] w-px bg-white/10" />
          <div className="absolute inset-y-0 left-[60%] w-px bg-white/10" />
          <div className="absolute inset-y-0 left-[85%] w-px bg-white/10" />
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full relative overflow-hidden ${
              level === 'light' ? 'bg-aurora-emerald' :
              level === 'moderate' ? 'bg-aurora-cyan' :
              level === 'heavy' ? 'bg-amber-400' :
              'bg-destructive'
            }`}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </motion.div>
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
          <span>Light</span>
          <span>Moderate</span>
          <span>Heavy</span>
          <span>Max</span>
        </div>

        {/* Lessons remaining */}
        {lessonsRemaining !== undefined && (
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Today's remaining lessons</span>
            <span className="text-sm font-bold text-foreground">{lessonsRemaining}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
