import { Achievement } from '@/hooks/useStudyStats';
import { Lock } from 'lucide-react';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
}

export const AchievementBadge = ({ achievement, size = 'md' }: AchievementBadgeProps) => {
  const isUnlocked = !!achievement.unlockedAt;
  
  const sizes = {
    sm: { container: 'w-12 h-12', icon: 'text-xl', text: 'text-[8px]' },
    md: { container: 'w-16 h-16', icon: 'text-2xl', text: 'text-[10px]' },
    lg: { container: 'w-20 h-20', icon: 'text-3xl', text: 'text-xs' },
  };

  return (
    <div className="flex flex-col items-center gap-2 group">
      <div
        className={`${sizes[size].container} relative rounded-xl flex items-center justify-center transition-all duration-300 ${
          isUnlocked
            ? 'bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/30 shadow-[0_0_20px_hsl(38_92%_50%/0.3)] group-hover:shadow-[0_0_30px_hsl(38_92%_50%/0.5)] group-hover:scale-110'
            : 'bg-white/5 border border-white/10 opacity-50 group-hover:opacity-70'
        }`}
      >
        {isUnlocked ? (
          <>
            <span className={sizes[size].icon}>{achievement.icon}</span>
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl overflow-hidden" />
          </>
        ) : (
          <Lock className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
      
      <div className="text-center">
        <p className={`${sizes[size].text} font-medium ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
          {achievement.name}
        </p>
      </div>
    </div>
  );
};
