import { useState, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { LessonCard } from './LessonCard';
import type { Day } from '@/hooks/useSchedule';

interface DayCardProps {
  day: Day;
  index: number;
  onToggleLesson: (lessonId: string) => void;
  onDeleteLesson: (lessonId: string) => void;
  onAddLesson: (subject: string) => void;
  onDeleteDay: () => void;
}

export const DayCard = ({
  day,
  index,
  onToggleLesson,
  onDeleteLesson,
  onAddLesson,
  onDeleteDay,
}: DayCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newLessonInput, setNewLessonInput] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleAddLesson = () => {
    if (!newLessonInput.trim()) return;
    onAddLesson(newLessonInput.trim());
    setNewLessonInput('');
    setIsEditing(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col glass-card overflow-hidden animate-card-entrance perspective-1000"
      style={{ 
        animationDelay: `${0.1 + index * 0.08}s`,
      }}
    >
      {/* Spotlight gradient on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, hsl(var(--primary) / 0.1), transparent 40%)`,
        }}
      />

      {/* Animated border glow */}
      <div
        className="absolute -inset-[1px] rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}% ${mousePos.y}%, hsl(var(--primary) / 0.3), transparent 40%)`,
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-transparent group-hover:border-primary/40 rounded-tl-3xl transition-all duration-500 group-hover:w-10 group-hover:h-10" />
      <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-transparent group-hover:border-primary/40 rounded-tr-3xl transition-all duration-500 group-hover:w-10 group-hover:h-10" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-transparent group-hover:border-primary/40 rounded-bl-3xl transition-all duration-500 group-hover:w-10 group-hover:h-10" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-transparent group-hover:border-primary/40 rounded-br-3xl transition-all duration-500 group-hover:w-10 group-hover:h-10" />

      {/* Shimmer on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none" />

      {/* Card Header */}
      <div className="relative p-5 border-b border-white/5 flex items-center justify-between z-10">
        <h3 className="text-lg font-medium text-foreground group-hover:animate-text-glow transition-all">
          {day.title}
        </h3>
        <button
          onClick={onDeleteDay}
          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-destructive/20 hover:text-destructive rounded-lg transition-all duration-300 hover:scale-110"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Lessons */}
      <div className="relative p-4 space-y-2 flex-1 z-10">
        {day.lessons.length === 0 && (
          <div className="py-8 text-center text-muted-foreground text-sm border border-dashed border-white/5 rounded-xl hover:border-primary/20 transition-colors">
            No Tasks
          </div>
        )}

        {day.lessons.map((lesson, lessonIndex) => (
          <div
            key={lesson.id}
            className="animate-slide-up"
            style={{ animationDelay: `${0.3 + index * 0.08 + lessonIndex * 0.05}s` }}
          >
            <LessonCard
              lesson={lesson}
              onToggle={() => onToggleLesson(lesson.id)}
              onDelete={() => onDeleteLesson(lesson.id)}
            />
          </div>
        ))}

        {/* Add Input */}
        {isEditing ? (
          <div className="mt-2 flex items-center gap-2 animate-slide-up" style={{ animationDelay: '0s' }}>
            <input
              autoFocus
              value={newLessonInput}
              onChange={(e) => setNewLessonInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddLesson();
                if (e.key === 'Escape') setIsEditing(false);
              }}
              placeholder="Subject..."
              className="w-full glass-input text-xs focus:ring-primary/30"
            />
            <button
              onClick={handleAddLesson}
              className="p-2 bg-primary rounded-lg text-primary-foreground hover:bg-primary/80 transition-all hover:scale-110 hover:shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setIsEditing(true);
              setNewLessonInput('');
            }}
            className="w-full mt-2 py-2 border border-dashed border-white/10 rounded-xl text-xs text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 flex items-center justify-center gap-2 group/add"
          >
            <Plus className="w-3 h-3 group-hover/add:rotate-90 transition-transform duration-300" /> 
            Add Task
          </button>
        )}
      </div>
    </div>
  );
};
