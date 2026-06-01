'use client'

import { useEffect } from 'react'
import { useQueryStore } from '@/store'

export function useKeyboardShortcuts() {
  const {
    resetTree,
    addRule,
    pushHistory,
    validateQuery,
    tree,
    setPreviewMode,
    previewMode,
  } = useQueryStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey

      if (ctrl && e.key === 'r') {
        e.preventDefault()
        resetTree()
      }

      if (ctrl && e.key === 'Enter') {
        e.preventDefault()
        pushHistory()
        validateQuery()
      }

      if (ctrl && e.key === 'a') {
        e.preventDefault()
        addRule(tree.root.id)
      }

      if (ctrl && e.key === 'p') {
        e.preventDefault()
        setPreviewMode(previewMode === 'sql' ? 'mongo' : 'sql')
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [resetTree, addRule, pushHistory, validateQuery, tree.root.id, setPreviewMode, previewMode])
}