'use client'

import { memo, useMemo, useState } from 'react'
import { useQueryStore } from '@/store'
import { executeQuery } from '@/engine'
import { MOCK_DATA } from '@/schemas/mock-data'
import { Play, ChevronDown, ChevronUp } from 'lucide-react'

function ResultsPanel() {
  const { tree, schema, validationErrors, pushHistory } = useQueryStore()
  const [isRunning, setIsRunning] = useState(false)
  const [hasRun, setHasRun] = useState(false)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 5

  const rawResults = useMemo(() => {
    if (!hasRun) return []
    const dataset = MOCK_DATA[schema.id] ?? []
    return executeQuery(tree.root, dataset)
  }, [tree, schema, hasRun])

  const results = useMemo(() => {
    if (!sortField) return rawResults
    return [...rawResults].sort((a, b) => {
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
  }, [rawResults, sortField, sortDir])

  const totalPages = Math.ceil(results.length / PAGE_SIZE)
  const paginated = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const columns = schema.fields.map(f => f.name)
  const hasErrors = validationErrors.length > 0

  const handleRun = () => {
    if (hasErrors) return
    setIsRunning(true)
    pushHistory()
    setTimeout(() => {
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
          padding: '10px 14px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
          {hasRun && (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '1px 7px',
                borderRadius: '20px',
                backgroundColor: results.length > 0 ? 'var(--accent)' : 'var(--bg-tertiary)',
                color: results.length > 0 ? 'var(--accent-text)' : 'var(--text-muted)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {results.length}
            </span>
          )}
        </div>

        <button
          onClick={handleRun}
          disabled={isRunning || hasErrors}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 12px',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--accent)',
            backgroundColor: hasErrors ? 'var(--bg-tertiary)' : 'var(--accent)',
            color: hasErrors ? 'var(--text-muted)' : 'var(--accent-text)',
            fontSize: '11px',
            fontWeight: 700,
            fontFamily: 'var(--font-sans)',
            cursor: hasErrors ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
            opacity: isRunning ? 0.7 : 1,
          }}
        >
          <Play size={11} />
          {isRunning ? 'Running...' : 'Execute'}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--bg)' }}>
        {!hasRun && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--text-muted)',
              fontSize: '12px',
              flexDirection: 'column',
              gap: '10px',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <Play size={28} strokeWidth={1} color="var(--text-muted)" />
            <span style={{ fontFamily: 'var(--font-sans)', lineHeight: 1.5 }}>
              Click Execute to run your<br />query against the mock dataset
            </span>
          </div>
        )}

        {hasRun && results.length === 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--text-muted)',
              fontSize: '12px',
              flexDirection: 'column',
              gap: '10px',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '28px' }}>∅</span>
            <span style={{ fontFamily: 'var(--font-sans)' }}>No records matched your query</span>
          </div>
        )}

        {hasRun && results.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '11px',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#111111' }}>
                  {columns.map(col => (
                    <th
                      key={col}
                      onClick={() => handleSort(col)}
                      style={{
                        padding: '8px 12px',
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {col}
                        {sortField === col && (
                          sortDir === 'asc' ? <ChevronUp size={10} /> : <ChevronDown size={10} />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((row, i) => (
                  <tr
                    key={i}
                    style={{
                      backgroundColor: i % 2 === 0 ? 'var(--surface)' : 'var(--bg-secondary)',
                      transition: 'background 0.1s ease',
                    }}
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
                            padding: '7px 12px',
                            borderBottom: '1px solid var(--border)',
                            color: 'var(--text-primary)',
                            whiteSpace: 'nowrap',
                            maxWidth: '140px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {isBoolean ? (
                            <span style={{
                              padding: '2px 7px',
                              borderRadius: '20px',
                              backgroundColor: val ? 'rgba(200,255,0,0.15)' : 'var(--bg-tertiary)',
                              color: val ? 'var(--accent)' : 'var(--text-muted)',
                              fontSize: '10px',
                              fontWeight: 600,
                            }}>
                              {String(val)}
                            </span>
                          ) : isStatus ? (
                            <span style={{
                              padding: '2px 7px',
                              borderRadius: '20px',
                              backgroundColor: 'var(--bg-tertiary)',
                              color: 'var(--text-secondary)',
                              fontSize: '10px',
                              fontWeight: 500,
                            }}>
                              {String(val)}
                            </span>
                          ) : (
                            String(val ?? '—')
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {hasRun && totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 14px',
            borderTop: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, results.length)} of {results.length}
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: '3px 10px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
                color: page === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                fontSize: '11px',
                fontFamily: 'var(--font-sans)',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Prev
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                padding: '3px 10px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
                color: page === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
                fontSize: '11px',
                fontFamily: 'var(--font-sans)',
                cursor: page === totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(ResultsPanel)