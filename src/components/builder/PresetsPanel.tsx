'use client'

import { memo } from 'react'
import { useQueryStore } from '@/store'
import { BookmarkCheck, Trash2, Download } from 'lucide-react'

export default memo(function PresetsPanel() {
  const { presets, loadPreset, deletePreset, activePresetId } = useQueryStore()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <BookmarkCheck size={14} color="var(--text-muted)" />
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
          Saved Presets
        </span>
        <span
          style={{
            fontSize: '10px',
            fontWeight: 600,
            padding: '1px 6px',
            borderRadius: 'var(--radius)',
            backgroundColor: presets.length > 0 ? 'var(--accent)' : 'var(--bg-tertiary)',
            color: presets.length > 0 ? 'var(--accent-text)' : 'var(--text-muted)',
            marginLeft: 'auto',
          }}
        >
          {presets.length}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {presets.length === 0 && (
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
            <BookmarkCheck size={24} strokeWidth={1} color="var(--text-muted)" />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
              No presets saved. Build a query and click Save.
            </span>
          </div>
        )}

        {presets.map(preset => (
          <div
            key={preset.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 16px',
              borderBottom: '1px solid var(--border)',
              backgroundColor: activePresetId === preset.id ? 'var(--bg-secondary)' : 'transparent',
              transition: 'background 0.15s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              if (activePresetId !== preset.id) e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
            }}
            onMouseLeave={e => {
              if (activePresetId !== preset.id) e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {activePresetId === preset.id && (
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent)',
                      flexShrink: 0,
                    }}
                  />
                )}
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {preset.name}
                </span>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {new Date(preset.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
              <button
                onClick={() => loadPreset(preset.id)}
                title="Load preset"
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
                <Download size={12} />
              </button>

              <button
                onClick={() => deletePreset(preset.id)}
                title="Delete preset"
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: 'var(--radius)',
                  border: '1px solid transparent',
                  backgroundColor: 'transparent',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--destructive)'
                  e.currentTarget.style.backgroundColor = 'var(--destructive-bg)'
                  e.currentTarget.style.borderColor = 'var(--destructive)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--text-muted)'
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})