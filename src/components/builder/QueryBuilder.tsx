'use client'

import { useEffect, useRef } from 'react'
import { useQueryStore } from '@/store'
import QueryGroupComponent from './QueryGroup'
import QueryPreview from '@/components/preview/QueryPreview'
import ResultsPanel from '@/components/simulator/ResultsPanel'
import Toolbar from './Toolbar'
import Sidebar from './Sidebar'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

export default function QueryBuilder() {
  const { theme, tree, pushHistory } = useQueryStore()
  useKeyboardShortcuts()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const prevTreeRef = useRef<string | null>(null)
  useEffect(() => {
    const serialized = JSON.stringify(tree)
    if (prevTreeRef.current === null) {
      prevTreeRef.current = serialized
      return
    }
    if (prevTreeRef.current === serialized) return
    prevTreeRef.current = serialized
    const id = setTimeout(pushHistory, 1500)
    return () => clearTimeout(id)
  }, [tree, pushHistory])

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
          <main
            className="dot-grid"
            aria-label="Query builder canvas"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 'var(--space-8)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
              backgroundColor: 'var(--bg)',
            }}
          >
            <header style={{ marginBottom: 'var(--space-1)' }}>
              <h1
                style={{
                  fontSize: '18px',
                  fontWeight: 400,
                  color: 'var(--text-primary)',
                  letterSpacing: '0.04em',
                  fontFamily: 'var(--font-display)',
                  marginBottom: 'var(--space-1)',
                }}
              >
                Query Builder
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Build complex filters visually — no code required
              </p>
            </header>

            <div style={{ animation: 'fadeIn 0.2s ease' }}>
              <QueryGroupComponent group={tree.root} depth={0} isRoot />
            </div>
          </main>

          <aside
            aria-label="Query preview and results"
            style={{
              width: '360px',
              borderLeft: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              backgroundColor: 'var(--surface)',
              flexShrink: 0,
              boxShadow: '-2px 0 8px rgba(0,0,0,0.04)',
            }}
          >
            <QueryPreview />
            <ResultsPanel />
          </aside>
        </div>
      </div>
    </div>
  )
}