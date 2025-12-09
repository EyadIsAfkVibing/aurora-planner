import { CheckCircle2, X } from 'lucide-react';
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
  const subjectClass = getSubjectClass(lesson.subject);

  return (
    <div
      onClick={onToggle}
      className={`
        relative overflow-hidden rounded-xl p-3 cursor-pointer border transition-all duration-300 group/item
        ${lesson.completed 
          ? 'bg-secondary/40 border-border' 
          : `${subjectClass} hover:scale-[1.02]`
        }
      `}
    >
      <div className="flex items-center justify-between z-10 relative">
        <span
          className={`text-sm font-medium ${
            lesson.completed ? 'text-muted-foreground line-through' : ''
          }`}
        >
          {lesson.subject}
        </span>
        <div className="flex items-center gap-2">
          {lesson.completed ? (
            <CheckCircle2 className="w-4 h-4 text-aurora-emerald" />
          ) : (
            <div className="w-3 h-3 rounded-full border border-white/20" />
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="opacity-0 group-hover/item:opacity-100 p-1 hover:text-destructive transition-all"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
