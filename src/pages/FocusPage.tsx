import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Timer, Brain, Sparkles, Coffee, Target, History, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuroraBackground } from '@/components/aurora/AuroraBackground';
import { HolographicLayer } from '@/components/aurora/HolographicLayer';
import { FocusTimer } from '@/components/focus/FocusTimer';
import { useLocalAuth } from '@/hooks/useLocalAuth';

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
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const stored = localStorage.getItem(SESSIONS_KEY(user.username));
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSessions(parsed);
        
        // Calculate stats
        const today = new Date().toISOString().split('T')[0];
        const todaySum = parsed
          .filter((s: FocusSession) => s.date.startsWith(today) && s.type === 'focus')
          .reduce((acc: number, s: FocusSession) => acc + s.duration, 0);
        setTodayMinutes(Math.round(todaySum / 60));
        
        const totalSum = parsed
          .filter((s: FocusSession) => s.type === 'focus')
          .reduce((acc: number, s: FocusSession) => acc + s.duration, 0);
        setTotalMinutes(Math.round(totalSum / 60));
      } catch {
        // Keep defaults
      }
    }
  }, [user, navigate]);

  const recordSession = (type: 'focus' | 'shortBreak' | 'longBreak', duration: number) => {
    if (!user) return;
    
    const newSession: FocusSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration,
      type,
    };
    
    const updated = [...sessions, newSession];
    setSessions(updated);
    localStorage.setItem(SESSIONS_KEY(user.username), JSON.stringify(updated));
    
    if (type === 'focus') {
      setTodayMinutes(prev => prev + Math.round(duration / 60));
      setTotalMinutes(prev => prev + Math.round(duration / 60));
    }
  };

  const stats = [
    { icon: Timer, label: 'Today', value: `${todayMinutes}m`, color: 'text-primary' },
    { icon: TrendingUp, label: 'Total Focus', value: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`, color: 'text-aurora-emerald' },
    { icon: Target, label: 'Sessions', value: sessions.filter(s => s.type === 'focus').length.toString(), color: 'text-aurora-cyan' },
  ];

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
              Focus <span className="font-serif italic text-primary/80">Zone</span>
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter deep focus mode with the Pomodoro technique. Track your sessions and build productive habits.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4 mb-8"
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
            <FocusTimer
              onComplete={() => recordSession('focus', 25 * 60)}
            />
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 glass-card p-6 rounded-2xl"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              Focus Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: Sparkles, text: 'Remove all distractions before starting' },
                { icon: Coffee, text: 'Take breaks to maintain productivity' },
                { icon: Target, text: 'Set clear goals for each session' },
                { icon: History, text: 'Review your progress regularly' },
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
