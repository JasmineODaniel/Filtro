'use client'

import { useEffect } from 'react'
import { useQueryStore } from '@/store'
import QueryGroupComponent from './QueryGroup'
import QueryPreview from '@/components/preview/QueryPreview'
import ResultsPanel from '@/components/simulator/ResultsPanel'
import Toolbar from './Toolbar'
import Sidebar from './Sidebar'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

export default function QueryBuilder() {
  const { theme, tree } = useQueryStore()
  useKeyboardShortcuts()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: 'var(--bg)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Toolbar />

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              paddingTop: 'var(--space-8)',
              paddingRight: 'var(--space-8)',
              paddingBottom: 'var(--space-8)',
              paddingLeft: 'var(--space-xs)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              backgroundColor: 'var(--bg)',
            }}
          >
            <div style={{ marginBottom: '8px' }}>
              <h1
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)',
                  marginBottom: '4px',
                }}
              >
                Query Builder
              </h1>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
                Build complex filters visually — no code required
              </p>
            </div>

            <QueryGroupComponent group={tree.root} depth={0} isRoot />
          </div>

          <div
            style={{
              width: '360px',
              borderLeft: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              backgroundColor: 'var(--surface)',
              flexShrink: 0,
            }}
          >
            <QueryPreview />
            <ResultsPanel />
          </div>
        </div>
      </div>
    </div>
  )
}