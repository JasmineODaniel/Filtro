'use client'

import { useState } from 'react'
import { useQueryStore } from '@/store'
import { useIsMobile } from '@/hooks/useIsMobile'
import { History, BookmarkCheck, Sun, Moon } from 'lucide-react'
import HistoryPanel from './HistoryPanel'
import PresetsPanel from './PresetsPanel'
import { AnimatedItem, AnimatedPresenceWrapper } from '@/components/ui/Animated'
import { smooth } from '@/hooks/useAnimation'

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
      title={label}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: 'var(--radius)',
        border: 'none',
        backgroundColor: active ? 'var(--accent)' : 'transparent',
        color: active ? 'var(--accent-text)' : 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        flexShrink: 0,
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
    </button>
  )
}

export default function Sidebar() {
  const { toggleTheme, theme } = useQueryStore()
  const [activePanel, setActivePanel] = useState<Panel>(null)
  const isMobile = useIsMobile()

  if (isMobile) return null

  const togglePanel = (panel: Panel) => {
    setActivePanel(prev => prev === panel ? null : panel)
  }

  return (
    <>
      {activePanel && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10,
            backgroundColor: 'rgba(0,0,0,0.25)',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
          }}
          onClick={() => setActivePanel(null)}
          aria-hidden="true"
        />
      )}
      <div style={{ flexShrink: 0, position: 'relative', zIndex: 20, width: '56px' }}>
        <div
          style={{
            width: '56px',
            height: '100vh',
            borderRight: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: 'var(--shadow)',
          }}
        >
          <nav
            aria-label="Sidebar navigation"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-1)',
              padding: 'var(--space-2) 0',
              borderTop: '1px solid var(--border)',
              width: '100%',
              paddingLeft: '8px',
              paddingRight: '8px',
            }}
          >
            <NavItem
              icon={<History size={16} />}
              label="Query History"
              active={activePanel === 'history'}
              onClick={() => togglePanel('history')}
            />
            <NavItem
              icon={<BookmarkCheck size={16} />}
              label="Saved Presets"
              active={activePanel === 'presets'}
              onClick={() => togglePanel('presets')}
            />
          </nav>

          <div style={{
            padding: 'var(--space-3) 0',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}>
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius)',
                border: 'none',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
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
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>

        <AnimatedPresenceWrapper>
          {activePanel && (
            <AnimatedItem
              variant="slideIn"
              transition={smooth}
              style={{
                position: 'absolute',
                left: '56px',
                top: 0,
                width: '260px',
                height: '100vh',
                borderRight: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                zIndex: 20,
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div
                role="complementary"
                aria-label={activePanel === 'history' ? 'Query history panel' : 'Saved presets panel'}
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                {activePanel === 'history' && <HistoryPanel />}
                {activePanel === 'presets' && <PresetsPanel />}
              </div>
            </AnimatedItem>
          )}
        </AnimatedPresenceWrapper>
      </div>
    </>
  )
}
