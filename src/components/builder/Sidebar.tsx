'use client'

import { useState } from 'react'
import { useQueryStore } from '@/store'
import { History, BookmarkCheck, Sun, Moon, Filter } from 'lucide-react'
import HistoryPanel from './HistoryPanel'
import PresetsPanel from './PresetsPanel'
import { Button } from '@/components/ui/Button'

type Panel = 'history' | 'presets' | null

interface NavItemProps {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}

function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-2) var(--space-3)',
        borderRadius: 'var(--radius)',
        border: 'none',
        backgroundColor: active ? 'var(--accent)' : 'transparent',
        color: active ? 'var(--accent-text)' : 'var(--text-secondary)',
        fontSize: '13px',
        fontWeight: active ? 600 : 400,
        fontFamily: 'var(--font-sans)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        textAlign: 'left',
        width: '100%',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
          e.currentTarget.style.color = 'var(--text-primary)'
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = 'var(--text-secondary)'
        }
      }}
    >
      {icon}
      {label}
    </button>
  )
}

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
          width: '220px',
          borderRight: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          boxShadow: 'var(--shadow)',
        }}
      >
        <div
          style={{
            padding: 'var(--space-5) var(--space-4) var(--space-4)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'var(--accent)',
              borderRadius: 'var(--radius)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Filter size={16} color="var(--accent-text)" strokeWidth={2.5} />
          </div>
          <div>
            <div
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              Filtro
            </div>
            <div
              style={{
                fontSize: '10px',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              query builder
            </div>
          </div>
        </div>

        <nav
          aria-label="Sidebar navigation"
          style={{
            flex: 1,
            padding: 'var(--space-3) var(--space-2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-1)',
          }}
        >
          <NavItem
            icon={<History size={15} />}
            label="Query History"
            active={activePanel === 'history'}
            onClick={() => togglePanel('history')}
          />
          <NavItem
            icon={<BookmarkCheck size={15} />}
            label="Saved Presets"
            active={activePanel === 'presets'}
            onClick={() => togglePanel('presets')}
          />
        </nav>

        <div
          style={{
            padding: 'var(--space-3) var(--space-2)',
            borderTop: '1px solid var(--border)',
          }}
        >
          <Button
            variant="ghost"
            size="md"
            label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleTheme}
            style={{
              width: '100%',
              justifyContent: 'flex-start',
              gap: 'var(--space-3)',
              color: 'var(--text-secondary)',
              padding: 'var(--space-2) var(--space-3)',
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
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </Button>
        </div>
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
          role="complementary"
          aria-label={activePanel === 'history' ? 'Query history panel' : 'Saved presets panel'}
        >
          {activePanel === 'history' && <HistoryPanel />}
          {activePanel === 'presets' && <PresetsPanel />}
        </div>
      )}
    </div>
  )
}                                                                     