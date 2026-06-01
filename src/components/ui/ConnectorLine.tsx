'use client'

interface ConnectorLineProps {
  operator: 'AND' | 'OR'
  depthColor: string
  onToggle: () => void
}

export function ConnectorLine({ operator, depthColor, onToggle }: ConnectorLineProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingLeft: '20px',
        margin: '0',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: '1px',
          height: '10px',
          backgroundColor: 'var(--border)',
          marginLeft: '0',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--border)',
            flexShrink: 0,
          }}
        />
        <button
          onClick={onToggle}
          aria-label={`Toggle operator. Currently ${operator}`}
          style={{
            padding: '2px 8px',
            borderRadius: '20px',
            border: `1.5px solid ${depthColor}`,
            backgroundColor: 'var(--accent)',
            color: 'var(--accent-text)',
            fontSize: '10px',
            fontWeight: 700,
            fontFamily: 'var(--font-sans)',
            cursor: 'pointer',
            letterSpacing: '0.06em',
            transition: 'all 0.15s ease',
            lineHeight: 1,
          }}
        >
          {operator}
        </button>
      </div>

      <div
        style={{
          width: '1px',
          height: '10px',
          backgroundColor: 'var(--border)',
          marginLeft: '0',
        }}
      />
    </div>
  )
}