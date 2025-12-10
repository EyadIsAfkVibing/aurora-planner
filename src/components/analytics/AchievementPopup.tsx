import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Achievement } from '@/hooks/useStudyStats';

interface AchievementPopupProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export const AchievementPopup = ({ achievement, onDismiss }: AchievementPopupProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      
      // Generate celebration particles
      const colors = ['#fbbf24', '#f59e0b', '#eab308', '#facc15', '#fcd34d'];
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setParticles(newParticles);
      
      // Auto dismiss after 5 seconds
      const timeout = setTimeout(() => {
        handleClose();
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [achievement]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  if (!achievement) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      
      {/* Popup */}
      <div
        className={`relative bg-gradient-to-br from-amber-900/90 to-orange-900/90 backdrop-blur-xl border border-amber-400/30 rounded-3xl p-8 max-w-sm w-full shadow-[0_0_100px_rgba(251,191,36,0.3)] transition-all duration-500 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-10'
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 text-amber-200" />
        </button>
        
        {/* Celebration particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute top-1/3 left-1/2 w-2 h-2 rounded-full animate-particle-spray"
            style={{
              backgroundColor: particle.color,
              '--tx': `${particle.x}px`,
              '--ty': `${particle.y}px`,
            } as React.CSSProperties}
          />
        ))}
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.5)] animate-bounce">
              <span className="text-5xl">{achievement.icon}</span>
            </div>
            {/* Rotating ring */}
            <div className="absolute inset-[-8px] border-2 border-dashed border-amber-400/50 rounded-3xl animate-spin-slow" />
          </div>
        </div>
        
        {/* Content */}
        <div className="text-center space-y-2">
          <p className="text-amber-200 text-sm uppercase tracking-widest font-medium">Achievement Unlocked!</p>
          <h3 className="text-2xl font-bold text-foreground">{achievement.name}</h3>
          <p className="text-amber-200/80 text-sm">{achievement.description}</p>
        </div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer rounded-3xl overflow-hidden pointer-events-none" />
      </div>
    </div>
  );
};
