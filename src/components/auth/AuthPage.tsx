import { useState } from 'react';
import { ArrowRight, Sparkles, Command, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';
import { MagneticButton } from '../aurora/MagneticButton';
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
    <div className="min-h-screen flex flex-col justify-center px-6 md:px-12">
      <div className="max-w-4xl mx-auto w-full">
        {/* Brand */}
        <div className="absolute top-8 left-8 flex items-center gap-2 opacity-60">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium tracking-widest text-foreground/60 uppercase">
            Gemini Workspace
          </span>
        </div>

        {/* Staggered Text Reveal */}
        <div className="space-y-4 mb-12">
          <h1
            className="text-6xl md:text-8xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground to-muted-foreground animate-slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            {isLogin ? 'Welcome.' : 'Join us.'}
          </h1>
          <h1
            className="text-6xl md:text-8xl font-medium tracking-tight text-foreground/40 animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            {isLogin ? (
              <>
                Sign <span className="text-primary">in</span>
              </>
            ) : (
              <>
                Create <span className="text-primary">account</span>
              </>
            )}
          </h1>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
          {/* Username Input */}
          <div className="relative">
            <div
              className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary via-accent to-aurora-fuchsia opacity-0 transition-opacity duration-500 ${
                focused === 'username' ? 'opacity-70 blur-sm' : ''
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
                    className={`w-6 h-6 transition-colors duration-300 ${
                      focused === 'username' ? 'text-primary' : ''
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
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <div
              className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary via-accent to-aurora-fuchsia opacity-0 transition-opacity duration-500 ${
                focused === 'password' ? 'opacity-70 blur-sm' : ''
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
                    className={`w-6 h-6 flex items-center justify-center transition-colors duration-300 ${
                      focused === 'password' ? 'text-primary' : ''
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
                  className="pr-6 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <div className="pr-3">
                  <MagneticButton
                    type="submit"
                    className={`h-12 w-12 flex items-center justify-center rounded-xl transition-all duration-500 ${
                      username && password
                        ? 'bg-foreground text-background translate-x-0 opacity-100 rotate-0 hover:bg-primary hover:text-primary-foreground'
                        : 'bg-transparent translate-x-4 opacity-0 -rotate-45 pointer-events-none'
                    }`}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </MagneticButton>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Mode Toggle */}
        <div className="mt-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <button
            onClick={() => setMode(isLogin ? 'signup' : 'login')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            {isLogin ? (
              <>
                <UserPlus className="w-4 h-4 group-hover:text-primary transition-colors" />
                <span className="text-sm">Don't have an account? Create one</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 group-hover:text-primary transition-colors" />
                <span className="text-sm">Already have an account? Sign in</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
