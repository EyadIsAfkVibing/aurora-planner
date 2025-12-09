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

  // Handle auth state changes with transition
  useEffect(() => {
    if (user && isLoaded) {
      // Initialize schedule if empty
      if (schedule.length === 0) {
        initializeSchedule();
      }
      // Show dashboard after data loads
      setShowDashboard(true);
    } else if (!user) {
      setShowDashboard(false);
    }
  }, [user, isLoaded, schedule.length, initializeSchedule]);

  const handleSignIn = (username: string, password: string) => {
    setIsTransitioning(true);
    const result = signIn(username, password);
    
    if (result.success) {
      setTimeout(() => setIsTransitioning(false), 1200);
    } else {
      setIsTransitioning(false);
    }
    
    return result;
  };

  const handleSignUp = (username: string, password: string) => {
    setIsTransitioning(true);
    const result = signUp(username, password);
    
    if (result.success) {
      setTimeout(() => setIsTransitioning(false), 1200);
    } else {
      setIsTransitioning(false);
    }
    
    return result;
  };

  const handleLogout = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      signOut();
      setIsTransitioning(false);
    }, 400);
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

      {/* Auth View */}
      <div
        className={`absolute inset-0 z-10 transition-all duration-300 ${
          showDashboard && !isTransitioning
            ? 'opacity-0 -translate-y-20 blur-lg pointer-events-none'
            : 'opacity-100 translate-y-0 blur-0'
        }`}
      >
        <AuthPage onSignIn={handleSignIn} onSignUp={handleSignUp} />
      </div>

      {/* Dashboard View */}
      <div
        className={`absolute inset-0 z-20 transition-all duration-300 ${
          showDashboard && !isTransitioning
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-20 pointer-events-none'
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
