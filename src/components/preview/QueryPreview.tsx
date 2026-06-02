'use client'

import { memo, useMemo, useState } from 'react'
import { useQueryStore } from '@/store'
import { generateSQL, generateMongo, generateGraphQL } from '@/utils'
import { Copy, Check } from 'lucide-react'

const SQL_KEYWORDS = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS', 'NULL', 'REGEXP']
const GQL_KEYWORDS = ['query', 'mutation', 'subscription', 'AND', 'OR', 'where', 'filter']

function highlightSQL(sql: string): React.ReactNode[] {
  return sql.split('\n').map((line, lineIdx) => (
    <div key={lineIdx}>
      {line.split(/(\s+|'[^']*'|\b\w+\b)/).filter(Boolean).map((token, i) => {
        if (SQL_KEYWORDS.includes(token.toUpperCase())) return <span key={i} style={{ color: 'var(--syntax-keyword)', fontWeight: 600 }}>{token}</span>
        if (token.startsWith("'") && token.endsWith("'")) return <span key={i} style={{ color: 'var(--syntax-value)' }}>{token}</span>
        if (/^-?\d+(\.\d+)?$/.test(token)) return <span key={i} style={{ color: 'var(--syntax-value)' }}>{token}</span>
        if (['=', '!=', '>', '<', '>=', '<='].includes(token)) return <span key={i} style={{ color: 'var(--syntax-operator)' }}>{token}</span>
        return <span key={i}>{token}</span>
      })}
    </div>
  ))
}

function highlightGQL(gql: string): React.ReactNode[] {
  return gql.split('\n').map((line, lineIdx) => (
    <div key={lineIdx}>
      {line.split(/(\s+|"[^"]*"|\b\w+\b)/).filter(Boolean).map((token, i) => {
        if (GQL_KEYWORDS.includes(token)) return <span key={i} style={{ color: 'var(--syntax-keyword)', fontWeight: 600 }}>{token}</span>
        if (token.startsWith('"') && token.endsWith('"')) return <span key={i} style={{ color: 'var(--syntax-value)' }}>{token}</span>
        if (/^-?\d+(\.\d+)?$/.test(token)) return <span key={i} style={{ color: 'var(--syntax-value)' }}>{token}</span>
        if (token === 'null' || token === 'true' || token === 'false') return <span key={i} style={{ color: 'var(--syntax-operator)' }}>{token}</span>
        return <span key={i}>{token}</span>
      })}
    </div>
  ))
}

function QueryPreview() {
  const { tree, schema, previewMode, setPreviewMode } = useQueryStore()
  const [copied, setCopied] = useState(false)

  const output = useMemo(() => {
    if (previewMode === 'sql') return generateSQL(tree.root, schema.name.toLowerCase())
    if (previewMode === 'graphql') return generateGraphQL(tree.root, schema.name.toLowerCase(), schema.fields.map(f => f.name))
    return generateMongo(tree.root)
  }, [tree, schema, previewMode])

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid var(--border)', flexShrink: 0, backgroundColor: 'var(--preview-bg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid var(--preview-border)' }}>
        <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--preview-btn-text)', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
          Preview
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {(['sql', 'mongo', 'graphql'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setPreviewMode(mode)}
              aria-pressed={previewMode === mode}
              style={{
                padding: '2px 8px',
                borderRadius: 'var(--radius)',
                border: `1px solid ${previewMode === mode ? 'var(--accent)' : 'var(--preview-btn-border)'}`,
                backgroundColor: previewMode === mode ? 'var(--accent)' : 'transparent',
                color: previewMode === mode ? 'var(--accent-text)' : 'var(--preview-btn-text)',
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
            aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
            style={{
              width: '26px',
              height: '26px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--preview-btn-border)',
              backgroundColor: 'transparent',
              color: copied ? 'var(--accent)' : 'var(--preview-btn-text)',
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
          color: 'var(--preview-text)',
          backgroundColor: 'var(--preview-bg)',
          overflowX: 'auto',
          overflowY: 'auto',
          maxHeight: '200px',
          margin: 0,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {previewMode === 'sql' ? highlightSQL(output) : previewMode === 'graphql' ? highlightGQL(output) : output}
      </pre>
    </div>
  )
}

export default memo(QueryPreview)
