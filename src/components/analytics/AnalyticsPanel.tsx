import { ProgressRing } from './ProgressRing';
import { WeeklyChart } from './WeeklyChart';
import { ActivityHeatmap } from './ActivityHeatmap';
import { StatsCard } from './StatsCard';
import { XPBar } from './XPBar';
import { AchievementBadge } from './AchievementBadge';
import { BookOpen, Flame, Calendar, Trophy, Target, Clock } from 'lucide-react';
import type { StudyStats } from '@/hooks/useStudyStats';

interface AnalyticsPanelProps {
  stats: StudyStats;
  scheduleStats: { total: number; completed: number; percent: number };
  xpProgress: number;
  xpToNext: number;
}

export const AnalyticsPanel = ({ stats, scheduleStats, xpProgress, xpToNext }: AnalyticsPanelProps) => {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* XP Bar */}
      <XPBar
        level={stats.level}
        progress={xpProgress}
        totalXP={stats.totalXP}
        xpToNext={xpToNext}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={BookOpen}
          label="Lessons Done"
          value={stats.totalCompletedLessons}
          sublabel="All time"
          color="primary"
          delay={0.1}
        />
        <StatsCard
          icon={Flame}
          label="Current Streak"
          value={`${stats.currentStreak} days`}
          sublabel={`Best: ${stats.bestStreak} days`}
          color="emerald"
          delay={0.2}
        />
        <StatsCard
          icon={Calendar}
          label="Study Days"
          value={stats.totalStudyDays}
          sublabel="Total active days"
          color="fuchsia"
          delay={0.3}
        />
        <StatsCard
          icon={Target}
          label="Schedule"
          value={`${scheduleStats.percent}%`}
          sublabel={`${scheduleStats.completed}/${scheduleStats.total} lessons`}
          color="cyan"
          delay={0.4}
        />
      </div>

      {/* Progress Ring & Weekly Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-4 self-start flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Overall Progress
          </h3>
          <ProgressRing
            progress={scheduleStats.percent}
            size={180}
            label="Complete"
            sublabel={`${scheduleStats.completed} of ${scheduleStats.total}`}
          />
        </div>
        
        <WeeklyChart data={stats.weeklyProgress} />
      </div>

      {/* Activity Heatmap */}
      <ActivityHeatmap data={stats.dailyActivity} />

      {/* Achievements */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          Achievements
        </h3>
        
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {stats.achievements.map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              achievement={achievement}
              size="sm"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
