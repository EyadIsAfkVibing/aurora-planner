/**
 * DATA MODEL - Type definitions and sample seed data
 */

// ============================================
// CORE TYPES
// ============================================

export interface User {
  id: string;
  username: string;
  email?: string;
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  reducedMotion: boolean;
  maxLessonsPerDay: number;
  defaultSessionLength: number; // minutes
  notifications: boolean;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  timezone: string;
}

export interface Lesson {
  id: string;
  subject: string;
  title: string;
  description?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedMinutes: number;
  deadline?: Date;
  dependencies?: string[];
  completed: boolean;
  completedAt?: Date;
  tags?: string[];
  notes?: string;
  order: number;
}

export interface Day {
  id: string;
  date: Date;
  lessons: Lesson[];
  notes?: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  icon?: string;
  targetLessons: number;
  completedLessons: number;
  difficulty: 'easy' | 'medium' | 'hard';
  avgCompletionTime: number;
  performanceScore: number;
}

export interface StudySession {
  id: string;
  lessonId: string;
  subject: string;
  startTime: Date;
  endTime?: Date;
  durationMinutes: number;
  completed: boolean;
  focusScore?: number; // 0-100
  notes?: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  date: Date;
  importance: 'low' | 'medium' | 'high';
  topics?: string[];
  notes?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  targetDate: Date;
  completed: boolean;
  completedAt?: Date;
  relatedSubjects?: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  requirement: {
    type: 'lessons' | 'streak' | 'time' | 'level' | 'special';
    target: number;
  };
}

export interface Stats {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalStudyTime: number; // minutes
  lessonsCompleted: number;
  dailyProgress: Array<{ date: string; lessonsCompleted: number; studyTime: number }>;
  weeklyProgress: Array<{ week: string; lessonsCompleted: number; studyTime: number }>;
  achievements: Achievement[];
  lastActive: Date;
}

export interface AnalyticsData {
  velocity: Array<{ date: string; lessons: number; avgTime: number }>;
  heatmap: Array<{ date: string; intensity: number }>;
  subjectBreakdown: Array<{ subject: string; hours: number; percentage: number }>;
  predictions: {
    estimatedFinishDate: Date;
    projectedPace: number;
    atRiskSubjects: string[];
  };
  insights: Array<{
    type: 'weakness' | 'strength' | 'suggestion' | 'warning';
    title: string;
    description: string;
    priority: number;
  }>;
}

// ============================================
// STATE INTERFACE
// ============================================

export interface AppState {
  user: User | null;
  schedule: Day[];
  subjects: Subject[];
  sessions: StudySession[];
  exams: Exam[];
  milestones: Milestone[];
  stats: Stats;
  analytics: AnalyticsData;
  isLoading: boolean;
  error: string | null;
}

// ============================================
// SAMPLE SEED DATA
// ============================================

export const sampleSubjects: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    color: 'hsl(262 83% 58%)',
    targetLessons: 20,
    completedLessons: 8,
    difficulty: 'hard',
    avgCompletionTime: 45,
    performanceScore: 72,
  },
  {
    id: 'physics',
    name: 'Physics',
    color: 'hsl(199 89% 48%)',
    targetLessons: 15,
    completedLessons: 5,
    difficulty: 'hard',
    avgCompletionTime: 50,
    performanceScore: 65,
  },
  {
    id: 'english',
    name: 'English',
    color: 'hsl(142 76% 36%)',
    targetLessons: 12,
    completedLessons: 7,
    difficulty: 'easy',
    avgCompletionTime: 25,
    performanceScore: 88,
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    color: 'hsl(25 95% 53%)',
    targetLessons: 18,
    completedLessons: 4,
    difficulty: 'medium',
    avgCompletionTime: 40,
    performanceScore: 70,
  },
  {
    id: 'history',
    name: 'History',
    color: 'hsl(350 89% 60%)',
    targetLessons: 10,
    completedLessons: 6,
    difficulty: 'easy',
    avgCompletionTime: 30,
    performanceScore: 82,
  },
];

