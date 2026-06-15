import { QueryGroup, QueryNode, QueryRule, Operator } from '@/types'
import { escapeSQLString, escapeSQLLike, escapeRegexLiteral, isSafeRegex } from './sanitize'

const formatValue = (value: unknown, operator: Operator): string => {
  if (operator === 'is_empty' || operator === 'is_not_empty') return ''
  if (operator === 'in_array' || operator === 'not_in_array') {
    return `(${(value as string[]).map(v => `'${escapeSQLString(String(v))}'`).join(', ')})`
  }
  if (operator === 'between') {
    const [a, b] = value as [unknown, unknown]
    return `${a} AND ${b}`
  }
  if (typeof value === 'string') return `'${escapeSQLString(value)}'`
  return String(value)
}

const operatorToSQL = (operator: Operator): string => {
  const map: Partial<Record<Operator, string>> = {
    equals: '=',
    not_equals: '!=',
    contains: 'LIKE',
    not_contains: 'NOT LIKE',
    starts_with: 'LIKE',
    ends_with: 'LIKE',
    greater_than: '>',
    less_than: '<',
    greater_than_or_equal: '>=',
    less_than_or_equal: '<=',
    between: 'BETWEEN',
    before: '<',
    after: '>',
    is_empty: 'IS NULL',
    is_not_empty: 'IS NOT NULL',
    in_array: 'IN',
    not_in_array: 'NOT IN',
    regex: 'REGEXP',
  }
  return map[operator] ?? '='
}

const ruleToSQL = (rule: QueryRule): string => {
  const op = operatorToSQL(rule.operator)
  if (rule.operator === 'is_empty' || rule.operator === 'is_not_empty') {
    return `${rule.field} ${op}`
  }
  if (rule.operator === 'contains' || rule.operator === 'not_contains') {
    return `${rule.field} ${op} '%${escapeSQLLike(rule.value as string)}%'`
  }
  if (rule.operator === 'starts_with') {
    return `${rule.field} ${op} '${escapeSQLLike(rule.value as string)}%'`
  }
  if (rule.operator === 'ends_with') {
    return `${rule.field} ${op} '%${escapeSQLLike(rule.value as string)}'`
  }
  return `${rule.field} ${op} ${formatValue(rule.value, rule.operator)}`
}

const nodeToSQL = (node: QueryNode, depth: number = 0): string => {
  if (node.type === 'rule') return ruleToSQL(node)
  return groupToSQL(node, depth)
}

const groupToSQL = (group: QueryGroup, depth: number = 0): string => {
  if (group.children.length === 0) return ''
  const indent = '  '.repeat(depth)
  const childIndent = '  '.repeat(depth + 1)
  const parts = group.children
    .filter(child => child.type === 'rule' || (child.type === 'group' && child.children.length > 0))
    .map(child => `${childIndent}${nodeToSQL(child, depth + 1)}`)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].trim()
  return `(\n${parts.join(`\n${childIndent}${group.operator}\n`)}\n${indent})`
}

export const generateSQL = (group: QueryGroup, schema: string = 'records'): string => {
  const where = groupToSQL(group, 0)
  if (!where) return `SELECT * FROM ${schema}`
  return `SELECT * FROM ${schema}\nWHERE ${where.trim()}`
}

const operatorToMongo = (operator: Operator): string => {
  const map: Partial<Record<Operator, string>> = {
    equals: '$eq',
    not_equals: '$ne',
    greater_than: '$gt',
    less_than: '$lt',
    greater_than_or_equal: '$gte',
    less_than_or_equal: '$lte',
    in_array: '$in',
    not_in_array: '$nin',
    before: '$lt',
    after: '$gt',
  }
  return map[operator] ?? '$eq'
}

const ruleToMongo = (rule: QueryRule): object => {
  if (rule.operator === 'is_empty') return { [rule.field]: { $in: [null, ''] } }
  if (rule.operator === 'is_not_empty') return { [rule.field]: { $nin: [null, ''] } }
  if (rule.operator === 'contains') return { [rule.field]: { $regex: escapeRegexLiteral(rule.value as string), $options: 'i' } }
  if (rule.operator === 'not_contains') return { [rule.field]: { $not: { $regex: escapeRegexLiteral(rule.value as string) } } }
  if (rule.operator === 'starts_with') return { [rule.field]: { $regex: `^${escapeRegexLiteral(rule.value as string)}`, $options: 'i' } }
  if (rule.operator === 'ends_with') return { [rule.field]: { $regex: `${escapeRegexLiteral(rule.value as string)}$`, $options: 'i' } }
  if (rule.operator === 'regex') {
    if (!isSafeRegex(rule.value)) return {}
    return { [rule.field]: { $regex: rule.value } }
  }
  if (rule.operator === 'between') {
    const [a, b] = rule.value as [unknown, unknown]
    return { [rule.field]: { $gte: a, $lte: b } }
  }
  return { [rule.field]: { [operatorToMongo(rule.operator)]: rule.value } }
}

