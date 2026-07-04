'use client'

import { useRef, useCallback, useState } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useQueryStore } from '@/store'
import { ALL_SCHEMAS } from '@/types/schema'
import { validateImportedTree, MAX_IMPORT_FILE_SIZE } from '@/utils/sanitize'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Check, Menu, X, History, BookmarkCheck, Sun, Moon, ChevronRight } from 'lucide-react'
import { FiltroLogo } from '@/components/ui/FiltroLogo'
import HistoryPanel from './HistoryPanel'
import PresetsPanel from './PresetsPanel'

type DrawerPanel = 'history' | 'presets' | null

export default function Toolbar() {
  const { schema, setSchema, resetTree, savePreset, importTree, tree, toggleTheme, theme } = useQueryStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [presetName, setPresetName] = useState('')
  const [savedToast, setSavedToast] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerPanel, setDrawerPanel] = useState<DrawerPanel>(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const isMobile = useIsMobile()

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
    setDrawerPanel(null)
  }, [])

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleExportPDF = useCallback(async () => {
    setPdfLoading(true)
    try {
      const [{ pdf }, { QueryPDF }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/components/ui/QueryPDF'),
      ])
      const exportedAt = new Date().toLocaleString()
      const blob = await pdf(<QueryPDF tree={tree} schema={schema} exportedAt={exportedAt} />).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `filtro-query-${new Date().toISOString().replace(/[:.]/g, '-')}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setPdfLoading(false)
    }
  }, [tree, schema])

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
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'center',
          justifyContent: isMobile ? undefined : 'space-between',
          padding: isMobile ? '0' : '0 var(--space-5)',
          flexShrink: 0,
          boxShadow: 'var(--shadow)',
          position: 'relative',
          zIndex: 30,
        }}
      >
        {isMobile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '40px',
            borderBottom: '1px solid var(--border)',
            padding: '0 var(--space-3)',
          }}>
            <FiltroLogo size="sm" description="Visual query builder" />
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '52px',
          padding: isMobile ? '0 var(--space-3)' : undefined,
          width: '100%',
        }}>

        {isMobile ? (
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <Menu size={16} />
          </button>
        ) : (
          <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
            <FiltroLogo size="sm" />
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
        )}

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
            label={pdfLoading ? 'Generating PDF…' : 'Export query as PDF'}
            title="Export query as PDF"
            onClick={() => { handleExportPDF() }}
            disabled={pdfLoading}
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
        </div>
      </header>

      {isMobile && drawerOpen && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 200, backgroundColor: 'var(--overlay-bg)' }}
            onClick={closeDrawer}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-label="Navigation menu"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: '280px',
              zIndex: 201,
              backgroundColor: 'var(--surface)',
              borderRight: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-4)',
              borderBottom: '1px solid var(--border)',
              flexShrink: 0,
            }}>
              {drawerPanel ? (
                <button
                  onClick={() => setDrawerPanel(null)}
                  aria-label="Back to menu"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    fontFamily: 'var(--font-sans)',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} />
                  {drawerPanel === 'history' ? 'History' : 'Saved Presets'}
                </button>
              ) : (
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>
                  Menu
                </span>
              )}
              <button
                onClick={closeDrawer}
                aria-label="Close menu"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={14} />
              </button>
            </div>

            {!drawerPanel ? (
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border)' }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-sans)',
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                  }}>
                    Schema
                  </span>
                  <div role="tablist" aria-label="Schema selector" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                    {ALL_SCHEMAS.map(s => (
                      <button
                        key={s.id}
                        role="tab"
                        aria-selected={schema.id === s.id}
                        onClick={() => { setSchema(s); closeDrawer() }}
                        style={{
                          flex: '1 1 calc(50% - 4px)',
                          minWidth: 0,
                          padding: 'var(--space-2) var(--space-2)',
                          borderRadius: 'var(--radius-sm)',
                          border: `1px solid ${schema.id === s.id ? 'var(--accent)' : 'var(--border)'}`,
                          backgroundColor: schema.id === s.id ? 'var(--accent)' : 'var(--bg)',
                          color: schema.id === s.id ? 'var(--accent-text)' : 'var(--text-secondary)',
                          fontSize: '12px',
                          fontWeight: schema.id === s.id ? 600 : 400,
                          fontFamily: 'var(--font-sans)',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>

                <nav aria-label="Sidebar navigation" style={{ padding: 'var(--space-2)' }}>
                  {([
                    { id: 'history' as const, label: 'History', icon: <History size={16} /> },
                    { id: 'presets' as const, label: 'Saved Presets', icon: <BookmarkCheck size={16} /> },
                  ]).map(item => (
                    <button
                      key={item.id}
                      onClick={() => setDrawerPanel(item.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 'var(--space-3)',
                        borderRadius: 'var(--radius)',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '13px',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
                        e.currentTarget.style.color = 'var(--text-primary)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = 'var(--text-secondary)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        {item.icon}
                        {item.label}
                      </div>
                      <ChevronRight size={14} />
                    </button>
                  ))}
                </nav>
              </div>
            ) : (
              <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {drawerPanel === 'history' && <HistoryPanel />}
                {drawerPanel === 'presets' && <PresetsPanel />}
              </div>
            )}
          </div>
        </>
      )}

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
