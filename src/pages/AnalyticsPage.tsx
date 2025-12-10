import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3, TrendingUp, Calendar, Award, Flame, BookOpen, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuroraBackground } from '@/components/aurora/AuroraBackground';
import { HolographicLayer } from '@/components/aurora/HolographicLayer';
import { AnalyticsPanel } from '@/components/analytics/AnalyticsPanel';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { useSchedule } from '@/hooks/useSchedule';
import { useStudyStats } from '@/hooks/useStudyStats';

export const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { user } = useLocalAuth();
  const { stats: scheduleStats, isLoaded } = useSchedule(user?.username || null);
  const {
    stats: studyStats,
    xpProgress,
    xpToNextLevel,
  } = useStudyStats(user?.username || null);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

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
              Deep dive into your study patterns, achievements, and progress metrics.
            </p>
          </motion.div>

          {/* Quick Stats Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { icon: BookOpen, label: 'Total Lessons', value: studyStats.totalCompletedLessons, color: 'primary' },
              { icon: Flame, label: 'Current Streak', value: `${studyStats.currentStreak} days`, color: 'aurora-emerald' },
              { icon: Calendar, label: 'Study Days', value: studyStats.totalStudyDays, color: 'aurora-cyan' },
              { icon: Target, label: 'Completion', value: `${scheduleStats.percent}%`, color: 'accent' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="glass-card p-5 rounded-2xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`w-10 h-10 rounded-xl bg-${stat.color}/20 flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Full Analytics Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnalyticsPanel
              stats={studyStats}
              scheduleStats={scheduleStats}
              xpProgress={xpProgress}
              xpToNext={xpToNextLevel}
            />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;
