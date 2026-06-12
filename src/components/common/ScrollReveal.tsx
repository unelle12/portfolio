import { useRef, type ElementType, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import { useReducedMotion } from '../../hooks';

const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: 'blur(10px)', y: 20 },
    visible: { opacity: 1, filter: 'blur(0px)', y: 0 },
  },
  rotate: {
    hidden: { opacity: 0, rotate: -8, scale: 0.95 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
  },
  clipPath: {
    hidden: { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
    visible: { opacity: 1, clipPath: 'inset(0 0% 0 0)' },
  },
};

const springTransition = {
  type: 'spring' as const,
  stiffness: 100,
  damping: 15,
  mass: 1,
};

const defaultTransition = {
  duration: 0.6,
  ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
};

interface ScrollRevealProps {
  children: ReactNode;
  variant?: keyof typeof variants;
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: ElementType;
  useSpring?: boolean;
  [key: string]: unknown;
}

export function ScrollReveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration,
  once = true,
  threshold = 0.1,
  className,
  style,
  as: Component = 'div',
  useSpring = false,
  ...props
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const prefersReduced = useReducedMotion();

  const selectedVariant = variants[variant] || variants.fadeUp;
  const transition = useSpring ? springTransition : { ...defaultTransition, delay, duration: duration || defaultTransition.duration };

  if (prefersReduced) {
    return (
      <Component className={className} style={style} {...props}>
        {children}
      </Component>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={selectedVariant}
      transition={useSpring ? { ...transition, delay } : transition}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface ScrollRevealGroupProps {
  children: ReactNode;
  staggerDelay?: number;
  variant?: keyof typeof variants;
  className?: string;
  useSpring?: boolean;
}

export function ScrollRevealGroup({
  children,
  staggerDelay = 0.1,
  variant = 'fadeUp',
  className,
  useSpring = false,
}: ScrollRevealGroupProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={variants[variant] || variants.fadeUp}
              transition={
                useSpring
                  ? {
                      ...springTransition,
                      delay: i * staggerDelay,
                    }
                  : {
                      ...defaultTransition,
                      delay: i * staggerDelay,
                    }
              }
            >
              {child}
            </motion.div>
          ))
        : children}
    </div>
  );
}