const nodeToMongo = (node: QueryNode): object => {
  if (node.type === 'rule') return ruleToMongo(node)
  return groupToMongo(node)
}

const groupToMongo = (group: QueryGroup): object => {
  if (group.children.length === 0) return {}
  const parts = group.children.map(nodeToMongo)
  if (parts.length === 1) return parts[0]
  return { [`$${group.operator.toLowerCase()}`]: parts }
}

export const generateMongo = (group: QueryGroup): string => {
  return JSON.stringify(groupToMongo(group), null, 2)
}

// ─── GraphQL (Prisma-style WHERE filter) ──────────────────────────────────────

const formatGQLValue = (value: unknown): string => {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'boolean') return String(value)
  if (typeof value === 'number') return String(value)
  return `"${escapeSQLString(String(value))}"`
}

const ruleToGQLFilter = (rule: QueryRule): string => {
  switch (rule.operator) {
    case 'is_empty': return 'equals: null'
    case 'is_not_empty': return 'not: { equals: null }'
    case 'equals': return `equals: ${formatGQLValue(rule.value)}`
    case 'not_equals': return `not: { equals: ${formatGQLValue(rule.value)} }`
    case 'contains': return `contains: ${formatGQLValue(rule.value)}`
    case 'not_contains': return `not: { contains: ${formatGQLValue(rule.value)} }`
    case 'starts_with': return `startsWith: ${formatGQLValue(rule.value)}`
    case 'ends_with': return `endsWith: ${formatGQLValue(rule.value)}`
    case 'greater_than': case 'after': return `gt: ${formatGQLValue(rule.value)}`
    case 'less_than': case 'before': return `lt: ${formatGQLValue(rule.value)}`
    case 'greater_than_or_equal': return `gte: ${formatGQLValue(rule.value)}`
    case 'less_than_or_equal': return `lte: ${formatGQLValue(rule.value)}`
    case 'between': {
      const [a, b] = rule.value as [unknown, unknown]
      return `gte: ${formatGQLValue(a)}, lte: ${formatGQLValue(b)}`
    }
    case 'in_array': return `in: [${(rule.value as string[]).map(formatGQLValue).join(', ')}]`
    case 'not_in_array': return `notIn: [${(rule.value as string[]).map(formatGQLValue).join(', ')}]`
    case 'regex': return `regex: ${formatGQLValue(rule.value)}`
    default: return `equals: ${formatGQLValue(rule.value)}`
  }
}

const nodeToGQL = (node: QueryNode, indent: string): string => {
  if (node.type === 'rule') {
    return `${indent}{ ${node.field}: { ${ruleToGQLFilter(node)} } }`
  }
  const childParts = node.children
    .filter(c => c.type === 'rule' || (c.type === 'group' && c.children.length > 0))
    .map(c => nodeToGQL(c, indent + '  '))
  if (childParts.length === 0) return ''
  return `${indent}{ ${node.operator}: [\n${childParts.join(',\n')}\n${indent}] }`
}

export const generateGraphQL = (group: QueryGroup, schemaName: string = 'records', fields: string[] = []): string => {
  const childParts = group.children
    .filter(c => c.type === 'rule' || (c.type === 'group' && c.children.length > 0))
    .map(c => nodeToGQL(c, '        '))

  const selectionFields = (fields.length > 0 ? fields : ['id']).map(f => `    ${f}`).join('\n')

  if (childParts.length === 0) {
    return `query {\n  ${schemaName} {\n${selectionFields}\n  }\n}`
  }

  const whereBody = childParts.length === 1 && childParts[0].trimStart().startsWith('{')
    ? childParts[0]
    : `      ${group.operator}: [\n${childParts.join(',\n')}\n      ]`

  return `query {\n  ${schemaName}(\n    where: {\n${whereBody}\n    }\n  ) {\n${selectionFields}\n  }\n}`
}