export const sampleLessons: Lesson[] = [
  {
    id: 'l1',
    subject: 'Mathematics',
    title: 'Quadratic Equations',
    difficulty: 'hard',
    estimatedMinutes: 45,
    completed: false,
    order: 1,
  },
  {
    id: 'l2',
    subject: 'Mathematics',
    title: 'Linear Algebra Basics',
    difficulty: 'medium',
    estimatedMinutes: 40,
    dependencies: ['l1'],
    completed: false,
    order: 2,
  },
  {
    id: 'l3',
    subject: 'Physics',
    title: 'Newton\'s Laws',
    difficulty: 'medium',
    estimatedMinutes: 50,
    completed: false,
    order: 1,
  },
  {
    id: 'l4',
    subject: 'English',
    title: 'Essay Structure',
    difficulty: 'easy',
    estimatedMinutes: 25,
    completed: true,
    completedAt: new Date('2024-01-10'),
    order: 1,
  },
  {
    id: 'l5',
    subject: 'Chemistry',
    title: 'Periodic Table',
    difficulty: 'medium',
    estimatedMinutes: 35,
    completed: false,
    order: 1,
  },
];

export const sampleExams: Exam[] = [
  {
    id: 'e1',
    title: 'Mid-term Mathematics',
    subject: 'Mathematics',
    date: new Date('2024-02-15'),
    importance: 'high',
    topics: ['Quadratic Equations', 'Linear Algebra', 'Calculus Basics'],
  },
  {
    id: 'e2',
    title: 'Physics Quiz',
    subject: 'Physics',
    date: new Date('2024-02-01'),
    importance: 'medium',
    topics: ['Newton\'s Laws', 'Motion'],
  },
];

export const sampleMilestones: Milestone[] = [
  {
    id: 'm1',
    title: 'Complete Math Unit 1',
    description: 'Finish all algebra topics',
    targetDate: new Date('2024-01-31'),
    completed: false,
    relatedSubjects: ['Mathematics'],
  },
  {
    id: 'm2',
    title: 'Weekly Review',
    description: 'Review all subjects from this week',
    targetDate: new Date('2024-01-14'),
    completed: true,
    completedAt: new Date('2024-01-14'),
  },
];

export const sampleStats: Stats = {
  totalXP: 2450,
  level: 7,
  currentStreak: 5,
  longestStreak: 12,
  totalStudyTime: 1840, // minutes
  lessonsCompleted: 30,
  dailyProgress: [
    { date: '2024-01-08', lessonsCompleted: 3, studyTime: 120 },
    { date: '2024-01-09', lessonsCompleted: 2, studyTime: 90 },
    { date: '2024-01-10', lessonsCompleted: 4, studyTime: 150 },
    { date: '2024-01-11', lessonsCompleted: 2, studyTime: 80 },
    { date: '2024-01-12', lessonsCompleted: 3, studyTime: 110 },
  ],
  weeklyProgress: [
    { week: '2024-W01', lessonsCompleted: 12, studyTime: 480 },
    { week: '2024-W02', lessonsCompleted: 14, studyTime: 550 },
  ],
  achievements: [
    {
      id: 'a1',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      unlockedAt: new Date('2024-01-01'),
      requirement: { type: 'lessons', target: 1 },
    },
    {
      id: 'a2',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      requirement: { type: 'streak', target: 7 },
    },
  ],
  lastActive: new Date(),
};

