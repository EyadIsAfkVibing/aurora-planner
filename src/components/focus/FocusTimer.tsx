import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Target, Volume2, VolumeX } from 'lucide-react';

interface FocusTimerProps {
  onComplete?: () => void;
}

const MODES = {
  focus: { label: 'Focus', duration: 25 * 60, color: 'primary', icon: Brain },
  shortBreak: { label: 'Short Break', duration: 5 * 60, color: 'aurora-emerald', icon: Coffee },
  longBreak: { label: 'Long Break', duration: 15 * 60, color: 'aurora-cyan', icon: Target },
};

export const FocusTimer = ({ onComplete }: FocusTimerProps) => {
  const [mode, setMode] = useState<keyof typeof MODES>('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const currentMode = MODES[mode];
  const progress = ((currentMode.duration - timeLeft) / currentMode.duration) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      
      if (mode === 'focus') {
        setCompletedPomodoros((prev) => prev + 1);
        onComplete?.();
        // Auto switch to break
        const newMode = completedPomodoros % 4 === 3 ? 'longBreak' : 'shortBreak';
        setMode(newMode);
        setTimeLeft(MODES[newMode].duration);
      } else {
        setMode('focus');
        setTimeLeft(MODES.focus.duration);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, completedPomodoros, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleModeChange = (newMode: keyof typeof MODES) => {
    setMode(newMode);
    setTimeLeft(MODES[newMode].duration);
    setIsRunning(false);
  };

  const handleReset = () => {
    setTimeLeft(currentMode.duration);
    setIsRunning(false);
  };

  const radius = 140;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
      {/* Animated background based on mode */}
      <div
        className={`absolute inset-0 bg-gradient-to-br opacity-10 transition-all duration-1000 ${
          mode === 'focus'
            ? 'from-primary to-accent'
            : mode === 'shortBreak'
            ? 'from-aurora-emerald to-aurora-cyan'
            : 'from-aurora-cyan to-aurora-fuchsia'
        }`}
      />

      {/* Pulsing ring when running */}
      {isRunning && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`w-80 h-80 rounded-full border-2 animate-pulse-slow ${
              mode === 'focus' ? 'border-primary/30' : 'border-aurora-emerald/30'
            }`}
          />
        </div>
      )}

      <div className="relative z-10">
        {/* Mode selector */}
        <div className="flex justify-center gap-2 mb-8">
          {Object.entries(MODES).map(([key, { label, icon: Icon }]) => (
            <button
              key={key}
              onClick={() => handleModeChange(key as keyof typeof MODES)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                mode === key
                  ? 'bg-white/10 text-foreground shadow-lg'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Timer display */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <svg width="320" height="320" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="160"
                cy="160"
                r={radius}
                fill="none"
                stroke="hsl(var(--muted) / 0.2)"
                strokeWidth="8"
              />
              
              {/* Progress circle */}
              <defs>
                <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={`hsl(var(--${currentMode.color}))`} />
                  <stop offset="100%" stopColor="hsl(var(--accent))" />
                </linearGradient>
              </defs>
              
              <circle
                cx="160"
                cy="160"
                r={radius}
                fill="none"
                stroke="url(#timer-gradient)"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500"
                style={{
                  filter: `drop-shadow(0 0 10px hsl(var(--${currentMode.color}) / 0.5))`,
                }}
              />
            </svg>

            {/* Time display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-light text-foreground font-mono tracking-wider">
                {formatTime(timeLeft)}
              </span>
              <span className="text-sm text-muted-foreground mt-2 uppercase tracking-widest">
                {currentMode.label}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              isRunning
                ? 'bg-destructive/20 hover:bg-destructive/30 text-destructive'
                : 'bg-primary hover:bg-primary/80 text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.4)]'
            }`}
          >
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>
          
          <button
            onClick={handleReset}
            className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all ${
              soundEnabled ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        {/* Pomodoro counter */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i < completedPomodoros % 4
                  ? 'bg-primary shadow-[0_0_10px_hsl(var(--primary))]'
                  : 'bg-white/10'
              }`}
            />
          ))}
          <span className="ml-2 text-xs text-muted-foreground">
            {completedPomodoros} completed
          </span>
        </div>
      </div>
    </div>
  );
};
