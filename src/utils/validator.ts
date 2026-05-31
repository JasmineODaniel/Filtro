import { QueryNode, QueryGroup, QueryRule, ValidationError, SchemaField } from '@/types'
import { needsNoValue, needsTwoValues } from './operators'

const validateRule = (rule: QueryRule, fields: SchemaField[]): ValidationError[] => {
  const errors: ValidationError[] = []
  const field = fields.find(f => f.name === rule.field)

  if (!rule.field) {
    errors.push({ nodeId: rule.id, message: 'Select a field' })
    return errors
  }

  if (!rule.operator) {
    errors.push({ nodeId: rule.id, message: 'Select an operator' })
    return errors
  }

  if (!field) {
    errors.push({ nodeId: rule.id, message: 'Invalid field' })
    return errors
  }

  if (needsNoValue(rule.operator)) return errors

  if (needsTwoValues(rule.operator)) {
    const [a, b] = (rule.value as [unknown, unknown]) ?? []
    if (a === undefined || a === '' || b === undefined || b === '') {
      errors.push({ nodeId: rule.id, message: 'Both values are required for between' })
    }
    return errors
  }

  if (field.type === 'enum' && (rule.operator === 'in_array' || rule.operator === 'not_in_array')) {
    const arr = rule.value as string[]
    if (!arr || arr.length === 0) {
      errors.push({ nodeId: rule.id, message: 'Select at least one value' })
    }
    return errors
  }

  if (rule.value === undefined || rule.value === '' || rule.value === null) {
    errors.push({ nodeId: rule.id, message: 'Value is required' })
  }

  return errors
}

const validateGroup = (group: QueryGroup, fields: SchemaField[]): ValidationError[] => {
  const errors: ValidationError[] = []

  if (group.children.length === 0) {
    errors.push({ nodeId: group.id, message: 'Group must have at least one condition' })
    return errors
  }

  for (const child of group.children) {
    errors.push(...validateNode(child, fields))
  }

  return errors
}

const validateNode = (node: QueryNode, fields: SchemaField[]): ValidationError[] => {
  if (node.type === 'rule') return validateRule(node, fields)
  return validateGroup(node, fields)
}

export const validateTree = (root: QueryGroup, fields: SchemaField[]): ValidationError[] => {
  return validateGroup(root, fields)
}

export const isTreeValid = (root: QueryGroup, fields: SchemaField[]): boolean => {
  return validateTree(root, fields).length === 0
}