import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface NeonOutlineProps {
  children: ReactNode;
  color?: 'primary' | 'accent' | 'emerald' | 'cyan';
  className?: string;
  animated?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

export const NeonOutline = ({ 
  children, 
  color = 'primary', 
  className = '',
  animated = true,
  intensity = 'medium',
}: NeonOutlineProps) => {
  const colorMap = {
    primary: 'hsl(var(--primary))',
    accent: 'hsl(var(--accent))',
    emerald: 'hsl(var(--aurora-emerald))',
    cyan: 'hsl(var(--aurora-cyan))',
  };

  const intensityMap = {
    low: { blur: '10px', spread: '2px', opacity: 0.3 },
    medium: { blur: '20px', spread: '4px', opacity: 0.5 },
    high: { blur: '30px', spread: '6px', opacity: 0.7 },
  };

  const neonColor = colorMap[color];
  const { blur, spread, opacity } = intensityMap[intensity];

  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={animated ? { scale: 1.02 } : undefined}
      transition={{ duration: 0.3 }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute -inset-[1px] rounded-2xl pointer-events-none"
        style={{
          boxShadow: `
            0 0 ${blur} ${neonColor}${Math.round(opacity * 100).toString(16).padStart(2, '0')},
            inset 0 0 ${spread} ${neonColor}${Math.round(opacity * 50).toString(16).padStart(2, '0')}
          `,
        }}
        animate={animated ? {
          boxShadow: [
            `0 0 ${blur} ${neonColor}${Math.round(opacity * 100).toString(16).padStart(2, '0')}, inset 0 0 ${spread} ${neonColor}${Math.round(opacity * 50).toString(16).padStart(2, '0')}`,
            `0 0 ${parseInt(blur) * 1.5}px ${neonColor}${Math.round(opacity * 130).toString(16).padStart(2, '0')}, inset 0 0 ${parseInt(spread) * 1.5}px ${neonColor}${Math.round(opacity * 70).toString(16).padStart(2, '0')}`,
            `0 0 ${blur} ${neonColor}${Math.round(opacity * 100).toString(16).padStart(2, '0')}, inset 0 0 ${spread} ${neonColor}${Math.round(opacity * 50).toString(16).padStart(2, '0')}`,
          ],
        } : undefined}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Border */}
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          border: `1px solid ${neonColor}40`,
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-full h-[1px]"
          style={{ background: `linear-gradient(90deg, ${neonColor}, transparent)` }}
        />
        <div 
          className="absolute top-0 left-0 w-[1px] h-full"
          style={{ background: `linear-gradient(180deg, ${neonColor}, transparent)` }}
        />
      </div>
      <div className="absolute top-0 right-0 w-4 h-4 pointer-events-none">
        <div 
          className="absolute top-0 right-0 w-full h-[1px]"
          style={{ background: `linear-gradient(270deg, ${neonColor}, transparent)` }}
        />
        <div 
          className="absolute top-0 right-0 w-[1px] h-full"
          style={{ background: `linear-gradient(180deg, ${neonColor}, transparent)` }}
        />
      </div>
      <div className="absolute bottom-0 left-0 w-4 h-4 pointer-events-none">
        <div 
          className="absolute bottom-0 left-0 w-full h-[1px]"
          style={{ background: `linear-gradient(90deg, ${neonColor}, transparent)` }}
        />
        <div 
          className="absolute bottom-0 left-0 w-[1px] h-full"
          style={{ background: `linear-gradient(0deg, ${neonColor}, transparent)` }}
        />
      </div>
      <div className="absolute bottom-0 right-0 w-4 h-4 pointer-events-none">
        <div 
          className="absolute bottom-0 right-0 w-full h-[1px]"
          style={{ background: `linear-gradient(270deg, ${neonColor}, transparent)` }}
        />
        <div 
          className="absolute bottom-0 right-0 w-[1px] h-full"
          style={{ background: `linear-gradient(0deg, ${neonColor}, transparent)` }}
        />
      </div>

      {children}
    </motion.div>
  );
};
