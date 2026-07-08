'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { X, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { useQueryStore } from '@/store'
import { explainQuery } from '@/utils/explain-query'
import type { QueryTree } from '@/types/query'

interface GenerateQueryModalProps {
  onClose: () => void
}

type Phase =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'result'; tree: QueryTree; confidence: number; explanation: string }
  | { type: 'clarification'; question: string }
  | { type: 'error'; message: string }

export function GenerateQueryModal({ onClose }: GenerateQueryModalProps) {
  const { schema, importTree } = useQueryStore()
  const [prompt, setPrompt] = useState('')
  const [phase, setPhase] = useState<Phase>({ type: 'idle' })
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const generate = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setPhase({ type: 'loading' })

    try {
      const res = await fetch('/api/generate-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmed, schema }),
      })
      const data = await res.json() as Record<string, unknown>

      if (data.type === 'query') {
        const tree = data.tree as QueryTree
        setPhase({
          type: 'result',
          tree,
          confidence: typeof data.confidence === 'number' ? data.confidence : 1,
          explanation: explainQuery(tree.root, schema),
        })
      } else if (data.type === 'clarification') {
        setPhase({ type: 'clarification', question: String(data.question) })
      } else {
        setPhase({ type: 'error', message: String(data.message ?? 'An unexpected error occurred.') })
      }
    } catch {
      setPhase({ type: 'error', message: 'Failed to reach the server. Please try again.' })
    }
  }, [schema])

  const handleApply = useCallback(() => {
    if (phase.type !== 'result') return
    importTree(phase.tree)
    onClose()
  }, [phase, importTree, onClose])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      generate(prompt)
    }
  }, [prompt, generate])

  const canGenerate = !!prompt.trim() && phase.type !== 'loading'
  const confidencePct = phase.type === 'result' ? Math.round(phase.confidence * 100) : 0

  const confidenceColor = (pct: number): string => {
    if (pct >= 85) return 'var(--accent)'
    if (pct >= 65) return 'var(--text-secondary)'
    return 'var(--destructive)'
  }

  const confidenceNote = (pct: number): string => {
    if (pct >= 85) return 'High confidence'
    if (pct >= 65) return 'Medium confidence — review before applying'
    return 'Low confidence — review carefully'
  }

  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 998, backgroundColor: 'var(--overlay-bg)' }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Ask AI to build a query"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 999,
          width: 'min(480px, calc(100vw - 32px))',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.15s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-4)',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
            Ask AI
          </span>
          <button
            onClick={onClose}
            aria-label="Close generate query dialog"
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
              transition: 'all 0.15s ease',
              flexShrink: 0,
            }}
          >
            <X size={14} />
          </button>
        </div>

        <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', margin: 0, lineHeight: 1.6 }}>
            Tell me what {schema.name.toLowerCase()} you&apos;re looking for — in plain English.{' '}
            <span style={{ color: 'var(--text-secondary)' }}>Ctrl+Enter to send.</span>
          </p>

          <textarea
            ref={textareaRef}
            autoFocus
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            placeholder={`e.g. "Active ${schema.name.toLowerCase()} from Nigeria with more than 10 purchases"`}
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
              lineHeight: 1.6,
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          {phase.type === 'loading' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'var(--font-sans)' }}>
              <Loader2 size={13} style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
              Thinking…
            </div>
          )}

          {phase.type === 'result' && (
            <div
              style={{
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                animation: 'fadeIn 0.2s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-3)',
                  borderBottom: '1px solid var(--border)',
                  backgroundColor: 'var(--bg)',
                }}
              >
                <CheckCircle2 size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: confidenceColor(confidencePct),
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {confidencePct}% · {confidenceNote(confidencePct)}
                </span>
              </div>
              <p
                style={{
                  padding: 'var(--space-3)',
                  margin: 0,
                  fontSize: '12px',
                  lineHeight: 1.75,
                  fontStyle: 'italic',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {phase.explanation}
              </p>
            </div>
          )}

          {(phase.type === 'clarification' || phase.type === 'error') && (
            <div
              style={{
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg)',
                display: 'flex',
                gap: 'var(--space-2)',
                animation: 'fadeIn 0.2s ease',
              }}
            >
              <AlertCircle size={14} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '1px' }} />
              <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.6, color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}>
                {phase.type === 'clarification' ? phase.question : phase.message}
              </p>
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--space-2)',
            padding: 'var(--space-3) var(--space-4)',
            borderTop: '1px solid var(--border)',
            flexShrink: 0,
          }}
        >
          {phase.type === 'result' ? (
            <>
              <button
                onClick={() => { setPhase({ type: 'idle' }); textareaRef.current?.focus() }}
                style={{
                  height: '32px',
                  padding: '0 var(--space-4)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-sans)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Retry
              </button>
              <button
                onClick={handleApply}
                style={{
                  height: '32px',
                  padding: '0 var(--space-4)',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  backgroundColor: 'var(--accent)',
                  color: 'var(--accent-text)',
                  fontSize: '12px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-sans)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}
              >
                <CheckCircle2 size={13} />
                Apply
              </button>
            </>
          ) : (
            <button
              onClick={() => generate(prompt)}
              disabled={!canGenerate}
              style={{
                height: '32px',
                padding: '0 var(--space-4)',
                borderRadius: 'var(--radius)',
                border: 'none',
                backgroundColor: canGenerate ? 'var(--accent)' : 'var(--bg-secondary)',
                color: canGenerate ? 'var(--accent-text)' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: 700,
                fontFamily: 'var(--font-sans)',
                cursor: canGenerate ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
              }}
            >
              Build Query
            </button>
          )}
        </div>
      </div>
    </>
  )
}
