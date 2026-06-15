'use client'

import {
  forwardRef,
  SelectHTMLAttributes,
  InputHTMLAttributes,
  useRef,
  useState,
  useEffect,
  Children,
  isValidElement,
  ReactElement,
} from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown } from 'lucide-react'

interface ChipSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasIcon?: boolean
  error?: boolean
}

interface ChipInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

interface OptionEntry {
  value: string
  label: string
  disabled?: boolean
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

export const ChipSelect = forwardRef<HTMLDivElement, ChipSelectProps>(
  ({ hasIcon, error, style, children, value, onChange, disabled, 'aria-label': ariaLabel, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [dropStyle, setDropStyle] = useState<React.CSSProperties>({})
    const [mounted, setMounted] = useState(false)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const dropRef = useRef<HTMLDivElement>(null)

    useEffect(() => { setMounted(true) }, [])

    const options: OptionEntry[] = Children.toArray(children)
      .filter(isValidElement)
      .map(child => {
        const c = child as ReactElement<{ value?: string | number; children?: React.ReactNode; disabled?: boolean }>
        return {
          value: String(c.props.value ?? ''),
          label: String(c.props.children ?? ''),
          disabled: c.props.disabled,
        }
      })

    const selected = options.find(o => o.value === String(value ?? ''))

    const openDropdown = () => {
      if (disabled || !triggerRef.current) return
      const rect = triggerRef.current.getBoundingClientRect()
      const dropH = Math.min(240, options.length * 34 + 8)
      const below = rect.bottom + 4 + dropH < window.innerHeight - 8
      setDropStyle({
        position: 'fixed',
        top: below ? rect.bottom + 4 : rect.top - dropH - 4,
        left: rect.left,
        minWidth: rect.width,
        zIndex: 9999,
      })
      setIsOpen(true)
    }

    const handleSelect = (optValue: string) => {
      setIsOpen(false)
      if (onChange) {
        const evt = { target: { value: optValue } } as React.ChangeEvent<HTMLSelectElement>
        onChange(evt)
      }
    }

    useEffect(() => {
      if (!isOpen) return
      const handler = (e: MouseEvent) => {
        const t = e.target as Node
        if (
          triggerRef.current && !triggerRef.current.contains(t) &&
          dropRef.current && !dropRef.current.contains(t)
        ) setIsOpen(false)
      }
      const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }
      document.addEventListener('mousedown', handler)
      document.addEventListener('keydown', onKey)
      return () => {
        document.removeEventListener('mousedown', handler)
        document.removeEventListener('keydown', onKey)
      }
    }, [isOpen])

    const displayLabel = selected?.label ?? options[0]?.label ?? '—'
    const hasRealValue = selected && selected.value !== ''

    return (
      <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          onClick={openDropdown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-invalid={error ? 'true' : 'false'}
          aria-label={ariaLabel}
          {...props}
          style={{
            ...baseChipStyle,
            paddingLeft: hasIcon ? '26px' : '10px',
            paddingRight: '26px',
            borderColor: error ? 'var(--destructive)' : isOpen ? 'var(--accent)' : 'var(--border)',
            boxShadow: isOpen ? '0 0 0 2px var(--accent-focus)' : 'none',
            color: hasRealValue ? 'var(--text-primary)' : 'var(--text-muted)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.4 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            textAlign: 'left',
            ...style,
          }}
        >
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {displayLabel}
          </span>
          <ChevronDown
            size={10}
            style={{
              flexShrink: 0,
              color: 'var(--text-muted)',
              transform: isOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.15s ease',
            }}
          />
        </button>

        {mounted && isOpen && createPortal(
          <div
            ref={dropRef}
            role="listbox"
            style={{
              ...dropStyle,
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              maxHeight: '240px',
              overflowY: 'auto',
            }}
          >
            {options.map((opt, i) => {
              const isSelected = opt.value === String(value ?? '')
              return (
                <button
                  key={i}
                  role="option"
                  aria-selected={isSelected}
                  type="button"
                  disabled={opt.disabled}
                  onClick={() => !opt.disabled && handleSelect(opt.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '7px 12px',
                    textAlign: 'left',
                    border: 'none',
                    backgroundColor: isSelected ? 'var(--accent)' : 'transparent',
                    color: isSelected
                      ? 'var(--accent-text)'
                      : opt.value === ''
                        ? 'var(--text-muted)'
                        : 'var(--text-primary)',
                    fontSize: '12px',
                    fontFamily: 'var(--font-sans)',
                    cursor: opt.disabled ? 'not-allowed' : 'pointer',
                    opacity: opt.disabled ? 0.4 : 1,
                    transition: 'background-color 0.1s ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected && !opt.disabled)
                      e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
                  }}
                  onMouseLeave={e => {
                    if (!isSelected)
                      e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>,
          document.body
        )}
      </div>
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
