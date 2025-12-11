import { useMemo, useCallback } from 'react';
import type { Day, Lesson, SubjectConfig } from './useSchedule';

// Difficulty levels for subjects
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface SubjectProfile {
  name: string;
  difficulty: DifficultyLevel;
  difficultyScore: number; // 1-10
  totalLessons: number;
  completedLessons: number;
  progress: number;
  avgTimePerLesson: number; // estimated minutes
  remainingLessons: number;
  estimatedCompletionDays: number;
  cognitiveLoad: number; // 1-10
}

export interface DayAnalysis {
  id: string;
  title: string;
  totalLoad: number;
  loadLevel: 'light' | 'moderate' | 'heavy' | 'overloaded';
  lessonCount: number;
  difficultyBreakdown: { easy: number; medium: number; hard: number };
  recommendedOrder: string[];
  isOptimal: boolean;
}

export interface StudyRecommendation {
  type: 'warning' | 'suggestion' | 'insight';
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
}

// Subject difficulty mappings (can be customized)
const SUBJECT_DIFFICULTY: Record<string, { difficulty: DifficultyLevel; cognitiveLoad: number; avgTime: number }> = {
  science: { difficulty: 'hard', cognitiveLoad: 8, avgTime: 45 },
  algebra: { difficulty: 'hard', cognitiveLoad: 9, avgTime: 50 },
  trigonometry: { difficulty: 'hard', cognitiveLoad: 9, avgTime: 55 },
  geometry: { difficulty: 'medium', cognitiveLoad: 7, avgTime: 40 },
  arabic: { difficulty: 'medium', cognitiveLoad: 6, avgTime: 35 },
  history: { difficulty: 'easy', cognitiveLoad: 5, avgTime: 30 },
};

const getDifficultyScore = (difficulty: DifficultyLevel): number => {
  return difficulty === 'hard' ? 9 : difficulty === 'medium' ? 6 : 3;
};

