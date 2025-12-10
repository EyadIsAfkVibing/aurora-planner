import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Flame, Clock, Zap } from 'lucide-react';
import type { Day } from '@/hooks/useSchedule';

interface SubjectMasteryProps {
  schedule: Day[];
}

interface SubjectData {
  name: string;
  total: number;
  completed: number;
  progress: number;
  difficulty: 'easy' | 'medium' | 'hard';
  daysToComplete: number;
  streak: number;
}

const DIFFICULTY_COLORS = {
  easy: 'bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30',
  medium: 'bg-amber-400/20 text-amber-400 border-amber-400/30',
  hard: 'bg-destructive/20 text-destructive border-destructive/30',
};

const SUBJECT_GRADIENTS: Record<string, string> = {
  science: 'from-emerald-500 to-teal-500',
  algebra: 'from-blue-500 to-indigo-500',
  trigonometry: 'from-violet-500 to-purple-500',
  geometry: 'from-fuchsia-500 to-pink-500',
  arabic: 'from-amber-500 to-orange-500',
  history: 'from-rose-500 to-red-500',
};

export const SubjectMastery = ({ schedule }: SubjectMasteryProps) => {
  const subjectData = useMemo(() => {
    const data: Record<string, { total: number; completed: number; positions: number[] }> = {};
    
    schedule.forEach((day, dayIndex) => {
      day.lessons.forEach((lesson, lessonIndex) => {
        const subjectLower = lesson.subject.toLowerCase();
        if (!data[subjectLower]) {
          data[subjectLower] = { total: 0, completed: 0, positions: [] };
        }
        data[subjectLower].total++;
        if (lesson.completed) {
          data[subjectLower].completed++;
          data[subjectLower].positions.push(dayIndex);
        }
      });
    });

    const subjects: SubjectData[] = Object.entries(data).map(([name, info]) => {
      const progress = info.total > 0 ? (info.completed / info.total) * 100 : 0;
      const remaining = info.total - info.completed;
      const daysToComplete = remaining > 0 ? Math.ceil(remaining / 2) : 0; // Assume 2 lessons/day
      
      // Calculate difficulty based on total and progress
      let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
      if (info.total >= 10 && progress < 30) difficulty = 'hard';
      else if (info.total <= 5 || progress > 70) difficulty = 'easy';
      
      // Calculate streak (consecutive days with completions)
      let streak = 0;
      const uniqueDays = [...new Set(info.positions)].sort((a, b) => b - a);
      for (let i = 0; i < uniqueDays.length - 1; i++) {
        if (uniqueDays[i] - uniqueDays[i + 1] === 1) streak++;
        else break;
      }

      return {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        total: info.total,
        completed: info.completed,
        progress: Math.round(progress),
        difficulty,
        daysToComplete,
        streak: streak + (uniqueDays.length > 0 ? 1 : 0),
      };
    });

    return subjects.sort((a, b) => b.progress - a.progress);
  }, [schedule]);

  if (subjectData.length === 0) return null;

  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative">
        <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-primary" />
          Subject Mastery
        </h3>

        <div className="space-y-4">
          {subjectData.map((subject, i) => {
            const gradient = SUBJECT_GRADIENTS[subject.name.toLowerCase()] || 'from-slate-500 to-gray-500';
            
            return (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{subject.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[subject.difficulty]}`}>
                      {subject.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {subject.streak > 1 && (
                      <span className="flex items-center gap-1 text-aurora-emerald">
                        <Flame className="w-3 h-3" />
                        {subject.streak}d streak
                      </span>
                    )}
                    {subject.daysToComplete > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ~{subject.daysToComplete}d left
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.progress}%` }}
                    transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${gradient} rounded-full`}
                  />
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
                
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>{subject.completed}/{subject.total} lessons</span>
                  <span className="font-medium text-foreground">{subject.progress}%</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
