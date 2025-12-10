import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { FloatingNav } from '../aurora/FloatingNav';
import { DayCard } from '../schedule/DayCard';
import { SettingsModal } from '../schedule/SettingsModal';
import { AnalyticsPanel } from '../analytics/AnalyticsPanel';
import { FocusTimer } from '../focus/FocusTimer';
import { AchievementPopup } from '../analytics/AchievementPopup';
import { useStudyStats } from '@/hooks/useStudyStats';
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

type TabType = 'overview' | 'focus' | 'analytics';

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
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);
  const prevLessonCount = useRef(stats.completed);

  const {
    stats: studyStats,
    recordLessonCompletion,
    newAchievement,
    dismissAchievement,
    xpProgress,
    xpToNextLevel,
  } = useStudyStats(username);

  // Track lesson completions
  useEffect(() => {
    if (stats.completed > prevLessonCount.current) {
      recordLessonCompletion();
    }
    prevLessonCount.current = stats.completed;
  }, [stats.completed, recordLessonCompletion]);

  const handleTabChange = useCallback((tab: TabType) => {
    if (tab === activeTab) return;
    setIsTabTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsTabTransitioning(false);
    }, 200);
  }, [activeTab]);

  const handleToggleLesson = useCallback((dayId: string, lessonId: string) => {
    onToggleLesson(dayId, lessonId);
  }, [onToggleLesson]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Achievement Popup */}
      <AchievementPopup achievement={newAchievement} onDismiss={dismissAchievement} />

      {/* Floating Navigation */}
      <FloatingNav
        username={username}
        percent={stats.percent}
        level={studyStats.level}
        xp={studyStats.totalXP}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={onLogout}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Content */}
      <main className="flex-1 overflow-y-auto pt-32 px-4 sm:px-8 pb-32 custom-scrollbar">
        <div
          className={`transition-all duration-300 ${
            isTabTransitioning ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'
          }`}
        >
          {activeTab === 'overview' && (
            <>
              {/* Hero Text */}
              <div className="max-w-7xl mx-auto mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1
                    className="text-4xl sm:text-5xl font-light text-foreground tracking-tight animate-slide-up"
                    style={{ animationDelay: '0.3s' }}
                  >
                    Your <span className="font-serif italic text-primary/80">Curriculum</span> Protocol
                  </h1>
                  <p className="text-muted-foreground mt-2 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    {stats.completed} of {stats.total} lessons completed • {stats.percent}% synced
                  </p>
                </div>
                <button
                  onClick={onAddDay}
                  className="btn-aurora flex items-center gap-2 animate-slide-up group"
                  style={{ animationDelay: '0.5s' }}
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
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
                    onToggleLesson={(lessonId) => handleToggleLesson(day.id, lessonId)}
                    onDeleteLesson={(lessonId) => onDeleteLesson(day.id, lessonId)}
                    onAddLesson={(subject) => onAddLesson(day.id, subject)}
                    onDeleteDay={() => onDeleteDay(day.id)}
                  />
                ))}
              </div>

              {/* Empty State */}
              {schedule.length === 0 && (
                <div className="max-w-7xl mx-auto text-center py-20 animate-slide-up">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-lg mb-4">No schedule yet.</p>
                  <button onClick={onAddDay} className="btn-aurora">
                    Create Your First Day
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 'focus' && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-light text-foreground tracking-tight animate-slide-up">
                  Focus <span className="font-serif italic text-primary/80">Mode</span>
                </h1>
                <p className="text-muted-foreground mt-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  Stay focused with the Pomodoro technique
                </p>
              </div>
              <FocusTimer onComplete={recordLessonCompletion} />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-4xl font-light text-foreground tracking-tight animate-slide-up">
                  Your <span className="font-serif italic text-primary/80">Analytics</span>
                </h1>
                <p className="text-muted-foreground mt-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  Track your progress and achievements
                </p>
              </div>
              <AnalyticsPanel
                stats={studyStats}
                scheduleStats={stats}
                xpProgress={xpProgress}
                xpToNext={xpToNextLevel}
              />
            </div>
          )}
        </div>
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
