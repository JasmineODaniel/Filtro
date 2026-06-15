'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import LoadingScreen from '@/components/ui/LoadingScreen'

const QueryBuilder = dynamic(
  () => import('@/components/builder/QueryBuilder'),
  { ssr: false }
)

export default function BuilderPage() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  if (!ready) return <LoadingScreen />

  return <QueryBuilder />
}
