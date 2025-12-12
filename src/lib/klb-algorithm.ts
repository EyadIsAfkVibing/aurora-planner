/**
 * KNOWLEDGE LOAD BALANCER (KLB) ALGORITHM
 * Intelligently distributes lessons across days based on:
 * - Cognitive load capacity
 * - Subject difficulty
 * - Deadlines
 * - Dependencies
 * - User performance history
 */

// ============================================
// TYPES
// ============================================

export interface Lesson {
  id: string;
  subject: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedMinutes: number;
  deadline?: Date;
  dependencies?: string[]; // IDs of prerequisite lessons
  completed: boolean;
  tags?: string[];
}

export interface Day {
  id: string;
  date: Date;
  lessons: Lesson[];
  maxCapacity: number; // 1-3 lessons per day
  cognitiveLoadLimit: number; // Max load points (default: 10)
}

export interface SubjectProfile {
  name: string;
  color: string;
  avgCompletionTime: number; // minutes
  performanceScore: number; // 0-100
  totalLessons: number;
  completedLessons: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface KLBConfig {
  maxLessonsPerDay: number;
  maxCognitiveLoad: number;
  difficultyWeights: Record<string, number>;
  preferHeavyLightAlternation: boolean;
  respectDeadlines: boolean;
  enforeDependencies: boolean;
}

export interface ScheduleResult {
  success: boolean;
  schedule: Day[];
  unscheduled: Lesson[];
  warnings: string[];
  metrics: {
    totalLessons: number;
    scheduledLessons: number;
    avgLoadPerDay: number;
    peakLoad: number;
    daysUsed: number;
  };
}

// ============================================
// CONSTANTS
// ============================================

const DEFAULT_CONFIG: KLBConfig = {
  maxLessonsPerDay: 3,
  maxCognitiveLoad: 10,
  difficultyWeights: {
    easy: 2,
    medium: 4,
    hard: 6,
  },
  preferHeavyLightAlternation: true,
  respectDeadlines: true,
  enforeDependencies: true,
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate cognitive load for a lesson
 */
export function calculateLessonLoad(
  lesson: Lesson,
  config: KLBConfig = DEFAULT_CONFIG
): number {
  const baseLoad = config.difficultyWeights[lesson.difficulty] || 4;
  const timeMultiplier = Math.min(lesson.estimatedMinutes / 30, 2); // Cap at 2x
  return Math.round(baseLoad * timeMultiplier * 10) / 10;
}

/**
 * Calculate total cognitive load for a day
 */
export function calculateDayLoad(
  lessons: Lesson[],
  config: KLBConfig = DEFAULT_CONFIG
): number {
  return lessons.reduce((sum, lesson) => sum + calculateLessonLoad(lesson, config), 0);
}

/**
 * Check if a lesson can be scheduled on a day
 */
export function canScheduleLesson(
  day: Day,
  lesson: Lesson,
  scheduledLessons: Map<string, Date>,
  config: KLBConfig = DEFAULT_CONFIG
): { canSchedule: boolean; reason?: string } {
  // Check lesson count
  if (day.lessons.length >= config.maxLessonsPerDay) {
    return { canSchedule: false, reason: 'Day at capacity' };
  }

  // Check cognitive load
  const currentLoad = calculateDayLoad(day.lessons, config);
  const lessonLoad = calculateLessonLoad(lesson, config);
  if (currentLoad + lessonLoad > config.maxCognitiveLoad) {
    return { canSchedule: false, reason: 'Would exceed cognitive load limit' };
  }

  // Check deadline
  if (config.respectDeadlines && lesson.deadline) {
    if (day.date > lesson.deadline) {
      return { canSchedule: false, reason: 'Past deadline' };
    }
  }

  // Check dependencies
  if (config.enforeDependencies && lesson.dependencies?.length) {
    for (const depId of lesson.dependencies) {
      const depDate = scheduledLessons.get(depId);
      if (!depDate || depDate >= day.date) {
        return { canSchedule: false, reason: `Dependency ${depId} not completed` };
      }
    }
  }

  return { canSchedule: true };
}

/**
 * Score a day for a lesson (higher = better fit)
 */
function scoreDayForLesson(
  day: Day,
  lesson: Lesson,
  dayIndex: number,
  previousDayLoad: number,
  config: KLBConfig
): number {
  let score = 100;

  const currentLoad = calculateDayLoad(day.lessons, config);
  const lessonLoad = calculateLessonLoad(lesson, config);
  const newLoad = currentLoad + lessonLoad;

  // Prefer days with lower load
  score -= newLoad * 5;

  // Heavy/light alternation
  if (config.preferHeavyLightAlternation) {
    // If previous day was heavy, prefer light day
    if (previousDayLoad > config.maxCognitiveLoad * 0.7) {
      if (lesson.difficulty === 'easy') score += 20;
      if (lesson.difficulty === 'hard') score -= 15;
    }
    // If previous day was light, can handle more
    if (previousDayLoad < config.maxCognitiveLoad * 0.3) {
      if (lesson.difficulty === 'hard') score += 10;
    }
  }

  // Prefer earlier scheduling for deadline items
  if (lesson.deadline) {
    const daysUntilDeadline = Math.ceil(
      (lesson.deadline.getTime() - day.date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilDeadline <= 2) score += 30; // Urgent
    else if (daysUntilDeadline <= 5) score += 15;
  }

  // Prefer grouping same subjects (batching)
  const sameSubjectCount = day.lessons.filter(l => l.subject === lesson.subject).length;
  if (sameSubjectCount > 0 && sameSubjectCount < 2) {
    score += 10; // Good to have 1-2 same subject
  } else if (sameSubjectCount >= 2) {
    score -= 10; // Too many same subject
  }

  return Math.max(0, score);
}

// ============================================
// MAIN KLB ALGORITHM
// ============================================

/**
 * PSEUDOCODE:
 * 
 * 1. INITIALIZATION
 *    - Sort lessons by: deadline (urgent first), then difficulty (hard first)
 *    - Create empty schedule for available days
 *    - Build dependency graph
 * 
 * 2. DEPENDENCY RESOLUTION
 *    - Topological sort of lessons based on dependencies
 *    - Ensure prerequisites are scheduled before dependents
 * 
 * 3. SCHEDULING LOOP
 *    FOR each lesson in sorted order:
 *      a. Find all valid days (capacity, load, deadline, dependencies)
 *      b. Score each valid day
 *      c. Select highest-scoring day
 *      d. If no valid day, add to unscheduled
 * 
 * 4. LOAD BALANCING PASS
 *    - Check for overloaded days
 *    - Redistribute if possible while respecting constraints
 * 
 * 5. ALTERNATION SMOOTHING
 *    - Check heavy/light pattern
 *    - Swap lessons between days if improves alternation
 * 
 * 6. RETURN result with metrics
 */

export function scheduleWithKLB(
  lessons: Lesson[],
  days: Day[],
  config: KLBConfig = DEFAULT_CONFIG
): ScheduleResult {
  const warnings: string[] = [];
  const unscheduled: Lesson[] = [];
  const scheduledLessons = new Map<string, Date>();

  // Filter out completed lessons
  const pendingLessons = lessons.filter(l => !l.completed);

  // Step 1: Sort lessons by priority
  const sortedLessons = [...pendingLessons].sort((a, b) => {
    // Deadline first
    if (a.deadline && b.deadline) {
      return a.deadline.getTime() - b.deadline.getTime();
    }
    if (a.deadline) return -1;
    if (b.deadline) return 1;

    // Then by difficulty (hard first to ensure they get scheduled)
    const diffOrder = { hard: 0, medium: 1, easy: 2 };
    return diffOrder[a.difficulty] - diffOrder[b.difficulty];
  });

  // Step 2: Topological sort for dependencies
  const lessonMap = new Map(sortedLessons.map(l => [l.id, l]));
  const sorted = topologicalSort(sortedLessons, lessonMap);

  // Step 3: Schedule each lesson
  const schedule = days.map(d => ({ ...d, lessons: [...d.lessons] }));

  for (const lesson of sorted) {
    let bestDay: Day | null = null;
    let bestScore = -1;

    for (let i = 0; i < schedule.length; i++) {
      const day = schedule[i];
      const previousDayLoad = i > 0 ? calculateDayLoad(schedule[i - 1].lessons, config) : 0;

      const { canSchedule, reason } = canScheduleLesson(day, lesson, scheduledLessons, config);

      if (canSchedule) {
        const score = scoreDayForLesson(day, lesson, i, previousDayLoad, config);
        if (score > bestScore) {
          bestScore = score;
          bestDay = day;
        }
      }
    }

    if (bestDay) {
      bestDay.lessons.push(lesson);
      scheduledLessons.set(lesson.id, bestDay.date);
    } else {
      unscheduled.push(lesson);
      warnings.push(`Could not schedule: ${lesson.title}`);
    }
  }

  // Step 4: Load balancing pass
  balanceLoads(schedule, config);

  // Step 5: Calculate metrics
  const totalScheduled = schedule.reduce((sum, d) => sum + d.lessons.length, 0);
  const loads = schedule.map(d => calculateDayLoad(d.lessons, config));
  const avgLoad = loads.reduce((a, b) => a + b, 0) / schedule.length || 0;
  const peakLoad = Math.max(...loads, 0);
  const daysUsed = schedule.filter(d => d.lessons.length > 0).length;

  return {
    success: unscheduled.length === 0,
    schedule,
    unscheduled,
    warnings,
    metrics: {
      totalLessons: pendingLessons.length,
      scheduledLessons: totalScheduled,
      avgLoadPerDay: Math.round(avgLoad * 10) / 10,
      peakLoad,
      daysUsed,
    },
  };
}

/**
 * Topological sort for dependency ordering
 */
function topologicalSort(lessons: Lesson[], lessonMap: Map<string, Lesson>): Lesson[] {
  const visited = new Set<string>();
  const result: Lesson[] = [];

  function visit(lesson: Lesson) {
    if (visited.has(lesson.id)) return;
    visited.add(lesson.id);

    // Visit dependencies first
    for (const depId of lesson.dependencies || []) {
      const dep = lessonMap.get(depId);
      if (dep) visit(dep);
    }

    result.push(lesson);
  }

  for (const lesson of lessons) {
    visit(lesson);
  }

  return result;
}

/**
 * Balance loads between days
 */
function balanceLoads(schedule: Day[], config: KLBConfig): void {
  const maxLoad = config.maxCognitiveLoad;

  for (let i = 0; i < schedule.length; i++) {
    const currentLoad = calculateDayLoad(schedule[i].lessons, config);

    // If day is overloaded, try to move to adjacent days
    if (currentLoad > maxLoad * 0.9) {
      const movableLessons = schedule[i].lessons.filter(
        l => l.difficulty === 'easy' && !l.deadline
      );

      for (const lesson of movableLessons) {
        // Try next day
        if (i + 1 < schedule.length) {
          const nextLoad = calculateDayLoad(schedule[i + 1].lessons, config);
          if (nextLoad + calculateLessonLoad(lesson, config) <= maxLoad * 0.7) {
            schedule[i].lessons = schedule[i].lessons.filter(l => l.id !== lesson.id);
            schedule[i + 1].lessons.push(lesson);
            break;
          }
        }
      }
    }
  }
}

// ============================================
// AUTO-RESCHEDULE ENGINE
// ============================================

export interface RescheduleResult {
  original: Day[];
  proposed: Day[];
  changes: Array<{
    lessonId: string;
    lessonTitle: string;
    fromDay: string;
    toDay: string;
    reason: string;
  }>;
}

export function autoReschedule(
  currentSchedule: Day[],
  missedLessonIds: string[],
  config: KLBConfig = DEFAULT_CONFIG
): RescheduleResult {
  const original = currentSchedule.map(d => ({ ...d, lessons: [...d.lessons] }));
  const changes: RescheduleResult['changes'] = [];

  // Find all lessons that need rescheduling
  const lessonsToReschedule: Lesson[] = [];
  const proposed = currentSchedule.map(d => {
    const day = { ...d, lessons: [...d.lessons] };

    for (const lessonId of missedLessonIds) {
      const lessonIndex = day.lessons.findIndex(l => l.id === lessonId);
      if (lessonIndex !== -1) {
        const [lesson] = day.lessons.splice(lessonIndex, 1);
        lessonsToReschedule.push(lesson);
      }
    }

    return day;
  });

  // Reschedule using KLB
  const result = scheduleWithKLB(lessonsToReschedule, proposed, config);

  // Track changes
  for (const lesson of lessonsToReschedule) {
    const originalDay = original.find(d => d.lessons.some(l => l.id === lesson.id));
    const newDay = result.schedule.find(d => d.lessons.some(l => l.id === lesson.id));

    if (originalDay && newDay && originalDay.id !== newDay.id) {
      changes.push({
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        fromDay: originalDay.id,
        toDay: newDay.id,
        reason: 'Missed original date',
      });
    }
  }

  return {
    original,
    proposed: result.schedule,
    changes,
  };
}

// ============================================
// ADAPTIVE TIME ESTIMATOR
// ============================================

export interface SessionLog {
  lessonId: string;
  subject: string;
  startTime: Date;
  endTime: Date;
  durationMinutes: number;
  completed: boolean;
}

export function updateTimeEstimates(
  subjects: SubjectProfile[],
  sessions: SessionLog[]
): SubjectProfile[] {
  const subjectTimes = new Map<string, number[]>();

  // Group session times by subject
  for (const session of sessions) {
    if (!session.completed) continue;

    const times = subjectTimes.get(session.subject) || [];
    times.push(session.durationMinutes);
    subjectTimes.set(session.subject, times);
  }

  // Update averages with exponential smoothing
  return subjects.map(subject => {
    const times = subjectTimes.get(subject.name);
    if (!times || times.length === 0) return subject;

    // Exponential moving average (recent sessions weighted more)
    const alpha = 0.3;
    let ema = times[0];
    for (let i = 1; i < times.length; i++) {
      ema = alpha * times[i] + (1 - alpha) * ema;
    }

    return {
      ...subject,
      avgCompletionTime: Math.round(ema),
    };
  });
}

// ============================================
// TEST VECTORS
// ============================================

export const testVectors = {
  /**
   * TEST 1: Basic scheduling - 3 easy lessons, 3 days
   * Expected: 1 lesson per day
   */
  test1: {
    lessons: [
      { id: '1', subject: 'Math', title: 'Algebra Basics', difficulty: 'easy' as const, estimatedMinutes: 30, completed: false },
      { id: '2', subject: 'Math', title: 'Equations', difficulty: 'easy' as const, estimatedMinutes: 30, completed: false },
      { id: '3', subject: 'Math', title: 'Functions', difficulty: 'easy' as const, estimatedMinutes: 30, completed: false },
    ],
    days: [
      { id: 'd1', date: new Date('2024-01-01'), lessons: [], maxCapacity: 3, cognitiveLoadLimit: 10 },
      { id: 'd2', date: new Date('2024-01-02'), lessons: [], maxCapacity: 3, cognitiveLoadLimit: 10 },
      { id: 'd3', date: new Date('2024-01-03'), lessons: [], maxCapacity: 3, cognitiveLoadLimit: 10 },
    ],
    expected: {
      success: true,
      unscheduledCount: 0,
      avgLoadPerDay: 2, // Easy lesson = 2 load points
    },
  },

  /**
   * TEST 2: Load balancing - 2 hard + 2 easy
   * Expected: Hard lessons distributed, not on same day
   */
  test2: {
    lessons: [
      { id: '1', subject: 'Physics', title: 'Quantum Mechanics', difficulty: 'hard' as const, estimatedMinutes: 60, completed: false },
      { id: '2', subject: 'Physics', title: 'Relativity', difficulty: 'hard' as const, estimatedMinutes: 60, completed: false },
      { id: '3', subject: 'English', title: 'Grammar', difficulty: 'easy' as const, estimatedMinutes: 30, completed: false },
      { id: '4', subject: 'English', title: 'Vocabulary', difficulty: 'easy' as const, estimatedMinutes: 30, completed: false },
    ],
    days: [
      { id: 'd1', date: new Date('2024-01-01'), lessons: [], maxCapacity: 3, cognitiveLoadLimit: 10 },
      { id: 'd2', date: new Date('2024-01-02'), lessons: [], maxCapacity: 3, cognitiveLoadLimit: 10 },
    ],
    expected: {
      success: true,
      peakLoad: 14, // 1 hard (12) + 1 easy (2)
    },
  },

  /**
   * TEST 3: Deadline priority
   * Expected: Urgent lesson scheduled first
   */
  test3: {
    lessons: [
      { id: '1', subject: 'History', title: 'Chapter 1', difficulty: 'medium' as const, estimatedMinutes: 45, completed: false },
      { id: '2', subject: 'History', title: 'Chapter 2', difficulty: 'medium' as const, estimatedMinutes: 45, deadline: new Date('2024-01-02'), completed: false },
    ],
    days: [
      { id: 'd1', date: new Date('2024-01-01'), lessons: [], maxCapacity: 3, cognitiveLoadLimit: 10 },
      { id: 'd2', date: new Date('2024-01-02'), lessons: [], maxCapacity: 3, cognitiveLoadLimit: 10 },
    ],
    expected: {
      success: true,
      // Lesson with deadline should be on day 1
    },
  },

  /**
   * TEST 4: Dependencies
   * Expected: Prerequisites scheduled before dependents
   */
  test4: {
    lessons: [
      { id: '1', subject: 'Programming', title: 'Variables', difficulty: 'easy' as const, estimatedMinutes: 30, completed: false },
      { id: '2', subject: 'Programming', title: 'Functions', difficulty: 'medium' as const, estimatedMinutes: 45, dependencies: ['1'], completed: false },
      { id: '3', subject: 'Programming', title: 'Classes', difficulty: 'hard' as const, estimatedMinutes: 60, dependencies: ['2'], completed: false },
    ],
    days: [
      { id: 'd1', date: new Date('2024-01-01'), lessons: [], maxCapacity: 3, cognitiveLoadLimit: 10 },
      { id: 'd2', date: new Date('2024-01-02'), lessons: [], maxCapacity: 3, cognitiveLoadLimit: 10 },
      { id: 'd3', date: new Date('2024-01-03'), lessons: [], maxCapacity: 3, cognitiveLoadLimit: 10 },
    ],
    expected: {
      success: true,
      // Order must be: Variables -> Functions -> Classes
    },
  },

  /**
   * TEST 5: Overflow handling
   * Expected: Some lessons unscheduled when capacity exceeded
   */
  test5: {
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: String(i + 1),
      subject: 'Science',
      title: `Lesson ${i + 1}`,
      difficulty: 'hard' as const,
      estimatedMinutes: 60,
      completed: false,
    })),
    days: [
      { id: 'd1', date: new Date('2024-01-01'), lessons: [], maxCapacity: 2, cognitiveLoadLimit: 10 },
      { id: 'd2', date: new Date('2024-01-02'), lessons: [], maxCapacity: 2, cognitiveLoadLimit: 10 },
    ],
    expected: {
      success: false,
      unscheduledCount: 8, // Only 2 days x 1 hard lesson each (load limit)
    },
  },
};

