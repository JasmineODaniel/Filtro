import Link from 'next/link'
import { Zap, SlidersHorizontal, Play, Braces, BookMarked, Smartphone } from 'lucide-react'

const FEATURES = [
  { icon: <Zap size={20} color="var(--accent)" />, title: 'Click to build', body: "Add rules and groups with a click. Drag to reorder. Flip AND/OR with one tap. No typing, no syntax — just your logic." },
  { icon: <SlidersHorizontal size={20} color="var(--accent)" />, title: 'Smart operators', body: "The operator list adjusts to the field type. Numbers get greater/less than. Text gets contains/starts with. Enums show a list. You can't pick a wrong option." },
  { icon: <Play size={20} color="var(--accent)" />, title: 'Live execution', body: 'Hit Execute and your filter runs against a real dataset instantly. Results appear in a sortable, paginated table. See exactly what your query catches.' },
  { icon: <Braces size={20} color="var(--accent)" />, title: 'Real-time JSON', body: "As you build, the JSON preview updates live. That's the exact structure you'd send to a backend — copy it and use it anywhere." },
  { icon: <BookMarked size={20} color="var(--accent)" />, title: 'History & presets', body: 'Every query is auto-saved to history. Save your best ones as named presets. Import and export queries as JSON files for sharing.' },
  { icon: <Smartphone size={20} color="var(--accent)" />, title: 'Works on mobile', body: 'The full builder adapts to any screen size. Hamburger drawer for navigation, tabbed layout for panels. Nothing is cut out on small screens.' },
]

const STEPS = [
  { num: '01', title: 'Pick a schema', body: 'Choose Users, Products or Orders. Each schema has its own fields and data types. The whole builder adapts instantly.', cls: 'lp-step-right' },
  { num: '02', title: 'Build your filter', body: 'Add rules. Pick a field, pick an operator, set a value. Nest groups for AND/OR logic. Drag to reorder.', cls: 'lp-step-left' },
  { num: '03', title: 'Execute & read results', body: 'Hit Execute. Your filter runs against the mock dataset and matching records appear in a sortable, paginated table.', cls: 'lp-step-center' },
]

const MOCK_RULES = [
  { field: 'status', op: 'equals', val: 'active' },
  { field: 'age', op: 'greater than', val: '25' },
  { field: 'plan', op: 'equals', val: 'premium' },
]

const CONNECTOR_PATH = 'M 410,20 L 410,115 L 10,115 L 10,210 L 10,315 L 360,315 L 360,420'

export default function LandingPage() {
  return (
    <div className="dark" style={{
      minHeight: '100vh',
      backgroundColor: '#0e0e0e',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)',
      overflowX: 'hidden',
    }}>

      <nav className="lp-nav" style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px',
        backgroundColor: 'rgba(14,14,14,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)' }}>
          Filtro
        </span>
        <Link href="/builder" style={{ padding: '8px 20px', borderRadius: '8px', backgroundColor: 'var(--accent)', color: 'var(--accent-text)', fontSize: '12px', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.04em' }}>
          Launch App →
        </Link>
      </nav>

      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '100px 24px 80px',
        backgroundImage: 'radial-gradient(circle, var(--bg-tertiary) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(200,255,0,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '20px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', marginBottom: '32px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>Visual Query Builder</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 7vw, 80px)', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '24px', maxWidth: '900px' }}>
          <span className="lp-hero-l1">Build filters.</span>
          <span className="lp-hero-l2" style={{ color: 'var(--accent)' }}>Without code.</span>
        </h1>

        <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '520px', marginBottom: '48px' }}>
          Filtro lets you construct complex data queries visually — pick fields, set conditions, nest logic. No SQL. No syntax errors. Just results.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/builder" style={{ padding: '14px 32px', borderRadius: '10px', backgroundColor: 'var(--accent)', color: 'var(--accent-text)', fontSize: '14px', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.04em' }}>
            Launch App →
          </Link>
          <a href="#how-it-works" style={{ padding: '14px 32px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'transparent', color: 'var(--text-secondary)', fontSize: '14px', textDecoration: 'none', letterSpacing: '0.04em' }}>
            See how it works ↓
          </a>
        </div>
      </section>

      <section style={{ padding: '100px 40px', maxWidth: '1100px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center', marginBottom: '16px' }}>
          What you get
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 400, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-primary)', textAlign: 'center', marginBottom: '64px' }}>
          Everything you need to filter data
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ padding: '28px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)' }}>
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>{f.icon}</div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px', letterSpacing: '0.02em' }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" style={{ padding: '100px 40px', backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>
            How it works
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 400, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '64px' }}>
            Three steps to your filter
          </h2>

          <div className="lp-steps-grid">
            <svg className="lp-connector" viewBox="0 0 720 600" preserveAspectRatio="xMidYMid meet">
              <path d={CONNECTOR_PATH} stroke="var(--bg-tertiary)" strokeWidth="2" fill="none" strokeLinecap="square" strokeLinejoin="miter" />
              <circle r="6" fill="var(--accent)" style={{ filter: 'drop-shadow(0 0 5px var(--accent))' }}>
                <animateMotion path={CONNECTOR_PATH} dur="3s" repeatCount="indefinite" calcMode="linear" />
              </circle>
            </svg>

            {STEPS.map(s => (
              <div key={s.num} className={s.cls} style={{ minHeight: '150px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 400, color: 'var(--accent)', opacity: 0.4, letterSpacing: '0.06em', marginBottom: '14px', lineHeight: 1 }}>{s.num}</div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>{s.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 40px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>
          See it in action
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 400, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '48px' }}>
          This is what a query looks like
        </h2>
        <div style={{ borderRadius: '14px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', overflow: 'hidden', textAlign: 'left', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--surface)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.16em', color: 'var(--accent)', textTransform: 'uppercase' }}>Filtro</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Users', 'Products', 'Orders'].map((s, i) => (
                <span key={s} style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '11px', backgroundColor: i === 0 ? 'var(--accent)' : 'transparent', color: i === 0 ? 'var(--accent-text)' : 'var(--text-muted)', fontWeight: i === 0 ? 600 : 400 }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div style={{ padding: '24px' }}>
            <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>All conditions must match</span>
                <span style={{ padding: '2px 10px', borderRadius: '20px', backgroundColor: 'var(--accent)', color: 'var(--accent-text)', fontSize: '10px', fontWeight: 700 }}>AND</span>
              </div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {MOCK_RULES.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500, minWidth: '60px' }}>{r.field}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.op}</span>
                    <span style={{ padding: '2px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-tertiary)', color: 'var(--accent)', fontSize: '11px', fontWeight: 600 }}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 40px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '16px' }}>
          Ready to build?
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '40px' }}>
          Open the app and start filtering in seconds.
        </p>
        <Link href="/builder" style={{ padding: '16px 40px', borderRadius: '10px', backgroundColor: 'var(--accent)', color: 'var(--accent-text)', fontSize: '15px', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.04em', display: 'inline-block' }}>
          Launch Filtro →
        </Link>
      </section>

      <footer style={{ padding: '32px clamp(16px, 4vw, 40px)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)' }}>Filtro</span>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Visual query builder — no code required</span>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>© Filtro 2026</span>
      </footer>

    </div>
  )
}
