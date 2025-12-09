import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { FloatingNav } from '../aurora/FloatingNav';
import { DayCard } from '../schedule/DayCard';
import { SettingsModal } from '../schedule/SettingsModal';
import type { Day, SubjectConfig } from '@/hooks/useSchedule';

interface DashboardProps {
  username: string;
  schedule: Day[];
  subjects: SubjectConfig;
  stats: { total: number; completed: number; percent: number };
  onLogout: () => void;
  onToggleLesson: (dayId: string, lessonId: string) => void;
  onDeleteLesson: (dayId: string, lessonId: string) => void;
  onAddLesson: (dayId: string, subject: string) => void;
  onDeleteDay: (dayId: string) => void;
  onAddDay: () => void;
  onUpdateSubjects: (subjects: SubjectConfig) => void;
  onResetSchedule: () => void;
}

export const Dashboard = ({
  username,
  schedule,
  subjects,
  stats,
  onLogout,
  onToggleLesson,
  onDeleteLesson,
  onAddLesson,
  onDeleteDay,
  onAddDay,
  onUpdateSubjects,
  onResetSchedule,
}: DashboardProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Floating Navigation */}
      <FloatingNav
        username={username}
        percent={stats.percent}
        onLogout={onLogout}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Content */}
      <main className="flex-1 overflow-y-auto pt-32 px-8 pb-32 custom-scrollbar">
        {/* Hero Text */}
        <div className="max-w-7xl mx-auto mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h1
            className="text-4xl sm:text-5xl font-light text-foreground tracking-tight animate-slide-up"
            style={{ animationDelay: '0.3s' }}
          >
            Your <span className="font-serif italic text-primary/80">Curriculum</span> Protocol
          </h1>
          <button
            onClick={onAddDay}
            className="btn-aurora flex items-center gap-2 animate-slide-up"
            style={{ animationDelay: '0.4s' }}
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Day</span>
          </button>
        </div>

        {/* Schedule Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {schedule.map((day, idx) => (
            <DayCard
              key={day.id}
              day={day}
              index={idx}
              onToggleLesson={(lessonId) => onToggleLesson(day.id, lessonId)}
              onDeleteLesson={(lessonId) => onDeleteLesson(day.id, lessonId)}
              onAddLesson={(subject) => onAddLesson(day.id, subject)}
              onDeleteDay={() => onDeleteDay(day.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {schedule.length === 0 && (
          <div className="max-w-7xl mx-auto text-center py-20 animate-slide-up">
            <p className="text-muted-foreground text-lg mb-4">No schedule yet.</p>
            <button onClick={onAddDay} className="btn-aurora">
              Create Your First Day
            </button>
          </div>
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        subjects={subjects}
        onUpdateSubjects={onUpdateSubjects}
        onResetSchedule={onResetSchedule}
      />
    </div>
  );
};
