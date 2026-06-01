'use client'

import { memo, useCallback } from 'react'
import { useQueryStore } from '@/store'
import { QueryRule as QueryRuleType } from '@/types'
import { getOperatorsForType, OPERATOR_LABELS, needsNoValue, needsTwoValues } from '@/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/Button'
import { ChipSelect, ChipInput } from '@/components/ui/Chip'
import { Icon, IconName } from '@/components/ui/Icon'
import { useHover } from '@/hooks/useHover'

interface Props {
  rule: QueryRuleType
}

const FIELD_TYPE_ICONS: Record<string, IconName> = {
  string: 'typeText',
  number: 'hash',
  date: 'calendar',
  enum: 'list',
  boolean: 'toggle',
}

function QueryRuleComponent({ rule }: Props) {
  const { schema, updateRule, removeNode, validationErrors } = useQueryStore()
  const { hovered, onMouseEnter, onMouseLeave } = useHover()
  const error = validationErrors.find(e => e.nodeId === rule.id)
  const selectedField = schema.fields.find(f => f.name === rule.field)
  const operators = selectedField ? getOperatorsForType(selectedField.type) : []
  const errorId = `error-${rule.id}`

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: rule.id })

  const dragStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : undefined,
    animation: 'slideDown 0.2s ease',
  }

  const handleFieldChange = useCallback((field: string) => {
    const newField = schema.fields.find(f => f.name === field)
    const newOperators = newField ? getOperatorsForType(newField.type) : []
    updateRule(rule.id, { field, operator: newOperators[0] ?? 'equals', value: '' })
  }, [rule.id, schema.fields, updateRule])

  const handleOperatorChange = useCallback((operator: string) => {
    updateRule(rule.id, { operator: operator as QueryRuleType['operator'], value: '' })
  }, [rule.id, updateRule])

  const renderValueInput = () => {
    if (!selectedField || needsNoValue(rule.operator)) {
      return (
        <div
          aria-label="No value required for this operator"
          style={{
            padding: '0 var(--space-3)',
            borderRadius: 'var(--radius-sm)',
            border: '1px dashed var(--border)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-muted)',
            fontSize: '11px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            fontStyle: 'italic',
          }}
        >
          no value needed
        </div>
      )
    }

    if (needsTwoValues(rule.operator)) {
      const [a, b] = (rule.value as [string, string]) ?? ['', '']
      const inputType = selectedField.type === 'date' ? 'date' : 'number'
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <ChipInput
            type={inputType}
            value={String(a ?? '')}
            onChange={e => updateRule(rule.id, { value: [e.target.value, b] })}
            style={{ width: '100px' }}
            placeholder="From"
            aria-label="Range start value"
            error={!!error}
          />
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>—</span>
          <ChipInput
            type={inputType}
            value={String(b ?? '')}
            onChange={e => updateRule(rule.id, { value: [a, e.target.value] })}
            style={{ width: '100px' }}
            placeholder="To"
            aria-label="Range end value"
            error={!!error}
          />
        </div>
      )
    }

    if (selectedField.type === 'enum' && (rule.operator === 'in_array' || rule.operator === 'not_in_array')) {
      const selected = (rule.value as string[]) ?? []
      return (
        <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }} role="group" aria-label="Select values">
          {selectedField.enumValues?.map(val => (
            <button
              key={val}
              onClick={() => {
                const next = selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val]
                updateRule(rule.id, { value: next })
              }}
              aria-pressed={selected.includes(val)}
              style={{
                padding: '3px var(--space-3)',
                borderRadius: '20px',
                border: `1px solid ${selected.includes(val) ? 'var(--accent)' : 'var(--border)'}`,
                backgroundColor: selected.includes(val) ? 'var(--accent)' : 'var(--bg)',
                color: selected.includes(val) ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: '11px',
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
                fontWeight: selected.includes(val) ? 600 : 400,
                transition: 'all 0.15s ease',
                height: '28px',
              }}
            >
              {val}
            </button>
          ))}
        </div>
      )
    }

    if (selectedField.type === 'enum') {
      return (
        <ChipSelect
          value={String(rule.value ?? '')}
          onChange={e => updateRule(rule.id, { value: e.target.value })}
          aria-label="Select enum value"
          error={!!error}
          aria-describedby={error ? errorId : undefined}
        >
          <option value="">Select...</option>
          {selectedField.enumValues?.map(val => <option key={val} value={val}>{val}</option>)}
        </ChipSelect>
      )
    }

    if (selectedField.type === 'boolean') {
      return (
        <ChipSelect
          value={String(rule.value ?? '')}
          onChange={e => updateRule(rule.id, { value: e.target.value === 'true' })}
          aria-label="Select boolean value"
          error={!!error}
          aria-describedby={error ? errorId : undefined}
        >
          <option value="">Select...</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </ChipSelect>
      )
    }

    if (selectedField.type === 'date') {
      return (
        <ChipInput
          type="date"
          value={String(rule.value ?? '')}
          onChange={e => updateRule(rule.id, { value: e.target.value })}
          style={{ width: '150px' }}
          aria-label="Date value"
          error={!!error}
          aria-describedby={error ? errorId : undefined}
        />
      )
    }

    if (selectedField.type === 'number') {
      return (
        <ChipInput
          type="number"
          value={String(rule.value ?? '')}
          onChange={e => updateRule(rule.id, { value: e.target.value === '' ? '' : Number(e.target.value) })}
          style={{ width: '120px' }}
          placeholder="Value..."
          aria-label="Number value"
          error={!!error}
          aria-describedby={error ? errorId : undefined}
        />
      )
    }

    return (
      <ChipInput
        type="text"
        value={String(rule.value ?? '')}
        onChange={e => updateRule(rule.id, { value: e.target.value })}
        style={{ minWidth: '140px' }}
        placeholder="Value..."
        aria-label="Text value"
        error={!!error}
        aria-describedby={error ? errorId : undefined}
      />
    )
  }

  return (
    <div ref={setNodeRef} style={dragStyle} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: 'var(--space-2) var(--space-3)',
          backgroundColor: hovered ? 'var(--surface-raised)' : 'var(--surface)',
          border: `1px solid ${error ? 'var(--destructive)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)',
          boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow)',
          transition: 'all 0.15s ease',
          flexWrap: 'wrap',
        }}
        role="group"
        aria-label="Query condition"
      >
        <div
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          style={{
            color: hovered ? 'var(--text-muted)' : 'transparent',
            cursor: 'grab',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            transition: 'color 0.15s ease',
          }}
        >
          <Icon name="grip" size={14} />
        </div>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {selectedField && (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 'var(--space-2)',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Icon name={FIELD_TYPE_ICONS[selectedField.type]} size={10} />
            </div>
          )}
          <ChipSelect
            value={rule.field}
            onChange={e => handleFieldChange(e.target.value)}
            hasIcon={!!selectedField}
            aria-label="Select field"
            error={!!error}
            style={{ minWidth: '140px' }}
          >
            <option value="">Select field...</option>
            {schema.fields.map(f => <option key={f.name} value={f.name}>{f.label}</option>)}
          </ChipSelect>
        </div>

        <ChipSelect
          value={rule.operator}
          onChange={e => handleOperatorChange(e.target.value)}
          disabled={!selectedField}
          aria-label="Select operator"
          style={{ minWidth: '130px', opacity: !selectedField ? 0.4 : 1 }}
        >
          {operators.map(op => <option key={op} value={op}>{OPERATOR_LABELS[op]}</option>)}
        </ChipSelect>

        {renderValueInput()}

        <div style={{ marginLeft: 'auto', opacity: hovered ? 1 : 0, transition: 'opacity 0.15s ease', flexShrink: 0 }}>
          <Button
            variant="danger"
            size="sm"
            label="Delete rule"
            onClick={() => removeNode(rule.id)}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--destructive)'
              e.currentTarget.style.backgroundColor = 'var(--destructive-bg)'
              e.currentTarget.style.borderColor = 'var(--destructive)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-muted)'
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.borderColor = 'transparent'
            }}
          >
            <Icon name="trash" size={12} />
          </Button>
        </div>
      </div>

      {error && (
        <div
          id={errorId}
          role="alert"
          style={{
            fontSize: '11px',
            color: 'var(--destructive)',
            marginTop: 'var(--space-1)',
            paddingLeft: '34px',
            fontFamily: 'var(--font-sans)',
          }}
        >
          ⚠ {error.message}
        </div>
      )}
    </div>
  )
}

export default memo(QueryRuleComponent)