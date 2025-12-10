import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Timer, BarChart3, Map, Brain, Settings, 
  ChevronUp, Sparkles, X, Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickActionsBarProps {
  onAddDay: () => void;
  onAddLesson?: () => void;
  onOpenSettings: () => void;
}

export const QuickActionsBar = ({ onAddDay, onAddLesson, onOpenSettings }: QuickActionsBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const actions = [
    { icon: Plus, label: 'Add Day', action: onAddDay, color: 'text-primary' },
    { icon: Timer, label: 'Focus', action: () => navigate('/focus'), color: 'text-aurora-emerald' },
    { icon: BarChart3, label: 'Analytics', action: () => navigate('/analytics'), color: 'text-aurora-cyan' },
    { icon: Map, label: 'Roadmap', action: () => navigate('/roadmap'), color: 'text-accent' },
    { icon: Brain, label: 'Insights', action: () => navigate('/insights'), color: 'text-aurora-fuchsia' },
    { icon: Settings, label: 'Settings', action: onOpenSettings, color: 'text-muted-foreground' },
  ];

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Quick Actions Bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-max"
            >
              <div className="glass-card p-3 rounded-2xl shadow-xl shadow-primary/10 border border-white/10">
                <div className="grid grid-cols-3 gap-2">
                  {actions.map((action, i) => (
                    <motion.button
                      key={action.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => {
                        action.action();
                        setIsExpanded(false);
                      }}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 transition-all group"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                        {action.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative w-14 h-14 rounded-full bg-primary shadow-lg shadow-primary/30 flex items-center justify-center group overflow-hidden"
        >
          {/* Animated ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary-foreground/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
          
          {/* Icon */}
          <motion.div
            animate={{ rotate: isExpanded ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isExpanded ? (
              <X className="w-6 h-6 text-primary-foreground" />
            ) : (
              <Layers className="w-6 h-6 text-primary-foreground" />
            )}
          </motion.div>

          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: isExpanded ? 45 : 0 }}
            >
              {isExpanded ? (
                <X className="w-6 h-6 text-primary-foreground relative z-10" />
              ) : (
                <Layers className="w-6 h-6 text-primary-foreground relative z-10" />
              )}
            </motion.div>
          </div>
        </motion.button>

        {/* Tooltip */}
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-white/10 text-xs text-muted-foreground whitespace-nowrap"
          >
            Quick Actions
          </motion.div>
        )}
      </motion.div>
    </>
  );
};
