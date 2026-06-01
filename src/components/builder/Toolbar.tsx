'use client'

import { useRef, useCallback } from 'react'
import { useQueryStore } from '@/store'
import { QueryTree } from '@/types'
import { ALL_SCHEMAS } from '@/types/schema'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

export default function Toolbar() {
  const { schema, setSchema, resetTree, validateQuery, pushHistory, savePreset, importTree, tree } = useQueryStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleExport = useCallback(() => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const json = JSON.stringify(tree, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `filtro-query-${timestamp}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [tree])

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string) as QueryTree
        if (!parsed.root || parsed.root.type !== 'group') return
        importTree(parsed)
      } catch {
        alert('Invalid query JSON file')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }, [importTree])

  const handleRun = useCallback(() => {
    pushHistory()
    validateQuery()
  }, [pushHistory, validateQuery])

  const handleSave = useCallback(() => {
    const name = prompt('Preset name:')
    if (name?.trim()) savePreset(name.trim())
  }, [savePreset])

  const ghostHover = useCallback((e: React.MouseEvent<HTMLButtonElement>, enter: boolean) => {
    e.currentTarget.style.backgroundColor = enter ? 'var(--bg-secondary)' : 'var(--surface)'
    e.currentTarget.style.color = enter ? 'var(--text-primary)' : 'var(--text-secondary)'
    e.currentTarget.style.borderColor = enter ? 'var(--border-strong)' : 'var(--border)'
  }, [])

  return (
    <header
      role="banner"
      style={{
        height: '52px',
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-5)',
        flexShrink: 0,
        boxShadow: 'var(--shadow)',
      }}
    >
      <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Filtro</span>
        <Icon name="chevronRight" size={12} color="var(--text-muted)" aria-hidden="true" />
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Query Builder</span>
        <Icon name="chevronRight" size={12} color="var(--text-muted)" aria-hidden="true" />
        <div
          role="tablist"
          aria-label="Schema selector"
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', marginLeft: 'var(--space-1)' }}
        >
          {ALL_SCHEMAS.map(s => (
            <button
              key={s.id}
              role="tab"
              aria-selected={schema.id === s.id}
              onClick={() => setSchema(s)}
              style={{
                padding: '3px var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: schema.id === s.id ? 'var(--accent)' : 'transparent',
                color: schema.id === s.id ? 'var(--accent-text)' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: schema.id === s.id ? 600 : 400,
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {s.name}
            </button>
          ))}
        </div>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <Button
          variant="primary"
          size="md"
          label="Reset query"
          title="Reset query ⌘R"
          onClick={resetTree}
          onMouseEnter={e => ghostHover(e, true)}
          onMouseLeave={e => ghostHover(e, false)}
        >
          <Icon name="reset" size={12} /> Reset
        </Button>

        <Button
          variant="primary"
          size="md"
          label="Export query as JSON"
          title="Export ⌘E"
          onClick={handleExport}
          onMouseEnter={e => ghostHover(e, true)}
          onMouseLeave={e => ghostHover(e, false)}
        >
          <Icon name="download" size={12} /> Export
        </Button>

        <Button
          variant="primary"
          size="md"
          label="Import query from JSON"
          title="Import ⌘I"
          onClick={handleImportClick}
          onMouseEnter={e => ghostHover(e, true)}
          onMouseLeave={e => ghostHover(e, false)}
        >
          <Icon name="upload" size={12} /> Import
        </Button>

        <Button
          variant="primary"
          size="md"
          label="Save as preset"
          title="Save preset ⌘S"
          onClick={handleSave}
          onMouseEnter={e => ghostHover(e, true)}
          onMouseLeave={e => ghostHover(e, false)}
        >
          <Icon name="save" size={12} /> Save
        </Button>

        <Button
          variant="accent"
          size="md"
          label="Run Query"
          title="Run Query ⌘↵"
          onClick={handleRun}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--accent-hover)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--accent)'}
        >
          <Icon name="play" size={12} /> Run Query
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          aria-hidden="true"
          tabIndex={-1}
          style={{ display: 'none' }}
          onChange={handleImport}
        />
      </div>
    </header>
  )
}