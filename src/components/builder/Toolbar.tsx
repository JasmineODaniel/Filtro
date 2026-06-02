'use client'

import { useRef, useCallback, useState } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useQueryStore } from '@/store'
import { ALL_SCHEMAS } from '@/types/schema'
import { validateImportedTree, MAX_IMPORT_FILE_SIZE } from '@/utils/sanitize'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Check } from 'lucide-react'

export default function Toolbar() {
  const { schema, setSchema, resetTree, validateQuery, pushHistory, savePreset, importTree, tree } = useQueryStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [presetName, setPresetName] = useState('')
  const [savedToast, setSavedToast] = useState(false)
  const isMobile = useIsMobile()

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
    if (file.size > MAX_IMPORT_FILE_SIZE) {
      alert('File is too large. Maximum allowed size is 512 KB.')
      e.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = event => {
      try {
        const parsed: unknown = JSON.parse(event.target?.result as string)
        if (!validateImportedTree(parsed)) {
          alert('Invalid or malformed query JSON. The file may contain unsupported operators, excessive nesting, or a corrupt structure.')
          return
        }
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

  const handleSaveConfirm = useCallback(() => {
    const name = presetName.trim()
    if (!name) return
    savePreset(name)
    setPresetName('')
    setShowSaveModal(false)
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 2500)
  }, [presetName, savePreset])

  const ghostHover = useCallback((e: React.MouseEvent<HTMLButtonElement>, enter: boolean) => {
    e.currentTarget.style.backgroundColor = enter ? 'var(--bg-secondary)' : 'var(--surface)'
    e.currentTarget.style.color = enter ? 'var(--text-primary)' : 'var(--text-secondary)'
    e.currentTarget.style.borderColor = enter ? 'var(--border-strong)' : 'var(--border)'
  }, [])

  return (
    <>
      <header
        role="banner"
        style={{
          minHeight: '52px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          padding: isMobile ? 'var(--space-2) var(--space-3)' : '0 var(--space-5)',
          gap: isMobile ? 'var(--space-2)' : '0',
          flexShrink: 0,
          boxShadow: 'var(--shadow)',
          position: 'relative',
          zIndex: 30,
        }}
      >
        <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
          {!isMobile && (
            <>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>Filtro</span>
              <Icon name="chevronRight" size={12} color="var(--text-muted)" aria-hidden="true" />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Query Builder</span>
              <Icon name="chevronRight" size={12} color="var(--text-muted)" aria-hidden="true" />
            </>
          )}
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
            title="Reset query (Ctrl+R)"
            onClick={resetTree}
            style={{ width: '32px', padding: 0 }}
            onMouseEnter={e => ghostHover(e, true)}
            onMouseLeave={e => ghostHover(e, false)}
          >
            <Icon name="reset" size={15} />
          </Button>

          <Button
            variant="primary"
            size="md"
            label="Export query as JSON"
            title="Export query (Ctrl+E)"
            onClick={handleExport}
            style={{ width: '32px', padding: 0 }}
            onMouseEnter={e => ghostHover(e, true)}
            onMouseLeave={e => ghostHover(e, false)}
          >
            <Icon name="download" size={15} />
          </Button>

          <Button
            variant="primary"
            size="md"
            label="Import query from JSON"
            title="Import query from JSON file (Ctrl+I)"
            onClick={handleImportClick}
            style={{ width: '32px', padding: 0 }}
            onMouseEnter={e => ghostHover(e, true)}
            onMouseLeave={e => ghostHover(e, false)}
          >
            <Icon name="upload" size={15} />
          </Button>

          <div style={{ position: 'relative' }}>
            <Button
              variant="primary"
              size="md"
              label="Save as preset"
              title="Save as preset (Ctrl+S)"
              onClick={() => { setShowSaveModal(v => !v); setPresetName('') }}
              style={{ width: '32px', padding: 0 }}
              onMouseEnter={e => ghostHover(e, true)}
              onMouseLeave={e => ghostHover(e, false)}
            >
              <Icon name="save" size={15} />
            </Button>

            {showSaveModal && (
              <>
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                  onClick={() => setShowSaveModal(false)}
                  aria-hidden="true"
                />
                <div
                  role="dialog"
                  aria-label="Save preset"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    zIndex: 50,
                    width: '240px',
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: 'var(--space-3)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-2)',
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
                    Save preset
                  </span>
                  <input
                    autoFocus
                    type="text"
                    value={presetName}
                    onChange={e => setPresetName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSaveConfirm()
                      if (e.key === 'Escape') setShowSaveModal(false)
                    }}
                    placeholder="Preset name..."
                    style={{
                      height: '30px',
                      padding: '0 var(--space-2)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      fontFamily: 'var(--font-sans)',
                      outline: 'none',
                      width: '100%',
                    }}
                  />
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button
                      onClick={handleSaveConfirm}
                      disabled={!presetName.trim()}
                      style={{
                        flex: 1,
                        height: '28px',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        backgroundColor: presetName.trim() ? 'var(--accent)' : 'var(--bg-tertiary)',
                        color: presetName.trim() ? 'var(--accent-text)' : 'var(--text-muted)',
                        fontSize: '11px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-sans)',
                        cursor: presetName.trim() ? 'pointer' : 'not-allowed',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setShowSaveModal(false)}
                      style={{
                        height: '28px',
                        padding: '0 var(--space-3)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                        backgroundColor: 'transparent',
                        color: 'var(--text-secondary)',
                        fontSize: '11px',
                        fontFamily: 'var(--font-sans)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <Button
            variant="accent"
            size="md"
            label="Run Query"
            title="Run Query (Ctrl+Enter)"
            onClick={handleRun}
            style={{ width: '32px', padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--accent-hover)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--accent)'}
          >
            <Icon name="play" size={15} />
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

      {savedToast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-2) var(--space-4)',
            backgroundColor: 'var(--accent)',
            color: 'var(--accent-text)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-lg)',
            fontSize: '12px',
            fontWeight: 600,
            fontFamily: 'var(--font-sans)',
            animation: 'slideUp 0.2s ease',
          }}
        >
          <Check size={13} />
          Preset saved
        </div>
      )}
    </>
  )
}
