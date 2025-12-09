interface AuroraBackgroundProps {
  variant?: 'login' | 'dashboard';
}

export const AuroraBackground = ({ variant = 'login' }: AuroraBackgroundProps) => {
  const isDashboard = variant === 'dashboard';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base Gradient */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-[#0a0a0f] to-background opacity-90" />

      {/* Animated Orbs */}
      <div
        className={`absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-primary/30 rounded-full blur-[120px] mix-blend-screen transition-all duration-[3000ms] ease-in-out ${
          isDashboard ? 'translate-x-[-20%] translate-y-[10%] opacity-40' : 'animate-blob'
        }`}
      />
      <div
        className={`absolute top-[10%] right-[-10%] w-[50vw] h-[50vw] bg-accent/20 rounded-full blur-[100px] mix-blend-screen transition-all duration-[3000ms] ease-in-out animation-delay-2000 ${
          isDashboard ? 'translate-x-[20%] translate-y-[-10%] opacity-40' : 'animate-blob'
        }`}
      />
      <div
        className={`absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-aurora-cyan/20 rounded-full blur-[130px] mix-blend-screen transition-all duration-[3000ms] ease-in-out animation-delay-4000 ${
          isDashboard ? 'opacity-20' : 'animate-blob'
        }`}
      />

      {/* Noise Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
    </div>
  );
};
