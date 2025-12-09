import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Command, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';
import { MagneticButton } from '../aurora/MagneticButton';
import { FloatingParticles } from '../aurora/FloatingParticles';
import { toast } from 'sonner';

interface AuthPageProps {
  onSignIn: (username: string, password: string) => { success: boolean; error?: string };
  onSignUp: (username: string, password: string) => { success: boolean; error?: string };
}

export const AuthPage = ({ onSignIn, onSignUp }: AuthPageProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleModeSwitch = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setMode(mode === 'login' ? 'signup' : 'login');
      setIsTransitioning(false);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    if (!password.trim()) {
      toast.error('Please enter a password');
      return;
    }

    if (mode === 'signup') {
      if (password.length < 4) {
        toast.error('Password must be at least 4 characters');
        return;
      }
      const result = onSignUp(username.trim(), password);
      if (!result.success) {
        toast.error(result.error || 'Sign up failed');
      } else {
        toast.success('Account created successfully!');
      }
    } else {
      const result = onSignIn(username.trim(), password);
      if (!result.success) {
        toast.error(result.error || 'Login failed');
      }
    }
  };

  const isLogin = mode === 'login';

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 md:px-12 relative overflow-hidden">
      {/* Floating particles */}
      <FloatingParticles count={15} />

      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* Brand */}
        <div className="absolute top-8 left-0 flex items-center gap-2 animate-slide-up" style={{ animationDelay: '0s' }}>
          <div className="relative">
            <Sparkles className="w-5 h-5 text-primary" />
            <div className="absolute inset-0 bg-primary/50 blur-md animate-pulse-slow" />
          </div>
          <span className="text-sm font-medium tracking-widest text-foreground/60 uppercase">
            Gemini Workspace
          </span>
        </div>

        {/* Staggered Text Reveal with transition */}
        <div 
          className={`space-y-4 mb-12 transition-all duration-300 ${
            isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          <h1
            className="text-6xl md:text-8xl font-medium tracking-tight animate-slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground to-muted-foreground">
                {isLogin ? 'Welcome.' : 'Join us.'}
              </span>
              {/* Text glow */}
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-primary/50 to-accent/50 blur-2xl animate-pulse-slow">
                {isLogin ? 'Welcome.' : 'Join us.'}
              </span>
            </span>
          </h1>
          <h1
            className="text-6xl md:text-8xl font-medium tracking-tight text-foreground/40 animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            {isLogin ? (
              <>
                Sign <span className="text-primary relative">
                  in
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent rounded-full animate-shimmer" />
                </span>
              </>
            ) : (
              <>
                Create <span className="text-primary relative">
                  account
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent rounded-full animate-shimmer" />
                </span>
              </>
            )}
          </h1>
        </div>

        {/* Auth Form */}
        <form 
          onSubmit={handleSubmit} 
          className={`space-y-4 max-w-2xl transition-all duration-300 ${
            isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {/* Username Input */}
          <div 
            className="relative animate-slide-up" 
            style={{ animationDelay: '0.3s' }}
          >
            <div
              className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary via-accent to-aurora-fuchsia transition-all duration-500 ${
                focused === 'username' ? 'opacity-70 blur-sm' : 'opacity-0'
              }`}
            />
            <div
              className={`group relative flex items-center w-full p-1 rounded-2xl transition-all duration-500 ease-out backdrop-blur-xl ${
                focused === 'username' ? 'bg-background/80' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="relative w-full rounded-xl flex items-center overflow-hidden">
                <div className="pl-6 pr-4 text-muted-foreground">
                  <Command
                    className={`w-6 h-6 transition-all duration-300 ${
                      focused === 'username' ? 'text-primary scale-110' : ''
                    }`}
                  />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocused('username')}
                  onBlur={() => setFocused(null)}
                  placeholder="Username"
                  className="w-full bg-transparent py-5 text-xl text-foreground placeholder-muted-foreground outline-none caret-primary font-light"
                  autoComplete="username"
                />
                
                {/* Typing indicator */}
                {username && focused === 'username' && (
                  <div className="pr-4 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div 
            className="relative animate-slide-up" 
            style={{ animationDelay: '0.4s' }}
          >
            <div
              className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary via-accent to-aurora-fuchsia transition-all duration-500 ${
                focused === 'password' ? 'opacity-70 blur-sm' : 'opacity-0'
              }`}
            />
            <div
              className={`group relative flex items-center w-full p-1 rounded-2xl transition-all duration-500 ease-out backdrop-blur-xl ${
                focused === 'password' ? 'bg-background/80' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="relative w-full rounded-xl flex items-center overflow-hidden">
                <div className="pl-6 pr-4 text-muted-foreground">
                  <div
                    className={`w-6 h-6 flex items-center justify-center transition-all duration-300 font-mono text-sm ${
                      focused === 'password' ? 'text-primary scale-110' : ''
                    }`}
                  >
                    •••
                  </div>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  placeholder="Password"
                  className="w-full bg-transparent py-5 text-xl text-foreground placeholder-muted-foreground outline-none caret-primary font-light"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-4 text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <div className="pr-3">
                  <MagneticButton
                    type="submit"
                    className={`h-12 w-12 flex items-center justify-center rounded-xl transition-all duration-500 ${
                      username && password
                        ? 'bg-foreground text-background translate-x-0 opacity-100 rotate-0 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]'
                        : 'bg-transparent translate-x-4 opacity-0 -rotate-45 pointer-events-none'
                    }`}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </MagneticButton>
                </div>
              </div>
            </div>
          </div>

          {/* Password strength indicator for signup */}
          {mode === 'signup' && password && (
            <div className="flex gap-1 px-2 animate-slide-up" style={{ animationDelay: '0s' }}>
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    password.length >= level * 2
                      ? level <= 2 
                        ? 'bg-destructive' 
                        : level === 3 
                        ? 'bg-amber-500' 
                        : 'bg-aurora-emerald'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          )}
        </form>

        {/* Mode Toggle with animation */}
        <div className="mt-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <button
            onClick={handleModeSwitch}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all group relative overflow-hidden px-4 py-2 -ml-4 rounded-lg hover:bg-white/5"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isLogin ? (
                <>
                  <UserPlus className="w-4 h-4 group-hover:text-primary group-hover:scale-110 transition-all" />
                  <span className="text-sm">Don't have an account? <span className="text-primary font-medium">Create one</span></span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 group-hover:text-primary group-hover:scale-110 transition-all" />
                  <span className="text-sm">Already have an account? <span className="text-primary font-medium">Sign in</span></span>
                </>
              )}
            </span>
            
            {/* Hover shine effect */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </button>
        </div>
      </div>
    </div>
  );
};
