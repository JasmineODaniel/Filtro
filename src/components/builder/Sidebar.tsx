'use client'

import { useState } from 'react'
import { useQueryStore } from '@/store'
import { History, BookmarkCheck, Sun, Moon, Filter } from 'lucide-react'
import HistoryPanel from './HistoryPanel'
import PresetsPanel from './PresetsPanel'

type Panel = 'history' | 'presets' | null

export default function Sidebar() {
  const { toggleTheme, theme } = useQueryStore()
  const [activePanel, setActivePanel] = useState<Panel>(null)

  const togglePanel = (panel: Panel) => {
    setActivePanel(prev => prev === panel ? null : panel)
  }

  return (
    <div style={{ display: 'flex', flexShrink: 0 }}>
      <div
        style={{
          width: '56px',
          borderRight: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '12px',
          paddingBottom: '16px',
          gap: '4px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'var(--accent)',
            borderRadius: 'var(--radius)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            flexShrink: 0,
          }}
        >
          <Filter size={16} color="var(--accent-text)" strokeWidth={2.5} />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', width: '100%', alignItems: 'center' }}>
          {[
            { id: 'history' as Panel, icon: <History size={16} />, label: 'History' },
            { id: 'presets' as Panel, icon: <BookmarkCheck size={16} />, label: 'Presets' },
          ].map(item => (
            <button
              key={item.id}
              title={item.label}
              onClick={() => togglePanel(item.id)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius)',
                border: 'none',
                backgroundColor: activePanel === item.id ? 'var(--accent)' : 'transparent',
                color: activePanel === item.id ? 'var(--accent-text)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                if (activePanel !== item.id) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
                  e.currentTarget.style.color = 'var(--text-primary)'
                }
              }}
              onMouseLeave={e => {
                if (activePanel !== item.id) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'var(--text-muted)'
                }
              }}
            >
              {item.icon}
            </button>
          ))}
        </div>

        <button
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          onClick={toggleTheme}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius)',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
            e.currentTarget.style.color = 'var(--text-primary)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'var(--text-muted)'
          }}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      {activePanel && (
        <div
          style={{
            width: '260px',
            borderRight: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'slideIn 0.15s ease',
          }}
        >
          {activePanel === 'history' && <HistoryPanel />}
          {activePanel === 'presets' && <PresetsPanel />}
        </div>
      )}
    </div>
  )
}