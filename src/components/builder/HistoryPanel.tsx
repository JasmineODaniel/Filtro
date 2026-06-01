'use client'

import { memo } from 'react'
import { useQueryStore } from '@/store'
import { History, RotateCcw } from 'lucide-react'

export default memo(function HistoryPanel() {
  const { history, loadHistory, clearHistory } = useQueryStore()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={14} color="var(--text-muted)" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
            History
          </span>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              padding: '2px 6px',
              borderRadius: 'var(--radius)',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--destructive)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            Clear all
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {history.length === 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: '8px',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <History size={24} strokeWidth={1} color="var(--text-muted)" />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
              No history yet. Run a query to save it here.
            </span>
          </div>
        )}

        {history.map((entry, i) => (
          <div
            key={entry.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 16px',
              borderBottom: '1px solid var(--border)',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
                Query #{history.length - i}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {new Date(entry.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <button
              onClick={() => loadHistory(entry.id)}
              title="Restore this query"
              style={{
                width: '26px',
                height: '26px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--accent)'
                e.currentTarget.style.color = 'var(--accent-text)'
                e.currentTarget.style.borderColor = 'var(--accent)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--text-muted)'
                e.currentTarget.style.borderColor = 'var(--border)'
              }}
            >
              <RotateCcw size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
})