import { useState } from 'react';
import { Activity, LayoutDashboard, Zap, PieChart, Power, Settings, Star } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MagneticButton } from './MagneticButton';

interface FloatingNavProps {
  username: string;
  percent: number;
  level: number;
  xp: number;
  onLogout: () => void;
  onOpenSettings: () => void;
}

export const FloatingNav = ({
  username,
  percent,
  level,
  xp,
  onLogout,
  onOpenSettings,
}: FloatingNavProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'overview', path: '/', icon: LayoutDashboard, label: 'Overview' },
    { id: 'focus', path: '/focus', icon: Zap, label: 'Focus' },
    { id: 'analytics', path: '/analytics', icon: PieChart, label: 'Analytics' },
  ];

  const activeTab = tabs.find(tab => tab.path === location.pathname)?.id || 'overview';

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <div
        className="relative w-full max-w-4xl nav-capsule p-2 flex items-center justify-between overflow-hidden group animate-slide-up"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ animationDelay: '0.2s' }}
      >
        {/* Holographic Scan Effect */}
        <div className="absolute top-0 bottom-0 w-[50px] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-scan pointer-events-none" />

        {/* Edge glow on hover */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-500 pointer-events-none ${
            isHovered ? 'shadow-[inset_0_0_30px_hsl(var(--primary)/0.2)]' : ''
          }`}
        />

        {/* Left: User Identity with Level */}
        <div className="flex items-center gap-3 pl-2">
          <div className="relative">
            {/* Avatar with rotating ring */}
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent p-[1px] animate-spin-slow-reverse group-hover:animate-none group-hover:scale-110 transition-transform duration-300">
              <div className="w-full h-full rounded-full bg-background/80 flex items-center justify-center backdrop-blur-sm relative overflow-hidden">
                <span className="font-bold text-sm text-foreground relative z-10">
                  {username.charAt(0).toUpperCase()}
                </span>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            
            {/* Level badge */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_10px_rgba(251,191,36,0.5)]">
              {level}
            </div>
          </div>

          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-bold text-foreground tracking-wider group-hover:animate-text-glow">
              {username.toUpperCase()}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400" />
              {xp.toLocaleString()} XP
            </span>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <div className="hidden md:flex relative bg-white/5 rounded-full p-1 border border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.path)}
              className={`relative z-10 px-4 py-2 text-xs font-medium transition-all duration-300 flex items-center gap-2 rounded-full ${
                activeTab === tab.id
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground/80'
              }`}
            >
              <tab.icon
                className={`w-3.5 h-3.5 transition-all duration-300 ${
                  activeTab === tab.id ? 'scale-110' : ''
                }`}
              />
              <span className="relative">
                {tab.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-[2px] bg-primary transition-all duration-300 ${
                    activeTab === tab.id ? 'w-full' : 'w-0'
                  }`}
                />
              </span>
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-primary/80 rounded-full -z-10 animate-slide-in shadow-[0_0_20px_hsl(var(--primary)/0.5)]" />
              )}
            </button>
          ))}
        </div>

        {/* Right: Sync Rate & Actions */}
        <div className="flex items-center gap-3 pr-2">
          {/* Sync Rate Gauge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background/40 rounded-full border border-white/10 group-hover:border-aurora-emerald/30 transition-colors">
            <Activity className="w-3.5 h-3.5 text-aurora-emerald" />
            <div className="flex flex-col items-end leading-none">
              <span className="text-xs font-bold font-mono text-foreground">{percent}%</span>
              <span className="text-[8px] text-muted-foreground uppercase tracking-widest">Sync</span>
            </div>
            {/* Visual Ring with glow */}
            <div className="relative">
              <svg className="w-8 h-8 -my-2 -mr-1 rotate-[-90deg]">
                <circle
                  cx="16"
                  cy="16"
                  r="12"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="12"
                  stroke="hsl(var(--aurora-emerald))"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="75.39"
                  strokeDashoffset={75.39 - (75.39 * percent) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                  style={{
                    filter: 'drop-shadow(0 0 4px hsl(var(--aurora-emerald)))',
                  }}
                />
              </svg>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-white/10" />

          {/* Settings Button */}
          <MagneticButton
            onClick={onOpenSettings}
            className="group/settings p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)] transition-all"
          >
            <Settings className="w-4 h-4 text-muted-foreground group-hover/settings:text-foreground group-hover/settings:rotate-90 transition-all duration-500" />
          </MagneticButton>

          {/* Logout Button */}
          <MagneticButton
            onClick={onLogout}
            className="group/power p-2.5 rounded-full bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 hover:border-destructive/50 hover:shadow-[0_0_20px_hsl(var(--destructive)/0.4)] transition-all"
          >
            <Power className="w-4 h-4 text-destructive group-hover/power:text-destructive/80 group-hover/power:scale-110 transition-all" />
          </MagneticButton>
        </div>
      </div>
    </div>
  );
};
