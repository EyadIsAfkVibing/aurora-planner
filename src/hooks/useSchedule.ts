import { useState, useEffect, useCallback } from 'react';

export interface Lesson {
  id: string;
  subject: string;
  completed: boolean;
}

export interface Day {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface SubjectConfig {
  [subject: string]: number;
}

const DEFAULT_SUBJECTS: SubjectConfig = {
  Science: 7,
  Algebra: 2,
  Trigonometry: 3,
  Geometry: 3,
  Arabic: 8,
  History: 6,
};

const SCHEDULE_KEY = (username: string) => `gemini_schedule_${username}`;
const SUBJECTS_KEY = (username: string) => `gemini_subjects_${username}`;

const generateId = () => Math.random().toString(36).substr(2, 9);

const generateSchedule = (subjects: SubjectConfig): Day[] => {
  const pool: Lesson[] = [];
  
  Object.entries(subjects).forEach(([subject, count]) => {
    for (let i = 0; i < count; i++) {
      pool.push({ id: generateId(), subject, completed: false });
    }
  });

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const days: Day[] = [];
  let dayCount = 1;
  
  while (pool.length > 0) {
    const take = Math.min(Math.floor(Math.random() * 2) + 2, pool.length);
    days.push({
      id: `day-${dayCount}`,
      title: `Day ${dayCount}`,
      lessons: pool.splice(0, take),
    });
    dayCount++;
  }

  return days;
};

export function useSchedule(username: string | null) {
  const [schedule, setSchedule] = useState<Day[]>([]);
  const [subjects, setSubjects] = useState<SubjectConfig>(DEFAULT_SUBJECTS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load schedule and subjects from localStorage
  useEffect(() => {
    if (!username) {
      setSchedule([]);
      setSubjects(DEFAULT_SUBJECTS);
      setIsLoaded(false);
      return;
    }

    const storedSchedule = localStorage.getItem(SCHEDULE_KEY(username));
    const storedSubjects = localStorage.getItem(SUBJECTS_KEY(username));

    if (storedSubjects) {
      try {
        setSubjects(JSON.parse(storedSubjects));
      } catch {
        setSubjects(DEFAULT_SUBJECTS);
      }
    }

    if (storedSchedule) {
      try {
        setSchedule(JSON.parse(storedSchedule));
      } catch {
        setSchedule([]);
      }
    }

    setIsLoaded(true);
  }, [username]);

  // Save schedule to localStorage
  useEffect(() => {
    if (!username || !isLoaded) return;
    localStorage.setItem(SCHEDULE_KEY(username), JSON.stringify(schedule));
  }, [schedule, username, isLoaded]);

  // Save subjects to localStorage
  useEffect(() => {
    if (!username || !isLoaded) return;
    localStorage.setItem(SUBJECTS_KEY(username), JSON.stringify(subjects));
  }, [subjects, username, isLoaded]);

  const initializeSchedule = useCallback(() => {
    if (!username) return;
    const newSchedule = generateSchedule(subjects);
    setSchedule(newSchedule);
  }, [subjects, username]);

  const toggleLesson = useCallback((dayId: string, lessonId: string) => {
    setSchedule(prev =>
      prev.map(day =>
        day.id !== dayId
          ? day
          : {
              ...day,
              lessons: day.lessons.map(lesson =>
                lesson.id === lessonId ? { ...lesson, completed: !lesson.completed } : lesson
              ),
            }
      )
    );
  }, []);

  const deleteLesson = useCallback((dayId: string, lessonId: string) => {
    setSchedule(prev =>
      prev.map(day =>
        day.id !== dayId
          ? day
          : { ...day, lessons: day.lessons.filter(l => l.id !== lessonId) }
      )
    );
  }, []);

  const addLesson = useCallback((dayId: string, subject: string) => {
    setSchedule(prev =>
      prev.map(day =>
        day.id !== dayId
          ? day
          : {
              ...day,
              lessons: [...day.lessons, { id: generateId(), subject, completed: false }],
            }
      )
    );
  }, []);

  const deleteDay = useCallback((dayId: string) => {
    setSchedule(prev => prev.filter(d => d.id !== dayId));
  }, []);

  const addDay = useCallback(() => {
    setSchedule(prev => [
      ...prev,
      { id: `custom-${Date.now()}`, title: `Day ${prev.length + 1}`, lessons: [] },
    ]);
  }, []);

  const updateSubjects = useCallback((newSubjects: SubjectConfig) => {
    setSubjects(newSubjects);
  }, []);

  const resetSchedule = useCallback(() => {
    const newSchedule = generateSchedule(subjects);
    setSchedule(newSchedule);
  }, [subjects]);

  // Stats
  const total = schedule.reduce((acc, d) => acc + d.lessons.length, 0);
  const completed = schedule.reduce((acc, d) => acc + d.lessons.filter(l => l.completed).length, 0);
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    schedule,
    subjects,
    isLoaded,
    stats: { total, completed, percent },
    initializeSchedule,
    toggleLesson,
    deleteLesson,
    addLesson,
    deleteDay,
    addDay,
    updateSubjects,
    resetSchedule,
  };
}
