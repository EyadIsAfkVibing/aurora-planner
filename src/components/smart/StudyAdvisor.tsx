import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, AlertTriangle, Zap, Coffee } from 'lucide-react';
import type { Day, SubjectConfig } from '@/hooks/useSchedule';

interface StudyAdvisorProps {
  schedule: Day[];
  subjects: SubjectConfig;
  streak: number;
  completedToday: number;
}

interface Recommendation {
  type: 'focus' | 'warning' | 'tip' | 'achievement';
  icon: typeof Brain;
  title: string;
  description: string;
  action?: string;
  priority: number;
}

export const StudyAdvisor = ({ schedule, subjects, streak, completedToday }: StudyAdvisorProps) => {
  const recommendations = useMemo(() => {
    const recs: Recommendation[] = [];
    const hour = new Date().getHours();
    
    // Calculate subject progress
    const subjectProgress: Record<string, { total: number; completed: number }> = {};
    schedule.forEach(day => {
      day.lessons.forEach(lesson => {
        if (!subjectProgress[lesson.subject]) {
          subjectProgress[lesson.subject] = { total: 0, completed: 0 };
        }
        subjectProgress[lesson.subject].total++;
        if (lesson.completed) subjectProgress[lesson.subject].completed++;
      });
    });

    // Find weakest subject
    let weakestSubject = '';
    let lowestProgress = 100;
    Object.entries(subjectProgress).forEach(([subject, data]) => {
      const progress = data.total > 0 ? (data.completed / data.total) * 100 : 0;
      if (progress < lowestProgress && data.total > 0) {
        lowestProgress = progress;
        weakestSubject = subject;
      }
    });

    // Time-based recommendations
    if (hour >= 6 && hour < 12) {
      recs.push({
        type: 'tip',
        icon: Zap,
        title: 'Morning Power Hour',
        description: 'Your brain is fresh! Tackle the most challenging subjects now.',
        action: weakestSubject ? `Focus on ${weakestSubject}` : 'Start with hard topics',
        priority: 1,
      });
    } else if (hour >= 14 && hour < 17) {
      recs.push({
        type: 'tip',
        icon: Coffee,
        title: 'Afternoon Slump',
        description: 'Energy dips in the afternoon. Try a quick break or light review.',
        action: 'Take a 5-min break',
        priority: 2,
      });
    }

    // Streak recommendations
    if (streak >= 7) {
      recs.push({
        type: 'achievement',
        icon: TrendingUp,
        title: `${streak} Day Streak!`,
        description: "You're on fire! Keep the momentum going.",
        priority: 3,
      });
    } else if (streak === 0 && completedToday === 0) {
      recs.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Start Your Day',
        description: "You haven't completed any lessons today. Start small!",
        action: 'Complete 1 lesson',
        priority: 0,
      });
    }

    // Subject-specific recommendations
    if (weakestSubject && lowestProgress < 30) {
      recs.push({
        type: 'focus',
        icon: Brain,
        title: `Boost ${weakestSubject}`,
        description: `Only ${Math.round(lowestProgress)}% complete. Extra attention needed.`,
        action: `Study ${weakestSubject}`,
        priority: 1,
      });
    }

    // Daily progress
    const todayLessons = schedule[0]?.lessons || [];
    const todayCompleted = todayLessons.filter(l => l.completed).length;
    const todayTotal = todayLessons.length;
    
    if (todayTotal > 0 && todayCompleted < todayTotal) {
      const remaining = todayTotal - todayCompleted;
      recs.push({
        type: 'tip',
        icon: Sparkles,
        title: `${remaining} Lesson${remaining > 1 ? 's' : ''} Left Today`,
        description: 'You can finish today\'s schedule!',
        action: 'View schedule',
        priority: 2,
      });
    }

    return recs.sort((a, b) => a.priority - b.priority).slice(0, 3);
  }, [schedule, subjects, streak, completedToday]);

  const topRecommendation = recommendations[0];

  if (!topRecommendation) return null;

  const iconColors = {
    focus: 'text-primary bg-primary/20',
    warning: 'text-amber-400 bg-amber-400/20',
    tip: 'text-aurora-cyan bg-aurora-cyan/20',
    achievement: 'text-aurora-emerald bg-aurora-emerald/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 rounded-2xl border border-primary/20 relative overflow-hidden group"
    >
      {/* Holographic shine */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      {/* Glow effect */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />

      <div className="relative flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColors[topRecommendation.type]}`}>
          <topRecommendation.icon className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-foreground">{topRecommendation.title}</h3>
            <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
              AI Advisor
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{topRecommendation.description}</p>
          
          {topRecommendation.action && (
            <button className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors">
              <Zap className="w-3 h-3" />
              {topRecommendation.action}
            </button>
          )}
        </div>
      </div>

      {/* Mini recommendations */}
      {recommendations.length > 1 && (
        <div className="mt-3 pt-3 border-t border-white/5 flex gap-2 overflow-x-auto custom-scrollbar">
          {recommendations.slice(1).map((rec, i) => (
            <div
              key={i}
              className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white/5 text-xs text-muted-foreground flex items-center gap-1.5"
            >
              <rec.icon className="w-3 h-3" />
              {rec.title}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
