'use client'

import { memo, useMemo, useState } from 'react'
import { useQueryStore } from '@/store'
import { executeQuery } from '@/engine'
import { MOCK_DATA } from '@/schemas/mock-data'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { AnimatedItem, AnimatedPresenceWrapper, StaggeredItem } from '@/components/ui/Animated'
import { smooth } from '@/hooks/useAnimation'

function ResultsPanel() {
  const { tree, schema, pushHistory } = useQueryStore()
  const [isRunning, setIsRunning] = useState(false)
  const [hasRun, setHasRun] = useState(false)
  const [results, setResults] = useState<Record<string, unknown>[]>([])
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 5

  const sorted = useMemo(() => {
    if (!sortField) return results
    return [...results].sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      if (aVal === undefined || bVal === undefined) return 0
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      }
      return sortDir === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal))
    })
  }, [results, sortField, sortDir])

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const columns = schema.fields.map(f => f.name)

  const handleRun = () => {
    setIsRunning(true)
    pushHistory()
    setTimeout(() => {
      const dataset = MOCK_DATA[schema.id] ?? []
      const matched = executeQuery(tree.root, dataset)
      setResults(matched)
      setHasRun(true)
      setIsRunning(false)
      setPage(1)
    }, 400)
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-3) var(--space-4)',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{
            fontSize: '10px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-sans)',
          }}>
            Results
          </span>
          <AnimatedPresenceWrapper>
            {hasRun && (
              <AnimatedItem variant="scaleIn" transition={smooth}>
                <Badge variant={results.length > 0 ? 'accent' : 'muted'} pill>
                  {results.length}
                </Badge>
              </AnimatedItem>
            )}
          </AnimatedPresenceWrapper>
        </div>

        <Button
          variant="accent"
          size="sm"
          label="Execute query"
          onClick={handleRun}
          disabled={isRunning}
        >
          <Icon name="play" size={11} />
          {isRunning ? 'Running...' : 'Execute'}
        </Button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--bg)' }}>
        <AnimatedPresenceWrapper>
          {!hasRun && (
            <AnimatedItem variant="fadeIn" transition={smooth}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                color: 'var(--text-muted)',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                padding: 'var(--space-6)',
                textAlign: 'center',
              }}>
                <Icon name="play" size={28} strokeWidth={1} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', lineHeight: 1.5 }}>
                  Click Execute to run your<br />query against the mock dataset
                </span>
              </div>
            </AnimatedItem>
          )}

          {hasRun && results.length === 0 && (
            <AnimatedItem variant="fadeIn" transition={smooth}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                color: 'var(--text-muted)',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                padding: 'var(--space-6)',
                textAlign: 'center',
              }}>
                <span style={{ fontSize: '28px' }}>∅</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px' }}>
                  No records matched your query
                </span>
              </div>
            </AnimatedItem>
          )}
        </AnimatedPresenceWrapper>

        {hasRun && results.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '11px',
              fontFamily: 'var(--font-sans)',
            }}>
              <thead>
                <tr style={{ backgroundColor: '#111111' }}>
                  {columns.map(col => (
                    <th
                      key={col}
                      onClick={() => handleSort(col)}
                      style={{
                        padding: 'var(--space-2) var(--space-3)',
                        textAlign: 'left',
                        fontSize: '10px',
                        fontWeight: 600,
                        color: '#ffffff',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        userSelect: 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                        {col}
                        {sortField === col && (
                          <Icon name={sortDir === 'asc' ? 'chevronDown' : 'chevronRight'} size={10} />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((row, i) => (
                  <StaggeredItem key={i} index={i}>
                    <tr
                      style={{ backgroundColor: i % 2 === 0 ? 'var(--surface)' : 'var(--bg-secondary)', display: 'table-row' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = i % 2 === 0 ? 'var(--surface)' : 'var(--bg-secondary)'}
                    >
                      {columns.map(col => {
                        const val = row[col]
                        const isBoolean = typeof val === 'boolean'
                        const isStatus = col === 'status'
                        return (
                          <td
                            key={col}
                            style={{
                              padding: 'var(--space-2) var(--space-3)',
                              borderBottom: '1px solid var(--border)',
                              color: 'var(--text-primary)',
                              whiteSpace: 'nowrap',
                              maxWidth: '140px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {isBoolean ? (
                              <Badge variant={val ? 'accent' : 'muted'} pill>
                                {String(val)}
                              </Badge>
                            ) : isStatus ? (
                              <Badge variant="depth" pill>
                                {String(val)}
                              </Badge>
                            ) : (
                              String(val ?? '—')
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  </StaggeredItem>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {hasRun && totalPages > 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-2) var(--space-4)',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
          </span>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button
              variant="primary"
              size="sm"
              label="Previous page"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </Button>
            <Button
              variant="primary"
              size="sm"
              label="Next page"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(ResultsPanel)