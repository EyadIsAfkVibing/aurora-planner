import { ReactNode, useRef, useState } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const AnimatedCard = ({ children, className = '', delay = 0 }: AnimatedCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group ${className}`}
      style={{
        animationDelay: `${delay}s`,
      }}
    >
      {/* Spotlight effect */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: isHovered
            ? `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, hsl(var(--primary) / 0.15), transparent 40%)`
            : 'none',
        }}
      />

      {/* Border glow */}
      <div
        className="absolute -inset-[1px] rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
        style={{
          background: isHovered
            ? `radial-gradient(400px circle at ${mousePos.x}% ${mousePos.y}%, hsl(var(--primary) / 0.4), transparent 40%)`
            : 'none',
        }}
      />

      {/* Card content */}
      <div className="relative z-10">{children}</div>

      {/* Corner accents on hover */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary/0 group-hover:border-primary/50 rounded-tl-3xl transition-all duration-300 group-hover:w-12 group-hover:h-12" />
      <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary/0 group-hover:border-primary/50 rounded-tr-3xl transition-all duration-300 group-hover:w-12 group-hover:h-12" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary/0 group-hover:border-primary/50 rounded-bl-3xl transition-all duration-300 group-hover:w-12 group-hover:h-12" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary/0 group-hover:border-primary/50 rounded-br-3xl transition-all duration-300 group-hover:w-12 group-hover:h-12" />
    </div>
  );
};
