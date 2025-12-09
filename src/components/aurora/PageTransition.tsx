import { useEffect, useState } from 'react';

interface PageTransitionProps {
  isActive: boolean;
  direction?: 'in' | 'out';
}

export const PageTransition = ({ isActive, direction = 'in' }: PageTransitionProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {/* Warp Lines */}
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-[2px] bg-gradient-to-b from-transparent via-primary to-transparent animate-warp-line"
            style={{
              height: '200vh',
              left: `${8 + i * 8}%`,
              animationDelay: `${i * 0.05}s`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Central Vortex */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-96 h-96">
          {/* Outer rings */}
          {[1, 2, 3].map((ring) => (
            <div
              key={ring}
              className="absolute inset-0 border-2 border-primary/30 rounded-full animate-vortex-ring"
              style={{
                animationDelay: `${ring * 0.1}s`,
                transform: `scale(${0.3 + ring * 0.3})`,
              }}
            />
          ))}
          
          {/* Core burst */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-primary rounded-full animate-core-burst shadow-[0_0_60px_30px_hsl(var(--primary)/0.8)]" />
          </div>
        </div>
      </div>

      {/* Particle spray */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-primary rounded-full animate-particle-spray"
          style={{
            left: '50%',
            top: '50%',
            '--tx': `${(particle.x - 50) * 20}px`,
            '--ty': `${(particle.y - 50) * 20}px`,
            animationDelay: `${particle.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Radial wipe */}
      <div className="absolute inset-0 bg-background animate-radial-wipe" />

      {/* Scanlines overlay */}
      <div className="absolute inset-0 bg-scanlines opacity-10 animate-scanlines-move" />
    </div>
  );
};
