import { QueryTree, Operator } from '@/types'

export const MAX_IMPORT_FILE_SIZE = 512 * 1024

const MAX_NESTING_DEPTH = 10
const MAX_NODE_COUNT = 500

const VALID_OPERATORS: ReadonlySet<string> = new Set<Operator>([
  'equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with',
  'is_empty', 'is_not_empty', 'regex', 'greater_than', 'less_than',
  'greater_than_or_equal', 'less_than_or_equal', 'between', 'before', 'after',
  'in_array', 'not_in_array',
])

export const escapeSQLString = (value: string): string =>
  value.replace(/\\/g, '\\\\').replace(/'/g, "''")

export const escapeSQLLike = (value: string): string =>
  escapeSQLString(value).replace(/%/g, '\\%').replace(/_/g, '\\_')

export const escapeRegexLiteral = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const isSafeRegex = (pattern: unknown): boolean => {
  if (typeof pattern !== 'string') return false
  try {
    new RegExp(pattern)
    return true
  } catch {
    return false
  }
}

const validateNode = (node: unknown, depth: number, counter: { n: number }): boolean => {
  if (++counter.n > MAX_NODE_COUNT) throw new Error('Too many nodes')
  if (depth > MAX_NESTING_DEPTH) throw new Error('Nesting too deep')
  if (!node || typeof node !== 'object') return false
  const n = node as Record<string, unknown>
  if (typeof n.id !== 'string' || !n.id) return false

  if (n.type === 'rule') {
    return (
      typeof n.field === 'string' &&
      typeof n.operator === 'string' &&
      VALID_OPERATORS.has(n.operator)
    )
  }

  if (n.type === 'group') {
    return (
      Array.isArray(n.children) &&
      (n.operator === 'AND' || n.operator === 'OR') &&
      typeof n.collapsed === 'boolean' &&
      (n.children as unknown[]).every(child => validateNode(child, depth + 1, counter))
    )
  }

  return false
}

export const validateImportedTree = (data: unknown): data is QueryTree => {
  if (!data || typeof data !== 'object') return false
  const tree = data as Record<string, unknown>
  try {
    return validateNode(tree.root, 0, { n: 0 })
  } catch {
    return false
  }
}
