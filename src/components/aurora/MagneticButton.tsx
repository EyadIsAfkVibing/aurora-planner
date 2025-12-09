import { useRef, useState, ReactNode, ButtonHTMLAttributes } from 'react';

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const MagneticButton = ({ children, className = '', ...props }: MagneticButtonProps) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) * 0.2;
    const y = (e.clientY - (top + height / 2)) * 0.2;
    setPos({ x, y });
  };

  const handleLeave = () => setPos({ x: 0, y: 0 });

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      className={`transition-transform duration-100 ease-out ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
