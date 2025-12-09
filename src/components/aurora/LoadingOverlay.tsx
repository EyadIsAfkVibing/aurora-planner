import { useEffect, useState } from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  delay: number;
  size: number;
}

export const LoadingOverlay = ({ isLoading }: LoadingOverlayProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [phase, setPhase] = useState<'idle' | 'charging' | 'burst' | 'wipe'>('idle');

  useEffect(() => {
    if (isLoading) {
      // Generate particles
      const newParticles = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: 50,
        y: 50,
        tx: (Math.random() - 0.5) * 200,
        ty: (Math.random() - 0.5) * 200,
        delay: Math.random() * 0.3,
        size: Math.random() * 4 + 2,
      }));
      setParticles(newParticles);

      // Animation phases
      setPhase('charging');
      setTimeout(() => setPhase('burst'), 300);
      setTimeout(() => setPhase('wipe'), 700);
    } else {
      setPhase('idle');
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Dark backdrop */}
      <div className="absolute inset-0 bg-background/95 backdrop-blur-md" />

      {/* Warp speed lines */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-[200vh] w-[2px] bg-gradient-to-b from-transparent via-primary/60 to-transparent"
            style={{
              left: `${5 + i * 5}%`,
              transform: phase === 'burst' ? 'scaleY(1) translateY(0)' : 'scaleY(0) translateY(-100%)',
              transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.02}s`,
              opacity: phase === 'wipe' ? 0 : 0.7,
            }}
          />
        ))}
      </div>

      {/* Central vortex */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-96 h-96">
          {/* Rotating rings */}
          {[1, 2, 3, 4].map((ring) => (
            <div
              key={ring}
              className="absolute inset-0 border-2 rounded-full transition-all duration-700"
              style={{
                borderColor: `hsl(var(--primary) / ${0.2 + ring * 0.1})`,
                transform: phase === 'charging' 
                  ? `scale(${0.2 + ring * 0.15}) rotate(${ring * 45}deg)` 
                  : phase === 'burst'
                  ? `scale(${2 + ring * 0.5}) rotate(${ring * 90 + 180}deg)`
                  : `scale(${0.1}) rotate(0deg)`,
                opacity: phase === 'wipe' ? 0 : 1,
                transitionDelay: `${ring * 0.05}s`,
              }}
            />
          ))}

          {/* Morphing core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`bg-primary rounded-full transition-all duration-500 ${
                phase === 'charging' ? 'w-12 h-12 animate-morph' : 
                phase === 'burst' ? 'w-[800px] h-[800px]' : 'w-4 h-4'
              }`}
              style={{
                boxShadow: phase === 'burst' 
                  ? '0 0 200px 100px hsl(var(--primary) / 0.8)' 
                  : '0 0 60px 30px hsl(var(--primary) / 0.5)',
                opacity: phase === 'wipe' ? 0 : 1,
              }}
            />
          </div>

          {/* Inner glow */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-500"
            style={{
              opacity: phase === 'wipe' ? 0 : 1,
            }}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-primary via-accent to-aurora-cyan rounded-full blur-xl animate-pulse-slow" />
          </div>
        </div>
      </div>

      {/* Particle burst */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-primary transition-all duration-700"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: '50%',
              top: '50%',
              transform: phase === 'burst' 
                ? `translate(calc(-50% + ${particle.tx}vw), calc(-50% + ${particle.ty}vh)) scale(0)`
                : 'translate(-50%, -50%) scale(1)',
              opacity: phase === 'wipe' ? 0 : phase === 'burst' ? 1 : 0.5,
              transitionDelay: `${particle.delay}s`,
              boxShadow: `0 0 ${particle.size * 2}px hsl(var(--primary))`,
            }}
          />
        ))}
      </div>

      {/* Scanlines */}
      <div 
        className="absolute inset-0 bg-scanlines transition-opacity duration-300"
        style={{ opacity: phase === 'wipe' ? 0 : 0.05 }}
      />

      {/* Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="absolute mt-64 font-mono tracking-[0.3em] text-primary/80 transition-all duration-500"
          style={{
            transform: phase === 'charging' ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
            opacity: phase === 'charging' ? 1 : 0,
          }}
        >
          <span className="animate-text-glow">INITIATING PROTOCOL</span>
          <span className="inline-block animate-pulse ml-1">_</span>
        </div>
      </div>

      {/* Radial wipe overlay */}
      <div
        className="absolute inset-0 bg-background transition-all duration-700"
        style={{
          clipPath: phase === 'wipe' 
            ? 'circle(0% at 50% 50%)' 
            : 'circle(150% at 50% 50%)',
          opacity: phase === 'wipe' ? 0 : 1,
        }}
      />
    </div>
  );
};
