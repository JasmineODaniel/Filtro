'use client'

import { memo, useCallback, useMemo, useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { useQueryStore } from '@/store'
import { explainQuery } from '@/utils/explain-query'

function QuerySummary() {
  const { tree, schema } = useQueryStore()
  const [copied, setCopied] = useState(false)

  const explanation = useMemo(() => explainQuery(tree.root, schema), [tree, schema])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(explanation)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable or permission denied
    }
  }, [explanation])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
        backgroundColor: 'var(--surface)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <span
          style={{
            fontSize: '10px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-mono)',
          }}
        >
          Query Summary
        </span>
        <button
          onClick={handleCopy}
          aria-label={copied ? 'Copied to clipboard' : 'Copy summary to clipboard'}
          style={{
            width: '26px',
            height: '26px',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            backgroundColor: 'transparent',
            color: copied ? 'var(--accent)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </button>
      </div>
      <p
        style={{
          padding: '14px 16px',
          fontSize: '12px',
          lineHeight: 1.75,
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-sans)',
          margin: 0,
          fontStyle: 'italic',
          maxHeight: '110px',
          overflowY: 'auto',
        }}
      >
        {explanation}
      </p>
    </div>
  )
}

export default memo(QuerySummary)
