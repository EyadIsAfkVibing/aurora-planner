import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Map, Flag, CheckCircle2, Circle, Target, TrendingUp, Award, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuroraBackground } from '@/components/aurora/AuroraBackground';
import { HolographicLayer } from '@/components/aurora/HolographicLayer';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { useSchedule } from '@/hooks/useSchedule';
import { useStudyStats } from '@/hooks/useStudyStats';

interface Milestone {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  icon: typeof Flag;
  unlocked: boolean;
  type: 'lessons' | 'streak' | 'level' | 'percent';
}

export const RoadmapPage = () => {
  const navigate = useNavigate();
  const { user } = useLocalAuth();
  const { schedule, stats: scheduleStats, isLoaded } = useSchedule(user?.username || null);
  const { stats: studyStats } = useStudyStats(user?.username || null);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const milestones = useMemo<Milestone[]>(() => {
    const lessonsCompleted = studyStats.totalCompletedLessons;
    const streak = studyStats.currentStreak;
    const level = studyStats.level;
    const percent = scheduleStats.percent;

    return [
      {
        id: 'first-lesson',
        title: 'First Step',
        description: 'Complete your first lesson',
        target: 1,
        current: lessonsCompleted,
        icon: Flag,
        unlocked: lessonsCompleted >= 1,
        type: 'lessons',
      },
      {
        id: 'ten-lessons',
        title: 'Getting Momentum',
        description: 'Complete 10 lessons',
        target: 10,
        current: lessonsCompleted,
        icon: TrendingUp,
        unlocked: lessonsCompleted >= 10,
        type: 'lessons',
      },
      {
        id: 'week-streak',
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        target: 7,
        current: streak,
        icon: Sparkles,
        unlocked: streak >= 7,
        type: 'streak',
      },
      {
        id: 'level-5',
        title: 'Rising Scholar',
        description: 'Reach Level 5',
        target: 5,
        current: level,
        icon: Award,
        unlocked: level >= 5,
        type: 'level',
      },
      {
        id: 'half-complete',
        title: 'Halfway There',
        description: 'Complete 50% of your schedule',
        target: 50,
        current: percent,
        icon: Target,
        unlocked: percent >= 50,
        type: 'percent',
      },
      {
        id: 'fifty-lessons',
        title: 'Knowledge Seeker',
        description: 'Complete 50 lessons',
        target: 50,
        current: lessonsCompleted,
        icon: TrendingUp,
        unlocked: lessonsCompleted >= 50,
        type: 'lessons',
      },
      {
        id: 'month-streak',
        title: 'Unstoppable Force',
        description: 'Maintain a 30-day streak',
        target: 30,
        current: streak,
        icon: Sparkles,
        unlocked: streak >= 30,
        type: 'streak',
      },
      {
        id: 'level-10',
        title: 'Master Scholar',
        description: 'Reach Level 10',
        target: 10,
        current: level,
        icon: Award,
        unlocked: level >= 10,
        type: 'level',
      },
      {
        id: 'complete-schedule',
        title: 'Mission Complete',
        description: 'Complete 100% of your schedule',
        target: 100,
        current: percent,
        icon: CheckCircle2,
        unlocked: percent >= 100,
        type: 'percent',
      },
      {
        id: 'hundred-lessons',
        title: 'Century Club',
        description: 'Complete 100 lessons',
        target: 100,
        current: lessonsCompleted,
        icon: Flag,
        unlocked: lessonsCompleted >= 100,
        type: 'lessons',
      },
    ];
  }, [studyStats, scheduleStats]);

  const completedMilestones = milestones.filter(m => m.unlocked).length;
  const nextMilestone = milestones.find(m => !m.unlocked);

  if (!isLoaded || !user) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AuroraBackground variant="dashboard" />
      <HolographicLayer />

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="p-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </motion.button>
        </header>

        <main className="px-6 pb-20 max-w-4xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-light text-foreground tracking-tight mb-4">
              Your <span className="font-serif italic text-primary/80">Roadmap</span>
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Track your journey and unlock milestones as you progress through your studies.
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-bold text-primary">{completedMilestones}</span>
              <span className="text-muted-foreground">/ {milestones.length} milestones unlocked</span>
            </div>
          </motion.div>

          {/* Next Milestone Highlight */}
          {nextMilestone && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 rounded-2xl mb-8 border border-primary/30 relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                  <nextMilestone.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-primary uppercase tracking-wider">Next Milestone</span>
                  </div>
                  <h3 className="text-xl font-medium text-foreground">{nextMilestone.title}</h3>
                  <p className="text-sm text-muted-foreground">{nextMilestone.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">
                    {nextMilestone.current}/{nextMilestone.target}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((nextMilestone.current / nextMilestone.target) * 100)}% complete
                  </p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((nextMilestone.current / nextMilestone.target) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                />
              </div>
            </motion.div>
          )}

          {/* Milestones Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-7 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-muted" />

            <div className="space-y-4">
              {milestones.map((milestone, i) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className={`relative flex items-center gap-4 p-4 rounded-2xl transition-all ${
                    milestone.unlocked 
                      ? 'glass-card border-aurora-emerald/30' 
                      : 'bg-white/[0.02] opacity-60'
                  }`}
                >
                  {/* Node */}
                  <div className={`relative z-10 w-14 h-14 rounded-xl flex items-center justify-center ${
                    milestone.unlocked 
                      ? 'bg-aurora-emerald/20' 
                      : 'bg-white/5'
                  }`}>
                    {milestone.unlocked ? (
                      <CheckCircle2 className="w-7 h-7 text-aurora-emerald" />
                    ) : (
                      <milestone.icon className="w-7 h-7 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className={`font-medium ${milestone.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  </div>

                  <div className="text-right">
                    {milestone.unlocked ? (
                      <span className="px-3 py-1 rounded-full bg-aurora-emerald/20 text-aurora-emerald text-xs font-medium">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {milestone.current}/{milestone.target}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RoadmapPage;
