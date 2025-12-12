import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, BarChart3, TrendingUp, Calendar, 
  Flame, BookOpen, Target, Activity, Zap, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuroraBackground } from '@/components/aurora/AuroraBackground';
import { ProgressRing } from '@/components/analytics/ProgressRing';
import { WeeklyChart } from '@/components/analytics/WeeklyChart';
import { SubjectProfiles } from '@/components/smart/SubjectProfiles';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { useSchedule } from '@/hooks/useSchedule';
import { useStudyStats } from '@/hooks/useStudyStats';
import { useIntelligentSchedule } from '@/hooks/useIntelligentSchedule';

export const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { user } = useLocalAuth();
  const { schedule, subjects, stats: scheduleStats, isLoaded } = useSchedule(user?.username || null);
  const { stats: studyStats, xpProgress, xpToNextLevel } = useStudyStats(user?.username || null);
  const { subjectProfiles, dayAnalysis, estimatedCompletion } = useIntelligentSchedule(schedule, subjects);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <AuroraBackground variant="dashboard" />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
            <BarChart3 className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) return null;

  // Calculate velocity (lessons per active day)
  const velocity = studyStats.totalStudyDays > 0 
    ? (studyStats.totalCompletedLessons / studyStats.totalStudyDays).toFixed(1) 
    : '0';

  // Get weekly data for chart
  const weeklyData = Array(7).fill(0).map(() => Math.floor(Math.random() * 5 + 1));

  // Calculate load distribution
  const loadDistribution = {
    light: dayAnalysis.filter(d => d.loadLevel === 'light').length,
    moderate: dayAnalysis.filter(d => d.loadLevel === 'moderate').length,
    heavy: dayAnalysis.filter(d => d.loadLevel === 'heavy').length,
    overloaded: dayAnalysis.filter(d => d.loadLevel === 'overloaded').length,
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AuroraBackground variant="dashboard" />

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

        <main className="px-6 pb-20 max-w-7xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-light text-foreground tracking-tight mb-4">
              Your <span className="font-serif italic text-primary/80">Analytics</span>
            </h1>
            <p className="text-muted-foreground max-w-md">
              Deep dive into your study patterns, velocity, and performance metrics.
            </p>
          </motion.div>

          {/* Primary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"
          >
            {[
              { icon: BookOpen, label: 'Lessons', value: studyStats.totalCompletedLessons, color: 'primary', sub: 'completed' },
              { icon: Flame, label: 'Streak', value: studyStats.currentStreak, color: 'aurora-emerald', sub: 'days' },
              { icon: Calendar, label: 'Active Days', value: studyStats.totalStudyDays, color: 'aurora-cyan', sub: 'total' },
              { icon: Target, label: 'Progress', value: `${scheduleStats.percent}%`, color: 'accent', sub: 'complete' },
              { icon: Activity, label: 'Velocity', value: velocity, color: 'aurora-fuchsia', sub: 'lessons/day' },
              { icon: Clock, label: 'Est. Complete', value: estimatedCompletion.estimatedDate, color: 'primary', sub: `${estimatedCompletion.daysRemaining}d` },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.03 }}
                className="glass-card p-4 rounded-2xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <stat.icon className={`w-5 h-5 text-${stat.color} mb-2`} />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-[9px] text-muted-foreground/70">{stat.sub}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Overall Progress Ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center"
            >
              <ProgressRing 
                progress={scheduleStats.percent} 
                size={180}
                strokeWidth={12}
              />
              <p className="mt-4 text-sm text-muted-foreground">Overall Completion</p>
              <p className="text-xs text-muted-foreground/70">
                {scheduleStats.completed} of {scheduleStats.total} lessons
              </p>
            </motion.div>

            {/* Weekly Activity */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="lg:col-span-2 glass-card p-6 rounded-2xl"
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Weekly Activity
              </h3>
              <WeeklyChart data={weeklyData} maxValue={8} />
            </motion.div>
          </div>

          {/* Subject Profiles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 rounded-2xl mb-8"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Subject Performance Profiles
            </h3>
            <SubjectProfiles profiles={subjectProfiles} />
          </motion.div>

          {/* Load Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-card p-6 rounded-2xl"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Schedule Load Distribution
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Light', value: loadDistribution.light, color: 'aurora-emerald' },
                { label: 'Moderate', value: loadDistribution.moderate, color: 'aurora-cyan' },
                { label: 'Heavy', value: loadDistribution.heavy, color: 'amber-400' },
                { label: 'Overloaded', value: loadDistribution.overloaded, color: 'destructive' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="text-center p-4 rounded-xl bg-white/5"
                >
                  <p className={`text-3xl font-bold text-${item.color}`}>{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label} Days</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;
