import Link from 'next/link'
import { Zap, SlidersHorizontal, Play, Braces, BookMarked, Smartphone } from 'lucide-react'

export default function LandingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0e0e0e',
      color: '#f0f0f0',
      fontFamily: 'var(--font-sans)',
      overflowX: 'hidden',
    }}>

      {/* NAV */}
      <nav className="lp-nav" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px',
        backgroundColor: 'rgba(14,14,14,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1e1e1e',
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '14px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#c8ff00',
        }}>
          Filtro
        </span>
        <Link href="/builder" style={{
          padding: '8px 20px',
          borderRadius: '8px',
          backgroundColor: '#c8ff00',
          color: '#111',
          fontSize: '12px',
          fontWeight: 600,
          textDecoration: 'none',
          letterSpacing: '0.04em',
          transition: 'opacity 0.15s ease',
        }}>
          Launch App →
        </Link>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '100px 24px 80px',
        backgroundImage: 'radial-gradient(circle, #2a2a2a 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(200,255,0,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '5px 14px',
          borderRadius: '20px',
          border: '1px solid #2e2e2e',
          backgroundColor: '#1a1a1a',
          marginBottom: '32px',
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#c8ff00' }} />
          <span style={{ fontSize: '11px', color: '#888', letterSpacing: '0.06em' }}>
            Visual Query Builder
          </span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(36px, 7vw, 80px)',
          fontWeight: 400,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#f0f0f0',
          lineHeight: 1.1,
          marginBottom: '24px',
          maxWidth: '900px',
        }}>
          <span className="lp-hero-l1">Build filters.</span>
          <span className="lp-hero-l2" style={{ color: '#c8ff00' }}>Without code.</span>
        </h1>

        <p style={{
          fontSize: 'clamp(15px, 2vw, 18px)',
          color: '#888',
          lineHeight: 1.7,
          maxWidth: '520px',
          marginBottom: '48px',
        }}>
          Filtro lets you construct complex data queries visually —
          pick fields, set conditions, nest logic. No SQL. No syntax errors.
          Just results.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/builder" style={{
            padding: '14px 32px',
            borderRadius: '10px',
            backgroundColor: '#c8ff00',
            color: '#111',
            fontSize: '14px',
            fontWeight: 700,
            textDecoration: 'none',
            letterSpacing: '0.04em',
          }}>
            Launch App →
          </Link>
          <a href="#how-it-works" style={{
            padding: '14px 32px',
            borderRadius: '10px',
            border: '1px solid #2e2e2e',
            backgroundColor: 'transparent',
            color: '#aaa',
            fontSize: '14px',
            textDecoration: 'none',
            letterSpacing: '0.04em',
          }}>
            See how it works ↓
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{
        padding: '100px 40px',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        <p style={{
          fontSize: '11px',
          fontWeight: 600,
          color: '#555',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: '16px',
        }}>
          What you get
        </p>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(22px, 3vw, 32px)',
          fontWeight: 400,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#f0f0f0',
          textAlign: 'center',
          marginBottom: '64px',
        }}>
          Everything you need to filter data
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {[
            {
              icon: <Zap size={20} color="#c8ff00" />,
              title: 'Click to build',
              body: 'Add rules and groups with a click. Drag to reorder. Flip AND/OR with one tap. No typing, no syntax — just your logic.',
            },
            {
              icon: <SlidersHorizontal size={20} color="#c8ff00" />,
              title: 'Smart operators',
              body: 'The operator list adjusts to the field type. Numbers get greater/less than. Text gets contains/starts with. Enums show a list. You can\'t pick a wrong option.',
            },
            {
              icon: <Play size={20} color="#c8ff00" />,
              title: 'Live execution',
              body: 'Hit Execute and your filter runs against a real dataset instantly. Results appear in a sortable, paginated table. See exactly what your query catches.',
            },
            {
              icon: <Braces size={20} color="#c8ff00" />,
              title: 'Real-time JSON',
              body: 'As you build, the JSON preview updates live. That\'s the exact structure you\'d send to a backend — copy it and use it anywhere.',
            },
            {
              icon: <BookMarked size={20} color="#c8ff00" />,
              title: 'History & presets',
              body: 'Every query is auto-saved to history. Save your best ones as named presets. Import and export queries as JSON files for sharing.',
            },
            {
              icon: <Smartphone size={20} color="#c8ff00" />,
              title: 'Works on mobile',
              body: 'The full builder adapts to any screen size. Hamburger drawer for navigation, tabbed layout for panels. Nothing is cut out on small screens.',
            },
          ].map(f => (
            <div key={f.title} style={{
              padding: '28px',
              borderRadius: '12px',
              border: '1px solid #1e1e1e',
              backgroundColor: '#141414',
            }}>
              <div style={{
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
              }}>
                {f.icon}
              </div>
              <h3 style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#f0f0f0',
                marginBottom: '10px',
                letterSpacing: '0.02em',
              }}>
                {f.title}
              </h3>
              <p style={{
                fontSize: '13px',
                color: '#666',
                lineHeight: 1.7,
              }}>
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{
        padding: '100px 40px',
        backgroundColor: '#111',
        borderTop: '1px solid #1a1a1a',
        borderBottom: '1px solid #1a1a1a',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#555',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            How it works
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 3vw, 32px)',
            fontWeight: 400,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#f0f0f0',
            marginBottom: '64px',
          }}>
            Three steps to your filter
          </h2>

          <div className="lp-steps-grid">

            {/* SVG connector — ball rolls 01 → 02 → 03 in zigzag */}
            {/* viewBox 720×500: col2 center x≈520, col1 center x≈40, row midpoints y≈107,281 */}
            <svg className="lp-connector" viewBox="0 0 720 500" preserveAspectRatio="xMidYMid meet">
              <path
                d="M 520,22 L 520,107 L 40,107 L 40,194 L 40,281 L 520,281 L 520,368"
                stroke="#2a2a2a"
                strokeWidth="2"
                fill="none"
                strokeLinecap="square"
                strokeLinejoin="miter"
              />
              <circle r="6" fill="#c8ff00" style={{ filter: 'drop-shadow(0 0 5px #c8ff00)' }}>
                <animateMotion
                  path="M 520,22 L 520,107 L 40,107 L 40,194 L 40,281 L 520,281 L 520,368"
                  dur="3s"
                  repeatCount="indefinite"
                  calcMode="linear"
                />
              </circle>
            </svg>

            {/* 01 — right column */}
            <div className="lp-step-right" style={{ minHeight: '150px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 400, color: '#c8ff00', opacity: 0.4, letterSpacing: '0.06em', marginBottom: '14px', lineHeight: 1 }}>01</div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#f0f0f0', marginBottom: '10px' }}>Pick a schema</h3>
              <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.7 }}>Choose Users, Products or Orders. Each schema has its own fields and data types. The whole builder adapts instantly.</p>
            </div>

            {/* 02 — left column */}
            <div className="lp-step-left" style={{ minHeight: '150px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 400, color: '#c8ff00', opacity: 0.4, letterSpacing: '0.06em', marginBottom: '14px', lineHeight: 1 }}>02</div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#f0f0f0', marginBottom: '10px' }}>Build your filter</h3>
              <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.7 }}>Add rules. Pick a field, pick an operator, set a value. Nest groups for AND/OR logic. Drag to reorder.</p>
            </div>

            {/* 03 — right column */}
            <div className="lp-step-right" style={{ minHeight: '150px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 400, color: '#c8ff00', opacity: 0.4, letterSpacing: '0.06em', marginBottom: '14px', lineHeight: 1 }}>03</div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#f0f0f0', marginBottom: '10px' }}>Execute &amp; read results</h3>
              <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.7 }}>Hit Execute. Your filter runs against the mock dataset and matching records appear in a sortable, paginated table.</p>
            </div>

          </div>
        </div>
      </section>

      {/* MOCK PREVIEW */}
      <section style={{
        padding: '100px 40px',
        maxWidth: '1000px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '11px',
          fontWeight: 600,
          color: '#555',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}>
          See it in action
        </p>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(22px, 3vw, 32px)',
          fontWeight: 400,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#f0f0f0',
          marginBottom: '48px',
        }}>
          This is what a query looks like
        </h2>

        {/* Mock builder UI */}
        <div style={{
          borderRadius: '14px',
          border: '1px solid #2a2a2a',
          backgroundColor: '#141414',
          overflow: 'hidden',
          textAlign: 'left',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}>
          {/* Mock toolbar */}
          <div style={{
            padding: '12px 20px',
            borderBottom: '1px solid #1e1e1e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#1a1a1a',
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.16em', color: '#c8ff00', textTransform: 'uppercase' }}>Filtro</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Users', 'Products', 'Orders'].map((s, i) => (
                <span key={s} style={{
                  padding: '3px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  backgroundColor: i === 0 ? '#c8ff00' : 'transparent',
                  color: i === 0 ? '#111' : '#555',
                  fontWeight: i === 0 ? 600 : 400,
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Mock query group */}
          <div style={{ padding: '24px' }}>
            <div style={{
              border: '1px solid #2a2a2a',
              borderRadius: '10px',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '10px 16px',
                borderBottom: '1px solid #2a2a2a',
                backgroundColor: '#1e1e1e',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <span style={{ fontSize: '11px', color: '#666' }}>All conditions must match</span>
                <span style={{
                  padding: '2px 10px',
                  borderRadius: '20px',
                  backgroundColor: '#c8ff00',
                  color: '#111',
                  fontSize: '10px',
                  fontWeight: 700,
                }}>AND</span>
              </div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { field: 'status', op: 'equals', val: 'active' },
                  { field: 'age', op: 'greater than', val: '25' },
                  { field: 'plan', op: 'equals', val: 'premium' },
                ].map((r, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #2a2a2a',
                    backgroundColor: '#191919',
                  }}>
                    <span style={{ fontSize: '11px', color: '#aaa', fontWeight: 500, minWidth: '60px' }}>{r.field}</span>
                    <span style={{ fontSize: '11px', color: '#555' }}>{r.op}</span>
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: '6px',
                      backgroundColor: '#242424',
                      color: '#c8ff00',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '100px 40px',
        textAlign: 'center',
        borderTop: '1px solid #1a1a1a',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 400,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#f0f0f0',
          marginBottom: '16px',
        }}>
          Ready to build?
        </h2>
        <p style={{ fontSize: '15px', color: '#666', marginBottom: '40px' }}>
          Open the app and start filtering in seconds.
        </p>
        <Link href="/builder" style={{
          padding: '16px 40px',
          borderRadius: '10px',
          backgroundColor: '#c8ff00',
          color: '#111',
          fontSize: '15px',
          fontWeight: 700,
          textDecoration: 'none',
          letterSpacing: '0.04em',
          display: 'inline-block',
        }}>
          Launch Filtro →
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '32px 40px',
        borderTop: '1px solid #1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '12px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: '#c8ff00',
        }}>
          Filtro
        </span>
        <span style={{ fontSize: '12px', color: '#444' }}>
          Visual query builder — no code required
        </span>
        <span style={{ fontSize: '12px', color: '#444' }}>
          © Filtro 2026
        </span>
      </footer>

    </div>
  )
}
