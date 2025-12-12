import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';

interface ParallaxElement {
  id: number;
  x: number;
  y: number;
  size: number;
  depth: number;
  type: 'orb' | 'ring' | 'line' | 'dot';
  color: string;
  rotation: number;
}

interface ParallaxItemProps {
  element: ParallaxElement;
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
}

const ParallaxItem = ({ element, smoothX, smoothY }: ParallaxItemProps) => {
  const offsetX = useTransform(smoothX, [0, 1], [-50 * element.depth, 50 * element.depth]);
  const offsetY = useTransform(smoothY, [0, 1], [-50 * element.depth, 50 * element.depth]);

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${element.x}%`,
        top: `${element.y}%`,
        x: offsetX,
        y: offsetY,
      }}
    >
      {element.type === 'orb' && (
        <motion.div
          className="rounded-full blur-xl"
          style={{
            width: element.size,
            height: element.size,
            background: `radial-gradient(circle, ${element.color}40 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4 + element.depth * 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
      
      {element.type === 'ring' && (
        <motion.div
          className="border rounded-full"
          style={{
            width: element.size,
            height: element.size,
            borderColor: `${element.color}30`,
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 20 / element.depth, repeat: Infinity, ease: 'linear' },
            scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      )}
      
      {element.type === 'line' && (
        <motion.div
          className="h-px"
          style={{
            width: element.size * 2,
            background: `linear-gradient(90deg, transparent, ${element.color}40, transparent)`,
            transform: `rotate(${element.rotation}deg)`,
          }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scaleX: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
      
      {element.type === 'dot' && (
        <motion.div
          className="rounded-full"
          style={{
            width: element.size / 4,
            height: element.size / 4,
            background: element.color,
            boxShadow: `0 0 ${element.size / 2}px ${element.color}`,
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.div>
  );
};

export const ParallaxLayer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useState<ParallaxElement[]>([]);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const smoothX = useSpring(mouseX, { stiffness: 30, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 30, damping: 30 });

  useEffect(() => {
    const colors = [
      'hsl(var(--primary))',
      'hsl(var(--accent))',
      'hsl(var(--aurora-cyan))',
      'hsl(var(--aurora-emerald))',
    ];

    const newElements: ParallaxElement[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 20,
      depth: Math.random() * 0.8 + 0.1,
      type: (['orb', 'ring', 'line', 'dot'] as const)[Math.floor(Math.random() * 4)],
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
    }));
    
    setElements(newElements);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((element) => (
        <ParallaxItem
          key={element.id}
          element={element}
          smoothX={smoothX}
          smoothY={smoothY}
        />
      ))}

      {/* Animated gradient waves */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, hsl(var(--accent) / 0.1) 0%, transparent 50%)
          `,
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Vaporwave/aura effect */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/3"
        style={{
          background: 'linear-gradient(to top, hsl(var(--primary) / 0.05), transparent)',
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};
