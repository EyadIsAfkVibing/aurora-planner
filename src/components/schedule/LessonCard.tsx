import { useState } from 'react';
import { CheckCircle2, X, Circle } from 'lucide-react';
import type { Lesson } from '@/hooks/useSchedule';

interface LessonCardProps {
  lesson: Lesson;
  onToggle: () => void;
  onDelete: () => void;
}

const getSubjectClass = (subject: string): string => {
  const lower = subject.toLowerCase();
  if (lower.includes('science')) return 'subject-science';
  if (lower.includes('algebra')) return 'subject-algebra';
  if (lower.includes('trigonometry')) return 'subject-trigonometry';
  if (lower.includes('geometry')) return 'subject-geometry';
  if (lower.includes('arabic')) return 'subject-arabic';
  if (lower.includes('history')) return 'subject-history';
  return 'subject-default';
};

export const LessonCard = ({ lesson, onToggle, onDelete }: LessonCardProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const subjectClass = getSubjectClass(lesson.subject);

  const handleClick = () => {
    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 600);
    onToggle();
  };

  return (
    <div
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        relative overflow-hidden rounded-xl p-3 cursor-pointer border transition-all duration-300 group/item
        ${lesson.completed 
          ? 'bg-secondary/40 border-border hover:bg-secondary/60' 
          : `${subjectClass} border hover:scale-[1.02]`
        }
        ${isPressed ? 'scale-[0.98]' : ''}
      `}
    >
      {/* Completion ripple effect */}
      {showRipple && (
        <div 
          className={`absolute inset-0 ${lesson.completed ? 'bg-aurora-emerald/20' : 'bg-white/10'} animate-ripple rounded-xl`}
          style={{ transformOrigin: 'center' }}
        />
      )}

      {/* Shimmer on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover/item:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />

      <div className="flex items-center justify-between z-10 relative">
        <span
          className={`text-sm font-medium transition-all duration-300 ${
            lesson.completed ? 'text-muted-foreground line-through' : ''
          }`}
        >
          {lesson.subject}
        </span>
        <div className="flex items-center gap-2">
          {/* Animated checkbox */}
          <div className="relative w-5 h-5">
            {lesson.completed ? (
              <CheckCircle2 className="w-5 h-5 text-aurora-emerald animate-scale-in" />
            ) : (
              <Circle className="w-5 h-5 text-white/30 group-hover/item:text-white/50 transition-colors" />
            )}
            {/* Glow effect on complete */}
            {lesson.completed && (
              <div className="absolute inset-0 bg-aurora-emerald/50 rounded-full blur-md animate-pulse-slow" />
            )}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="opacity-0 group-hover/item:opacity-100 p-1 hover:text-destructive hover:bg-destructive/20 rounded transition-all duration-200 hover:scale-110"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Progress indicator line */}
      <div 
        className={`absolute bottom-0 left-0 h-[2px] bg-aurora-emerald transition-all duration-500 ${
          lesson.completed ? 'w-full' : 'w-0'
        }`}
      />
    </div>
  );
};
