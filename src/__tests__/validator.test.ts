import { describe, it, expect } from 'vitest'
import { validateTree, isTreeValid } from '@/utils/validator'
import { QueryGroup, SchemaField } from '@/types'

const fields: SchemaField[] = [
  { name: 'name', label: 'Name', type: 'string' },
  { name: 'age', label: 'Age', type: 'number' },
  { name: 'status', label: 'Status', type: 'enum', enumValues: ['active', 'inactive'] },
  { name: 'createdAt', label: 'Created At', type: 'date' },
  { name: 'verified', label: 'Verified', type: 'boolean' },
]

const makeGroup = (overrides?: Partial<QueryGroup>): QueryGroup => ({
  id: 'root',
  type: 'group',
  operator: 'AND',
  collapsed: false,
  children: [],
  ...overrides,
})

describe('validateTree', () => {
  it('returns error for empty group', () => {
    const errors = validateTree(makeGroup(), fields)
    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0].message).toContain('at least one condition')
  })

  it('returns error when field is missing', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: '', operator: 'equals', value: 'active' }],
    })
    const errors = validateTree(group, fields)
    expect(errors.some(e => e.message === 'Select a field')).toBe(true)
  })

  it('returns error when value is missing', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'name', operator: 'equals', value: '' }],
    })
    const errors = validateTree(group, fields)
    expect(errors.some(e => e.message === 'Value is required')).toBe(true)
  })

  it('returns no error for valid rule', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'name', operator: 'equals', value: 'John' }],
    })
    const errors = validateTree(group, fields)
    expect(errors.length).toBe(0)
  })

  it('returns no error for is_empty operator without value', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'name', operator: 'is_empty', value: '' }],
    })
    const errors = validateTree(group, fields)
    expect(errors.length).toBe(0)
  })

  it('returns error for between operator with missing values', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'age', operator: 'between', value: ['', ''] }],
    })
    const errors = validateTree(group, fields)
    expect(errors.length).toBeGreaterThan(0)
  })

  it('returns no error for valid between operator', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'age', operator: 'between', value: [18, 30] }],
    })
    const errors = validateTree(group, fields)
    expect(errors.length).toBe(0)
  })

  it('returns error for in_array with empty selection', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'status', operator: 'in_array', value: [] }],
    })
    const errors = validateTree(group, fields)
    expect(errors.length).toBeGreaterThan(0)
  })

  it('validates nested groups recursively', () => {
    const group = makeGroup({
      children: [{
        id: 'g1',
        type: 'group',
        operator: 'OR',
        collapsed: false,
        children: [],
      }],
    })
    const errors = validateTree(group, fields)
    expect(errors.some(e => e.nodeId === 'g1')).toBe(true)
  })
})

describe('isTreeValid', () => {
  it('returns false for empty group', () => {
    expect(isTreeValid(makeGroup(), fields)).toBe(false)
  })

  it('returns true for valid tree', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'name', operator: 'equals', value: 'John' }],
    })
    expect(isTreeValid(group, fields)).toBe(true)
  })
})