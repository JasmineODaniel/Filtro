export type StringOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'is_empty'
  | 'is_not_empty'
  | 'regex'

export type NumberOperator =
  | 'equals'
  | 'not_equals'
  | 'greater_than'
  | 'less_than'
  | 'greater_than_or_equal'
  | 'less_than_or_equal'
  | 'between'
  | 'is_empty'
  | 'is_not_empty'

export type DateOperator =
  | 'equals'
  | 'not_equals'
  | 'before'
  | 'after'
  | 'between'
  | 'is_empty'
  | 'is_not_empty'

export type EnumOperator =
  | 'equals'
  | 'not_equals'
  | 'in_array'
  | 'not_in_array'
  | 'is_empty'
  | 'is_not_empty'

export type BooleanOperator = 'equals' | 'not_equals'

export type Operator =
  | StringOperator
  | NumberOperator
  | DateOperator
  | EnumOperator
  | BooleanOperator

export type FieldType = 'string' | 'number' | 'date' | 'enum' | 'boolean'

export interface SchemaField {
  name: string
  label: string
  type: FieldType
  enumValues?: string[]
}

export interface Schema {
  id: string
  name: string
  fields: SchemaField[]
}

export interface QueryRule {
  id: string
  type: 'rule'
  field: string
  operator: Operator
  value: unknown
}

export interface QueryGroup {
  id: string
  type: 'group'
  operator: 'AND' | 'OR'
  children: QueryNode[]
  collapsed: boolean
}

export type QueryNode = QueryRule | QueryGroup

export interface QueryTree {
  root: QueryGroup
}

export interface ValidationError {
  nodeId: string
  message: string
}

export interface QueryPreset {
  id: string
  name: string
  tree: QueryTree
  createdAt: string
}

export interface QueryHistoryEntry {
  id: string
  tree: QueryTree
  timestamp: string
  label?: string
}