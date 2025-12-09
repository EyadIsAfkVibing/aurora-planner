import { useState } from 'react';
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

  const handleAddLesson = () => {
    if (!newLessonInput.trim()) return;
    onAddLesson(newLessonInput.trim());
    setNewLessonInput('');
    setIsEditing(false);
  };

  return (
    <div
      className="group relative flex flex-col glass-card-hover overflow-hidden animate-slide-up"
      style={{ animationDelay: `${0.5 + index * 0.1}s` }}
    >
      {/* Card Header */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">{day.title}</h3>
        <button
          onClick={onDeleteDay}
          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-destructive/20 hover:text-destructive rounded-lg transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Lessons */}
      <div className="p-4 space-y-2 flex-1">
        {day.lessons.length === 0 && (
          <div className="py-8 text-center text-muted-foreground text-sm border border-dashed border-white/5 rounded-xl">
            No Tasks
          </div>
        )}

        {day.lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            onToggle={() => onToggleLesson(lesson.id)}
            onDelete={() => onDeleteLesson(lesson.id)}
          />
        ))}

        {/* Add Input */}
        {isEditing ? (
          <div className="mt-2 flex items-center gap-2 animate-in fade-in zoom-in duration-200">
            <input
              autoFocus
              value={newLessonInput}
              onChange={(e) => setNewLessonInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddLesson();
                if (e.key === 'Escape') setIsEditing(false);
              }}
              placeholder="Subject..."
              className="w-full glass-input text-xs"
            />
            <button
              onClick={handleAddLesson}
              className="p-2 bg-primary rounded-lg text-primary-foreground hover:bg-primary/80 transition-colors"
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
            className="w-full mt-2 py-2 border border-dashed border-white/10 rounded-xl text-xs text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-3 h-3" /> Add Task
          </button>
        )}
      </div>
    </div>
  );
};
