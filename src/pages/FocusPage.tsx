import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Timer, Brain, Sparkles, Coffee, Target, 
  TrendingUp, Zap, Clock, BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuroraBackground } from '@/components/aurora/AuroraBackground';
import { FocusTimer } from '@/components/focus/FocusTimer';
import { CognitiveLoadMeter } from '@/components/smart/CognitiveLoadMeter';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { useSchedule } from '@/hooks/useSchedule';
import { useIntelligentSchedule } from '@/hooks/useIntelligentSchedule';

interface FocusSession {
  id: string;
  date: string;
  duration: number;
  type: 'focus' | 'shortBreak' | 'longBreak';
}

const SESSIONS_KEY = (username: string) => `gemini_focus_sessions_${username}`;

export const FocusPage = () => {
  const navigate = useNavigate();
  const { user } = useLocalAuth();
  const { schedule, subjects, stats: scheduleStats, isLoaded } = useSchedule(user?.username || null);
  const { todayLoad, subjectProfiles } = useIntelligentSchedule(schedule, subjects);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Get today's priority subjects
  const prioritySubjects = subjectProfiles
    .filter(s => s.progress < 50)
    .slice(0, 3);

  // Get session stats
  const getSessionStats = () => {
    if (!user) return { todayMinutes: 0, totalMinutes: 0, sessions: 0 };
    const stored = localStorage.getItem(SESSIONS_KEY(user.username));
    if (!stored) return { todayMinutes: 0, totalMinutes: 0, sessions: 0 };
    
    try {
      const sessions: FocusSession[] = JSON.parse(stored);
      const today = new Date().toISOString().split('T')[0];
      const todaySum = sessions
        .filter(s => s.date.startsWith(today) && s.type === 'focus')
        .reduce((acc, s) => acc + s.duration, 0);
      const totalSum = sessions
        .filter(s => s.type === 'focus')
        .reduce((acc, s) => acc + s.duration, 0);
      
      return {
        todayMinutes: Math.round(todaySum / 60),
        totalMinutes: Math.round(totalSum / 60),
        sessions: sessions.filter(s => s.type === 'focus').length,
      };
    } catch {
      return { todayMinutes: 0, totalMinutes: 0, sessions: 0 };
    }
  };

  const sessionStats = getSessionStats();

  const recordSession = (type: 'focus' | 'shortBreak' | 'longBreak', duration: number) => {
    if (!user) return;
    
    const stored = localStorage.getItem(SESSIONS_KEY(user.username));
    const sessions: FocusSession[] = stored ? JSON.parse(stored) : [];
    
    sessions.push({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration,
      type,
    });
    
    localStorage.setItem(SESSIONS_KEY(user.username), JSON.stringify(sessions));
  };

  const stats = [
    { icon: Timer, label: 'Today', value: `${sessionStats.todayMinutes}m`, color: 'text-primary' },
    { icon: TrendingUp, label: 'Total Focus', value: `${Math.floor(sessionStats.totalMinutes / 60)}h ${sessionStats.totalMinutes % 60}m`, color: 'text-aurora-emerald' },
    { icon: Target, label: 'Sessions', value: sessionStats.sessions.toString(), color: 'text-aurora-cyan' },
  ];

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <AuroraBackground variant="dashboard" />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
            <Timer className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Loading Focus Mode...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) return null;

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

        <main className="px-6 pb-20 max-w-6xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-light text-foreground tracking-tight mb-4">
              Focus <span className="font-serif italic text-primary/80">Zone</span>
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter deep focus mode with the Pomodoro technique. Track your sessions and build productive habits.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Timer */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-4"
              >
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="glass-card p-4 rounded-2xl text-center relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Timer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <FocusTimer onComplete={() => recordSession('focus', 25 * 60)} />
              </motion.div>
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-6">
              {/* Cognitive Load */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <CognitiveLoadMeter 
                  load={todayLoad.load} 
                  level={todayLoad.level as any}
                  lessonsRemaining={todayLoad.lessonsRemaining}
                />
              </motion.div>

              {/* Today's Focus Priorities */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-5 rounded-2xl"
              >
                <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Today's Priority
                </h3>
                
                <div className="space-y-3">
                  {prioritySubjects.map((subject, i) => (
                    <motion.div
                      key={subject.name}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        subject.difficulty === 'hard' ? 'bg-destructive/20' :
                        subject.difficulty === 'medium' ? 'bg-amber-400/20' :
                        'bg-aurora-emerald/20'
                      }`}>
                        <BookOpen className={`w-4 h-4 ${
                          subject.difficulty === 'hard' ? 'text-destructive' :
                          subject.difficulty === 'medium' ? 'text-amber-400' :
                          'text-aurora-emerald'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{subject.name}</p>
                        <p className="text-[10px] text-muted-foreground">{subject.remainingLessons} left</p>
                      </div>
                      <span className="text-sm font-bold text-foreground">{subject.progress}%</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-8 glass-card p-6 rounded-2xl"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              Focus Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Sparkles, text: 'Remove all distractions before starting' },
                { icon: Coffee, text: 'Take breaks to maintain productivity' },
                { icon: Target, text: 'Set clear goals for each session' },
                { icon: Clock, text: 'Review your progress regularly' },
              ].map((tip, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <tip.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{tip.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default FocusPage;
