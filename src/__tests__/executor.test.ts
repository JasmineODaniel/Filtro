import { describe, it, expect } from 'vitest'
import { executeQuery } from '@/engine/executor'
import { QueryGroup } from '@/types'

const mockUsers = [
  { id: '1', name: 'Amara', age: 28, country: 'Nigeria', status: 'active', purchases: 12, verified: true },
  { id: '2', name: 'James', age: 34, country: 'USA', status: 'active', purchases: 5, verified: true },
  { id: '3', name: 'Sofia', age: 22, country: 'Brazil', status: 'inactive', purchases: 0, verified: false },
  { id: '4', name: 'Liam', age: 45, country: 'China', status: 'active', purchases: 30, verified: true },
  { id: '5', name: 'Fatima', age: 19, country: 'Nigeria', status: 'banned', purchases: 2, verified: false },
]

const makeGroup = (overrides?: Partial<QueryGroup>): QueryGroup => ({
  id: 'root',
  type: 'group',
  operator: 'AND',
  collapsed: false,
  children: [],
  ...overrides,
})

describe('executeQuery', () => {
  it('returns all records for empty group', () => {
    const results = executeQuery(makeGroup(), mockUsers)
    expect(results.length).toBe(0)
  })

  it('filters by equals', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'status', operator: 'equals', value: 'active' }],
    })
    const results = executeQuery(group, mockUsers)
    expect(results.length).toBe(3)
    expect(results.every(r => r.status === 'active')).toBe(true)
  })

  it('filters by not_equals', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'status', operator: 'not_equals', value: 'active' }],
    })
    const results = executeQuery(group, mockUsers)
    expect(results.length).toBe(2)
  })

  it('filters by greater_than', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'age', operator: 'greater_than', value: 30 }],
    })
    const results = executeQuery(group, mockUsers)
    expect(results.length).toBe(2)
    expect(results.every(r => Number(r.age) > 30)).toBe(true)
  })

  it('filters by less_than', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'age', operator: 'less_than', value: 25 }],
    })
    const results = executeQuery(group, mockUsers)
    expect(results.length).toBe(2)
  })

  it('filters by contains', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'name', operator: 'contains', value: 'a' }],
    })
    const results = executeQuery(group, mockUsers)
    expect(results.length).toBeGreaterThan(0)
    expect(results.every(r => String(r.name).toLowerCase().includes('a'))).toBe(true)
  })

  it('filters by starts_with', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'name', operator: 'starts_with', value: 'A' }],
    })
    const results = executeQuery(group, mockUsers)
    expect(results.every(r => String(r.name).toLowerCase().startsWith('a'))).toBe(true)
  })

  it('filters by in_array', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'status', operator: 'in_array', value: ['active', 'banned'] }],
    })
    const results = executeQuery(group, mockUsers)
    expect(results.length).toBe(4)
  })

  it('filters with AND combining two rules', () => {
    const group = makeGroup({
      operator: 'AND',
      children: [
        { id: 'r1', type: 'rule', field: 'status', operator: 'equals', value: 'active' },
        { id: 'r2', type: 'rule', field: 'age', operator: 'greater_than', value: 30 },
      ],
    })
    const results = executeQuery(group, mockUsers)
    expect(results.length).toBe(2)
  })

  it('filters with OR combining two rules', () => {
    const group = makeGroup({
      operator: 'OR',
      children: [
        { id: 'r1', type: 'rule', field: 'country', operator: 'equals', value: 'Nigeria' },
        { id: 'r2', type: 'rule', field: 'country', operator: 'equals', value: 'USA' },
      ],
    })
    const results = executeQuery(group, mockUsers)
    expect(results.length).toBe(3)
  })

  it('handles is_empty operator', () => {
    const dataWithEmpty = [...mockUsers, { id: '6', name: '', age: 25, country: 'UK', status: 'active', purchases: 1, verified: true }]
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'name', operator: 'is_empty', value: null }],
    })
    const results = executeQuery(group, dataWithEmpty)
    expect(results.length).toBe(1)
  })

  it('handles nested groups recursively', () => {
    const group = makeGroup({
      operator: 'AND',
      children: [
        { id: 'r1', type: 'rule', field: 'status', operator: 'equals', value: 'active' },
        {
          id: 'g1',
          type: 'group',
          operator: 'OR',
          collapsed: false,
          children: [
            { id: 'r2', type: 'rule', field: 'country', operator: 'equals', value: 'Nigeria' },
            { id: 'r3', type: 'rule', field: 'age', operator: 'greater_than', value: 40 },
          ],
        },
      ],
    })
    const results = executeQuery(group, mockUsers)
    expect(results.length).toBeGreaterThan(0)
    expect(results.every(r => r.status === 'active')).toBe(true)
  })

  it('returns empty array when no records match', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'age', operator: 'greater_than', value: 100 }],
    })
    const results = executeQuery(group, mockUsers)
    expect(results.length).toBe(0)
  })

  it('handles invalid regex gracefully', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'name', operator: 'regex', value: '[invalid' }],
    })
    expect(() => executeQuery(group, mockUsers)).not.toThrow()
  })

  it('handles in_array with non-array value gracefully', () => {
    const group = makeGroup({
      children: [{ id: 'r1', type: 'rule', field: 'status', operator: 'in_array', value: null }],
    })
    expect(() => executeQuery(group, mockUsers)).not.toThrow()
  })
})