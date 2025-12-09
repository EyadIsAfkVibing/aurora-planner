import { useState, useEffect } from 'react';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { useSchedule } from '@/hooks/useSchedule';
import { AuroraBackground } from '@/components/aurora/AuroraBackground';
import { LoadingOverlay } from '@/components/aurora/LoadingOverlay';
import { AuthPage } from '@/components/auth/AuthPage';
import { Dashboard } from '@/components/dashboard/Dashboard';

const Index = () => {
  const { user, isLoading: authLoading, signIn, signUp, signOut } = useLocalAuth();
  const {
    schedule,
    subjects,
    isLoaded,
    stats,
    initializeSchedule,
    toggleLesson,
    deleteLesson,
    addLesson,
    deleteDay,
    addDay,
    updateSubjects,
    resetSchedule,
  } = useSchedule(user?.username || null);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [viewState, setViewState] = useState<'auth' | 'transitioning' | 'dashboard'>('auth');

  // Handle auth state changes with transition
  useEffect(() => {
    if (user && isLoaded) {
      // Initialize schedule if empty
      if (schedule.length === 0) {
        initializeSchedule();
      }
      // Show dashboard after data loads
      setShowDashboard(true);
      setViewState('dashboard');
    } else if (!user) {
      setShowDashboard(false);
      setViewState('auth');
    }
  }, [user, isLoaded, schedule.length, initializeSchedule]);

  const handleSignIn = (username: string, password: string) => {
    const result = signIn(username, password);
    
    if (result.success) {
      setIsTransitioning(true);
      setViewState('transitioning');
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1400);
    }
    
    return result;
  };

  const handleSignUp = (username: string, password: string) => {
    const result = signUp(username, password);
    
    if (result.success) {
      setIsTransitioning(true);
      setViewState('transitioning');
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1400);
    }
    
    return result;
  };

  const handleLogout = () => {
    setIsTransitioning(true);
    setViewState('transitioning');
    setTimeout(() => {
      signOut();
      setIsTransitioning(false);
    }, 800);
  };

  if (authLoading) {
    return (
      <div className="relative w-full min-h-screen overflow-hidden bg-background">
        <AuroraBackground variant="login" />
        <LoadingOverlay isLoading={true} />
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-background">
      {/* Background Layer */}
      <AuroraBackground variant={showDashboard ? 'dashboard' : 'login'} />

      {/* Cinematic Loading Overlay */}
      <LoadingOverlay isLoading={isTransitioning} />

      {/* Auth View with exit animation */}
      <div
        className={`absolute inset-0 z-10 transition-all duration-500 ease-out ${
          showDashboard && !isTransitioning
            ? 'opacity-0 scale-110 blur-xl pointer-events-none'
            : 'opacity-100 scale-100 blur-0'
        }`}
      >
        <AuthPage onSignIn={handleSignIn} onSignUp={handleSignUp} />
      </div>

      {/* Dashboard View with entrance animation */}
      <div
        className={`absolute inset-0 z-20 transition-all duration-500 ease-out ${
          showDashboard && !isTransitioning
            ? 'opacity-100 scale-100 blur-0'
            : 'opacity-0 scale-95 blur-xl pointer-events-none'
        }`}
      >
        {user && (
          <Dashboard
            username={user.username}
            schedule={schedule}
            subjects={subjects}
            stats={stats}
            onLogout={handleLogout}
            onToggleLesson={toggleLesson}
            onDeleteLesson={deleteLesson}
            onAddLesson={addLesson}
            onDeleteDay={deleteDay}
            onAddDay={addDay}
            onUpdateSubjects={updateSubjects}
            onResetSchedule={resetSchedule}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
