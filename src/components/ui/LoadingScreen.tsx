'use client'

export default function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#0e0e0e',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '32px',
    }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: '16px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--accent)',
      }}>
        Filtro
      </span>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent)',
              animation: `dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
