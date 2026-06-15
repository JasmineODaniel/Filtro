'use client'

import { useEffect, useRef, useState } from 'react'
import { useQueryStore } from '@/store'
import QueryGroupComponent from './QueryGroup'
import QueryPreview from '@/components/preview/QueryPreview'
import ResultsPanel from '@/components/simulator/ResultsPanel'
import Toolbar from './Toolbar'
import Sidebar from './Sidebar'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useIsMobile } from '@/hooks/useIsMobile'

type MobileTab = 'builder' | 'preview' | 'results'

const MOBILE_TABS: { id: MobileTab; label: string }[] = [
  { id: 'builder', label: 'Builder' },
  { id: 'preview', label: 'Preview' },
  { id: 'results', label: 'Results' },
]

export default function QueryBuilder() {
  const { theme, tree, pushHistory } = useQueryStore()
  const isMobile = useIsMobile()
  const [mobileTab, setMobileTab] = useState<MobileTab>('builder')
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

  const builderCanvas = (
    <main
      className="dot-grid"
      role="tabpanel"
      id="panel-builder"
      aria-label="Query builder canvas"
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: isMobile ? 'var(--space-4)' : 'var(--space-8)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        backgroundColor: 'var(--bg)',
      }}
    >
      {!isMobile && (
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
      )}
      <div style={{ animation: 'fadeIn 0.2s ease' }}>
        <QueryGroupComponent group={tree.root} depth={0} isRoot />
      </div>
    </main>
  )

  const previewPanel = (
    <div
      role="tabpanel"
      id="panel-preview"
      style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      <QueryPreview />
    </div>
  )

  const resultsPanel = (
    <div
      role="tabpanel"
      id="panel-results"
      style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      <ResultsPanel />
    </div>
  )

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

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Toolbar />

        {isMobile ? (
          <>
            <div
              role="tablist"
              aria-label="Section navigation"
              style={{
                display: 'flex',
                borderBottom: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                flexShrink: 0,
              }}
            >
              {MOBILE_TABS.map(tab => (
                <button
                  type="button"
                  key={tab.id}
                  role="tab"
                  aria-selected={mobileTab === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => setMobileTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: 'var(--space-3) var(--space-2)',
                    border: 'none',
                    borderBottom: `2px solid ${mobileTab === tab.id ? 'var(--accent)' : 'transparent'}`,
                    backgroundColor: 'transparent',
                    color: mobileTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontSize: '12px',
                    fontWeight: mobileTab === tab.id ? 600 : 400,
                    fontFamily: 'var(--font-sans)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {mobileTab === 'builder' && builderCanvas}
              {mobileTab === 'preview' && previewPanel}
              {mobileTab === 'results' && resultsPanel}
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {builderCanvas}
            <aside
              aria-label="Query preview and results"
              style={{
                width: '460px',
                borderLeft: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                backgroundColor: 'var(--surface)',
                flexShrink: 0,
                boxShadow: 'var(--shadow-side)',
              }}
            >
              <QueryPreview />
              <ResultsPanel />
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}