import type { QueryGroup, QueryRule, Schema, Operator } from '@/types/query'

function formatVal(value: unknown): string {
  if (typeof value === 'string') return `"${value}"`
  if (Array.isArray(value)) return (value as unknown[]).map(v => `"${v}"`).join(', ')
  if (value === null || value === undefined) return 'empty'
  return String(value)
}

function operatorPhrase(label: string, operator: Operator, value: unknown): string {
  switch (operator) {
    case 'equals': return `${label} is ${formatVal(value)}`
    case 'not_equals': return `${label} is not ${formatVal(value)}`
    case 'contains': return `${label} contains ${formatVal(value)}`
    case 'not_contains': return `${label} does not contain ${formatVal(value)}`
    case 'starts_with': return `${label} starts with ${formatVal(value)}`
    case 'ends_with': return `${label} ends with ${formatVal(value)}`
    case 'greater_than': return `${label} is greater than ${formatVal(value)}`
    case 'less_than': return `${label} is less than ${formatVal(value)}`
    case 'greater_than_or_equal': return `${label} is at least ${formatVal(value)}`
    case 'less_than_or_equal': return `${label} is at most ${formatVal(value)}`
    case 'between': {
      const arr = Array.isArray(value) ? value as [unknown, unknown] : ['', '']
      return `${label} is between ${formatVal(arr[0])} and ${formatVal(arr[1])}`
    }
    case 'before': return `${label} is before ${formatVal(value)}`
    case 'after': return `${label} is after ${formatVal(value)}`
    case 'is_empty': return `${label} is empty`
    case 'is_not_empty': return `${label} is not empty`
    case 'in_array': {
      const arr = Array.isArray(value) ? value as unknown[] : []
      return `${label} is one of ${arr.map(formatVal).join(', ')}`
    }
    case 'not_in_array': {
      const arr = Array.isArray(value) ? value as unknown[] : []
      return `${label} is none of ${arr.map(formatVal).join(', ')}`
    }
    case 'regex': return `${label} matches the pattern ${formatVal(value)}`
    default: return `${label} matches ${formatVal(value)}`
  }
}

function describeRule(rule: QueryRule, schema: Schema): string {
  if (!rule.field) return ''
  const field = schema.fields.find(f => f.name === rule.field)
  return operatorPhrase(field?.label ?? rule.field, rule.operator, rule.value)
}

function describeGroup(group: QueryGroup, schema: Schema, depth: number): string {
  const parts = group.children
    .map(child => child.type === 'rule' ? describeRule(child, schema) : describeGroup(child, schema, depth + 1))
    .filter(Boolean)
  if (parts.length === 0) return ''
  const connector = group.operator === 'AND' ? ' and ' : ' or '
  const joined = parts.join(connector)
  return depth > 0 ? `(${joined})` : joined
}

export function explainQuery(root: QueryGroup, schema: Schema): string {
  const body = describeGroup(root, schema, 0)
  if (!body) return `This query retrieves all ${schema.name} records.`
  return `This query retrieves all ${schema.name} records where ${body}.`
}
