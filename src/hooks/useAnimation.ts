import { Transition } from 'framer-motion'

export const spring: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
}

export const smooth: Transition = {
  type: 'tween',
  duration: 0.2,
  ease: 'easeOut',
}

export const fast: Transition = {
  type: 'tween',
  duration: 0.15,
  ease: 'easeOut',
}

export const stagger = (index: number): Transition => ({
  type: 'tween',
  duration: 0.2,
  ease: 'easeOut',
  delay: index * 0.04,
})

export const variants = {
  slideDown: {
    initial: { opacity: 0, y: -8, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -4, scale: 0.98 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideIn: {
    initial: { opacity: 0, x: -12 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -12 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  collapse: {
    initial: { height: 0, opacity: 0 },
    animate: { height: 'auto', opacity: 1 },
    exit: { height: 0, opacity: 0 },
  },
}