export const sampleAnalytics: AnalyticsData = {
  velocity: [
    { date: '2024-01-08', lessons: 3, avgTime: 40 },
    { date: '2024-01-09', lessons: 2, avgTime: 45 },
    { date: '2024-01-10', lessons: 4, avgTime: 38 },
    { date: '2024-01-11', lessons: 2, avgTime: 40 },
    { date: '2024-01-12', lessons: 3, avgTime: 37 },
  ],
  heatmap: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    intensity: Math.random() * 100,
  })),
  subjectBreakdown: [
    { subject: 'Mathematics', hours: 12, percentage: 35 },
    { subject: 'Physics', hours: 8, percentage: 23 },
    { subject: 'English', hours: 5, percentage: 15 },
    { subject: 'Chemistry', hours: 6, percentage: 17 },
    { subject: 'History', hours: 3.5, percentage: 10 },
  ],
  predictions: {
    estimatedFinishDate: new Date('2024-03-15'),
    projectedPace: 2.5,
    atRiskSubjects: ['Physics', 'Chemistry'],
  },
  insights: [
    {
      type: 'weakness',
      title: 'Physics needs attention',
      description: 'Your completion rate in Physics is 33%, below average.',
      priority: 1,
    },
    {
      type: 'strength',
      title: 'English is on track',
      description: 'You\'re 58% complete and ahead of schedule.',
      priority: 3,
    },
    {
      type: 'suggestion',
      title: 'Consider lighter days',
      description: 'Your cognitive load has been high. Try scheduling 2 lessons max tomorrow.',
      priority: 2,
    },
  ],
};

// ============================================
// ROUTE MAP
// ============================================

export const routes = {
  home: '/',
  schedule: '/schedule',
  focus: '/focus',
  analytics: '/analytics',
  roadmap: '/roadmap',
  insights: '/insights',
  settings: '/settings',
  auth: '/auth',
} as const;

export const routeConfig = [
  {
    path: routes.home,
    name: 'Dashboard',
    icon: 'Home',
    description: 'Overview of your study progress',
  },
  {
    path: routes.schedule,
    name: 'Schedule',
    icon: 'Calendar',
    description: 'Plan and manage your lessons',
  },
  {
    path: routes.focus,
    name: 'Focus',
    icon: 'Target',
    description: 'Distraction-free study mode',
  },
  {
    path: routes.analytics,
    name: 'Analytics',
    icon: 'BarChart3',
    description: 'Track your performance',
  },
  {
    path: routes.roadmap,
    name: 'Roadmap',
    icon: 'Map',
    description: 'Milestones and goals',
  },
  {
    path: routes.insights,
    name: 'Insights',
    icon: 'Lightbulb',
    description: 'AI-powered recommendations',
  },
  {
    path: routes.settings,
    name: 'Settings',
    icon: 'Settings',
    description: 'Configure your preferences',
  },
] as const;

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

export const keyboardShortcuts = {
  global: {
    'Cmd+K': 'Open command palette',
    'Cmd+/': 'Show keyboard shortcuts',
    'Escape': 'Close modal/dialog',
  },
  navigation: {
    'G then H': 'Go to Home',
    'G then S': 'Go to Schedule',
    'G then F': 'Go to Focus',
    'G then A': 'Go to Analytics',
    'G then R': 'Go to Roadmap',
    'G then I': 'Go to Insights',
  },
  schedule: {
    'N': 'New lesson',
    'D': 'New day',
    'E': 'Edit selected',
    'Delete': 'Delete selected',
    'Cmd+Z': 'Undo',
    'Cmd+Shift+Z': 'Redo',
  },
  focus: {
    'Space': 'Start/Pause timer',
    'R': 'Reset timer',
    'S': 'Skip break',
    'M': 'Toggle music',
  },
} as const;

// ============================================
// JSON EXPORT/IMPORT SCHEMA
// ============================================

export interface ExportData {
  version: string;
  exportedAt: string;
  user: {
    username: string;
    preferences: UserPreferences;
  };
  schedule: Day[];
  subjects: Subject[];
  sessions: StudySession[];
  exams: Exam[];
  milestones: Milestone[];
  stats: Stats;
}

export function exportToJSON(state: AppState): string {
  const exportData: ExportData = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    user: {
      username: state.user?.username || 'Unknown',
      preferences: state.user?.preferences || getDefaultPreferences(),
    },
    schedule: state.schedule,
    subjects: state.subjects,
    sessions: state.sessions,
    exams: state.exams,
    milestones: state.milestones,
    stats: state.stats,
  };

  return JSON.stringify(exportData, null, 2);
}

export function getDefaultPreferences(): UserPreferences {
  return {
    theme: 'dark',
    reducedMotion: false,
    maxLessonsPerDay: 3,
    defaultSessionLength: 25,
    notifications: true,
    weekStartsOn: 1,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}