export function useIntelligentSchedule(schedule: Day[], subjects: SubjectConfig) {
  // Analyze subject profiles
  const subjectProfiles = useMemo<SubjectProfile[]>(() => {
    const profiles: Record<string, SubjectProfile> = {};

    // Initialize from subjects config
    Object.entries(subjects).forEach(([name, count]) => {
      const key = name.toLowerCase();
      const config = SUBJECT_DIFFICULTY[key] || { difficulty: 'medium' as const, cognitiveLoad: 5, avgTime: 35 };
      
      profiles[name] = {
        name,
        difficulty: config.difficulty,
        difficultyScore: getDifficultyScore(config.difficulty),
        totalLessons: count,
        completedLessons: 0,
        progress: 0,
        avgTimePerLesson: config.avgTime,
        remainingLessons: count,
        estimatedCompletionDays: 0,
        cognitiveLoad: config.cognitiveLoad,
      };
    });

    // Calculate progress from schedule
    schedule.forEach(day => {
      day.lessons.forEach(lesson => {
        const profile = profiles[lesson.subject];
        if (profile && lesson.completed) {
          profile.completedLessons++;
        }
      });
    });

    // Calculate derived values
    Object.values(profiles).forEach(profile => {
      profile.progress = profile.totalLessons > 0 
        ? Math.round((profile.completedLessons / profile.totalLessons) * 100) 
        : 0;
      profile.remainingLessons = profile.totalLessons - profile.completedLessons;
      profile.estimatedCompletionDays = Math.ceil(profile.remainingLessons / 2); // ~2 lessons per day
    });

    return Object.values(profiles).sort((a, b) => a.progress - b.progress);
  }, [schedule, subjects]);

  // Analyze each day's cognitive load
  const dayAnalysis = useMemo<DayAnalysis[]>(() => {
    return schedule.map(day => {
      let totalLoad = 0;
      const breakdown = { easy: 0, medium: 0, hard: 0 };
      
      day.lessons.forEach(lesson => {
        const key = lesson.subject.toLowerCase();
        const config = SUBJECT_DIFFICULTY[key] || { difficulty: 'medium' as const, cognitiveLoad: 5 };
        totalLoad += config.cognitiveLoad;
        breakdown[config.difficulty]++;
      });

      // Determine load level
      let loadLevel: DayAnalysis['loadLevel'] = 'light';
      if (totalLoad > 30) loadLevel = 'overloaded';
      else if (totalLoad > 20) loadLevel = 'heavy';
      else if (totalLoad > 10) loadLevel = 'moderate';

      // Calculate optimal order (hard → medium → easy → hard for variety)
      const recommendedOrder = [...day.lessons]
        .sort((a, b) => {
          const aKey = a.subject.toLowerCase();
          const bKey = b.subject.toLowerCase();
          const aLoad = SUBJECT_DIFFICULTY[aKey]?.cognitiveLoad || 5;
          const bLoad = SUBJECT_DIFFICULTY[bKey]?.cognitiveLoad || 5;
          return bLoad - aLoad; // Start with harder
        })
        .map(l => l.id);

      return {
        id: day.id,
        title: day.title,
        totalLoad,
        loadLevel,
        lessonCount: day.lessons.length,
        difficultyBreakdown: breakdown,
        recommendedOrder,
        isOptimal: totalLoad <= 20 && totalLoad >= 8,
      };
    });
  }, [schedule]);

  // Calculate today's cognitive load
  const todayLoad = useMemo(() => {
    const incompleteDays = schedule.filter(day => 
      day.lessons.some(l => !l.completed)
    );
    
    if (incompleteDays.length === 0) return { load: 0, level: 'light' as const };
    
    const today = incompleteDays[0];
    const analysis = dayAnalysis.find(d => d.id === today.id);
    
    return {
      load: analysis?.totalLoad || 0,
      level: analysis?.loadLevel || 'light',
      lessonsRemaining: today.lessons.filter(l => !l.completed).length,
    };
  }, [schedule, dayAnalysis]);

  // Generate smart recommendations
  const recommendations = useMemo<StudyRecommendation[]>(() => {
    const recs: StudyRecommendation[] = [];

    // Check for overloaded days
    const overloadedDays = dayAnalysis.filter(d => d.loadLevel === 'overloaded');
    if (overloadedDays.length > 0) {
      recs.push({
        type: 'warning',
        title: 'Overloaded Schedule Detected',
        description: `${overloadedDays.length} day${overloadedDays.length > 1 ? 's have' : ' has'} too much cognitive load. Consider redistributing lessons.`,
        action: 'Auto-balance schedule',
        priority: 'high',
      });
    }

    // Check for neglected subjects
    const neglected = subjectProfiles.filter(s => s.progress < 20 && s.totalLessons > 0);
    if (neglected.length > 0) {
      recs.push({
        type: 'warning',
        title: 'Subjects Falling Behind',
        description: `${neglected.map(s => s.name).join(', ')} ${neglected.length > 1 ? 'need' : 'needs'} attention.`,
        priority: 'high',
      });
    }

    // Suggest focus based on difficulty curve
    const hardSubjectsLow = subjectProfiles.filter(s => s.difficulty === 'hard' && s.progress < 30);
    if (hardSubjectsLow.length > 0) {
      recs.push({
        type: 'suggestion',
        title: 'Prioritize Harder Subjects',
        description: `Focus on ${hardSubjectsLow[0].name} while energy is high.`,
        priority: 'medium',
      });
    }

    // Light day suggestion
    if (todayLoad.load > 25) {
      recs.push({
        type: 'insight',
        title: 'Heavy Day Ahead',
        description: 'Consider taking breaks between lessons to maintain focus.',
        priority: 'low',
      });
    }

    return recs;
  }, [dayAnalysis, subjectProfiles, todayLoad]);

  // Calculate estimated completion date
  const estimatedCompletion = useMemo(() => {
    const totalRemaining = subjectProfiles.reduce((acc, s) => acc + s.remainingLessons, 0);
    const avgLessonsPerDay = 2.5;
    const daysNeeded = Math.ceil(totalRemaining / avgLessonsPerDay);
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + daysNeeded);
    
    return {
      daysRemaining: daysNeeded,
      lessonsRemaining: totalRemaining,
      estimatedDate: completionDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
    };
  }, [subjectProfiles]);

  // Auto-balance schedule function
  const getOptimizedSchedule = useCallback((): Day[] => {
    // Get all incomplete lessons
    const incompleteLessons: Lesson[] = [];
    schedule.forEach(day => {
      day.lessons.forEach(lesson => {
        if (!lesson.completed) {
          incompleteLessons.push({ ...lesson });
        }
      });
    });

    // Sort by difficulty (interleave hard and easy)
    const sorted = incompleteLessons.sort((a, b) => {
      const aKey = a.subject.toLowerCase();
      const bKey = b.subject.toLowerCase();
      const aLoad = SUBJECT_DIFFICULTY[aKey]?.cognitiveLoad || 5;
      const bLoad = SUBJECT_DIFFICULTY[bKey]?.cognitiveLoad || 5;
      return bLoad - aLoad;
    });

    // Interleave for optimal cognitive flow
    const interleaved: Lesson[] = [];
    const hard = sorted.filter(l => (SUBJECT_DIFFICULTY[l.subject.toLowerCase()]?.cognitiveLoad || 5) >= 7);
    const easy = sorted.filter(l => (SUBJECT_DIFFICULTY[l.subject.toLowerCase()]?.cognitiveLoad || 5) < 7);
    
    while (hard.length > 0 || easy.length > 0) {
      if (hard.length > 0) interleaved.push(hard.shift()!);
      if (easy.length > 0) interleaved.push(easy.shift()!);
    }

    // Distribute into days with optimal load (~15-18 cognitive load per day)
    const optimizedDays: Day[] = [];
    let currentDay: Lesson[] = [];
    let currentLoad = 0;
    let dayIndex = 1;

    interleaved.forEach(lesson => {
      const lessonLoad = SUBJECT_DIFFICULTY[lesson.subject.toLowerCase()]?.cognitiveLoad || 5;
      
      if (currentLoad + lessonLoad > 18 && currentDay.length > 0) {
        optimizedDays.push({
          id: `optimized-${dayIndex}`,
          title: `Day ${dayIndex}`,
          lessons: currentDay,
        });
        currentDay = [];
        currentLoad = 0;
        dayIndex++;
      }
      
      currentDay.push(lesson);
      currentLoad += lessonLoad;
    });

    if (currentDay.length > 0) {
      optimizedDays.push({
        id: `optimized-${dayIndex}`,
        title: `Day ${dayIndex}`,
        lessons: currentDay,
      });
    }

    return optimizedDays;
  }, [schedule]);

  return {
    subjectProfiles,
    dayAnalysis,
    todayLoad,
    recommendations,
    estimatedCompletion,
    getOptimizedSchedule,
  };
}
