interface LoadingOverlayProps {
  isLoading: boolean;
}

export const LoadingOverlay = ({ isLoading }: LoadingOverlayProps) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md transition-opacity duration-300 ease-linear">
      <div className="w-96 h-96 relative flex items-center justify-center">
        {/* Outer Ring - Pulse */}
        <div className="absolute inset-0 border-4 border-primary/50 rounded-full animate-pulse-slow opacity-0 animate-in fade-in zoom-in duration-500" />

        {/* Core - Warp Effect */}
        <div className="w-16 h-16 rounded-full bg-primary shadow-[0_0_80px_hsl(var(--primary))] animate-expand-warp" />

        {/* Text */}
        <div className="absolute bottom-[-100px] text-lg font-mono tracking-widest text-primary/80 animate-slide-up-slow">
          INITIATING PROTOCOL...
        </div>
      </div>
    </div>
  );
};
