/**
 * ANIMATION SYSTEM
 * Centralized animation tokens and utilities
 */

import { Variants, Transition } from 'framer-motion';

// ============================================
// TIMING TOKENS
// ============================================

export const timing = {
  instant: 0,
  micro: 0.12,    // 120ms - micro-interactions
  fast: 0.18,     // 180ms - quick feedback
  normal: 0.25,   // 250ms - standard transitions
  slow: 0.36,     // 360ms - deliberate animations
  slower: 0.5,    // 500ms - cinematic
  entry: 0.3,     // 300ms - entrance animations
  exit: 0.22,     // 220ms - exit animations
} as const;

// ============================================
// EASING TOKENS
// ============================================

export const easing = {
  // Default smooth (ease-out-expo feel)
  default: [0.16, 1, 0.3, 1] as const,
  
  // Entrance (decelerate)
  enter: [0, 0, 0.2, 1] as const,
  
  // Exit (accelerate)
  exit: [0.4, 0, 1, 1] as const,
  
  // Bounce
  bounce: [0.34, 1.56, 0.64, 1] as const,
  
  // Spring-like overshoot
  spring: [0.175, 0.885, 0.32, 1.275] as const,
  
  // Linear
  linear: [0, 0, 1, 1] as const,
  
  // Smooth (ease-in-out)
  smooth: [0.4, 0, 0.2, 1] as const,
} as const;

// ============================================
// SPRING CONFIGS (for Framer Motion)
// ============================================

export const springConfig = {
  // Snappy feedback
  snappy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 30,
    mass: 1,
  },
  
  // Gentle movement
  gentle: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 20,
    mass: 1,
  },
  
  // Bouncy effect
  bouncy: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 20,
    mass: 1,
  },
  
  // Slow, deliberate
  slow: {
    type: 'spring' as const,
    stiffness: 50,
    damping: 20,
    mass: 1,
  },
  
  // Ultra smooth
  smooth: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25,
    mass: 1,
  },
} as const;

// ============================================
// TRANSITION PRESETS
// ============================================

export const transitions: Record<string, Transition> = {
  // Default transition
  default: {
    duration: timing.normal,
    ease: easing.default,
  },
  
  // Fast micro-interaction
  micro: {
    duration: timing.micro,
    ease: easing.default,
  },
  
  // Entry animation
  entry: {
    duration: timing.entry,
    ease: easing.enter,
  },
  
  // Exit animation
  exit: {
    duration: timing.exit,
    ease: easing.exit,
  },
  
  // Bounce effect
  bounce: {
    duration: timing.slow,
    ease: easing.bounce,
  },
  
  // Spring entry
  springEntry: springConfig.snappy,
  
  // Gentle spring
  gentleSpring: springConfig.gentle,
};

// ============================================
// VARIANT PRESETS
// ============================================

// Fade variants
export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: transitions.entry,
  },
  exit: {
    opacity: 0,
    transition: transitions.exit,
  },
};

// Slide up variants
export const slideUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.entry,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: transitions.exit,
  },
};

// Slide down variants
export const slideDownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.entry,
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: transitions.exit,
  },
};

// Scale variants
export const scaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.springEntry,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.exit,
  },
};

// Card hover variants
export const cardHoverVariants: Variants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    transition: springConfig.snappy,
  },
  tap: {
    scale: 0.98,
    transition: transitions.micro,
  },
};

// Stagger children variants
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springConfig.snappy,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: transitions.exit,
  },
};

// Modal variants
export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: timing.fast } },
  exit: { opacity: 0, transition: { duration: timing.micro } },
};

export const modalContentVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springConfig.bouncy,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: transitions.exit,
  },
};

// Drag variants
export const draggableVariants: Variants = {
  idle: {
    scale: 1,
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    zIndex: 0,
  },
  dragging: {
    scale: 1.05,
    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    zIndex: 50,
    cursor: 'grabbing',
  },
};

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      duration: timing.entry,
      ease: easing.default,
      when: 'beforeChildren',
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: timing.exit,
      ease: easing.exit,
    },
  },
};

// ============================================
// REDUCED MOTION UTILITIES
// ============================================

export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export function getReducedMotionVariants(variants: Variants): Variants {
  const getOpacity = (variant: unknown, fallback: number): number => {
    if (typeof variant === 'object' && variant !== null && 'opacity' in variant) {
      return (variant as { opacity: number }).opacity ?? fallback;
    }
    return fallback;
  };

  return {
    hidden: { opacity: getOpacity(variants.hidden, 0) },
    visible: { opacity: getOpacity(variants.visible, 1) },
    exit: { opacity: getOpacity(variants.exit, 0) },
  };
}

/**
 * Hook to check for reduced motion preference
 */
export function useReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get appropriate variants based on motion preference
 */
export function getMotionVariants(
  variants: Variants,
  reducedMotion: boolean
): Variants {
  return reducedMotion ? getReducedMotionVariants(variants) : variants;
}

// ============================================
// ANIMATION UTILITIES
// ============================================

/**
 * Create staggered delay for children
 */
export function getStaggerDelay(index: number, baseDelay = 0.05): number {
  return index * baseDelay;
}

/**
 * Create animation props for a list item
 */
export function getListItemAnimation(index: number) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: getStaggerDelay(index),
        ...springConfig.snappy,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: transitions.exit,
    },
  };
}

/**
 * Hover animation for interactive elements
 */
export const hoverAnimation = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: springConfig.snappy,
};

/**
 * Pulse animation for attention
 */
export const pulseAnimation = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

/**
 * Glow animation
 */
export const glowAnimation = {
  animate: {
    boxShadow: [
      '0 0 20px hsl(var(--primary) / 0.3)',
      '0 0 40px hsl(var(--primary) / 0.5)',
      '0 0 20px hsl(var(--primary) / 0.3)',
    ],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

// ============================================
// EXPORT ALL
// ============================================

export const animationSystem = {
  timing,
  easing,
  springConfig,
  transitions,
  variants: {
    fade: fadeVariants,
    slideUp: slideUpVariants,
    slideDown: slideDownVariants,
    scale: scaleVariants,
    cardHover: cardHoverVariants,
    staggerContainer: staggerContainerVariants,
    staggerItem: staggerItemVariants,
    modalBackdrop: modalBackdropVariants,
    modalContent: modalContentVariants,
    draggable: draggableVariants,
    page: pageVariants,
    reducedMotion: reducedMotionVariants,
  },
  utils: {
    getReducedMotionVariants,
    getMotionVariants,
    getStaggerDelay,
    getListItemAnimation,
    hoverAnimation,
    pulseAnimation,
    glowAnimation,
  },
} as const;

export default animationSystem;
