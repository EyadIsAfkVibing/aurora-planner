import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Brain, TrendingDown, TrendingUp, AlertTriangle, 
  Clock, Flame, Target, BarChart3, Zap, Award 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuroraBackground } from '@/components/aurora/AuroraBackground';
import { HolographicLayer } from '@/components/aurora/HolographicLayer';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { useSchedule } from '@/hooks/useSchedule';
import { useStudyStats } from '@/hooks/useStudyStats';

interface Insight {
  id: string;
  type: 'warning' | 'success' | 'info' | 'danger';
  title: string;
  description: string;
  icon: typeof Brain;
  value?: string;
  action?: string;
}

export const InsightsPage = () => {
  const navigate = useNavigate();
  const { user } = useLocalAuth();
  const { schedule, stats: scheduleStats, isLoaded } = useSchedule(user?.username || null);
  const { stats: studyStats } = useStudyStats(user?.username || null);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const subjectAnalysis = useMemo(() => {
    const data: Record<string, { total: number; completed: number }> = {};
    
    schedule.forEach(day => {
      day.lessons.forEach(lesson => {
        const subject = lesson.subject.toLowerCase();
        if (!data[subject]) {
          data[subject] = { total: 0, completed: 0 };
        }
        data[subject].total++;
        if (lesson.completed) data[subject].completed++;
      });
    });

    return Object.entries(data).map(([name, info]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      total: info.total,
      completed: info.completed,
      progress: info.total > 0 ? Math.round((info.completed / info.total) * 100) : 0,
    })).sort((a, b) => a.progress - b.progress);
  }, [schedule]);

  const insights = useMemo<Insight[]>(() => {
    const ins: Insight[] = [];
    
    // Weakest subjects
    const weakest = subjectAnalysis.filter(s => s.progress < 30 && s.total > 0);
    if (weakest.length > 0) {
      ins.push({
        id: 'weak-subjects',
        type: 'danger',
        title: 'Weak Subjects Detected',
        description: `${weakest.map(s => s.name).join(', ')} ${weakest.length > 1 ? 'need' : 'needs'} more attention.`,
        icon: AlertTriangle,
        value: `${weakest.length} subject${weakest.length > 1 ? 's' : ''}`,
        action: 'Focus on these today',
      });
    }

    // Slowest progress
    const slowest = subjectAnalysis[0];
    if (slowest && slowest.progress < 50) {
      ins.push({
        id: 'slowest',
        type: 'warning',
        title: 'Slowest Progress',
        description: `${slowest.name} has the lowest completion rate at ${slowest.progress}%.`,
        icon: TrendingDown,
        value: `${slowest.progress}%`,
      });
    }

    // Best performer
    const best = subjectAnalysis[subjectAnalysis.length - 1];
    if (best && best.progress > 50) {
      ins.push({
        id: 'best',
        type: 'success',
        title: 'Top Performer',
        description: `${best.name} is your strongest subject at ${best.progress}% complete!`,
        icon: TrendingUp,
        value: `${best.progress}%`,
      });
    }

    // Streak analysis
    if (studyStats.currentStreak >= 7) {
      ins.push({
        id: 'streak-great',
        type: 'success',
        title: 'Excellent Consistency',
        description: `You've maintained a ${studyStats.currentStreak}-day streak! Keep it up!`,
        icon: Flame,
        value: `${studyStats.currentStreak} days`,
      });
    } else if (studyStats.currentStreak === 0) {
      ins.push({
        id: 'streak-broken',
        type: 'warning',
        title: 'Streak Reset',
        description: 'Your streak has reset. Start fresh today!',
        icon: Flame,
        action: 'Complete a lesson now',
      });
    }

    // Completion rate
    if (scheduleStats.percent >= 80) {
      ins.push({
        id: 'almost-done',
        type: 'success',
        title: 'Almost There!',
        description: `You're ${scheduleStats.percent}% through your schedule. The finish line is near!`,
        icon: Target,
        value: `${scheduleStats.percent}%`,
      });
    } else if (scheduleStats.percent < 25 && scheduleStats.total > 0) {
      ins.push({
        id: 'just-starting',
        type: 'info',
        title: 'Building Momentum',
        description: `You're ${scheduleStats.percent}% in. Consistency is key!`,
        icon: Zap,
        value: `${scheduleStats.percent}%`,
      });
    }

    // Level milestone
    if (studyStats.level >= 5) {
      ins.push({
        id: 'level-achievement',
        type: 'success',
        title: 'Level Milestone',
        description: `You've reached Level ${studyStats.level}! Your dedication is paying off.`,
        icon: Award,
        value: `Level ${studyStats.level}`,
      });
    }

    return ins;
  }, [subjectAnalysis, studyStats, scheduleStats]);

  const typeStyles = {
    warning: 'bg-amber-400/10 border-amber-400/30 text-amber-400',
    success: 'bg-aurora-emerald/10 border-aurora-emerald/30 text-aurora-emerald',
    info: 'bg-aurora-cyan/10 border-aurora-cyan/30 text-aurora-cyan',
    danger: 'bg-destructive/10 border-destructive/30 text-destructive',
  };

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
              Deep <span className="font-serif italic text-primary/80">Insights</span>
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              AI-powered analysis of your study patterns, weaknesses, and opportunities for improvement.
            </p>
          </motion.div>

          {/* Insights Grid */}
          <div className="grid gap-4 mb-8">
            {insights.map((insight, i) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass-card p-5 rounded-2xl border relative overflow-hidden group ${typeStyles[insight.type]}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-current/10`}>
                    <insight.icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                    
                    {insight.action && (
                      <button className="mt-2 text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {insight.action}
                      </button>
                    )}
                  </div>
                  
                  {insight.value && (
                    <div className="text-2xl font-bold">{insight.value}</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Subject Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 rounded-2xl"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-6 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Subject Performance Breakdown
            </h3>

            <div className="space-y-4">
              {subjectAnalysis.map((subject, i) => (
                <motion.div
                  key={subject.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{subject.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {subject.completed}/{subject.total} • {subject.progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.progress}%` }}
                      transition={{ duration: 1, delay: 0.4 + i * 0.05 }}
                      className={`h-full rounded-full ${
                        subject.progress >= 70 ? 'bg-aurora-emerald' :
                        subject.progress >= 40 ? 'bg-amber-400' :
                        'bg-destructive'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Performance Pattern */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 glass-card p-6 rounded-2xl"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Study Pattern Analysis
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-2xl font-bold text-foreground">{studyStats.totalStudyDays}</p>
                <p className="text-xs text-muted-foreground">Active Days</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-2xl font-bold text-foreground">{studyStats.bestStreak}</p>
                <p className="text-xs text-muted-foreground">Best Streak</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {studyStats.totalStudyDays > 0 
                    ? Math.round(studyStats.totalCompletedLessons / studyStats.totalStudyDays * 10) / 10 
                    : 0}
                </p>
                <p className="text-xs text-muted-foreground">Avg Lessons/Day</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-2xl font-bold text-foreground">{studyStats.level}</p>
                <p className="text-xs text-muted-foreground">Current Level</p>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default InsightsPage;
