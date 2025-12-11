import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Lightbulb, Target, Clock, TrendingUp, 
  AlertTriangle, Sparkles, Coffee, Zap, BookOpen
} from 'lucide-react';
import type { SubjectProfile, StudyRecommendation } from '@/hooks/useIntelligentSchedule';

interface SmartDailyAdvisorProps {
  subjectProfiles: SubjectProfile[];
  recommendations: StudyRecommendation[];
  todayLoad: { load: number; level: string };
  estimatedCompletion: { daysRemaining: number; lessonsRemaining: number; estimatedDate: string };
}

export const SmartDailyAdvisor = ({
  subjectProfiles,
  recommendations,
  todayLoad,
  estimatedCompletion,
}: SmartDailyAdvisorProps) => {
  const dailyAdvice = useMemo(() => {
    const hour = new Date().getHours();
    const isEarlyMorning = hour >= 5 && hour < 9;
    const isMorning = hour >= 9 && hour < 12;
    const isAfternoon = hour >= 12 && hour < 17;
    const isEvening = hour >= 17 && hour < 21;
    
    // Find weakest and strongest subjects
    const weakest = subjectProfiles[0];
    const strongest = subjectProfiles[subjectProfiles.length - 1];
    const hardSubjects = subjectProfiles.filter(s => s.difficulty === 'hard' && s.progress < 50);
    
    let advice = '';
    let icon = Brain;
    let tip = '';
    
    if (isEarlyMorning) {
      advice = hardSubjects.length > 0
        ? `Great time for ${hardSubjects[0].name}. Your brain is fresh for complex topics.`
        : `Start with ${weakest?.name || 'your weakest subject'} while focus is peak.`;
      icon = Sparkles;
      tip = 'Tackle hard subjects when cortisol is naturally high.';
    } else if (isMorning) {
      advice = `Perfect time for ${weakest?.name || 'challenging work'}. Schedule 2-3 focused sessions.`;
      icon = Target;
      tip = 'Peak cognitive performance window.';
    } else if (isAfternoon) {
      const easySubject = subjectProfiles.find(s => s.difficulty === 'easy');
      advice = `Post-lunch dip expected. Try ${easySubject?.name || 'lighter subjects'} or take a short break.`;
      icon = Coffee;
      tip = 'A 20-minute walk can restore focus.';
    } else if (isEvening) {
      advice = `Review mode: Perfect for ${strongest?.name || 'revision'}. Avoid new complex topics.`;
      icon = BookOpen;
      tip = 'Evening learning should be review-focused.';
    } else {
      advice = 'Rest is part of learning. Sleep consolidates memory.';
      icon = Sparkles;
      tip = '7-9 hours of sleep improves retention by 40%.';
    }
    
    return { advice, icon, tip };
  }, [subjectProfiles]);

  const prioritySubject = subjectProfiles.find(s => s.progress < 30) || subjectProfiles[0];
  const Icon = dailyAdvice.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-2xl relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-foreground mb-1">Daily Study Advisor</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{dailyAdvice.advice}</p>
          </div>
        </div>

        {/* Quick tip */}
        <div className="bg-white/5 rounded-xl p-3 mb-4 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-xs text-muted-foreground">{dailyAdvice.tip}</p>
        </div>

        {/* Priority Focus */}
        {prioritySubject && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-3.5 h-3.5 text-aurora-cyan" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Priority Focus
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  prioritySubject.difficulty === 'hard' ? 'bg-destructive/20' :
                  prioritySubject.difficulty === 'medium' ? 'bg-amber-400/20' :
                  'bg-aurora-emerald/20'
                }`}>
                  <Zap className={`w-4 h-4 ${
                    prioritySubject.difficulty === 'hard' ? 'text-destructive' :
                    prioritySubject.difficulty === 'medium' ? 'text-amber-400' :
                    'text-aurora-emerald'
                  }`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{prioritySubject.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {prioritySubject.remainingLessons} lessons remaining
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-foreground">{prioritySubject.progress}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Alerts */}
        {recommendations.filter(r => r.priority === 'high').slice(0, 2).map((rec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className={`flex items-center gap-2 p-2 rounded-lg mb-2 ${
              rec.type === 'warning' ? 'bg-amber-400/10 border border-amber-400/20' :
              'bg-destructive/10 border border-destructive/20'
            }`}
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${
              rec.type === 'warning' ? 'text-amber-400' : 'text-destructive'
            }`} />
            <p className="text-xs text-muted-foreground flex-1">{rec.description}</p>
          </motion.div>
        ))}

        {/* Estimated completion */}
        <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{estimatedCompletion.daysRemaining}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Days Left</p>
          </div>
          <div className="text-center border-x border-white/5">
            <p className="text-xl font-bold text-foreground">{estimatedCompletion.lessonsRemaining}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Lessons</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-primary">{estimatedCompletion.estimatedDate}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Finish Date</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
