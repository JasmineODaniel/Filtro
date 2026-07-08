'use client'

import React from 'react'

interface OperatorToggleProps {
  value: 'AND' | 'OR'
  onToggle: () => void
  borderColor?: string
}

const OPERATORS = ['AND', 'OR'] as const

const segmentStyle: React.CSSProperties = {
  padding: '7px 13px',
  border: 'none',
  fontSize: '10px',
  fontWeight: 700,
  fontFamily: 'var(--font-sans)',
  letterSpacing: '0.06em',
  lineHeight: 1,
  transition: 'background-color 0.15s ease, color 0.15s ease',
}

export function OperatorToggle({ value, onToggle, borderColor }: OperatorToggleProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexShrink: 0,
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        border: `1px solid ${borderColor ?? 'var(--border)'}`,
      }}
    >
      {OPERATORS.map(op => (
        <button
          type="button"
          key={op}
          onClick={() => value !== op && onToggle()}
          aria-label={`Set operator to ${op}`}
          aria-pressed={value === op}
          style={{
            ...segmentStyle,
            backgroundColor: value === op ? 'var(--accent)' : 'transparent',
            color: value === op ? 'var(--accent-text)' : 'var(--text-muted)',
            cursor: value === op ? 'default' : 'pointer',
          }}
        >
          {op}
        </button>
      ))}
    </div>
  )
}
