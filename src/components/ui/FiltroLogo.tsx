'use client'

interface FiltroLogoProps {
  size?: 'sm' | 'md'
  description?: string
}

export function FiltroLogo({ size = 'md', description }: FiltroLogoProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: size === 'sm' ? '13px' : '16px',
        fontWeight: 500,
        color: 'var(--accent)',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        userSelect: 'none',
        lineHeight: 1,
      }}>
        Filtro
      </span>
      {description && (
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '9px',
          color: 'var(--text-muted)',
          letterSpacing: '0.04em',
          userSelect: 'none',
          lineHeight: 1,
        }}>
          {description}
        </span>
      )}
    </div>
  )
}

export function FiltroMark({ size = 28 }: { size?: number }) {
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: `${Math.round(size * 0.25)}px`,
      backgroundColor: 'var(--accent)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: `${Math.round(size * 0.5)}px`,
        fontWeight: 500,
        color: 'var(--accent-text)',
        letterSpacing: '0.05em',
        userSelect: 'none',
        lineHeight: 1,
      }}>
        F
      </span>
    </div>
  )
}
