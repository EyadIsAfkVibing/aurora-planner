import { useState, useEffect, useCallback } from 'react';

export interface StudySession {
  date: string;
  completedLessons: number;
  studyTime: number; // minutes
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  requirement: number;
  type: 'streak' | 'total' | 'daily' | 'perfect';
}

export interface StudyStats {
  totalXP: number;
  level: number;
  currentStreak: number;
  bestStreak: number;
  totalCompletedLessons: number;
  totalStudyDays: number;
  weeklyProgress: number[];
  dailyActivity: { [date: string]: number };
  achievements: Achievement[];
}

const STATS_KEY = (username: string) => `gemini_stats_${username}`;
const XP_PER_LESSON = 25;
const XP_PER_LEVEL = 500;

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_lesson', name: 'First Step', description: 'Complete your first lesson', icon: '🚀', requirement: 1, type: 'total' },
  { id: 'ten_lessons', name: 'Getting Started', description: 'Complete 10 lessons', icon: '📚', requirement: 10, type: 'total' },
  { id: 'fifty_lessons', name: 'Knowledge Seeker', description: 'Complete 50 lessons', icon: '🎓', requirement: 50, type: 'total' },
  { id: 'hundred_lessons', name: 'Scholar', description: 'Complete 100 lessons', icon: '🏆', requirement: 100, type: 'total' },
  { id: 'streak_3', name: 'Consistency', description: '3 day streak', icon: '🔥', requirement: 3, type: 'streak' },
  { id: 'streak_7', name: 'Week Warrior', description: '7 day streak', icon: '⚡', requirement: 7, type: 'streak' },
  { id: 'streak_30', name: 'Unstoppable', description: '30 day streak', icon: '💎', requirement: 30, type: 'streak' },
  { id: 'perfect_day', name: 'Perfect Day', description: 'Complete all lessons in a day', icon: '⭐', requirement: 1, type: 'perfect' },
];

export function useStudyStats(username: string | null) {
  const [stats, setStats] = useState<StudyStats>({
    totalXP: 0,
    level: 1,
    currentStreak: 0,
    bestStreak: 0,
    totalCompletedLessons: 0,
    totalStudyDays: 0,
    weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
    dailyActivity: {},
    achievements: DEFAULT_ACHIEVEMENTS,
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  // Load stats
  useEffect(() => {
    if (!username) {
      setIsLoaded(false);
      return;
    }

    const stored = localStorage.getItem(STATS_KEY(username));
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setStats({ ...stats, ...parsed });
      } catch {
        // Keep defaults
      }
    }
    setIsLoaded(true);
  }, [username]);

  // Save stats
  useEffect(() => {
    if (!username || !isLoaded) return;
    localStorage.setItem(STATS_KEY(username), JSON.stringify(stats));
  }, [stats, username, isLoaded]);

  const checkAchievements = useCallback((newStats: StudyStats): Achievement | null => {
    for (const achievement of newStats.achievements) {
      if (achievement.unlockedAt) continue;

      let shouldUnlock = false;
      
      if (achievement.type === 'total' && newStats.totalCompletedLessons >= achievement.requirement) {
        shouldUnlock = true;
      } else if (achievement.type === 'streak' && newStats.currentStreak >= achievement.requirement) {
        shouldUnlock = true;
      }

      if (shouldUnlock) {
        return achievement;
      }
    }
    return null;
  }, []);

  const recordLessonCompletion = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const dayOfWeek = new Date().getDay();

    setStats(prev => {
      const newDailyActivity = { ...prev.dailyActivity };
      newDailyActivity[today] = (newDailyActivity[today] || 0) + 1;

      const newWeeklyProgress = [...prev.weeklyProgress];
      newWeeklyProgress[dayOfWeek] = (newWeeklyProgress[dayOfWeek] || 0) + 1;

      // Check streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      let newStreak = prev.currentStreak;
      if (prev.dailyActivity[yesterdayStr] || prev.dailyActivity[today]) {
        newStreak = prev.currentStreak + (prev.dailyActivity[today] ? 0 : 1);
      } else {
        newStreak = 1;
      }

      const newXP = prev.totalXP + XP_PER_LESSON;
      const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;

      const newStats: StudyStats = {
        ...prev,
        totalXP: newXP,
        level: newLevel,
        currentStreak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        totalCompletedLessons: prev.totalCompletedLessons + 1,
        totalStudyDays: Object.keys(newDailyActivity).length,
        weeklyProgress: newWeeklyProgress,
        dailyActivity: newDailyActivity,
      };

      // Check for new achievements
      const unlockedAchievement = checkAchievements(newStats);
      if (unlockedAchievement) {
        newStats.achievements = newStats.achievements.map(a =>
          a.id === unlockedAchievement.id
            ? { ...a, unlockedAt: new Date().toISOString() }
            : a
        );
        setTimeout(() => setNewAchievement(unlockedAchievement), 100);
      }

      return newStats;
    });
  }, [checkAchievements]);

  const dismissAchievement = useCallback(() => {
    setNewAchievement(null);
  }, []);

  const xpProgress = (stats.totalXP % XP_PER_LEVEL) / XP_PER_LEVEL;
  const xpToNextLevel = XP_PER_LEVEL - (stats.totalXP % XP_PER_LEVEL);

  return {
    stats,
    isLoaded,
    recordLessonCompletion,
    newAchievement,
    dismissAchievement,
    xpProgress,
    xpToNextLevel,
  };
}
