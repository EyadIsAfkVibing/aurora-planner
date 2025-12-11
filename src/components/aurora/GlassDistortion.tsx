import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface GlassDistortionProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export const GlassDistortion = ({ 
  children, 
  className = '', 
  intensity = 1 
}: GlassDistortionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      mouseX.set(x * 10 * intensity);
      mouseY.set(y * 10 * intensity);
    };

    const element = ref.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', () => {
        mouseX.set(0);
        mouseY.set(0);
      });
    }

    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [mouseX, mouseY, intensity]);

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      <motion.div
        style={{
          rotateX: springY,
          rotateY: springX,
        }}
        className="relative"
      >
        {/* Glass texture overlay */}
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none z-10 opacity-30"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(255,255,255,0.1) 0%, 
                transparent 50%, 
                rgba(255,255,255,0.05) 100%
              )
            `,
          }}
        />
        
        {/* Subtle distortion effect */}
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none z-10"
          style={{
            background: `
              radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
                rgba(255,255,255,0.1) 0%, 
                transparent 50%
              )
            `,
            mixBlendMode: 'overlay',
          }}
        />

        {children}
      </motion.div>
    </motion.div>
  );
};
