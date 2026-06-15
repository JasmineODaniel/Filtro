'use client'

type BadgeVariant = 'accent' | 'muted' | 'danger' | 'depth'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  pill?: boolean
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  accent: {
    backgroundColor: 'var(--accent)',
    color: 'var(--accent-text)',
  },
  muted: {
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-muted)',
  },
  danger: {
    backgroundColor: 'var(--destructive-bg)',
    color: 'var(--destructive)',
  },
  depth: {
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
  },
}

export function Badge({ children, variant = 'muted', pill = false }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: 600,
        fontFamily: 'var(--font-sans)',
        letterSpacing: '0.04em',
        padding: '1px 7px',
        borderRadius: pill ? '20px' : 'var(--radius-sm)',
        whiteSpace: 'nowrap',
        ...variantStyles[variant],
      }}
    >
      {children}
    </span>
  )
}