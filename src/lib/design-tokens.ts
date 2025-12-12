/**
 * GEMINI DESIGN SYSTEM TOKENS
 * Production-ready design tokens for the study dashboard
 */

// ============================================
// COLOR TOKENS (HSL format for Tailwind)
// ============================================
export const colors = {
  // Primary palette
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
    muted: 'hsl(var(--primary) / 0.1)',
    glow: 'hsl(var(--primary) / 0.3)',
  },
  
  // Semantic colors
  semantic: {
    success: 'hsl(var(--aurora-emerald))',
    warning: 'hsl(45 93% 47%)',
    error: 'hsl(var(--destructive))',
    info: 'hsl(var(--aurora-cyan))',
  },
  
  // Difficulty levels
  difficulty: {
    easy: 'hsl(142 76% 36%)',    // Green
    medium: 'hsl(45 93% 47%)',   // Amber
    hard: 'hsl(0 84% 60%)',      // Red
  },
  
  // Cognitive load
  cognitiveLoad: {
    light: 'hsl(142 76% 36%)',
    moderate: 'hsl(45 93% 47%)',
    heavy: 'hsl(25 95% 53%)',
    overload: 'hsl(0 84% 60%)',
  },
} as const;

// ============================================
// SPACING TOKENS (24-32px vertical rhythm)
// ============================================
export const spacing = {
  // Base unit: 4px
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  2: '0.5rem',      // 8px
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px - rhythm base
  8: '2rem',        // 32px - rhythm base
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
} as const;

// ============================================
// TYPOGRAPHY TOKENS
// ============================================
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    serif: ['Playfair Display', 'Georgia', 'serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
  },
  
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

// ============================================
// MOTION TOKENS
// ============================================
export const motion = {
  // Durations
  duration: {
    instant: '0ms',
    micro: '120ms',
    fast: '180ms',
    normal: '250ms',
    slow: '360ms',
    slower: '500ms',
    // Entry animations
    entry: '300ms',
    exit: '220ms',
  },
  
  // Easings
  easing: {
    // Default smooth easing
    default: 'cubic-bezier(0.16, 1, 0.3, 1)',
    // Entrance (decelerate)
    enter: 'cubic-bezier(0, 0, 0.2, 1)',
    // Exit (accelerate)
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
    // Bounce
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    // Spring-like
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    // Linear
    linear: 'linear',
  },
  
  // Framer Motion spring configs
  spring: {
    snappy: { stiffness: 400, damping: 30 },
    gentle: { stiffness: 100, damping: 20 },
    bouncy: { stiffness: 300, damping: 20 },
    slow: { stiffness: 50, damping: 20 },
  },
} as const;

// ============================================
// LAYOUT TOKENS
// ============================================
export const layout = {
  // Grid
  grid: {
    columns: 12,
    gutter: '1.5rem',
    margin: '1rem',
  },
  
  // Content widths
  maxWidth: {
    xs: '20rem',
    sm: '24rem',
    md: '28rem',
    lg: '32rem',
    xl: '36rem',
    '2xl': '42rem',
    '3xl': '48rem',
    '4xl': '56rem',
    '5xl': '64rem',
    '6xl': '72rem',
    '7xl': '80rem',
    full: '100%',
  },
  
  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    DEFAULT: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px',
  },
  
  // Z-index scale
  zIndex: {
    behind: -1,
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modalBackdrop: 40,
    modal: 50,
    popover: 60,
    tooltip: 70,
    toast: 80,
  },
} as const;

// ============================================
// GLASS EFFECT TOKENS
// ============================================
export const glass = {
  // Blur levels
  blur: {
    sm: 'blur(4px)',
    DEFAULT: 'blur(12px)',
    md: 'blur(16px)',
    lg: 'blur(24px)',
    xl: 'blur(40px)',
  },
  
  // Glass backgrounds
  background: {
    light: 'hsl(var(--background) / 0.6)',
    DEFAULT: 'hsl(var(--background) / 0.8)',
    dark: 'hsl(var(--background) / 0.9)',
  },
  
  // Border styles
  border: {
    subtle: '1px solid hsl(var(--border) / 0.3)',
    DEFAULT: '1px solid hsl(var(--border) / 0.5)',
    prominent: '1px solid hsl(var(--border) / 0.8)',
  },
} as const;

// ============================================
// SHADOW TOKENS
// ============================================
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  
  // Glow effects
  glow: {
    primary: '0 0 20px hsl(var(--primary) / 0.3)',
    accent: '0 0 20px hsl(var(--accent) / 0.3)',
    success: '0 0 20px hsl(142 76% 36% / 0.3)',
    error: '0 0 20px hsl(0 84% 60% / 0.3)',
  },
} as const;

// ============================================
// BREAKPOINTS
// ============================================
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Export all tokens
export const designTokens = {
  colors,
  spacing,
  typography,
  motion,
  layout,
  glass,
  shadows,
  breakpoints,
} as const;

export default designTokens;
