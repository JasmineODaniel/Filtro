'use client'

import { memo, useCallback } from 'react'
import { useQueryStore } from '@/store'
import { QueryRule as QueryRuleType } from '@/types'
import { getOperatorsForType, OPERATOR_LABELS, needsNoValue, needsTwoValues } from '@/utils'
import { GripVertical, Trash2 } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Props {
  rule: QueryRuleType
}

function QueryRuleComponent({ rule }: Props) {
  const { schema, updateRule, removeNode, validationErrors } = useQueryStore()
  const error = validationErrors.find(e => e.nodeId === rule.id)
  const selectedField = schema.fields.find(f => f.name === rule.field)
  const operators = selectedField ? getOperatorsForType(selectedField.type) : []

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: rule.id })

  const dragStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : undefined,
  }

  const handleFieldChange = useCallback((field: string) => {
    const newField = schema.fields.find(f => f.name === field)
    const newOperators = newField ? getOperatorsForType(newField.type) : []
    updateRule(rule.id, { field, operator: newOperators[0] ?? 'equals', value: '' })
  }, [rule.id, schema.fields, updateRule])

  const handleOperatorChange = useCallback((operator: string) => {
    updateRule(rule.id, { operator: operator as QueryRuleType['operator'], value: '' })
  }, [rule.id, updateRule])

  const labelStyle: React.CSSProperties = {
    fontSize: '9px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: '4px',
    fontFamily: 'var(--font-sans)',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '6px 10px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg)',
    color: 'var(--text-primary)',
    fontSize: '12px',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    height: '32px',
    transition: 'border-color 0.15s ease',
  }

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'none',
    paddingRight: '28px',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
  }

  const renderValueInput = () => {
    if (!selectedField || needsNoValue(rule.operator)) {
      return (
        <div style={{ flex: 1 }}>
          <div style={labelStyle}>Value</div>
          <div style={{ ...inputStyle, color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            —
          </div>
        </div>
      )
    }

    if (needsTwoValues(rule.operator)) {
      const [a, b] = (rule.value as [string, string]) ?? ['', '']
      return (
        <div style={{ flex: 1 }}>
          <div style={labelStyle}>Value</div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <input
              type={selectedField.type === 'date' ? 'date' : 'number'}
              value={String(a ?? '')}
              onChange={e => updateRule(rule.id, { value: [e.target.value, b] })}
              style={{ ...inputStyle, width: '100px' }}
              placeholder="From"
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0 }}>—</span>
            <input
              type={selectedField.type === 'date' ? 'date' : 'number'}
              value={String(b ?? '')}
              onChange={e => updateRule(rule.id, { value: [a, e.target.value] })}
              style={{ ...inputStyle, width: '100px' }}
              placeholder="To"
            />
          </div>
        </div>
      )
    }

    if (selectedField.type === 'enum' && (rule.operator === 'in_array' || rule.operator === 'not_in_array')) {
      const selected = (rule.value as string[]) ?? []
      return (
        <div style={{ flex: 1 }}>
          <div style={labelStyle}>Value</div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {selectedField.enumValues?.map(val => (
              <button
                key={val}
                onClick={() => {
                  const next = selected.includes(val)
                    ? selected.filter(v => v !== val)
                    : [...selected, val]
                  updateRule(rule.id, { value: next })
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  backgroundColor: selected.includes(val) ? 'var(--accent)' : 'var(--bg)',
                  color: selected.includes(val) ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-sans)',
                  cursor: 'pointer',
                  fontWeight: selected.includes(val) ? 600 : 400,
                  transition: 'all 0.15s ease',
                  height: '32px',
                }}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      )
    }

    if (selectedField.type === 'enum') {
      return (
        <div style={{ flex: 1 }}>
          <div style={labelStyle}>Value</div>
          <select
            value={String(rule.value ?? '')}
            onChange={e => updateRule(rule.id, { value: e.target.value })}
            style={selectStyle}
          >
            <option value="">Select...</option>
            {selectedField.enumValues?.map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
      )
    }

    if (selectedField.type === 'boolean') {
      return (
        <div style={{ flex: 1 }}>
          <div style={labelStyle}>Value</div>
          <select
            value={String(rule.value ?? '')}
            onChange={e => updateRule(rule.id, { value: e.target.value === 'true' })}
            style={selectStyle}
          >
            <option value="">Select...</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
      )
    }

    if (selectedField.type === 'date') {
      return (
        <div style={{ flex: 1 }}>
          <div style={labelStyle}>Value</div>
          <input
            type="date"
            value={String(rule.value ?? '')}
            onChange={e => updateRule(rule.id, { value: e.target.value })}
            style={inputStyle}
          />
        </div>
      )
    }

    if (selectedField.type === 'number') {
      return (
        <div style={{ flex: 1 }}>
          <div style={labelStyle}>Value</div>
          <input
            type="number"
            value={String(rule.value ?? '')}
            onChange={e => updateRule(rule.id, { value: Number(e.target.value) })}
            style={inputStyle}
            placeholder="Enter value..."
          />
        </div>
      )
    }

    return (
      <div style={{ flex: 1 }}>
        <div style={labelStyle}>Value</div>
        <input
          type="text"
          value={String(rule.value ?? '')}
          onChange={e => updateRule(rule.id, { value: e.target.value })}
          style={inputStyle}
          placeholder="Enter value..."
        />
      </div>
    )
  }

  return (
    <div ref={setNodeRef} style={dragStyle}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '10px',
          padding: '14px 14px 14px 10px',
          backgroundColor: 'var(--surface)',
          border: `1px solid ${error ? 'var(--destructive)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)',
          position: 'relative',
        }}
      >
        <div
          {...attributes}
          {...listeners}
          style={{
            color: 'var(--text-muted)',
            cursor: 'grab',
            display: 'flex',
            alignItems: 'center',
            paddingBottom: '6px',
            flexShrink: 0,
          }}
        >
          <GripVertical size={14} />
        </div>

        <div style={{ flex: '0 0 160px' }}>
          <div style={labelStyle}>Field</div>
          <select
            value={rule.field}
            onChange={e => handleFieldChange(e.target.value)}
            style={selectStyle}
          >
            <option value="">Select field...</option>
            {schema.fields.map(f => (
              <option key={f.name} value={f.name}>{f.label}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: '0 0 160px' }}>
          <div style={labelStyle}>Condition</div>
          <select
            value={rule.operator}
            onChange={e => handleOperatorChange(e.target.value)}
            style={{ ...selectStyle, opacity: !selectedField ? 0.5 : 1 }}
            disabled={!selectedField}
          >
            {operators.map(op => (
              <option key={op} value={op}>{OPERATOR_LABELS[op]}</option>
            ))}
          </select>
        </div>

        {renderValueInput()}

        <div style={{ paddingBottom: '4px', flexShrink: 0 }}>
          <button
            onClick={() => removeNode(rule.id)}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius)',
              border: '1px solid transparent',
              backgroundColor: 'transparent',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--destructive)'
              e.currentTarget.style.backgroundColor = 'rgba(255,68,68,0.08)'
              e.currentTarget.style.borderColor = 'var(--destructive)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-muted)'
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.borderColor = 'transparent'
            }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {error && (
        <div style={{ fontSize: '11px', color: 'var(--destructive)', marginTop: '4px', paddingLeft: '4px' }}>
          {error.message}
        </div>
      )}
    </div>
  )
}

export default memo(QueryRuleComponent)