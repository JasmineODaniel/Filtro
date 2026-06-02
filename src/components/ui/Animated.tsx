'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { variants, smooth, fast, spring, stagger } from '@/hooks/useAnimation'

interface AnimatedItemProps {
  children: React.ReactNode
  variant?: keyof typeof variants
  transition?: typeof smooth | typeof fast | typeof spring
  style?: React.CSSProperties
  layoutId?: string
}

export function AnimatedItem({
  children,
  variant = 'slideDown',
  transition = smooth,
  style,
  layoutId,
}: AnimatedItemProps) {
  return (
    <motion.div
      layoutId={layoutId}
      initial={variants[variant].initial}
      animate={variants[variant].animate}
      exit={variants[variant].exit}
      transition={transition}
      style={style}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedListProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

export function AnimatedList({ children, style }: AnimatedListProps) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.div layout transition={smooth} style={style}>
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

interface AnimatedCollapseProps {
  children: React.ReactNode
  isOpen: boolean
}

export function AnimatedCollapse({ children, isOpen }: AnimatedCollapseProps) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={variants.collapse.initial}
          animate={variants.collapse.animate}
          exit={variants.collapse.exit}
          transition={smooth}
          style={{ overflow: 'hidden' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface AnimatedPresenceWrapperProps {
  children: React.ReactNode
}

export function AnimatedPresenceWrapper({ children }: AnimatedPresenceWrapperProps) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      {children}
    </AnimatePresence>
  )
}

interface StaggeredItemProps {
  children: React.ReactNode
  index: number
  style?: React.CSSProperties
}

export function StaggeredItem({ children, index, style }: StaggeredItemProps) {
  return (
    <motion.div
      initial={variants.fadeIn.initial}
      animate={variants.fadeIn.animate}
      exit={variants.fadeIn.exit}
      transition={stagger(index)}
      style={style}
    >
      {children}
    </motion.div>
  )
}

interface StaggeredRowProps {
  children: React.ReactNode
  index: number
  style?: React.CSSProperties
  onMouseEnter?: React.MouseEventHandler<HTMLTableRowElement>
  onMouseLeave?: React.MouseEventHandler<HTMLTableRowElement>
}

export function StaggeredRow({ children, index, style, onMouseEnter, onMouseLeave }: StaggeredRowProps) {
  return (
    <motion.tr
      initial={variants.fadeIn.initial}
      animate={variants.fadeIn.animate}
      exit={variants.fadeIn.exit}
      transition={stagger(index)}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.tr>
  )
}

interface OperatorToggleProps {
  children: React.ReactNode
  onClick: () => void
  style?: React.CSSProperties
  'aria-label'?: string
}

export function OperatorToggle({ children, onClick, style, 'aria-label': ariaLabel }: OperatorToggleProps) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={ariaLabel}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.04 }}
      transition={spring}
      style={style}
    >
      {children}
    </motion.button>
  )
}