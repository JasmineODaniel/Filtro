import { describe, it, expect } from 'vitest'
import { getOperatorsForType, needsNoValue, needsTwoValues, OPERATOR_LABELS } from '@/utils/operators'

describe('getOperatorsForType', () => {
  it('returns string operators for string type', () => {
    const ops = getOperatorsForType('string')
    expect(ops).toContain('equals')
    expect(ops).toContain('contains')
    expect(ops).toContain('starts_with')
    expect(ops).toContain('regex')
  })

  it('returns number operators for number type', () => {
    const ops = getOperatorsForType('number')
    expect(ops).toContain('greater_than')
    expect(ops).toContain('less_than')
    expect(ops).toContain('between')
    expect(ops).not.toContain('contains')
    expect(ops).not.toContain('regex')
  })

  it('returns date operators for date type', () => {
    const ops = getOperatorsForType('date')
    expect(ops).toContain('before')
    expect(ops).toContain('after')
    expect(ops).toContain('between')
    expect(ops).not.toContain('contains')
  })

  it('returns enum operators for enum type', () => {
    const ops = getOperatorsForType('enum')
    expect(ops).toContain('in_array')
    expect(ops).toContain('not_in_array')
    expect(ops).not.toContain('greater_than')
    expect(ops).not.toContain('regex')
  })

  it('returns boolean operators for boolean type', () => {
    const ops = getOperatorsForType('boolean')
    expect(ops).toContain('equals')
    expect(ops).toContain('not_equals')
    expect(ops.length).toBe(2)
  })
})

describe('needsNoValue', () => {
  it('returns true for is_empty', () => {
    expect(needsNoValue('is_empty')).toBe(true)
  })

  it('returns true for is_not_empty', () => {
    expect(needsNoValue('is_not_empty')).toBe(true)
  })

  it('returns false for equals', () => {
    expect(needsNoValue('equals')).toBe(false)
  })

  it('returns false for contains', () => {
    expect(needsNoValue('contains')).toBe(false)
  })

  it('returns false for greater_than', () => {
    expect(needsNoValue('greater_than')).toBe(false)
  })
})

describe('needsTwoValues', () => {
  it('returns true for between', () => {
    expect(needsTwoValues('between')).toBe(true)
  })

  it('returns false for equals', () => {
    expect(needsTwoValues('equals')).toBe(false)
  })

  it('returns false for greater_than', () => {
    expect(needsTwoValues('greater_than')).toBe(false)
  })
})

describe('OPERATOR_LABELS', () => {
  it('has label for equals', () => {
    expect(OPERATOR_LABELS['equals']).toBe('equals')
  })

  it('has label for greater_than', () => {
    expect(OPERATOR_LABELS['greater_than']).toBe('greater than')
  })

  it('has label for is_empty', () => {
    expect(OPERATOR_LABELS['is_empty']).toBe('is empty')
  })

  it('has label for in_array', () => {
    expect(OPERATOR_LABELS['in_array']).toBe('is in')
  })
})