'use client'

interface CardProps {
  children: React.ReactNode
  style?: React.CSSProperties
  elevated?: boolean
  error?: boolean
  onClick?: () => void
}

export function Card({ children, style, elevated = false, error = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'var(--surface)',
        border: `1px solid ${error ? 'var(--destructive)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        boxShadow: elevated ? 'var(--shadow-md)' : 'var(--shadow)',
        overflow: 'hidden',
        transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

export function CardHeader({ children, style }: CardHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: 'var(--space-3) var(--space-4)',
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--bg-secondary)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

interface CardBodyProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

export function CardBody({ children, style }: CardBodyProps) {
  return (
    <div
      style={{
        padding: 'var(--space-3)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}