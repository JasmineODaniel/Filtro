import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: '#111111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            alignItems: 'center',
          }}
        >
          <div style={{ width: 14, height: 2, background: '#c8ff00', borderRadius: 2 }} />
          <div style={{ width: 10, height: 2, background: '#c8ff00', borderRadius: 2 }} />
          <div style={{ width: 6, height: 2, background: '#c8ff00', borderRadius: 2 }} />
        </div>
      </div>
    ),
    { ...size }
  )
}
