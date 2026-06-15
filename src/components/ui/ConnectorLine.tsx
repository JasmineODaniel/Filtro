'use client'

import { OperatorToggle } from './OperatorToggle'

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
        paddingLeft: 'var(--space-5)',
        margin: '0',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: '1px',
          height: '10px',
          backgroundColor: 'var(--border)',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--border)',
            flexShrink: 0,
          }}
        />
        <OperatorToggle value={operator} onToggle={onToggle} borderColor={depthColor} />
      </div>

      <div
        style={{
          width: '1px',
          height: '10px',
          backgroundColor: 'var(--border)',
        }}
      />
    </div>
  )
}
