import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { FloatingNav } from '../aurora/FloatingNav';
import { DayCard } from '../schedule/DayCard';
import { SettingsModal } from '../schedule/SettingsModal';
import { AchievementPopup } from '../analytics/AchievementPopup';
import { SmartDailyAdvisor } from '../smart/SmartDailyAdvisor';
import { CognitiveLoadMeter } from '../smart/CognitiveLoadMeter';
import { ExamCountdown } from '../smart/ExamCountdown';
import { QuickActionsBar } from '../smart/QuickActionsBar';
import { useStudyStats } from '@/hooks/useStudyStats';
import { useIntelligentSchedule } from '@/hooks/useIntelligentSchedule';
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
  const prevLessonCount = useRef(stats.completed);

  const {
    stats: studyStats,
    recordLessonCompletion,
    newAchievement,
    dismissAchievement,
  } = useStudyStats(username);

  const {
    subjectProfiles,
    recommendations,
    todayLoad,
    estimatedCompletion,
  } = useIntelligentSchedule(schedule, subjects);

  // Track lesson completions
  useEffect(() => {
    if (stats.completed > prevLessonCount.current) {
      recordLessonCompletion();
    }
    prevLessonCount.current = stats.completed;
  }, [stats.completed, recordLessonCompletion]);

  const handleToggleLesson = useCallback((dayId: string, lessonId: string) => {
    onToggleLesson(dayId, lessonId);
  }, [onToggleLesson]);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Achievement Popup */}
      <AchievementPopup achievement={newAchievement} onDismiss={dismissAchievement} />

      {/* Floating Navigation */}
      <FloatingNav
        username={username}
        percent={stats.percent}
        level={studyStats.level}
        xp={studyStats.totalXP}
        onLogout={onLogout}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Content */}
      <main className="flex-1 overflow-y-auto pt-28 px-4 sm:px-8 pb-32 custom-scrollbar relative z-10">
        {/* Hero Section - Clean & Minimal */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl sm:text-5xl font-light text-foreground tracking-tight animate-slide-up">
                Your <span className="font-serif italic text-primary/80">Schedule</span>
              </h1>
              <p className="text-muted-foreground mt-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {stats.completed} of {stats.total} lessons completed • {stats.percent}% synced
              </p>
            </div>
            <button
              onClick={onAddDay}
              className="btn-aurora flex items-center gap-2 animate-slide-up group"
              style={{ animationDelay: '0.2s' }}
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              <span className="text-sm font-medium">Add Day</span>
            </button>
          </div>

          {/* Smart Widgets Row - 3 Essential Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <SmartDailyAdvisor
              subjectProfiles={subjectProfiles}
              recommendations={recommendations}
              todayLoad={todayLoad}
              estimatedCompletion={estimatedCompletion}
            />
            <CognitiveLoadMeter
              load={todayLoad.load}
              level={todayLoad.level as 'light' | 'moderate' | 'heavy' | 'overloaded'}
              lessonsRemaining={todayLoad.lessonsRemaining}
            />
            <ExamCountdown username={username} />
          </div>
        </div>

        {/* Schedule Grid - Clean Layout */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedule.map((day, idx) => (
              <DayCard
                key={day.id}
                day={day}
                index={idx}
                onToggleLesson={(lessonId) => handleToggleLesson(day.id, lessonId)}
                onDeleteLesson={(lessonId) => onDeleteLesson(day.id, lessonId)}
                onAddLesson={(subject) => onAddLesson(day.id, subject)}
                onDeleteDay={() => onDeleteDay(day.id)}
              />
            ))}
          </div>

          {/* Empty State */}
          {schedule.length === 0 && (
            <div className="text-center py-20 animate-slide-up">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <p className="text-muted-foreground text-lg mb-4">No schedule yet.</p>
              <button onClick={onAddDay} className="btn-aurora">
                Create Your First Day
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Quick Actions Bar */}
      <QuickActionsBar
        onAddDay={onAddDay}
        onOpenSettings={() => setSettingsOpen(true)}
      />

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
