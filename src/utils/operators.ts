import { FieldType, Operator } from '@/types'

export const OPERATOR_LABELS: Record<Operator, string> = {
  equals: 'equals',
  not_equals: 'not equals',
  contains: 'contains',
  not_contains: 'does not contain',
  starts_with: 'starts with',
  ends_with: 'ends with',
  is_empty: 'is empty',
  is_not_empty: 'is not empty',
  regex: 'matches regex',
  greater_than: 'greater than',
  less_than: 'less than',
  greater_than_or_equal: 'greater than or equal',
  less_than_or_equal: 'less than or equal',
  between: 'between',
  before: 'before',
  after: 'after',
  in_array: 'is in',
  not_in_array: 'is not in',
}

export const OPERATORS_BY_TYPE: Record<FieldType, Operator[]> = {
  string: [
    'equals',
    'not_equals',
    'contains',
    'not_contains',
    'starts_with',
    'ends_with',
    'is_empty',
    'is_not_empty',
    'regex',
  ],
  number: [
    'equals',
    'not_equals',
    'greater_than',
    'less_than',
    'greater_than_or_equal',
    'less_than_or_equal',
    'between',
    'is_empty',
    'is_not_empty',
  ],
  date: [
    'equals',
    'not_equals',
    'before',
    'after',
    'between',
    'is_empty',
    'is_not_empty',
  ],
  enum: [
    'equals',
    'not_equals',
    'in_array',
    'not_in_array',
    'is_empty',
    'is_not_empty',
  ],
  boolean: ['equals', 'not_equals'],
}

export const getOperatorsForType = (type: FieldType): Operator[] => {
  return OPERATORS_BY_TYPE[type] ?? []
}

export const needsNoValue = (operator: Operator): boolean => {
  return operator === 'is_empty' || operator === 'is_not_empty'
}

export const needsTwoValues = (operator: Operator): boolean => {
  return operator === 'between'
}