import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Target, AlertTriangle, Edit2, X, Check } from 'lucide-react';

interface ExamCountdownProps {
  username: string;
}

interface Exam {
  id: string;
  name: string;
  date: string;
  color: string;
}

const STORAGE_KEY = (username: string) => `gemini_exams_${username}`;

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--aurora-cyan))',
  'hsl(var(--aurora-emerald))',
  'hsl(var(--aurora-fuchsia))',
];

export const ExamCountdown = ({ username }: ExamCountdownProps) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newExamName, setNewExamName] = useState('');
  const [newExamDate, setNewExamDate] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY(username));
    if (stored) {
      try {
        setExams(JSON.parse(stored));
      } catch {
        // Keep defaults
      }
    }
  }, [username]);

  useEffect(() => {
    if (exams.length > 0) {
      localStorage.setItem(STORAGE_KEY(username), JSON.stringify(exams));
    }
  }, [exams, username]);

  const addExam = () => {
    if (!newExamName || !newExamDate) return;
    
    const newExam: Exam = {
      id: Date.now().toString(),
      name: newExamName,
      date: newExamDate,
      color: COLORS[exams.length % COLORS.length],
    };
    
    setExams([...exams, newExam]);
    setNewExamName('');
    setNewExamDate('');
    setIsAdding(false);
  };

  const removeExam = (id: string) => {
    setExams(exams.filter(e => e.id !== id));
  };

  const sortedExams = useMemo(() => {
    return [...exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [exams]);

  const getDaysLeft = (dateStr: string) => {
    const examDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    examDate.setHours(0, 0, 0, 0);
    const diff = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getUrgencyClass = (days: number) => {
    if (days < 0) return 'text-muted-foreground';
    if (days <= 3) return 'text-destructive';
    if (days <= 7) return 'text-amber-400';
    return 'text-aurora-emerald';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-4 rounded-2xl relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Exam Countdown
          </h3>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            {isAdding ? 'Cancel' : '+ Add Exam'}
          </button>
        </div>

        {/* Add exam form */}
        {isAdding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10"
          >
            <input
              type="text"
              placeholder="Exam name..."
              value={newExamName}
              onChange={(e) => setNewExamName(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none mb-2"
            />
            <div className="flex gap-2">
              <input
                type="date"
                value={newExamDate}
                onChange={(e) => setNewExamDate(e.target.value)}
                className="flex-1 bg-white/5 rounded-lg px-3 py-1.5 text-sm text-foreground outline-none"
              />
              <button
                onClick={addExam}
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/80 transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Exams list */}
        <div className="space-y-2">
          {sortedExams.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No exams scheduled. Add one to start tracking!
            </p>
          ) : (
            sortedExams.map((exam, i) => {
              const daysLeft = getDaysLeft(exam.date);
              const isPast = daysLeft < 0;
              
              return (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`group relative flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all ${isPast ? 'opacity-50' : ''}`}
                >
                  {/* Color indicator */}
                  <div
                    className="w-1 h-10 rounded-full"
                    style={{ background: exam.color }}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{exam.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(exam.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getUrgencyClass(daysLeft)}`}>
                      {isPast ? 'Past' : daysLeft === 0 ? 'Today!' : `${daysLeft}d`}
                    </p>
                    {!isPast && daysLeft <= 7 && daysLeft > 0 && (
                      <div className="flex items-center gap-1 text-xs text-amber-400">
                        <AlertTriangle className="w-3 h-3" />
                        Soon
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => removeExam(exam.id)}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-white/10"
                  >
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
};

