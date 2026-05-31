import { QueryGroup, QueryNode, QueryRule } from '@/types'
import { needsNoValue } from '@/utils'

const evaluateRule = (rule: QueryRule, record: Record<string, unknown>): boolean => {
  const recordValue = record[rule.field]

  if (needsNoValue(rule.operator)) {
    if (rule.operator === 'is_empty') return recordValue === null || recordValue === undefined || recordValue === ''
    if (rule.operator === 'is_not_empty') return recordValue !== null && recordValue !== undefined && recordValue !== ''
  }

  const value = rule.value

  switch (rule.operator) {
    case 'equals':
      return String(recordValue).toLowerCase() === String(value).toLowerCase()
    case 'not_equals':
      return String(recordValue).toLowerCase() !== String(value).toLowerCase()
    case 'contains':
      return String(recordValue).toLowerCase().includes(String(value).toLowerCase())
    case 'not_contains':
      return !String(recordValue).toLowerCase().includes(String(value).toLowerCase())
    case 'starts_with':
      return String(recordValue).toLowerCase().startsWith(String(value).toLowerCase())
    case 'ends_with':
      return String(recordValue).toLowerCase().endsWith(String(value).toLowerCase())
    case 'regex':
      try {
        return new RegExp(String(value), 'i').test(String(recordValue))
      } catch {
        return false
      }
    case 'greater_than':
      return Number(recordValue) > Number(value)
    case 'less_than':
      return Number(recordValue) < Number(value)
    case 'greater_than_or_equal':
      return Number(recordValue) >= Number(value)
    case 'less_than_or_equal':
      return Number(recordValue) <= Number(value)
    case 'between': {
      const [a, b] = value as [unknown, unknown]
      const recDate = new Date(String(recordValue)).getTime()
      const aDate = new Date(String(a)).getTime()
      const bDate = new Date(String(b)).getTime()
      if (!isNaN(recDate) && !isNaN(aDate) && !isNaN(bDate)) {
        return recDate >= aDate && recDate <= bDate
      }
      const num = Number(recordValue)
      return num >= Number(a) && num <= Number(b)
    }
    case 'before':
      return new Date(String(recordValue)) < new Date(String(value))
    case 'after':
      return new Date(String(recordValue)) > new Date(String(value))
    case 'in_array':
      if (!Array.isArray(value)) return false
      return (value as unknown[]).map(v => String(v).toLowerCase()).includes(String(recordValue).toLowerCase())
    case 'not_in_array':
      if (!Array.isArray(value)) return true
      return !(value as unknown[]).map(v => String(v).toLowerCase()).includes(String(recordValue).toLowerCase())
    default:
      return false
  }
}

const evaluateNode = (node: QueryNode, record: Record<string, unknown>): boolean => {
  if (node.type === 'rule') return evaluateRule(node, record)
  return evaluateGroup(node, record)
}

const evaluateGroup = (group: QueryGroup, record: Record<string, unknown>): boolean => {
  if (group.children.length === 0) return true
  if (group.operator === 'AND') return group.children.every(child => evaluateNode(child, record))
  return group.children.some(child => evaluateNode(child, record))
}

export const executeQuery = (root: QueryGroup, dataset: object[]): Record<string, unknown>[] => {
  return (dataset as Record<string, unknown>[]).filter(record => evaluateGroup(root, record))
}