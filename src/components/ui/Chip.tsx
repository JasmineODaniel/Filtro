'use client'

import { forwardRef, SelectHTMLAttributes, InputHTMLAttributes } from 'react'

interface ChipSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasIcon?: boolean
  error?: boolean
}

interface ChipInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const baseChipStyle: React.CSSProperties = {
  height: '30px',
  padding: '0 10px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)',
  backgroundColor: 'var(--bg)',
  color: 'var(--text-primary)',
  fontSize: '12px',
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
}

const selectChipStyle: React.CSSProperties = {
  ...baseChipStyle,
  cursor: 'pointer',
  appearance: 'none',
  paddingRight: '26px',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 8px center',
}

export const ChipSelect = forwardRef<HTMLSelectElement, ChipSelectProps>(
  ({ hasIcon, error, style, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        aria-invalid={error ? 'true' : 'false'}
        style={{
          ...selectChipStyle,
          paddingLeft: hasIcon ? '26px' : '10px',
          borderColor: error ? 'var(--destructive)' : 'var(--border)',
          ...style,
        }}
        {...props}
      >
        {children}
      </select>
    )
  }
)

ChipSelect.displayName = 'ChipSelect'

export const ChipInput = forwardRef<HTMLInputElement, ChipInputProps>(
  ({ error, style, ...props }, ref) => {
    return (
      <input
        ref={ref}
        aria-invalid={error ? 'true' : 'false'}
        style={{
          ...baseChipStyle,
          borderColor: error ? 'var(--destructive)' : 'var(--border)',
          ...style,
        }}
        {...props}
      />
    )
  }
)

ChipInput.displayName = 'ChipInput'