'use client'

import { useQueryStore } from '@/store'
import { RotateCcw, Play, Download, Upload, Save } from 'lucide-react'
import { useRef } from 'react'
import { QueryTree } from '@/types'
import { ALL_SCHEMAS } from '@/types/schema'

export default function Toolbar() {
  const { schema, setSchema, resetTree, validateQuery, pushHistory, savePreset, importTree, tree } = useQueryStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const json = JSON.stringify(tree, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `filtro-query-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
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
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleRun = () => {
    pushHistory()
    validateQuery()
  }

  const handleSave = () => {
    const name = prompt('Preset name:')
    if (name?.trim()) savePreset(name.trim())
  }

  const ghostBtn: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '5px 10px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '12px',
    fontWeight: 500,
    fontFamily: 'var(--font-sans)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap' as const,
  }

  return (
    <div
      style={{
        height: '56px',
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        flexShrink: 0,
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {ALL_SCHEMAS.map(s => (
          <button
            key={s.id}
            onClick={() => setSchema(s)}
            style={{
              padding: '5px 14px',
              borderRadius: 'var(--radius)',
              border: 'none',
              backgroundColor: 'transparent',
              color: schema.id === s.id ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: schema.id === s.id ? 600 : 400,
              fontFamily: 'var(--font-sans)',
              cursor: 'pointer',
              position: 'relative' as const,
              transition: 'all 0.15s ease',
              paddingBottom: '8px',
            }}
          >
            {s.name}
            {schema.id === s.id && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '14px',
                  right: '14px',
                  height: '2px',
                  backgroundColor: 'var(--accent)',
                  borderRadius: '1px',
                }}
              />
            )}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          style={ghostBtn}
          onClick={resetTree}
          title="Reset ⌘R"
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
            e.currentTarget.style.color = 'var(--text-primary)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
        >
          <RotateCcw size={13} />
          Reset
        </button>

        <button
          style={ghostBtn}
          onClick={handleExport}
          title="Export ⌘E"
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
            e.currentTarget.style.color = 'var(--text-primary)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
        >
          <Download size={13} />
          Export
        </button>

        <button
          style={ghostBtn}
          onClick={handleImportClick}
          title="Import ⌘I"
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
            e.currentTarget.style.color = 'var(--text-primary)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
        >
          <Upload size={13} />
          Import
        </button>

        <button
          style={ghostBtn}
          onClick={handleSave}
          title="Save preset ⌘S"
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
            e.currentTarget.style.color = 'var(--text-primary)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
        >
          <Save size={13} />
          Save
        </button>

        <button
          onClick={handleRun}
          title="Run Query ⌘↵"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 14px',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--accent)',
            backgroundColor: 'var(--accent)',
            color: 'var(--accent-text)',
            fontSize: '12px',
            fontWeight: 700,
            fontFamily: 'var(--font-sans)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
            letterSpacing: '0.02em',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'var(--accent-hover)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'var(--accent)'
          }}
        >
          <Play size={12} />
          Run Query
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleImport}
        />
      </div>
    </div>
  )
}