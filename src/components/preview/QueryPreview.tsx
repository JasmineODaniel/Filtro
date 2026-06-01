'use client'

import { memo, useMemo, useState } from 'react'
import { useQueryStore } from '@/store'
import { generateSQL, generateMongo } from '@/utils'
import { Copy, Check } from 'lucide-react'

const SQL_KEYWORDS = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS', 'NULL', 'REGEXP']

function highlightSQL(sql: string): React.ReactNode[] {
  const lines = sql.split('\n')
  return lines.map((line, lineIdx) => {
    const tokens = line.split(/(\s+|'[^']*'|\b\w+\b)/).filter(Boolean)
    return (
      <div key={lineIdx}>
        {tokens.map((token, i) => {
          if (SQL_KEYWORDS.includes(token.toUpperCase())) {
            return <span key={i} style={{ color: 'var(--syntax-keyword)', fontWeight: 600 }}>{token}</span>
          }
          if (token.startsWith("'") && token.endsWith("'")) {
            return <span key={i} style={{ color: 'var(--syntax-value)' }}>{token}</span>
          }
          if (/^-?\d+(\.\d+)?$/.test(token)) {
            return <span key={i} style={{ color: 'var(--syntax-value)' }}>{token}</span>
          }
          if (['=', '!=', '>', '<', '>=', '<='].includes(token)) {
            return <span key={i} style={{ color: 'var(--syntax-operator)' }}>{token}</span>
          }
          return <span key={i}>{token}</span>
        })}
      </div>
    )
  })
}

function QueryPreview() {
  const { tree, schema, previewMode, setPreviewMode } = useQueryStore()
  const [copied, setCopied] = useState(false)

  const output = useMemo(() => {
    if (previewMode === 'sql') return generateSQL(tree.root, schema.name.toLowerCase())
    return generateMongo(tree.root)
  }, [tree, schema, previewMode])

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
        backgroundColor: '#0d0d0d',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: '1px solid #2a2a2a',
        }}
      >
        <span style={{
          fontSize: '10px',
          fontWeight: 600,
          color: '#666',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-mono)',
        }}>
          Preview
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {(['sql', 'mongo'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setPreviewMode(mode)}
              style={{
                padding: '2px 8px',
                borderRadius: 'var(--radius)',
                border: `1px solid ${previewMode === mode ? '#c8ff00' : '#333'}`,
                backgroundColor: previewMode === mode ? '#c8ff00' : 'transparent',
                color: previewMode === mode ? '#111' : '#666',
                fontSize: '10px',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.15s ease',
              }}
            >
              {mode}
            </button>
          ))}

          <button
            onClick={handleCopy}
            title="Copy to clipboard"
            style={{
              width: '26px',
              height: '26px',
              borderRadius: 'var(--radius)',
              border: '1px solid #333',
              backgroundColor: 'transparent',
              color: copied ? '#c8ff00' : '#666',
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
      </div>

      <pre
        style={{
          padding: '14px',
          fontSize: '11px',
          lineHeight: '1.8',
          fontFamily: 'var(--font-mono)',
          color: '#e0e0e0',
          backgroundColor: '#0d0d0d',
          overflowX: 'auto',
          overflowY: 'auto',
          maxHeight: '200px',
          margin: 0,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {previewMode === 'sql' ? highlightSQL(output) : output}
      </pre>
    </div>
  )
}

export default memo(QueryPreview)