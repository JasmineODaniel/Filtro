'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'ghost' | 'danger' | 'icon' | 'accent'
type Size = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  label?: string
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  accent: {
    backgroundColor: 'var(--accent)',
    color: 'var(--accent-text)',
    border: '1.5px solid var(--accent)',
    fontWeight: 700,
  },
  primary: {
    backgroundColor: 'var(--surface)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
    fontWeight: 500,
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid transparent',
    fontWeight: 400,
  },
  danger: {
    backgroundColor: 'transparent',
    color: 'var(--text-muted)',
    border: '1px solid transparent',
    fontWeight: 400,
  },
  icon: {
    backgroundColor: 'transparent',
    color: 'var(--text-muted)',
    border: '1px solid transparent',
    fontWeight: 400,
    padding: '0',
  },
}

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { fontSize: '11px', padding: '4px 10px', height: '28px', borderRadius: 'var(--radius-sm)' },
  md: { fontSize: '12px', padding: '5px 12px', height: '32px', borderRadius: 'var(--radius)' },
}

const iconSizeStyles: React.CSSProperties = {
  width: '28px',
  height: '28px',
  padding: '0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 'var(--radius-sm)',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', label, children, style, ...props }, ref) => {
    const isIcon = variant === 'icon'

    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '5px',
      cursor: props.disabled ? 'not-allowed' : 'pointer',
      opacity: props.disabled ? 0.5 : 1,
      fontFamily: 'var(--font-sans)',
      letterSpacing: '0.01em',
      whiteSpace: 'nowrap',
      transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, opacity 0.15s ease',
      ...variantStyles[variant],
      ...(isIcon ? iconSizeStyles : sizeStyles[size]),
      ...style,
    }

    return (
      <button
        ref={ref}
        aria-label={label}
        style={base}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'