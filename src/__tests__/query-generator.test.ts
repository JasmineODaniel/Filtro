import { describe, it, expect } from 'vitest'
import { generateSQL, generateMongo } from '@/utils/query-generator'
import { QueryGroup } from '@/types'

const makeGroup = (overrides?: Partial<QueryGroup>): QueryGroup => ({
  id: 'root',
  type: 'group',
  operator: 'AND',
  collapsed: false,
  children: [],
  ...overrides,
})

describe('generateSQL', () => {
  it('returns base SELECT when no conditions', () => {
    const group = makeGroup()
    expect(generateSQL(group, 'users')).toBe('SELECT * FROM users')
  })

  it('generates equals condition', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'status', operator: 'equals', value: 'active' }],
    })
    expect(generateSQL(group, 'users')).toContain("status = 'active'")
  })

  it('generates greater than condition', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'age', operator: 'greater_than', value: 18 }],
    })
    expect(generateSQL(group, 'users')).toContain('age > 18')
  })

  it('generates LIKE for contains', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'name', operator: 'contains', value: 'john' }],
    })
    expect(generateSQL(group, 'users')).toContain("name LIKE '%john%'")
  })

  it('generates IS NULL for is_empty', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'email', operator: 'is_empty', value: null }],
    })
    expect(generateSQL(group, 'users')).toContain('email IS NULL')
  })

  it('generates BETWEEN condition', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'age', operator: 'between', value: [18, 30] }],
    })
    expect(generateSQL(group, 'users')).toContain('BETWEEN')
  })

  it('generates AND for multiple conditions', () => {
    const group = makeGroup({
      operator: 'AND',
      children: [
        { id: 'r1', type: 'rule', field: 'age', operator: 'greater_than', value: 18 },
        { id: 'r2', type: 'rule', field: 'status', operator: 'equals', value: 'active' },
      ],
    })
    expect(generateSQL(group, 'users')).toContain('AND')
  })

  it('generates OR for OR group', () => {
    const group = makeGroup({
      operator: 'OR',
      children: [
        { id: 'r1', type: 'rule', field: 'age', operator: 'greater_than', value: 18 },
        { id: 'r2', type: 'rule', field: 'status', operator: 'equals', value: 'active' },
      ],
    })
    expect(generateSQL(group, 'users')).toContain('OR')
  })

  it('handles starts_with operator', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'name', operator: 'starts_with', value: 'Jo' }],
    })
    expect(generateSQL(group, 'users')).toContain("name LIKE 'Jo%'")
  })

  it('handles ends_with operator', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'name', operator: 'ends_with', value: 'son' }],
    })
    expect(generateSQL(group, 'users')).toContain("name LIKE '%son'")
  })
})

describe('generateMongo', () => {
  it('returns empty object for empty group', () => {
    const group = makeGroup()
    expect(JSON.parse(generateMongo(group))).toEqual({})
  })

  it('generates $eq for equals', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'status', operator: 'equals', value: 'active' }],
    })
    const result = JSON.parse(generateMongo(group))
    expect(result.status).toEqual({ $eq: 'active' })
  })

  it('generates $gt for greater_than', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'age', operator: 'greater_than', value: 18 }],
    })
    const result = JSON.parse(generateMongo(group))
    expect(result.age).toEqual({ $gt: 18 })
  })

  it('generates $and for AND group', () => {
    const group = makeGroup({
      operator: 'AND',
      children: [
        { id: 'r1', type: 'rule', field: 'age', operator: 'greater_than', value: 18 },
        { id: 'r2', type: 'rule', field: 'status', operator: 'equals', value: 'active' },
      ],
    })
    const result = JSON.parse(generateMongo(group))
    expect(result.$and).toBeDefined()
    expect(result.$and).toHaveLength(2)
  })

  it('generates $or for OR group', () => {
    const group = makeGroup({
      operator: 'OR',
      children: [
        { id: 'r1', type: 'rule', field: 'age', operator: 'greater_than', value: 18 },
        { id: 'r2', type: 'rule', field: 'status', operator: 'equals', value: 'active' },
      ],
    })
    const result = JSON.parse(generateMongo(group))
    expect(result.$or).toBeDefined()
  })

  it('generates $regex for contains', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'name', operator: 'contains', value: 'john' }],
    })
    const result = JSON.parse(generateMongo(group))
    expect(result.name.$regex).toBe('john')
  })

  it('generates $in for in_array', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'status', operator: 'in_array', value: ['active', 'inactive'] }],
    })
    const result = JSON.parse(generateMongo(group))
    expect(result.status.$in).toEqual(['active', 'inactive'])
  })
})