/**
 * Run all test vectors
 */
export function runKLBTests(): { passed: boolean; results: Array<{ name: string; passed: boolean; details: string }> } {
  const results: Array<{ name: string; passed: boolean; details: string }> = [];

  // Test 1
  const result1 = scheduleWithKLB(testVectors.test1.lessons, testVectors.test1.days);
  results.push({
    name: 'Test 1: Basic scheduling',
    passed: result1.success && result1.unscheduled.length === 0,
    details: `Success: ${result1.success}, Unscheduled: ${result1.unscheduled.length}`,
  });

  // Test 2
  const result2 = scheduleWithKLB(testVectors.test2.lessons, testVectors.test2.days);
  const hardOnDifferentDays = result2.schedule.every(d => 
    d.lessons.filter(l => l.difficulty === 'hard').length <= 1
  );
  results.push({
    name: 'Test 2: Load balancing',
    passed: result2.success && hardOnDifferentDays,
    details: `Hard lessons distributed: ${hardOnDifferentDays}`,
  });

  // Test 3
  const result3 = scheduleWithKLB(testVectors.test3.lessons, testVectors.test3.days);
  const deadlineFirst = result3.schedule[0].lessons.some(l => l.id === '2');
  results.push({
    name: 'Test 3: Deadline priority',
    passed: result3.success && deadlineFirst,
    details: `Deadline item scheduled first: ${deadlineFirst}`,
  });

  // Test 4
  const result4 = scheduleWithKLB(testVectors.test4.lessons, testVectors.test4.days);
  const findLessonDay = (id: string) => result4.schedule.findIndex(d => d.lessons.some(l => l.id === id));
  const correctOrder = findLessonDay('1') <= findLessonDay('2') && findLessonDay('2') <= findLessonDay('3');
  results.push({
    name: 'Test 4: Dependencies',
    passed: result4.success && correctOrder,
    details: `Correct dependency order: ${correctOrder}`,
  });

  // Test 5
  const result5 = scheduleWithKLB(testVectors.test5.lessons, testVectors.test5.days);
  results.push({
    name: 'Test 5: Overflow handling',
    passed: !result5.success && result5.unscheduled.length > 0,
    details: `Unscheduled: ${result5.unscheduled.length}`,
  });

  return {
    passed: results.every(r => r.passed),
    results,
  };
}
