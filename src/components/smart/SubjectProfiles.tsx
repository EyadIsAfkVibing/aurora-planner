import { motion } from 'framer-motion';
import { 
  BookOpen, TrendingUp, Clock, Target, 
  ChevronRight, Zap, AlertTriangle, CheckCircle2
} from 'lucide-react';
import type { SubjectProfile } from '@/hooks/useIntelligentSchedule';

interface SubjectProfilesProps {
  profiles: SubjectProfile[];
}

const difficultyColors = {
  easy: { bg: 'bg-aurora-emerald/20', text: 'text-aurora-emerald', border: 'border-aurora-emerald/30' },
  medium: { bg: 'bg-amber-400/20', text: 'text-amber-400', border: 'border-amber-400/30' },
  hard: { bg: 'bg-destructive/20', text: 'text-destructive', border: 'border-destructive/30' },
};

const subjectIcons: Record<string, typeof BookOpen> = {
  science: Zap,
  algebra: Target,
  trigonometry: TrendingUp,
  geometry: BookOpen,
  arabic: BookOpen,
  history: Clock,
};

export const SubjectProfiles = ({ profiles }: SubjectProfilesProps) => {
  return (
    <div className="space-y-3">
      {profiles.map((profile, index) => {
        const colors = difficultyColors[profile.difficulty];
        const Icon = subjectIcons[profile.name.toLowerCase()] || BookOpen;
        const isLow = profile.progress < 30;
        const isComplete = profile.progress === 100;

        return (
          <motion.div
            key={profile.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`glass-card p-4 rounded-xl relative overflow-hidden group cursor-pointer
              hover:border-white/20 transition-all duration-300 ${
              isLow ? 'border-destructive/30' : isComplete ? 'border-aurora-emerald/30' : ''
            }`}
          >
            {/* Background glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative flex items-center gap-4">
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
                {isComplete ? (
                  <CheckCircle2 className="w-6 h-6 text-aurora-emerald" />
                ) : isLow ? (
                  <AlertTriangle className="w-6 h-6 text-destructive animate-pulse" />
                ) : (
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground truncate">{profile.name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-medium ${colors.bg} ${colors.text}`}>
                    {profile.difficulty}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${profile.progress}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + index * 0.05 }}
                    className={`h-full rounded-full ${
                      isComplete ? 'bg-aurora-emerald' :
                      isLow ? 'bg-destructive' :
                      'bg-gradient-to-r from-primary to-accent'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span>{profile.completedLessons}/{profile.totalLessons} lessons</span>
                  <span>•</span>
                  <span>~{profile.avgTimePerLesson}min each</span>
                  {profile.estimatedCompletionDays > 0 && (
                    <>
                      <span>•</span>
                      <span>{profile.estimatedCompletionDays}d left</span>
                    </>
                  )}
                </div>
              </div>

              {/* Progress % */}
              <div className="text-right shrink-0">
                <p className={`text-xl font-bold ${
                  isComplete ? 'text-aurora-emerald' :
                  isLow ? 'text-destructive' :
                  'text-foreground'
                }`}>
                  {profile.progress}%
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {isComplete ? 'Complete!' : `${profile.remainingLessons} to go`}
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </div>

            {/* Cognitive load indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(profile.cognitiveLoad / 10) * 100}%` }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                className={`h-full ${
                  profile.cognitiveLoad >= 8 ? 'bg-destructive' :
                  profile.cognitiveLoad >= 6 ? 'bg-amber-400' :
                  'bg-aurora-emerald'
                }`}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
